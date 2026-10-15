// Normal private-HTTPS animation checks. No bundle interception or YouTube API stub.
const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { Script } = require('node:vm');
const path = require('node:path');
const output = path.join(__dirname, 'notes-return');
const report = { url: 'https://johnsax.tailb6e2d3.ts.net:3461/redesign', transport: 'normal HTTPS, no interception', checks: [], errors: [] };
(async () => {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('pageerror', error => report.errors.push(error.message));
    if (process.argv.includes('--disk-layout')) {
      const bundle = await fs.readFile(path.resolve('.next/static/chunks/app/layout.js'));
      new Script(bundle.toString());
      report.transport = 'Normal HTTPS except explicitly labelled current on-disk layout bootstrap';
      report.layoutDelivery = { testOnly: true, bytes: bundle.length, nodeParse: 'passed', normalBootstrap: 'not verified by this run' };
      await page.route('**/_next/static/chunks/app/layout.js*', route => route.fulfill({ status: 200, contentType: 'application/javascript', body: bundle }));
    }
    const response = await page.goto(report.url, { waitUntil: 'domcontentloaded', timeout: 120000 });
    assert.equal(response.status(), 200, 'Preview HTTP response is not healthy');
    await page.waitForSelector('[data-font-ready="true"]', { timeout: 60000 });
    await page.evaluate(() => { window.savedGame = document.querySelector('[data-study-canvas] > div'); });
    await page.getByRole('link', { name: 'Work', exact: true }).click();
    async function open(id) {
      const index = await page.locator(`[data-project-id="${id}"]`).getAttribute('data-project-index');
      await page.evaluate(index => {
        const track = document.querySelector('[data-gallery-count]');
        if (document.querySelector('[data-gallery]').dataset.reduced !== 'true') scrollTo(0, Number(track.dataset.browseStart) + Number(index) * Number(track.dataset.galleryStride));
      }, index);
      await page.waitForTimeout(350);
      await page.locator(`[data-project-id="${id}"]`).click();
      await page.waitForFunction(id => document.querySelector('[data-gallery]').dataset.committedId === id, id);
      await page.locator('[data-project-action]').click();
      await page.waitForSelector(`[data-portfolio-viewer][data-project="${id}"]`);
      await page.waitForFunction(() => document.querySelector('[data-portfolio-viewer]')?.dataset.notesPhase === 'shown');
      await page.waitForTimeout(400);
    }
    async function record() {
      await page.evaluate(() => {
        const start = performance.now();
        const initial = document.querySelector('[data-portfolio-viewer]').dataset;
        const initialExpanded = initial.expanded === 'true', initialPhase = initial.notesPhase;
        window.motionFrames = [];
        window.motionDone = false;
        let sawTransition = false;
        function frame(now) {
          const viewer = document.querySelector('[data-portfolio-viewer]');
          const notes = viewer.querySelector('[aria-label="Studio Notes"]');
          const media = viewer.querySelector('[class*="_media"]');
          window.motionFrames.push({ elapsed: now - start, phase: viewer.dataset.notesPhase, expanded: viewer.dataset.expanded === 'true',
            left: notes.getBoundingClientRect().left, visibility: getComputedStyle(notes).visibility,
            moving: media.getAnimations().some(animation => animation.playState === 'running'),
            mediaZ: getComputedStyle(media.parentElement).zIndex, notesZ: getComputedStyle(notes).zIndex });
          const last = window.motionFrames.at(-1);
          sawTransition ||= last.expanded !== initialExpanded || last.phase !== initialPhase;
          const settled = sawTransition && !last.moving && (last.expanded ? last.phase === 'waiting' : last.phase === 'shown');
          if (settled || now - start > 3000) window.motionDone = true;
          else requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      });
    }
    for (const id of ['nifemi', 'adaptive-study-game', 'forest-sequence']) {
      await open(id);
      if (id === 'adaptive-study-game') {
        await page.locator('[data-try-sample]').first().click();
        await page.locator('[data-study-canvas]').getByRole('button', { name: 'Let’s play' }).first().click();
        await page.locator('[data-study-canvas]').getByRole('button', { name: /Mars/ }).click();
      }
      if (id === 'forest-sequence') await page.waitForSelector('[data-portfolio-viewer] iframe', { state: 'attached' });
      await page.evaluate(() => { window.savedPlayer = document.querySelector('[data-portfolio-viewer] video, [data-portfolio-viewer] iframe'); });
      await record();
      await page.locator('[data-viewer-fullscreen]').click({ force: true });
      await page.waitForFunction(() => window.motionDone);
      const entry = await page.evaluate(() => window.motionFrames);
      report.lastEntry = { id, frames: entry };
      const leaving = entry.filter(frame => frame.phase === 'leaving');
      assert(leaving.length > 1, `${id}: no outgoing notes animation`);
      assert(leaving.at(-1).left > leaving[0].left + 30, `${id}: notes did not slide right`);
      if (id === 'forest-sequence') assert(entry.filter(frame => frame.expanded).every(frame => frame.visibility === 'hidden'), 'Notes showed through the fading YouTube iframe');
      await record();
      if (id === 'adaptive-study-game') await page.evaluate(() => document.exitFullscreen());
      else await page.locator('[data-viewer-fullscreen]').click({ force: true });
      await page.waitForFunction(() => window.motionDone);
      const returning = await page.evaluate(() => window.motionFrames);
      report.lastReturn = { id, frames: returning };
      assert(returning.some(frame => frame.phase === 'waiting' && frame.moving), `${id}: missing return wait`);
      assert(!returning.some(frame => frame.moving && ['entering', 'shown'].includes(frame.phase)), `${id}: notes entered before media finished`);
      assert(returning.some(frame => frame.phase === 'entering'), `${id}: no notes reentry`);
      assert.equal(returning.at(-1).phase, 'shown');
      assert(returning.every(frame => Number(frame.mediaZ) > Number(frame.notesZ)), `${id}: media is behind notes`);
      assert(await page.evaluate(() => window.savedGame === document.querySelector('[data-study-canvas] > div')));
      assert(await page.evaluate(() => window.savedPlayer === document.querySelector('[data-portfolio-viewer] video, [data-portfolio-viewer] iframe')));
      if (id === 'adaptive-study-game') assert.equal(await page.locator('[data-study-canvas]').getByRole('button', { name: /Mars/ }).getAttribute('aria-pressed'), 'true');
      await page.screenshot({ path: path.join(output, `${id}-returned.png`) });
      report.checks.push({ id, result: 'pass', entry, returning });
      delete report.lastEntry; delete report.lastReturn;
      console.log('PASS', id);
      await page.locator('[data-back-to-browsing]').click();
      await page.waitForSelector('[data-portfolio-viewer]', { state: 'detached' });
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(report.url, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForSelector('[data-font-ready="true"]', { timeout: 60000 });
    await page.getByRole('link', { name: 'Work', exact: true }).click();
    await open('nifemi');
    await page.locator('[data-viewer-fullscreen]').click();
    await page.waitForFunction(() => document.fullscreenElement !== null);
    await page.evaluate(() => document.exitFullscreen());
    await page.waitForFunction(() => document.querySelector('[data-portfolio-viewer]')?.dataset.notesPhase === 'shown');
    report.checks.push({ id: 'reduced-motion', result: 'pass' });
    assert.deepEqual(report.errors, []);
    report.status = 'passed';
  } catch (error) { report.status = 'failed'; report.failure = error.message; process.exitCode = 1; console.error(error.message); }
  finally { await fs.writeFile(path.join(output, process.argv.includes('--disk-layout') ? 'compiled-bootstrap-results.json' : 'results.json'), JSON.stringify(report, null, 2)); await browser.close(); }
})();
