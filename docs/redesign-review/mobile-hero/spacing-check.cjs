const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const dir = __dirname;
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];
  for (const [width, height] of [[360, 740], [320, 560], [390, 844], [760, 360], [1440, 900]]) {
    const page = await browser.newPage({ viewport: { width, height }, isMobile: width < 800, hasTouch: width < 800 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:5899/redesign', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => Number(document.querySelector('[data-denominator]')?.dataset.denominator) > 0);
    const measure = () => page.evaluate(() => {
      const rect = element => { const r = element.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom }; };
      const stage = document.querySelector('[class*="stage"]');
      const intro = stage.querySelector('[class*="businessIntro"]');
      return { screen: { width: innerWidth, height: innerHeight },
        eyebrow: rect(stage.querySelector('[class*="eyebrow"]')),
        lines: [...stage.querySelectorAll('[class*="mobileLine"]')].filter(x => getComputedStyle(x).display !== 'none').map(rect),
        copy: rect(stage.querySelector('[class*="description"]')),
        headline: rect(intro.querySelector('h2')), introCopy: rect(intro.querySelector('p')),
        scene: rect(stage.querySelector('[class*="tabletScene"]')),
        film: rect(stage.querySelector('video')),
        work: rect(stage.querySelector('[class*="bottomRow"]')),
        stage: rect(stage) };
    });
    const opening = await measure();
    if (width === 360 || width === 320) await page.screenshot({ path: path.join(dir, `spacing-opening-${width}.png`), scale: 'css' });
    await page.evaluate(() => { const section = document.querySelector('[data-denominator]'); window.scrollTo({ top: Number(section.dataset.denominator) * 2.43, behavior: 'instant' }); });
    await page.waitForTimeout(2600);
    const tablet = await measure();
    if (width === 360 || width === 320) await page.screenshot({ path: path.join(dir, `spacing-tablet-${width}.png`), scale: 'css' });
    if (width < 480 && width < height) {
      assert.ok(opening.lines.every(line => line.right <= width - 12), 'opening line clips at right edge');
      assert.ok(opening.copy.bottom < opening.work.y - 12, 'opening copy meets work link');
      assert.ok(tablet.introCopy.bottom < tablet.scene.y + 12, 'tablet copy and portrait overlap');
      assert.ok(tablet.scene.bottom < height - 40, 'portrait reaches controls');
    }
    if (tablet.scene.width > 0) {
      const scale = tablet.scene.width / 1672;
      const delta = Math.abs(tablet.film.x - (tablet.scene.x + 1028 * scale));
      assert.ok(delta < 1, `tablet screen misaligned by ${delta}px`);
    }
    assert.deepEqual(errors, []);
    results.push({ width, height, opening, tablet, errors });
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(dir, 'spacing-results.json'), JSON.stringify(results, null, 2));
  console.log(results.map(({ width, height, opening, tablet }) => ({ size: `${width}x${height}`, lines: opening.lines.map(x => Math.round(x.width)), copyBottom: Math.round(opening.copy.bottom), workTop: Math.round(opening.work.y), tabletCopyBottom: Math.round(tablet.introCopy.bottom), sceneTop: Math.round(tablet.scene.y), sceneBottom: Math.round(tablet.scene.bottom) })));
})().catch(error => { console.error(error); process.exitCode = 1; });
