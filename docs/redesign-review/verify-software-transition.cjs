// Focused visual check. --record captures entrance/reverse; --journey captures opening through the playable quiz.
// CDP captures frames without Playwright's pre-hydration recorder; NVIDIA NVENC exports MP4.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { execFileSync, spawn } = require('node:child_process');
const { once } = require('node:events');

const record = process.argv.includes('--record');
const journey = process.argv.includes('--journey');
const output = __dirname;
const views = [{ width: 1440, height: 900 }, { width: 1920, height: 1080 }];

async function move(page, distance, progress, duration = 750) {
  await page.evaluate(async ({ to, duration }) => {
    const from = scrollY;
    const start = performance.now();
    await new Promise(resolve => {
      function step(now) {
        const t = Math.min(1, (now - start) / duration);
        scrollTo(0, from + (to - from) * t);
        if (t < 1) requestAnimationFrame(step);
        else resolve();
      }
      requestAnimationFrame(step);
    });
  }, { to: distance * progress, duration });
}

async function capture(page, name) {
  const cdp = await page.context().newCDPSession(page);
  try {
    const image = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await fs.writeFile(path.join(output, name), Buffer.from(image.data, 'base64'));
  } finally { await cdp.detach(); }
}

async function startRecording(page) {
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  let latest = -Infinity;
  let stopped = false;
  const start = Date.now();
  cdp.on('Page.screencastFrame', ({ data, sessionId }) => {
    const ms = Date.now() - start;
    if (!stopped && ms - latest >= 38) {
      frames.push({ ms, image: Buffer.from(data, 'base64') });
      latest = ms;
    }
    void cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 76, maxWidth: 1280, maxHeight: 800, everyNthFrame: 1 });
  return async () => {
    stopped = true;
    await cdp.send('Page.stopScreencast');
    await cdp.detach();
    return { frames, duration: Date.now() - start };
  };
}

async function encodeRecording({ frames, duration }, name) {
  assert(frames.length >= 40, `Only ${frames.length} screencast frames captured`);
  const mp4 = path.join(output, `${name}.mp4`);
  const encoder = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', '24',
    '-c:v', 'mjpeg', '-i', 'pipe:0', '-an', '-c:v', 'h264_nvenc', '-preset', 'p4', '-cq', '23',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4]);
  let errorText = '';
  encoder.stderr.on('data', data => { errorText += data.toString(); });
  const done = new Promise((resolve, reject) => {
    encoder.on('error', reject);
    encoder.on('close', code => code === 0 ? resolve() : reject(new Error(`NVENC failed: ${errorText}`)));
  });
  let current = 0;
  const totalFrames = Math.ceil(duration / 1000 * 24);
  for (let index = 0; index < totalFrames; index++) {
    const time = index * 1000 / 24;
    while (current + 1 < frames.length && frames[current + 1].ms <= time) current++;
    if (!encoder.stdin.write(frames[current].image)) await once(encoder.stdin, 'drain');
  }
  encoder.stdin.end();
  await done;
  const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', mp4], { encoding: 'utf8' }));
  assert(probe.streams[0].codec_name === 'h264' && probe.streams[0].width === 1280 && probe.streams[0].height === 800);
  console.log(`Recorded ${Number(probe.format.duration).toFixed(1)}s via NVENC (${frames.length} captured / ${totalFrames} output frames): ${mp4}`);
}

(async () => {
  const started = Date.now();
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const view of process.env.SOFTWARE_VIEWPORT ? views.filter(item => item.width === Number(process.env.SOFTWARE_VIEWPORT)) : views) {
      const captureThisView = (record || journey) && view.width === 1440;
      const opened = Date.now();
      const page = await browser.newPage({ viewport: view });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto('http://127.0.0.1:5782/redesign', { waitUntil: 'commit', timeout: 25000 });
      assert.equal(response.status(), 200);
      await page.waitForSelector('[data-settled="true"]', { timeout: 20000 });
      await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
      const distance = await page.evaluate(() => document.querySelector('section').firstElementChild.clientHeight * 2.7 - innerHeight);
      await page.evaluate(() => { window.reviewFilm = document.querySelector('video'); });
      let stopRecording = journey && captureThisView ? await startRecording(page) : null;
      if (journey) {
        await move(page, distance, 0.25, 900);
        await page.waitForTimeout(1100);
        await move(page, distance, 1, 1200);
        await page.waitForTimeout(1300);
      }
      await move(page, distance, 1.9, 700);
      await page.waitForFunction(() => {
        const root = document.querySelector('[data-static-expanded]');
        const stage = root?.querySelector('[class*=stage]');
        const scale = Math.min(stage.clientWidth / 1672, stage.clientHeight / 941) * 0.96;
        return root?.dataset.tablet === 'true' && Math.abs(Number(root.style.getPropertyValue('--scene-scale')) - scale) < 0.05;
      }, null, { timeout: 12000 });
      if (captureThisView && !stopRecording) stopRecording = await startRecording(page);
      await move(page, distance, 2.45, 850);
      await page.waitForFunction(() => Number(document.querySelector('[data-static-expanded]').style.getPropertyValue('--supporting-copy')) > 0.985, null, { timeout: 12000 });
      const intro = await page.evaluate(() => {
        const root = document.querySelector('[data-static-expanded]');
        const h = root.querySelector('[class*=businessIntro] h2');
        const p = h.nextElementSibling;
        const scene = root.querySelector('img[src="/redesign/tablet-scene-v1.png"]').parentElement;
        const imageTransform = new DOMMatrix(getComputedStyle(scene).transform);
        const game = root.querySelector('[data-theme]').parentElement.parentElement.getBoundingClientRect();
        return {
          font: getComputedStyle(h).fontFamily, weight: getComputedStyle(h).fontWeight,
          headlineSize: parseFloat(getComputedStyle(h).fontSize), spacing: getComputedStyle(h).letterSpacing,
          lines: Array.from(h.querySelectorAll('[class*=lineMask]'), item => ({ text: item.textContent, bounds: item.getBoundingClientRect().toJSON() })),
          copy: { text: p.textContent, fontSize: parseFloat(getComputedStyle(p).fontSize), weight: getComputedStyle(p).fontWeight, bounds: p.getBoundingClientRect().toJSON() },
          screen: { x: imageTransform.e + 1028 * imageTransform.a, y: imageTransform.f + 224 * imageTransform.d, width: 188 * imageTransform.a, height: 110 * imageTransform.d },
          game: game.toJSON(), portraitOpacity: Number(getComputedStyle(scene).opacity),
          film: { same: root.querySelector('video') === window.reviewFilm, paused: window.reviewFilm.paused },
        };
      });
      assert.deepEqual(intro.lines.map(item => item.text), ['We build what', 'happens next.']);
      assert(intro.font.startsWith('Arial') && intro.weight === '700' && intro.copy.weight === '400');
      assert(intro.lines.every(item => item.bounds.right < view.width * .63));
      assert(intro.copy.bounds.left >= view.width * .048 && intro.copy.bounds.right < intro.screen.x - 45, 'Text collides with tablet');
      assert(intro.film.same && !intro.film.paused);
      for (const key of ['x', 'y', 'width', 'height']) assert(Math.abs(intro.screen[key] - intro.game[key]) < 0.35, `Screen ${key} not aligned`);
      if (view.width === 1920) assert(intro.headlineSize >= 124 && intro.headlineSize <= 128 && intro.copy.fontSize >= 29 && intro.copy.fontSize <= 30);
      await capture(page, `software-introduction-${view.width}.png`);
      await move(page, distance, 3.1, 850);
      await page.waitForFunction(() => document.querySelector('[data-static-expanded]')?.dataset.gameVisible === 'true' && document.querySelector('video').paused, null, { timeout: 12000 });
      await capture(page, `software-tablet-${view.width}.png`);
      await move(page, distance, 3.48, 700);
      await page.waitForFunction(() => Number(document.querySelector('[data-static-expanded]').style.getPropertyValue('--game-reveal')) > 0.07, null, { timeout: 10000 });
      const emerging = await page.evaluate(() => {
        const root = document.querySelector('[data-static-expanded]');
        const scene = root.querySelector('img[src="/redesign/tablet-scene-v1.png"]').parentElement;
        const game = root.querySelector('[data-theme]').parentElement.parentElement;
        return { zGame: Number(getComputedStyle(game).zIndex), zScene: Number(getComputedStyle(scene).zIndex),
          portraitExit: Number(root.style.getPropertyValue('--portrait-exit')),
          textExit: Number(root.style.getPropertyValue('--text-exit')),
          frame: game.getBoundingClientRect().toJSON() };
      });
      assert(emerging.zGame > emerging.zScene && emerging.frame.width > intro.game.width * 1.4, 'Quiz remains behind bezel while growing');
      assert(emerging.textExit > emerging.portraitExit, 'Text should clear ahead of the portrait');
      await capture(page, `software-emerging-${view.width}.png`);
      await move(page, distance, 4.3, 1000);
      await page.waitForSelector('[data-game-interactive="true"]', { timeout: 12000 });
      const frame = page.locator('[data-theme]').first().locator('../..');
      assert(await frame.evaluate(el => !el.inert && Math.abs(el.getBoundingClientRect().width - innerWidth) < 0.5));
      await page.evaluate(to => scrollTo(0, to), distance * 4.2);
      await page.waitForTimeout(100);
      assert(await frame.evaluate(el => !el.inert), 'Tiny resting scroll locked quiz controls');
      await page.evaluate(to => scrollTo(0, to), distance * 4.3);
      await page.waitForTimeout(100);
      await capture(page, `software-quiz-settled-${view.width}.png`);
      await page.getByRole('button', { name: 'Let’s play' }).first().click();
      await page.getByRole('button', { name: 'B Mars', exact: true }).click();
      let recording = null;
      if (journey && stopRecording) {
        await page.getByRole('button', { name: 'Check answer', exact: true }).click();
        await page.waitForTimeout(900);
        recording = await stopRecording();
        assert((await page.getByRole('status').textContent()).includes('Iron-rich dust'));
        assert.deepEqual(errors, []);
        await page.close();
        await encodeRecording(recording, 'opening-to-quiz');
        console.log(`PASS ${view.width}×${view.height} full journey (${((Date.now() - opened) / 1000).toFixed(1)}s): opening through submitted quiz feedback.`);
        continue;
      }
      await move(page, distance, 2.45, 1200);
      await page.waitForFunction(() => Number(document.querySelector('[data-static-expanded]').style.getPropertyValue('--swipe')) < 0.003 && !document.querySelector('video').paused, null, { timeout: 14000 });
      assert(await frame.evaluate(el => el.inert));
      assert(await page.locator('video').evaluate(el => el === window.reviewFilm && !el.paused));
      if (!journey && stopRecording) recording = await stopRecording();
      await move(page, distance, 4.3, 900);
      await page.waitForSelector('[data-game-interactive="true"]', { timeout: 12000 });
      assert.equal(await page.getByRole('button', { name: 'B Mars', exact: true }).getAttribute('aria-pressed'), 'true');
      assert.deepEqual(errors, []);
      await page.close();
      if (recording) await encodeRecording(recording, journey ? 'opening-to-quiz' : 'software-entrance');
      console.log(`PASS ${view.width}×${view.height} (${((Date.now() - opened) / 1000).toFixed(1)}s): font, spacing, screen alignment, emerging layer, final controls, retained selection and reverse.`);
    }
    console.log(`Total elapsed ${(Date.now() - started) / 1000}s`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error.stack); process.exitCode = 1; });
