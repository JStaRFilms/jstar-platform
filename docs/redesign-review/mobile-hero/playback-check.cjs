const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 360, height: 760 }, isMobile: true, hasTouch: true });
  try {
    await page.goto('http://127.0.0.1:5898/redesign', { waitUntil: 'load' });
    await page.waitForFunction(() => Number(document.querySelector('[data-denominator]')?.dataset.denominator) > 0);
    const jump = p => page.evaluate(p => { const s = document.querySelector('[data-denominator]'); scrollTo({ top: scrollY + s.getBoundingClientRect().top + p * Number(s.dataset.denominator), behavior: 'instant' }); }, p);
    const state = () => page.locator('section video').first().evaluate(v => ({ time: v.currentTime, paused: v.paused, muted: v.muted, loop: v.loop, src: v.currentSrc }));
    await jump(.85);
    await page.waitForTimeout(1600);
    const full = await state();
    await page.locator('section video').first().focus();
    await page.keyboard.press('Space');
    await page.waitForTimeout(150);
    const paused = await state();
    assert.equal(paused.paused, true);
    await jump(1.8);
    await page.waitForTimeout(1800);
    const tablet = await state();
    await jump(.85);
    await page.waitForTimeout(1500);
    const returned = await state();
    assert.ok(returned.time >= paused.time - .05, 'return reset playback position');
    assert.equal(returned.paused, true, 'return lost pause intent');
    assert.equal(returned.muted, paused.muted);
    assert.equal(returned.loop, true);
    await jump(3.3);
    await page.waitForTimeout(100);
    await jump(0);
    await page.waitForTimeout(2400);
    const opening = await page.evaluate(() => ({ filmX: document.querySelector('section video').getBoundingClientRect().x, screen: document.querySelector('[data-screening]').dataset.screening }));
    assert.equal(opening.screen, 'false');
    console.log({ full, paused, tablet, returned, opening });
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
