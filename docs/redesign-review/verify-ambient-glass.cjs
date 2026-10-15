// Normal private-HTTPS animation checks. No bundle interception or YouTube API stub.
const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { Script } = require('node:vm');
const path = require('node:path');
const output = path.join(__dirname, 'ambient-glass');
const report = { url: process.env.GALLERY_URL || 'https://johnsax.tailb6e2d3.ts.net:3461/redesign', transport: 'normal networking, no interception', checks: [], errors: [] };
(async () => {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('pageerror', error => report.errors.push(error.message));
    await page.addInitScript(() => {
      window.ambientReads = 0;
      const original = CanvasRenderingContext2D.prototype.getImageData;
      CanvasRenderingContext2D.prototype.getImageData = function (...args) {
        if (this.canvas.width === 24 && this.canvas.height === 12) window.ambientReads++;
        return original.apply(this, args);
      };
    });
    report.instrumentation = 'Counts 24x12 canvas reads while delegating actual pixels; no colour or video stub';
    if (process.argv.includes('--disk-layout')) {
      const bundle = await fs.readFile(path.resolve('.next/static/chunks/app/layout.js'));
      new Script(bundle.toString());
      report.transport = 'Normal networking except explicitly labelled current on-disk layout bootstrap';
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
      if (id === 'nifemi') {
        await page.evaluate(async () => {
          const film = document.querySelector('[data-portfolio-viewer] video');
          film.muted = true; await film.play(); film.pause();
        });
        await page.waitForFunction(() => document.querySelector('[data-portfolio-viewer]').style.getPropertyValue('--ambient-top') !== '');
        const colours = [];
        for (const seconds of [4, 12, 20]) {
          await page.evaluate(seconds => new Promise(resolve => {
            const film = document.querySelector('[data-portfolio-viewer] video');
            film.addEventListener('seeked', resolve, { once: true }); film.currentTime = seconds;
          }), seconds);
          colours.push(await page.locator('[data-portfolio-viewer]').evaluate(el => ({
            top: el.style.getPropertyValue('--ambient-top'), bottom: el.style.getPropertyValue('--ambient-bottom'),
          })));
        }
        assert(new Set(colours.map(c => c.top + c.bottom)).size > 1, 'Tint did not follow real decoded scenes');
        assert(colours.every(c => [c.top, c.bottom].every(v => v.split(' ').map(Number).every(n => n >= 16 && n <= 78))), 'Unsafe bright tint');
        const beforePlay = await page.evaluate(() => window.ambientReads);
        await page.evaluate(async () => { const film = document.querySelector('[data-portfolio-viewer] video'); await film.play(); });
        await page.waitForTimeout(1250);
        const playingReads = await page.evaluate(() => window.ambientReads) - beforePlay;
        assert(playingReads >= 1 && playingReads <= 5, 'Sampler is not throttled');
        await page.evaluate(() => document.querySelector('[data-portfolio-viewer] video').pause());
        const pausedReads = await page.evaluate(() => window.ambientReads);
        await page.waitForTimeout(800);
        assert.equal(await page.evaluate(() => window.ambientReads), pausedReads, 'Paused sampling kept running');
        await page.screenshot({ path: path.join(output, 'native-live-glass.png') });
        report.nativeAmbient = { colours, playingReads, pausedReadsStable: true };
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.waitForFunction(() => document.querySelector('[data-portfolio-viewer]').style.getPropertyValue('--ambient-top') === '');
        const reducedReads = await page.evaluate(() => window.ambientReads);
        await page.evaluate(async () => { await document.querySelector('[data-portfolio-viewer] video').play(); });
        await page.waitForTimeout(800);
        assert.equal(await page.evaluate(() => window.ambientReads), reducedReads, 'Reduced motion sampled continuously');
        await page.evaluate(() => document.querySelector('[data-portfolio-viewer] video').pause());
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.waitForFunction(() => document.querySelector('[data-portfolio-viewer]').style.getPropertyValue('--ambient-top') !== '');
        report.checks.push({ id: 'reduced-motion-live-preference', result: 'pass' });
      }
      if (id === 'forest-sequence') {
        assert.equal(await page.locator('[data-portfolio-viewer]').evaluate(el => el.style.getPropertyValue('--ambient-top')), '');
        const reads = await page.evaluate(() => window.ambientReads);
        await page.waitForTimeout(800);
        assert.equal(await page.evaluate(() => window.ambientReads), reads, 'YouTube attempted canvas reads');
        const iframe = await page.locator('[data-portfolio-viewer] iframe').boundingBox();
        const controls = await page.locator('[data-viewer-controls]').boundingBox();
        assert(iframe && controls && controls.y >= iframe.y + iframe.height - 1, 'Glass controls overlap iframe');
        await page.screenshot({ path: path.join(output, 'youtube-neutral-glass.png') });
        report.youtubeAmbient = { neutral: true, canvasReads: 0, controlsOutsideIframe: true };
      }
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
      assert.equal(await page.locator('[data-portfolio-viewer]').evaluate(el => el.style.getPropertyValue('--ambient-top')), '', 'Tint survived cinema exit');
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
    assert.deepEqual(report.errors, []);
    report.status = 'passed';
  } catch (error) { report.status = 'failed'; report.failure = error.message; process.exitCode = 1; console.error(error.message); }
  finally { await fs.writeFile(path.join(output, process.argv.includes('--disk-layout') ? 'compiled-bootstrap-results.json' : 'results.json'), JSON.stringify(report, null, 2)); await browser.close(); }
})();
