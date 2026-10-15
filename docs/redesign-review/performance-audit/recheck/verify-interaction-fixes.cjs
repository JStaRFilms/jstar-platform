const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const phase = process.argv[2] || 'before';
const url = process.env.REDESIGN_URL || 'http://localhost:5782/redesign';
const results = { phase, url, tests: [], errors: [] };
const out = process.env.REDESIGN_EVIDENCE_DIR || __dirname;
let page;
async function save(name) { await page.screenshot({ path: path.join(out, `interaction-${phase}-${name}.png`), timeout: 30000 }); }
async function test(name, run) {
  try { results.tests.push({ name, result: await run() }); }
  catch (error) { results.tests.push({ name, failure: error.message }); await save(`${name}-failure`); }
}
async function open(browser, options) {
  page = await browser.newPage(options);
  page.setDefaultTimeout(4000);
  page.on('pageerror', error => results.errors.push(error.message));
  await page.route('**/*', route => ['GET', 'HEAD', 'OPTIONS'].includes(route.request().method()) && !/wa\.me|whatsapp\.com/.test(route.request().url()) ? route.continue() : route.abort());
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() => document.querySelector('[data-denominator]')?.dataset.denominator && document.querySelector('[data-team]')?.dataset.teamProgress);
  await page.waitForTimeout(500);
}
async function keyboardPress(name, backwards = false) {
  for (let i = 0; i < 50; i++) {
    await page.keyboard.press(backwards ? 'Shift+Tab' : 'Tab');
    await page.waitForTimeout(50);
    const active = await page.evaluate(() => document.activeElement?.textContent?.trim());
    if (active === name || active?.startsWith(`${name} `)) { await page.keyboard.press('Enter'); await page.waitForTimeout(150); return; }
  }
  throw new Error(`Tab navigation did not reach ${name}`);
}
async function press(name, touch) {
  const button = page.getByRole('button', { name, exact: true });
  if (touch) await button.tap(); else await button.click();
}
const emailState = () => page.evaluate(() => {
  const field = document.querySelector('input[name="email"]');
  return { y: scrollY, height: innerHeight, active: document.activeElement?.getAttribute('name'), draft: field.value,
    top: field.getBoundingClientRect().top, inert: !!field.closest('[inert]'), cover: document.querySelector('#closing-sequence').dataset.cover };
});
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const width of [1440, 390]) {
      await open(browser, { viewport: { width, height: width === 390 ? 844 : 900 }, reducedMotion: 'reduce', hasTouch: width === 390, isMobile: width === 390 });
      await test(`reduced-${width}`, async () => {
        await press('Expand film', width === 390);
        const control = page.getByRole('button', { name: 'View tablet', exact: true });
        await control.scrollIntoViewIfNeeded();
        const hit = await control.evaluate(node => {
          const r = node.getBoundingClientRect();
          const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
          return { y: scrollY, top: r.top, hit: hit?.outerHTML.slice(0, 400), receivesInput: hit === node || node.contains(hit), galleryTop: document.querySelector('[data-gallery]').getBoundingClientRect().top };
        });
        await save(`reduced-${width}`);
        if (phase === 'before') {
          let failure;
          try { await press('View tablet', width === 390); } catch (error) { failure = error.message; }
          return { hit, failure, tablet: await page.locator('[data-static-tablet]').getAttribute('data-static-tablet') };
        }
        assert.equal(hit.receivesInput, true);
        for (const name of ['View tablet', 'View study game', 'Return to tablet', 'Return to screening', 'Return to opening']) await press(name, width === 390);
        await page.goto(url, { waitUntil: 'load', timeout: 60000 });
        await page.waitForTimeout(700);
        for (const name of ['Expand film', 'View tablet', 'View study game', 'Return to tablet', 'Return to screening', 'Return to opening']) {
          await keyboardPress(name, ['View tablet', 'View study game', 'Return to tablet'].includes(name));
        }
        await press('View selected work', width === 390);
        if (width === 390) await page.locator('[data-filter-button="film"]').tap();
        else await page.locator('[data-filter-button="film"]').click();
        assert.equal(await page.locator('[data-gallery]').getAttribute('data-filter'), 'film');
        await save(`reduced-gallery-${width}`);
        return { hit, galleryFilter: 'film' };
      });
      await page.close();
    }
    await open(browser, { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    await test('enquiry-resize', async () => {
      await page.locator('nav a[href="#project-enquiry"]').tap();
      await page.waitForTimeout(900);
      await page.locator('input[name="name"]').fill('Local resize fixture');
      await page.locator('input[name="email"]').tap();
      await page.keyboard.type('resize@example.invalid');
      const before = await emailState();
      await save('enquiry-tall');
      await page.setViewportSize({ width: 390, height: 500 });
      await page.waitForTimeout(1500);
      const after = await emailState();
      await save('enquiry-short');
      results.enquiryResize = { before, after };
      if (phase === 'after') {
        assert.equal(after.draft, before.draft);
        assert.equal(after.active, 'email');
        assert.equal(after.inert, false);
        await page.locator('input[name="email"]').tap();
        await page.keyboard.press('End');
        await page.keyboard.type('.test');
        assert.equal(await page.locator('input[name="email"]').inputValue(), 'resize@example.invalid.test');
      }
      if (phase === 'after') {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.waitForTimeout(700);
        const restored = await emailState();
        assert.equal(restored.active, 'email');
        assert.equal(restored.inert, false);
        assert.equal(restored.draft, 'resize@example.invalid.test');
        return { before, after, restored };
      }
      return { before, after };
    });
    await page.close();
    await open(browser, { viewport: { width: 1440, height: 900 } });
    await test('normal-desktop-forward-reverse', async () => {
      const states = [];
      for (const [name, progress] of [['opening', 0], ['film', .8], ['tablet', 2.2], ['quiz', 4.2]]) {
        await page.evaluate(p => scrollTo({ top: Number(document.querySelector('[data-denominator]').dataset.denominator) * p, behavior: 'instant' }), progress);
        await page.waitForTimeout(5000);
        await save(`normal-${name}`);
        states.push(await page.evaluate(() => ({ y: scrollY, settled: document.querySelector('[data-screening]').dataset.settled, screening: document.querySelector('[data-screening]').dataset.screening, gameInert: document.querySelector('[data-study-frame]').inert })));
      }
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(5000);
      await page.locator('nav a[href="#selected-work"]').click();
      await page.waitForTimeout(800);
      await page.locator('[data-project-action]').click();
      await page.locator('[class*="topic"] button').first().click();
      await page.locator('[class*="answers"] button').first().click();
      await page.getByRole('button', { name: 'Check answer', exact: true }).click();
      const progress = await page.locator('[role="progressbar"]').getAttribute('aria-valuenow');
      await page.locator('[data-back-to-browsing]').click();
      for (const position of [2.2, 4.2]) {
        await page.evaluate(p => scrollTo({ top: Number(document.querySelector('[data-denominator]').dataset.denominator) * p, behavior: 'instant' }), position);
        await page.waitForTimeout(5000);
      }
      assert.equal(await page.locator('[role="progressbar"]').getAttribute('aria-valuenow'), progress);
      await save('normal-quiz-return');
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(5000);
      await save('normal-opening-return');
      return { states, quizProgressRetained: progress };
    });
    await test('gallery-resize-preserves-selection', async () => {
      await page.goto(url, { waitUntil: 'load', timeout: 60000 });
      await page.waitForTimeout(700);
      await page.locator('nav a[href="#selected-work"]').click();
      await page.waitForTimeout(800);
      await page.locator('[data-project-index="1"]').click();
      await page.waitForTimeout(600);
      const selected = await page.locator('[data-gallery]').getAttribute('data-committed-id');
      await page.setViewportSize({ width: 1440, height: 640 });
      await page.waitForTimeout(1500);
      const state = await page.evaluate(() => {
        const track = document.querySelector('[data-browse-start]');
        const gallery = document.querySelector('[data-gallery]');
        return { y: scrollY, anchor: Number(track.dataset.browseStart) + Number(track.dataset.galleryStride), selected: gallery.dataset.committedId, mode: gallery.dataset.mode };
      });
      assert.equal(state.selected, selected);
      assert.ok(Math.abs(state.y - state.anchor) <= 1);
      await save('gallery-resize');
      const boundaryChecks = [];
      for (const index of [0, 3]) {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(url, { waitUntil: 'load', timeout: 60000 });
        await page.waitForTimeout(700);
        await page.locator('nav a[href="#selected-work"]').click();
        await page.waitForTimeout(800);
        await page.locator(`[data-project-index="${index}"]`).click();
        await page.waitForTimeout(600);
        await page.setViewportSize({ width: 1440, height: 640 });
        await page.waitForTimeout(1000);
        const boundary = await page.evaluate(index => {
          const track = document.querySelector('[data-browse-start]');
          return { index, y: scrollY, anchor: Number(track.dataset.browseStart) + Number(track.dataset.galleryStride) * index };
        }, index);
        assert.ok(Math.abs(boundary.y - boundary.anchor) <= 1, JSON.stringify(boundary));
        boundaryChecks.push(boundary);
      }
      return { ...state, boundaryChecks };
    });
    for (const section of ['team', 'footer']) await test(`${section}-resize`, async () => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.evaluate(section => {
        const node = section === 'team' ? document.querySelector('[data-team]') : document.querySelector('footer [aria-label*="beginning"]').closest('footer');
        scrollTo({ top: section === 'team' ? scrollY + node.getBoundingClientRect().top + innerHeight * 2 : document.documentElement.scrollHeight, behavior: 'instant' });
      }, section);
      await page.waitForTimeout(1500);
      await page.setViewportSize({ width: 1440, height: 640 });
      await page.waitForTimeout(1500);
      const state = await page.evaluate(() => {
        const track = document.querySelector('[data-browse-start]');
        return { y: scrollY, galleryEnd: Number(track.dataset.browseStart) + Number(track.dataset.galleryBrowsing), teamTop: document.querySelector('[data-team]').getBoundingClientRect().top, cover: document.querySelector('#closing-sequence').dataset.cover };
      });
      await save(`${section}-resize`);
      if (phase === 'after') assert.ok(state.y > state.galleryEnd, 'Resize returned to gallery');
      return state;
    });
    await page.close();
    if (phase === 'after') {
      await open(browser, { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
      await test('mobile-gallery-boundary-resizes', async () => {
        const checks = [];
        for (const index of [0, 1, 3]) {
          await page.setViewportSize({ width: 390, height: 844 });
          await page.goto(url, { waitUntil: 'load', timeout: 60000 });
          await page.waitForTimeout(700);
          await page.locator('nav a[href="#selected-work"]').tap();
          await page.waitForTimeout(800);
          await page.locator(`[data-project-index="${index}"]`).tap();
          await page.waitForTimeout(600);
          const selected = await page.locator('[data-gallery]').getAttribute('data-committed-id');
          await page.setViewportSize({ width: 390, height: 500 });
          await page.waitForTimeout(1500);
          const state = await page.evaluate(index => {
            const track = document.querySelector('[data-browse-start]');
            return { index, y: scrollY, anchor: Number(track.dataset.browseStart) + Number(track.dataset.galleryStride) * index, selected: document.querySelector('[data-gallery]').dataset.committedId };
          }, index);
          assert.equal(state.selected, selected);
          assert.ok(Math.abs(state.y - state.anchor) <= 1, JSON.stringify(state));
          checks.push(state);
        }
        await save('mobile-gallery-resize');
        return checks;
      });
      for (const section of ['team', 'footer']) await test(`mobile-${section}-resize`, async () => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.waitForTimeout(800);
        await page.evaluate(section => {
          const team = document.querySelector('[data-team]');
          scrollTo({ top: section === 'team' ? scrollY + team.getBoundingClientRect().top + innerHeight * 2 : document.documentElement.scrollHeight, behavior: 'instant' });
        }, section);
        await page.waitForTimeout(1200);
        await page.setViewportSize({ width: 390, height: 500 });
        await page.waitForTimeout(1200);
        const state = await page.evaluate(() => {
          const track = document.querySelector('[data-browse-start]');
          return { y: scrollY, galleryEnd: Number(track.dataset.browseStart) + Number(track.dataset.galleryBrowsing) };
        });
        assert.ok(state.y > state.galleryEnd);
        await save(`mobile-${section}-resize`);
        return state;
      });
      await page.close();
    }
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(out, `interaction-${phase}.json`), JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results, null, 2));
    if (phase === 'after' && (results.errors.length || results.tests.some(test => test.failure))) process.exitCode = 1;
  }
})();
