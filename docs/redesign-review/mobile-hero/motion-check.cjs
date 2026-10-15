const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const url = 'http://127.0.0.1:5898/redesign';
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 360, height: 760 }, isMobile: true, hasTouch: true });
  try {
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelector('[data-denominator]')?.dataset.denominator);
    const observe = () => page.evaluate(() => ({ glitch: document.querySelectorAll('[class*="mobileLine"][data-scrambling="true"]').length, wave: Math.max(...[...document.querySelectorAll('[class*="mobileCopy"] > span')].map(x => Math.abs(Number(x.style.transform.match(/^translateY\(([^)]+)px\)/)?.[1] ?? 0)))) }));
    const samples = [];
    for (let n = 0; n < 90; n++) { samples.push(await observe()); await page.waitForTimeout(90); }
    assert.ok(samples.some(s => s.glitch > 0), 'idle glitch never played');
    assert.ok(samples.some(s => s.wave > 2), 'copy wave never played');
    await page.evaluate(() => window.scrollTo({ top: 150, behavior: 'instant' }));
    await page.waitForTimeout(100);
    const interruption = await observe();
    assert.deepEqual(interruption, { glitch: 0, wave: 0 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(1000);
    assert.deepEqual(await observe(), { glitch: 0, wave: 0 }, 'restart should have a quiet delay');
    await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); });
    await page.waitForTimeout(4400);
    const hidden = await observe();
    assert.deepEqual(hidden, { glitch: 0, wave: 0 });
    await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: false }); document.dispatchEvent(new Event('visibilitychange')); });
    await page.waitForTimeout(800);
    assert.deepEqual(await observe(), { glitch: 0, wave: 0 }, 'visibility restart should have a quiet delay');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(4700);
    const reduced = await observe();
    assert.deepEqual(reduced, { glitch: 0, wave: 0 });
    const output = { sampledMs: 8100, glitchSamples: samples.filter(x => x.glitch).length, waveSamples: samples.filter(x => x.wave > 0).length, maxWave: Math.max(...samples.map(x => x.wave)), interruption, hidden, reduced };
    fs.writeFileSync(path.join(__dirname, 'motion-results.json'), JSON.stringify(output, null, 2));
    console.log(output);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
