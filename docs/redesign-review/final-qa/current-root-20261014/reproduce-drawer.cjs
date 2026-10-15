const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  try {
    await page.route('**/api/contact', r => r.request().method() === 'POST' ? r.abort('blockedbyclient') : r.continue());
    await page.goto('https://johnsax.tailb6e2d3.ts.net:3461/redesign', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-font-ready="true"]', { timeout: 60000 });
    await page.getByRole('link', { name: 'Work', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('[data-gallery]').dataset.settled === 'true');
    await page.locator('[data-filter-button="film"]').click();
    await page.waitForFunction(() => document.querySelector('[data-gallery]').dataset.settled === 'true');
    await page.locator('[data-project-id="nifemi"]').click();
    await page.locator('[data-project-action]').click();
    await page.waitForSelector('[data-portfolio-viewer][data-project="nifemi"]');
    await page.waitForFunction(() => document.querySelector('[data-viewer-picture] video').readyState >= 2);
    await page.locator('[data-viewer-fullscreen]').click();
    await page.waitForFunction(() => !!document.fullscreenElement);
    await page.waitForTimeout(700);
    await page.locator('[data-viewer-fullscreen]').click();
    await page.waitForFunction(() => !document.fullscreenElement);
    const snapshot = () => page.evaluate(() => {
      const viewer = document.querySelector('[data-portfolio-viewer]');
      const notes = viewer.querySelector('aside');
      const drawer = document.querySelector('[data-viewer-drawer]');
      const box = e => { if (!e) return null; const r=e.getBoundingClientRect(); return { x:r.x, y:r.y, width:r.width, height:r.height }; };
      return { phase:viewer.dataset.notesPhase, notes:box(notes), transform:getComputedStyle(notes).transform, drawer:box(drawer), drawerLeft:getComputedStyle(document.querySelector('[data-study-frame]')).getPropertyValue('--drawer-left') };
    });
    await page.waitForTimeout(760);
    const early = await snapshot();
    await page.getByRole('button', { name: 'Read more' }).click();
    await page.waitForTimeout(500);
    const settled = await snapshot();
    const result = { sourceFingerprint:require('./baseline.json').sourceFingerprint, early, settled, errors };
    fs.writeFileSync(path.join(__dirname, 'drawer-reproduction.json'), JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode=1; });
