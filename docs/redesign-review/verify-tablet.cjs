// Standalone Chrome only. No recording and no project browser dependency.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const output = __dirname;

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const reports = [];
    for (const viewport of [{ width: 1860, height: 980 }, { width: 1440, height: 900 }, { width: 1280, height: 720 }]) {
      console.log(`Checking ${viewport.width}×${viewport.height}`);
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      assert((await page.goto('http://127.0.0.1:5782/redesign', { waitUntil: 'networkidle' })).status() === 200);
      await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
      await page.waitForSelector('[data-settled="true"]');
      await page.evaluate(() => {
        window.tabletTestFilm = document.querySelector('video');
        window.tabletTestLoops = 0;
        let last = 0;
        window.tabletTestFilm.addEventListener('timeupdate', () => {
          if (last - window.tabletTestFilm.currentTime > 10) window.tabletTestLoops++;
          last = window.tabletTestFilm.currentTime;
        });
      });
      const phases = [];
      async function phase(progress, name) {
        const before = await page.locator('video').evaluate(el => ({ time: el.currentTime, clock: performance.now(), paused: el.paused }));
        await page.evaluate(p => {
          const section = document.querySelector('section');
          scrollTo(0, section.getBoundingClientRect().top + scrollY + (section.firstElementChild.clientHeight * 2.7 - innerHeight) * p);
        }, progress);
        await page.waitForTimeout(150);
        await page.waitForSelector('[data-settled="true"]', { timeout: 20000 });
        const report = await page.evaluate(before => {
          const film = document.querySelector('video');
          const image = document.querySelector('img[src="/redesign/tablet-scene-v1.png"]');
          const scene = image.parentElement;
          const root = document.querySelector('main > div');
          const m = new DOMMatrix(getComputedStyle(scene).transform);
          const origin = scene.parentElement.getBoundingClientRect();
          return {
            time: film.currentTime, paused: film.paused, muted: film.muted, rate: film.playbackRate,
            same: film === window.tabletTestFilm, videoCount: document.querySelectorAll('video').length,
            bounds: film.getBoundingClientRect().toJSON(), sceneVisible: getComputedStyle(scene).visibility,
            screen: { left: origin.left + m.e + 1028 * m.a, top: origin.top + m.f + 224 * m.d, width: 188 * m.a, height: 110 * m.d },
            mask: getComputedStyle(image).maskImage, fit: getComputedStyle(film).objectFit,
            elapsed: (performance.now() - before.clock) / 1000,
            advanced: (film.currentTime - before.time + film.duration) % film.duration,
            loops: window.tabletTestLoops,
            tablet: root.dataset.tablet,
            audit: window.__CREATIVE_AUDIT__,
          };
        }, before);
        assert(report.same && report.videoCount === 1 && report.rate === 1 && report.fit === 'cover', 'Film replaced, stretched or reversed');
        if (progress >= 1 && !before.paused) assert(!report.paused && Math.abs(report.advanced - report.elapsed) < 1, 'Playback discontinuity');
        if (progress >= 1.5) {
          assert(report.sceneVisible === 'visible' && report.mask.includes('tablet-screen-mask.svg'));
          for (const key of ['left', 'top', 'width', 'height']) assert(Math.abs(report.bounds[key] - report.screen[key]) < 0.15, `Unregistered ${key}`);
        }
        if (progress === 1) assert(report.bounds.left === 0 && report.bounds.top === 0 && report.bounds.width === viewport.width && report.bounds.height === viewport.height, 'Screening changed');
        if (viewport.width === 1860) {
          await page.screenshot({ path: path.join(output, `tablet-${name}.png`) });
          if (name === 'end') {
            await page.screenshot({ path: path.join(output, 'tablet-bezel.png'), clip: { x: report.bounds.x - 8, y: report.bounds.y - 8, width: report.bounds.width + 16, height: report.bounds.height + 16 }, scale: 'device' });
          }
        }
        console.log(`  ${name}: same film, ${report.paused ? 'paused' : 'playing'}, ${report.loops} loops`);
        phases.push({ name, ...report });
        return report;
      }
      await phase(1, 'start');
      await phase(1.1, 'early');
      await phase(1.5, 'middle');
      await phase(2.2, 'end');
      await page.locator('#film-sound').click();
      assert(await page.locator('video').evaluate(el => !el.muted));
      await phase(1.5, 'reverse-middle');
      const reverse = await phase(1, 'reverse-start');
      assert(!reverse.muted);
      const film = page.locator('video');
      await film.focus();
      await page.keyboard.press('Space');
      const pausedTime = await film.evaluate(el => el.currentTime);
      const paused = await phase(2, 'paused-end');
      assert(paused.paused && !paused.muted && Math.abs(paused.time - pausedTime) < 0.05, 'Manual pause or sound choice lost');
      await phase(1, 'paused-reverse');
      await film.focus();
      await page.keyboard.press('Space');
      await page.waitForFunction(() => !document.querySelector('video').paused);
      await phase(0, 'opening');
      assert(await film.evaluate(el => el.paused), 'Offscreen film did not pause');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.getByRole('button', { name: 'Expand film', exact: true }).click();
      await page.getByRole('button', { name: 'View tablet', exact: true }).click();
      assert(await film.evaluate(el => el === window.tabletTestFilm && el.paused));
      await film.focus();
      await page.keyboard.press('Space');
      await page.waitForFunction(() => !document.querySelector('video').paused);
      await page.getByRole('button', { name: 'Return to screening', exact: true }).click();
      assert(await film.evaluate(el => !el.paused && !el.muted));
      assert.deepEqual(errors, []);
      assert(phases.some(p => p.loops >= 2), 'Multiple natural loops not exercised');
      reports.push({ viewport, phases, errors });
      await page.close();
    }
    const detail = await browser.newPage({ viewport: { width: 1860, height: 980 }, deviceScaleFactor: 2 });
    await detail.goto('http://127.0.0.1:5782/redesign', { waitUntil: 'networkidle' });
    await detail.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
    await detail.evaluate(() => scrollTo(0, (document.querySelector('section').firstElementChild.clientHeight * 2.7 - innerHeight) * 2));
    await detail.waitForTimeout(150);
    await detail.waitForSelector('[data-settled="true"]');
    const bezel = await detail.locator('video').boundingBox();
    await detail.screenshot({ path: path.join(output, 'tablet-bezel-2x.png'), clip: { x: bezel.x - 8, y: bezel.y - 8, width: bezel.width + 16, height: bezel.height + 16 }, scale: 'device' });
    await detail.close();
    await fs.writeFile(path.join(output, 'tablet-checks.json'), JSON.stringify(reports, null, 2));
    console.log('PASS: registration, forward/reverse same-video continuity over multiple loops, manual pause/mute, reduced motion and original screening at three desktop sizes. No recording created.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e.message); process.exitCode = 1; });
