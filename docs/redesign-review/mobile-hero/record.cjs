const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 360, height: 760 }, isMobile: true, hasTouch: true, recordVideo: { dir: __dirname, size: { width: 360, height: 760 } } });
  const page = await context.newPage();
  try {
    await page.goto('http://127.0.0.1:5898/redesign', { waitUntil: 'load' });
    await page.waitForFunction(() => Number(document.querySelector('[data-denominator]')?.dataset.denominator) > 0);
    await page.waitForTimeout(400);
    for (const p of [...Array.from({length: 25}, (_, i) => i * 1.8 / 24), ...Array.from({length: 25}, (_, i) => 1.8 * (1 - i / 24))]) {
      await page.evaluate(p => { const section = document.querySelector('[data-denominator]'); scrollTo({ top: scrollY + section.getBoundingClientRect().top + p * Number(section.dataset.denominator), behavior: 'instant' }); }, p);
      await page.waitForTimeout(100);
    }
    await page.waitForTimeout(1300);
    const video = page.video();
    await context.close();
    await video.saveAs(path.join(__dirname, 'forward-reverse.webm'));
    await video.delete();
    console.log('Recorded forward-reverse.webm');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
