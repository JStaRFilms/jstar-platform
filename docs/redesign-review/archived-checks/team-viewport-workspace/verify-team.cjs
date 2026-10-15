const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const url = process.env.REDESIGN_URL || 'http://127.0.0.1:5908/redesign';
const results = [];
const errors = [];
async function go(page, progress) {
  await page.evaluate(progress => {
    const team = document.querySelector('[data-team]');
    scrollTo({ top: scrollY + team.getBoundingClientRect().top + innerHeight * (.8 + progress * 4.1 / 8.3), behavior: 'instant' });
  }, progress);
  await page.waitForTimeout(600);
}
async function state(page) {
  return page.evaluate(() => {
    const team = document.querySelector('[data-team]');
    const stage = team.firstElementChild;
    const spotlight = team.querySelector('[class*=spotlight]');
    const bottomHit = document.elementFromPoint(innerWidth / 2, innerHeight - 2);
    return {
      progress: +team.dataset.teamProgress, final: team.dataset.teamFinal === 'true',
      cover: +document.querySelector('#closing-sequence').dataset.cover,
      stage: { top: stage.getBoundingClientRect().top, bottom: stage.getBoundingClientRect().bottom, height: stage.clientHeight },
      height: innerHeight, bottomCovered: stage.contains(bottomHit),
      caption: { opacity: +getComputedStyle(spotlight).opacity, top: spotlight.getBoundingClientRect().top, bottom: spotlight.getBoundingClientRect().bottom },
      portraits: [...team.querySelectorAll('[data-team-person]')].map(person => ({
        opacity: +getComputedStyle(person).opacity, imageBottom: person.querySelector('img').getBoundingClientRect().bottom,
        nameBottom: person.querySelector('[data-team-name]').getBoundingClientRect().bottom,
      })),
      footerTop: team.querySelector('[class*=footer]').getBoundingClientRect().top,
    };
  });
}
(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    for (const [width, height] of [[320,480],[320,560],[360,640],[390,844],[412,915],[1440,900]]) {
      const page = await browser.newPage({ viewport: { width, height }, isMobile: width <= 800, hasTouch: width <= 800 });
      page.on('pageerror', error => errors.push(error.message));
      await page.route('**/*', route => ['GET','HEAD','OPTIONS'].includes(route.request().method()) ? route.continue() : route.abort());
      await page.goto(url, { waitUntil: 'load' });
      await page.waitForFunction(() => document.querySelector('[data-team]')?.dataset.teamProgress);
      for (const progress of [1.4,6.4,7.4,7.75,8.95,9.6,10.2,10.7,9.6,7.4]) {
        await go(page, progress);
        const s = await state(page);
        assert.ok(Math.abs(s.progress - Math.min(progress,10.3)) < .03, 'Native scroll must reach the requested interval');
        if (progress <= 7.75) {
          assert.equal(s.caption.opacity, 1, `Caption fades early at ${width}x${height} ${progress}`);
          if (width <= 800) {
            const index = Math.min(7, Math.floor(progress));
            assert.ok(s.portraits[index].imageBottom <= s.caption.top + 1, `Portrait touches caption at ${width}x${height} ${progress}`);
            assert.ok(s.caption.bottom < s.footerTop, `Caption touches footer at ${width}x${height} ${progress}`);
          }
        }
        if (progress >= 8.95 && progress <= 10.2) {
          assert.ok(s.final && s.cover === 0, `No final-group hold at ${width}x${height} ${progress}`);
          assert.ok(s.portraits.every(p => p.opacity === 1), 'Final portraits must all remain visible');
          if (width <= 800) assert.ok(s.portraits.every(p => p.nameBottom < s.footerTop), `Names must clear the footer at ${width}x${height}: ${JSON.stringify(s)}`);
        }
        if (progress === 10.7) assert.ok(s.cover > 0, 'Enquiry must still enter after the hold');
        if (progress < 10.3) {
          assert.ok(Math.abs(s.stage.height - s.height) <= 1, 'Team stage must fill the visible viewport');
          assert.ok(s.bottomCovered, 'Bottom of viewport must belong to the team stage');
        }
        results.push({ width, height, progress, final: s.final, caption: s.caption.opacity, cover: s.cover });
      }
      await page.screenshot({ path: path.join(__dirname, `last-person-${width}-${height}.png`), scale: 'css' });
      await page.getByRole('button', { name: /Meet everyone/ }).click();
      await page.waitForTimeout(900);
      const skip = await state(page);
      assert.ok(skip.final && skip.cover === 0 && skip.progress < 9, 'Meet everyone must land at the beginning of the final hold');
      if (width <= 800) {
        await page.locator('[data-team-person="7"]').tap();
        assert.equal(await page.locator('[data-team-person="7"] [data-team-role]').getAttribute('data-visible'), 'true');
      }
      await page.close();
    }
    const page = await browser.newPage({ viewport: { width: 390, height: 700 }, isMobile: true, hasTouch: true });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelector('[data-team]')?.dataset.teamProgress);
    for (const height of [700,844,700,844]) {
      await page.setViewportSize({ width: 390, height });
      await page.waitForTimeout(400);
      await go(page, 7.4);
      const s = await state(page);
      assert.equal(s.stage.height, height);
      assert.ok(s.bottomCovered && s.caption.opacity === 1 && s.cover === 0);
      results.push({ resize: height, covered: true });
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(600);
    await page.locator('[data-team]').scrollIntoViewIfNeeded();
    const reduced = await state(page);
    assert.ok(reduced.final && reduced.portraits.every(p => p.opacity === 1));
    assert.equal(reduced.stage.height, reduced.height);
    await page.close();
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(__dirname, 'team-results.json'), JSON.stringify({ results, errors }, null, 2));
    console.log(JSON.stringify({ checks: results.length, errors, passed: true }));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
