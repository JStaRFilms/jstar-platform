// Synchronous Chrome QA. --refinement keeps new evidence separate from initial receipts.
// Fixtures temporarily override the isolated /redesign page, with byte restoration in finally.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { spawn, execFileSync } = require('node:child_process');
const { once } = require('node:events');
const base = process.env.GALLERY_URL || 'http://127.0.0.1:5782/redesign';
const out = process.argv.includes('--refinement') ? path.join(__dirname, 'gallery-refinement') : __dirname;
const root = path.resolve(__dirname, '../..');
const report = { started: new Date().toISOString(), checks: [], status: 'running', recording: null };
const resumeFixtures = process.argv.includes('--from-fixtures');
const recordOnly = process.argv.includes('--record-only');
let prior;
const started = Date.now();
let page, browser, current = 'startup', fixtureOriginal, fixtureRestored = false;
const pageSource = path.join(root, 'src/app/redesign/page.tsx');
const ids = ['adaptive-study-game', 'school-management-system', 'nifemi', 'sharon'];
const row = id => page.locator(`[data-project-id="${id}"]`);
const gallery = () => page.locator('[data-gallery]');
async function checkpoint() {
  if (process.argv.includes('--reduced-only')) return;
  const fixture = fixtureOriginal ? { used: true, byteRestored: fixtureRestored } : report.fixture;
  await fs.writeFile(path.join(out, 'gallery-verify-results.json'), JSON.stringify({ ...report, currentCheck: current, checkpoint: true, fixture }, null, 2));
}
async function check(name, fn) {
  current = name;
  const earlier = prior?.checks.find(item => item.name === name && item.status === 'pass');
  if (earlier && (recordOnly || resumeFixtures && name !== 'runtime errors and fixture cleanup')) {
    report.checks.push({ ...earlier, retainedFrom: earlier.retainedFrom ?? prior.started });
    console.log(`RETAIN ${name}`); await checkpoint(); return;
  }
  const begin = Date.now();
  console.log(`RUN ${name}`);
  await checkpoint();
  try { const evidence = await fn(); report.checks.push({ name, status: 'pass', elapsedMs: Date.now() - begin, evidence }); console.log(`PASS ${name} (${Date.now() - begin}ms)`); await checkpoint(); }
  catch (error) { report.checks.push({ name, status: 'fail', elapsedMs: Date.now() - begin, error: error.message }); throw error; }
}
async function snap(name) {
  const cdp = await page.context().newCDPSession(page);
  try { const shot = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }); await fs.writeFile(path.join(out, `gallery-verify-${name}.png`), Buffer.from(shot.data, 'base64')); }
  finally { await cdp.detach(); }
}
async function state() {
  return page.evaluate(() => {
    const g = document.querySelector('[data-gallery]'), t = document.querySelector('[data-gallery-count]');
    return { gallery: { ...g.dataset }, track: { ...t.dataset }, scrollY, height: innerHeight,
      counter: document.querySelector('[data-gallery-counter]').textContent,
      gameInert: document.querySelector('[data-study-frame]').inert,
      panels: [...document.querySelectorAll('[data-panel-id]')].map(e => e.dataset.panelId),
      previews: [...document.querySelectorAll('[data-panel-id] video')].map(e => ({ src: e.getAttribute('src'), paused: e.paused, rect: e.getBoundingClientRect().toJSON() })),
      active: document.activeElement?.outerHTML.slice(0, 700), overflow: document.body.style.overflow };
  });
}
async function load(url = base, count = 4) {
  const response = await page.goto(url, { waitUntil: 'load', timeout: 25000 });
  assert.equal(response.status(), 200);
  await page.waitForSelector(`[data-gallery-count="${count}"]`, { timeout: 25000 });
  await page.waitForFunction(() => Number(document.querySelector('[data-denominator]')?.dataset.denominator) > 0 && document.querySelector('[data-theme]'), null, { timeout: 20000 });
  await page.evaluate(() => { window.galleryQuizNode = document.querySelector('[data-study-canvas]').firstElementChild; window.galleryFrameNode = document.querySelector('[data-study-frame]'); window.galleryCanvasNode = document.querySelector('[data-study-canvas]'); });
  await page.addStyleTag({ content: 'nextjs-portal { display:none !important; }' });
}
async function identity() {
  assert(await page.evaluate(() => window.galleryQuizNode === document.querySelector('[data-study-canvas]').firstElementChild && window.galleryFrameNode === document.querySelector('[data-study-frame]') && window.galleryCanvasNode === document.querySelector('[data-study-canvas]')), 'Quiz/frame/canvas DOM identity changed');
  assert.equal(await page.locator('[data-study-frame]').count(), 1);
  assert.equal(await page.locator('iframe').count(), 0);
}
async function scroll(to, settle = true) {
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), to);
  await page.waitForTimeout(100);
  if (settle) await page.waitForSelector('[data-gallery][data-settled="true"]', { state: 'attached', timeout: 25000 });
}
async function metric() { return page.locator('[data-gallery-count]').evaluate(e => ({ start: Number(e.dataset.browseStart), d: Number(e.dataset.denominator), h: e.firstElementChild.clientHeight, stride: Number(e.dataset.galleryStride), count: Number(e.dataset.galleryCount) })); }
async function browse(index = 0) { const m = await metric(); await scroll(m.start + m.stride * index); }
async function selected(id) {
  await page.waitForFunction(id => document.querySelector('[data-gallery]').dataset.committedId === id && document.querySelector('[data-gallery]').dataset.displayedId === id, id, { timeout: 15000 });
}
async function bounded() {
  const s = await state();
  assert(s.panels.length <= 3, `${s.panels.length} ordinary panels`);
  assert(s.previews.filter(v => v.src).length <= 1, 'More than one sourced preview');
  for (const v of s.previews.filter(v => !v.src)) assert(v.paused, 'Unsourced preview still playing');
  return s;
}
async function play() {
  await page.locator('[data-project-action]').click();
  await page.waitForSelector('[data-study-frame]:popover-open', { timeout: 15000 });
  assert.equal(await page.locator('body').evaluate(e => e.style.overflow), 'hidden');
  assert(await page.locator('[data-back-to-browsing]').evaluate(e => e === document.activeElement));
  assert.equal(await gallery().getAttribute('data-mode'), 'play');
  assert(await page.locator('[data-study-frame]').evaluate(e => !e.inert));
  await identity();
}
async function back(key = false) {
  if (key) await page.keyboard.press('Escape'); else await page.locator('[data-back-to-browsing]').click();
  await page.waitForSelector('[data-gallery][data-mode="browse"]', { timeout: 15000 });
  await page.waitForTimeout(100);
  assert.equal(await page.locator('body').evaluate(e => e.style.overflow), '');
  assert(await page.locator('[data-project-action]').evaluate(e => e === document.activeElement), 'Invoking action focus not restored');
  await identity();
}
async function select(id) { await row(id).click(); await page.waitForTimeout(100); await page.waitForSelector('[data-gallery][data-settled="true"]', { timeout: 25000 }); await selected(id); }
async function filter(value) { await page.locator(`[data-filter-button="${value}"]`).click(); await page.waitForTimeout(100); await page.waitForSelector('[data-gallery][data-settled="true"]', { timeout: 25000 }); }
const answer = text => page.locator('[data-study-frame] button[aria-pressed]').filter({ hasText: text });
const gameButton = text => page.locator('[data-study-frame]').getByRole('button', { name: text, exact: true });
async function continuityTrip() {
  await back();
  await browse(3);
  await filter('film');
  await selected('sharon');
  await filter('all');
  const m = await metric();
  await scroll(m.d * 4.2);
  await identity();
  assert(await page.locator('[data-study-frame]').evaluate(e => !e.inert));
  await browse(0);
  await play();
}
async function geometry(label, minimumRows = 4) {
  const result = await page.evaluate(() => {
    const g = document.querySelector('[data-gallery]');
    const nav = g.querySelector('nav');
    const win = g.querySelector('[data-project-id]')?.parentElement.parentElement;
    const wr = win?.getBoundingClientRect();
    const rect = e => ({ ...e.getBoundingClientRect().toJSON(), text: e.textContent.trim() });
    const controls = [...g.querySelectorAll('[data-filter-button], [data-project-action], [data-gallery-continue], [data-gallery-counter]')].map(rect);
    const visibleRows = [...g.querySelectorAll('[data-project-id]')].filter(e => { const r = e.getBoundingClientRect(); return r.top >= wr.top - .5 && r.bottom <= wr.bottom + .5; }).map(e => ({ ...rect(e), strong: rect(e.querySelector('strong')), small: rect(e.querySelector('small')) }));
    const catalogScrollers = [nav, win].filter(e => ['auto', 'scroll'].includes(getComputedStyle(e).overflowY) && e.scrollHeight > e.clientHeight + 1).length;
    return { width: innerWidth, height: innerHeight, overflow: document.documentElement.scrollWidth - innerWidth, controls, visibleRows, catalogScrollers, window: wr?.toJSON() };
  });
  assert.equal(result.overflow, 0, `${label}: horizontal overflow`);
  assert.equal(result.catalogScrollers, 0, `${label}: unintended nested catalog scroll region`);
  for (const r of result.controls) assert(r.x >= -1 && r.y >= -1 && r.right <= result.width + 1 && r.bottom <= result.height + 1, `${label}: clipped control ${r.text}: ${JSON.stringify(r)}`);
  assert(result.visibleRows.length >= minimumRows && result.visibleRows.length <= 6, `${label}: ${result.visibleRows.length} fully visible rows`);
  for (const r of result.visibleRows) {
    assert(r.strong.right <= r.right + 1 && r.small.right <= r.right + 1, `${label}: unreadable name/label ${r.text}`);
    assert(r.strong.top >= r.y - 1 && r.small.bottom <= r.bottom + 1, `${label}: vertically clipped name/label ${r.text}`);
  }
  await snap(label);
  return result;
}
async function installFixture(count = 20) {
  await page.goto('about:blank');
  if (!fixtureOriginal) {
    fixtureOriginal = await fs.readFile(pageSource);
    await fs.writeFile(path.join(root, '.next/gallery-page-backup.tsx'), fixtureOriginal);
  }
  assert(fixtureOriginal.toString().includes('return <Hero />;'), 'Unexpected page source; refusing override');
  const replacement = fixtureOriginal.toString().replace("import Hero from './Hero';", "import Hero from './Hero';\nimport { selectedWork, type GalleryProject } from '@/content/selected-work';")
    .replace('export default function RedesignPage() {\n  return <Hero />;\n}', `export default function RedesignPage() {
  const fixture: readonly GalleryProject[] = ${count === 1 ? '[selectedWork[0]]' : "[selectedWork[0], selectedWork[1], ...Array.from({ length: 18 }, (_, index): GalleryProject => ({ ...selectedWork[2], id: 'fixture-film-' + (index + 3), title: 'Fixture film ' + (index + 3), presentation: { type: 'film', poster: '/redesign/gallery-nifemi.jpg', previewSrc: '/redesign/gallery-nifemi.mp4?fixture=' + index } }))]"};
  return <Hero projects={fixture} />;
}`);
  assert(replacement.includes('projects={fixture}'), 'Fixture replacement failed');
  fixtureRestored = false;
  await fs.writeFile(pageSource, replacement);
  // Warm the development compile before browser navigation. Each request remains bounded.
  const response = await fetch(base, { signal: AbortSignal.timeout(60000) });
  assert.equal(response.status, 200, 'Fixture development compile did not return 200');
  await response.text();
}
async function restoreFixture() {
  if (!fixtureOriginal || fixtureRestored) return;
  if (page && !page.isClosed()) await page.goto('about:blank');
  await fs.writeFile(pageSource, fixtureOriginal);
  assert((await fs.readFile(pageSource)).equals(fixtureOriginal), 'Page bytes not restored');
  fixtureRestored = true;
  const response = await fetch(base, { signal: AbortSignal.timeout(60000) });
  assert.equal(response.status, 200, 'Restored development page did not return 200');
  await response.text();
}
async function studyOcclusion() {
  return page.evaluate(() => {
    const cover = document.querySelector('[class*="staticStudy"]');
    const rect = cover.getBoundingClientRect();
    const targets = [cover, ...document.querySelectorAll('[data-panel-id]')];
    const saved = targets.map(e => e.getAttribute('style'));
    // Enable hit testing without changing layout/paint order, then restore exact inline styles.
    targets.forEach(e => e.style.pointerEvents = 'auto');
    const front = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    const result = { cover: rect.toJSON(), frontPanel: front?.closest('[data-panel-id]')?.dataset.panelId ?? null,
      coverFront: front === cover || cover.contains(front), coverZ: getComputedStyle(cover).zIndex,
      panels: targets.slice(1).map(e => ({ id: e.dataset.panelId, z: getComputedStyle(e).zIndex, rect: e.getBoundingClientRect().toJSON() })) };
    targets.forEach((e, i) => saved[i] === null ? e.removeAttribute('style') : e.setAttribute('style', saved[i]));
    return result;
  });
}
async function reducedRecheck() {
  const errors = [];
  const previousReceipt = await fs.readFile(path.join(__dirname, 'gallery-verify-results.json'));
  const previousClip = await fs.readFile(path.join(__dirname, 'gallery-verify-journey.mp4'));
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    page = await browser.newPage(); page.setDefaultTimeout(15000);
    page.on('pageerror', error => errors.push(error.message));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const view of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      const label = `${view.width}x${view.height}`;
      await check(`reduced ${label}: selected study render, no pin and posters`, async () => {
        await page.setViewportSize(view);
        if (view.width === 1440) await load();
        await gallery().scrollIntoViewIfNeeded(); await select(ids[0]);
        const s = await bounded(), occlusion = await studyOcclusion();
        assert.equal(s.gallery.reduced, 'true'); assert.equal(s.counter, '01 / 04');
        for (const range of ['galleryEntrance', 'galleryBrowsing', 'galleryRest', 'galleryExit']) assert.equal(Number(s.track[range]), 0);
        assert.equal(s.previews.filter(v => v.src).length, 0); assert(s.previews.every(v => v.paused));
        assert(occlusion.coverFront, `Study cover is occluded by ${occlusion.frontPanel}`); assert.equal(occlusion.coverZ, '10');
        assert(occlusion.cover.top >= 0 && occlusion.cover.bottom <= view.height && occlusion.cover.left >= 0 && occlusion.cover.right <= view.width);
        await identity(); await snap(`reduced-fixed-${label}`); return { state: s, occlusion };
      });
      await check(`reduced ${label}: keyboard/filter selection and film posters`, async () => {
        const y = await page.evaluate(() => scrollY);
        await row(ids[0]).focus(); await page.keyboard.press('End'); assert.equal(await gallery().getAttribute('data-focus-id'), ids[3]);
        await page.keyboard.press('ArrowUp'); assert.equal(await gallery().getAttribute('data-focus-id'), ids[2]);
        await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter'); await selected(ids[3]);
        assert.equal(await page.evaluate(() => scrollY), y, 'Reduced selection adds scroll choreography');
        assert.equal(await page.locator('dialog:visible, [data-study-frame]:popover-open').count(), 0);
        await filter('film'); await selected(ids[3]); assert.equal((await state()).counter, '02 / 02');
        assert(await page.locator('[data-filter-button="film"]').evaluate(e => e === document.activeElement));
        const videos = await page.locator('[data-panel-id] video').evaluateAll(nodes => nodes.map(e => ({ src: e.getAttribute('src'), paused: e.paused, poster: e.getAttribute('poster') })));
        assert(videos.length > 0); assert(videos.every(v => !v.src && v.paused && v.poster));
        const posterImages = await page.evaluate(async () => Promise.all([...document.querySelectorAll('[data-panel-id] video')].map(async video => {
          const image = new Image(); image.src = video.poster;
          await Promise.race([image.decode(), new Promise((_, reject) => setTimeout(() => reject(new Error('Poster readiness exceeded 15 seconds')), 15000))]);
          return { url: video.poster, width: image.naturalWidth, height: image.naturalHeight };
        })));
        assert(posterImages.every(image => image.width > 0 && image.height > 0));
        await page.waitForTimeout(100); await snap(`reduced-fixed-film-${label}`);
        await filter('software'); await selected(ids[0]); assert.equal((await state()).counter, '01 / 02');
        await filter('all'); await row(ids[1]).focus(); await page.keyboard.press('Home'); await page.keyboard.press('Enter'); await selected(ids[0]);
        assert((await studyOcclusion()).coverFront); await identity(); return { films: videos, posterImages, state: await state() };
      });
      await check(`reduced ${label}: same-game play, Back/Escape and focus/scroll restoration`, async () => {
        const y = await page.evaluate(() => scrollY);
        await play(); await snap(`reduced-fixed-play-${label}`); await back();
        assert.equal(await page.evaluate(() => scrollY), y); assert((await studyOcclusion()).coverFront);
        await play(); await page.locator('[data-back-to-browsing]').focus(); await page.keyboard.press('Shift+Tab');
        assert(await page.locator('[data-study-frame]').evaluate(e => e.contains(document.activeElement)));
        await back(true); assert.equal(await page.evaluate(() => scrollY), y);
        assert((await studyOcclusion()).coverFront); assert.equal((await bounded()).previews.filter(v => v.src).length, 0);
        await snap(`reduced-fixed-return-${label}`); return await state();
      });
    }
    await check('reduced recheck runtime errors and prior receipt/recording preservation', async () => {
      assert.deepEqual(errors, []);
      assert((await fs.readFile(path.join(__dirname, 'gallery-verify-results.json'))).equals(previousReceipt));
      assert((await fs.readFile(path.join(__dirname, 'gallery-verify-journey.mp4'))).equals(previousClip));
      return { runtimeErrors: errors, previousReceiptUnchanged: true, normalRecordingUnchanged: true, fixturesUsed: false };
    });
    report.status = 'passed';
  } catch (error) {
    report.status = 'blocked'; report.failedCheck = current; report.error = error.stack;
    if (page && !page.isClosed()) { report.failureState = await state().catch(() => null); await snap('reduced-recheck-failure').catch(() => {}); }
    console.error(error); process.exitCode = 1;
  } finally {
    report.elapsedMs = Date.now() - started; report.runtimeErrors = errors;
    try { await fs.writeFile(path.join(out, 'gallery-verify-reduced-recheck.json'), JSON.stringify(report, null, 2)); }
    finally { await browser.close(); }
    console.log(`Reduced-only QA ${report.status}: ${report.elapsedMs}ms. Browser closed; prior receipts untouched.`);
  }
}
async function recordJourney() {
  await load();
  const m = await metric();
  await scroll(m.d * 4.2);
  await page.locator('[data-study-frame] button').filter({ hasText: 'Let’s play' }).first().click();
  await answer('Mars').click();
  await scroll(m.d * 4.2);
  const cdp = await page.context().newCDPSession(page), frames = [];
  let latest = -Infinity;
  const begin = Date.now();
  cdp.on('Page.screencastFrame', ({ data, sessionId }) => {
    const ms = Date.now() - begin;
    if (ms - latest >= 38) { frames.push({ ms, image: Buffer.from(data, 'base64') }); latest = ms; }
    void cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 76, maxWidth: 1280, maxHeight: 800, everyNthFrame: 1 });
  let duration;
  try {
    await page.waitForTimeout(700);
    await browse(0); await page.waitForTimeout(400);
    for (const id of ['school-management-system', 'nifemi', 'sharon', 'school-management-system']) {
      const r = await row(id).boundingBox();
      await page.mouse.move(r.x + r.width / 2, r.y + r.height / 2);
      await page.mouse.move(r.x + r.width / 2 + 8, r.y + r.height / 2);
      await page.waitForTimeout(800);
    }
    await page.mouse.move(1100, 150); await page.waitForTimeout(500);
    await browse(1); await page.waitForTimeout(350);
    await browse(2); await page.waitForTimeout(350);
    await browse(3); await page.waitForTimeout(450);
    const hover = await row('adaptive-study-game').boundingBox();
    await page.mouse.move(hover.x + hover.width / 2, hover.y + hover.height / 2);
    await page.mouse.move(hover.x + hover.width / 2 + 8, hover.y + hover.height / 2);
    await page.waitForTimeout(450);
    await page.mouse.move(1100, 150); await page.waitForTimeout(400);
    await select('adaptive-study-game');
    await play(); await page.waitForTimeout(500);
    assert.equal(await answer('Mars').getAttribute('aria-pressed'), 'true');
    await gameButton('Check answer').click(); await page.waitForTimeout(1100);
    await back();
    await scroll(m.d * 4.2); await page.waitForTimeout(800);
    await snap('record-final');
  } finally { duration = Date.now() - begin; await cdp.send('Page.stopScreencast'); await cdp.detach(); }
  assert(frames.length >= 40, 'Insufficient screencast frames');
  const mp4 = path.join(out, 'gallery-verify-journey.mp4');
  const args = ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', '24', '-c:v', 'mjpeg', '-i', 'pipe:0', '-an', '-c:v', 'h264_nvenc', '-preset', 'p4', '-cq', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4];
  const encoder = spawn('ffmpeg', args); let stderr = '';
  encoder.stderr.on('data', data => { stderr += data; });
  const done = new Promise((resolve, reject) => { encoder.on('error', reject); encoder.on('close', code => code === 0 ? resolve() : reject(new Error(stderr))); });
  let currentFrame = 0;
  const total = Math.ceil(duration / 1000 * 24);
  for (let i = 0; i < total; i++) { while (currentFrame + 1 < frames.length && frames[currentFrame + 1].ms <= i * 1000 / 24) currentFrame++; if (!encoder.stdin.write(frames[currentFrame].image)) await once(encoder.stdin, 'drain'); }
  encoder.stdin.end(); await done;
  const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', mp4], { encoding: 'utf8' }));
  const stream = probe.streams[0];
  assert.equal(stream.codec_name, 'h264'); assert.equal(stream.width, 1280); assert.equal(stream.height, 800);
  assert(Number(probe.format.duration) >= 12 && Number(probe.format.duration) <= 60, `Unexpected recording duration ${probe.format.duration}`);
  report.recording = { encoder: 'h264_nvenc', duration: probe.format.duration, width: stream.width, height: stream.height, capturedFrames: frames.length, path: mp4 };
}
async function recordStandalone() {
  const core = JSON.parse(await fs.readFile(path.join(out, 'gallery-verify-results.json'), 'utf8'));
  const reduced = JSON.parse(await fs.readFile(path.join(out, 'gallery-verify-reduced-recheck.json'), 'utf8'));
  assert.equal(core.checks.slice(0, 14).filter(item => item.status === 'pass').length, 14, 'Recording requires passed core/count/layout checks');
  assert.equal(reduced.status, 'passed', 'Recording requires passed reduced-motion checks');
  report.scope = 'recording only; matrix and reduced receipts remain separate';
  const errors = [];
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.setDefaultTimeout(15000);
    page.on('pageerror', error => errors.push(error.message));
    await recordJourney();
    assert.deepEqual(errors, []);
    report.status = 'passed';
  } catch (error) {
    report.status = 'blocked'; report.error = error.stack;
    console.error(error); process.exitCode = 1;
  } finally {
    report.runtimeErrors = errors; report.elapsedMs = Date.now() - started;
    await fs.writeFile(path.join(out, 'gallery-motion-recording.json'), JSON.stringify(report, null, 2));
    await browser.close();
    console.log(`Standalone recording ${report.status}: ${report.elapsedMs}ms. Matrix receipts unchanged.`);
  }
}
(async () => {
  await fs.mkdir(out, { recursive: true });
  if (process.argv.includes('--record-journey')) { await recordStandalone(); return; }
  if (process.argv.includes('--reduced-only')) { await reducedRecheck(); return; }
  if (resumeFixtures || recordOnly) {
    prior = JSON.parse(await fs.readFile(path.join(out, 'gallery-verify-results.json'), 'utf8'));
    if (recordOnly) assert.equal(prior.status, 'passed', 'Recording requires a passed core matrix');
    report.previousRun = { started: prior.started, elapsedMs: prior.elapsedMs, status: prior.status, failedCheck: prior.failedCheck, error: prior.error };
    report.recording = prior.recording;
    report.fixture = prior.fixture;
  }
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const errors = [], requests = [];
  try {
    page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.setDefaultTimeout(15000);
    page.on('pageerror', e => errors.push(e.message));
    page.on('request', r => { if (/\.mp4/.test(r.url())) requests.push(r.url()); });
    await check('hydration, topology and range', async () => {
      await load(); assert(await page.evaluate(() => typeof HTMLElement.prototype.showPopover === 'function'));
      const s = await state(), m = await metric();
      assert.equal(m.d, 900 * 1.7); assert.equal(m.stride, m.h * .5); assert.equal(Number(s.track.galleryBrowsing), 1350);
      assert.equal(Number(s.track.galleryEntrance), 675); assert.equal(Number(s.track.galleryRest), 315); assert.equal(Number(s.track.galleryExit), 450);
      const source = await fs.readFile(path.join(root, 'src/app/redesign/Hero.tsx'), 'utf8');
      for (const constant of ['Math.min(delta, 64)', '(progress >= 4.1 && target > 4.3) || (progress > 4.3 && target >= 4.1)', 'Math.exp(-elapsed / (galleryMotion ? 180 : 1000))', 'elapsed / (galleryMotion ? 250 : 900)', 'Math.abs(target - progress) < 0.0001', '(progress - 3.3) / 0.8', '(progress - 2.65) / 0.45']) assert(source.includes(constant), `Original formula absent: ${constant}`);
      await identity(); return s;
    });
    await check('representative software hold, entrance/reverse and partial answer identity', async () => {
      const m = await metric(); await scroll(m.d * 4.2);
      assert(await page.locator('[data-study-frame]').evaluate(e => !e.inert));
      assert.equal(await page.locator('[data-static-expanded]').evaluate(e => e.style.getPropertyValue('--game-mini')), '0');
      await page.locator('[data-study-frame] button').filter({ hasText: 'Let’s play' }).first().click(); await answer('Mars').click();
      await page.locator('[data-study-canvas]').evaluate(e => e.scrollTop = 80);
      const before = await page.locator('[data-study-canvas]').evaluate(e => e.scrollTop);
      await scroll(m.d * 4.3 + 25, false);
      assert(await page.locator('[data-study-frame]').evaluate(e => e.inert), 'Entrance leaves miniature quiz interactive');
      await browse(0); await identity();
      assert.equal(await answer('Mars').getAttribute('aria-pressed'), 'true');
      await snap('entrance-settled-1440');
      await scroll(m.d * 4.2); await identity();
      assert(await page.locator('[data-study-frame]').evaluate(e => !e.inert));
      assert.equal(await answer('Mars').getAttribute('aria-pressed'), 'true');
      const after = await page.locator('[data-study-canvas]').evaluate(e => e.scrollTop);
      assert.equal(after, before, 'Earlier game scroll position changed through entrance/reverse');
      await browse(0); return { savedScroll: before, restoredScroll: after };
    });
    await check('four forward/backward and rapid direction', async () => {
      const visits = [];
      for (const i of [0, 1, 2, 3, 2, 1, 0]) { await browse(i); await selected(ids[i]); await identity(); visits.push(await bounded()); }
      await browse(3);
      assert.equal(await page.locator('[data-panel-id]').count(), 3, 'Four-work reference stack is incomplete');
      assert.equal(await page.locator('[data-study-frame]').evaluate(e => getComputedStyle(e).visibility), 'visible');
      assert.equal(await page.locator('[data-study-frame]').evaluate(e => e.style.transform), 'rotate(-2.2deg)');
      assert(await page.locator('[data-panel-id="sharon"]').evaluate(e => Math.abs(parseFloat(e.style.transform.match(/rotate\(([^)]+)deg\)/)[1])) < .001));
      const header = await page.locator('[data-gallery-header]').boundingBox();
      assert.equal(header.y, 0); assert.equal(header.height, 84);
      await snap('reference-stack-sharon-1440');
      const m = await metric(); await scroll(m.start + m.stride * 3, false); await scroll(m.start + m.stride, false); await scroll(m.start + m.stride * 2, false); await browse(0);
      await selected(ids[0]); await identity(); return { visits: visits.map(s => ({ id: s.gallery.committedId, counter: s.counter, panels: s.panels, sources: s.previews.filter(v => v.src).length })), rapidFinal: await state() };
    });
    await check('hover departure and stationary cursor scroll with >=4px in-list rearm', async () => {
      const r = await row('nifemi').boundingBox(); const x = r.x + r.width * .5, y = r.y + r.height * .5;
      await page.mouse.move(x, y); await page.mouse.move(x + 8, y);
      await page.waitForFunction(() => document.querySelector('[data-gallery]').dataset.pointerId === 'nifemi');
      assert.equal(await gallery().getAttribute('data-committed-id'), ids[0]);
      await page.mouse.move(1100, 150); await selected(ids[0]);
      await page.mouse.move(x, y); await page.mouse.move(x + 8, y);
      await browse(1); await selected(ids[1]);
      assert.equal(await gallery().getAttribute('data-pointer-id'), '');
      await page.mouse.move(x + 8, y); // zero delta must not rearm
      assert.equal(await gallery().getAttribute('data-pointer-id'), '');
      await page.mouse.move(x + 10, y); // two pixels must not rearm
      assert.equal(await gallery().getAttribute('data-pointer-id'), '');
      await page.mouse.move(x + 14, y); // six pixels, without leaving row
      await page.waitForFunction(() => document.querySelector('[data-gallery]').dataset.pointerId === 'nifemi');
      assert.equal(await gallery().getAttribute('data-committed-id'), ids[1]);
      await snap('pointer-rearmed'); await page.mouse.move(1100, 150); await selected(ids[1]); return await state();
    });
    await check('independent keyboard focus preview, scroll clearing and click continued browsing', async () => {
      await browse(0);
      await row(ids[0]).focus(); await page.keyboard.press('ArrowDown');
      assert.equal(await gallery().getAttribute('data-focus-id'), ids[1]);
      assert.equal(await gallery().getAttribute('data-committed-id'), ids[0]);
      await page.mouse.move(1100, 200); assert.equal(await gallery().getAttribute('data-focus-id'), ids[1]);
      await browse(2); await selected(ids[2]);
      assert.equal(await gallery().getAttribute('data-focus-id'), '');
      assert(await page.locator('nav[aria-label="Selected work"]').evaluate(e => e === document.activeElement));
      await row(ids[0]).focus(); await page.keyboard.press('End'); assert.equal(await gallery().getAttribute('data-focus-id'), ids[3]);
      await page.keyboard.press('Home'); assert.equal(await gallery().getAttribute('data-focus-id'), ids[0]);
      await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
      await page.waitForTimeout(100); await page.waitForSelector('[data-gallery][data-settled="true"]', { timeout: 25000 }); await selected(ids[1]);
      assert.equal(await page.locator('dialog:visible, [data-study-frame]:popover-open').count(), 0);
      await select(ids[2]); assert.equal(await page.locator('dialog:visible').count(), 0); await browse(3); await selected(ids[3]); return await state();
    });
    await check('filters preserve ID/first/counter/range/focus and survive reverse', async () => {
      await filter('film'); await selected('sharon'); let s = await state(); assert.equal(s.counter, '02 / 02'); assert.equal(Number(s.track.galleryBrowsing), 450);
      assert(await page.locator('[data-filter-button="film"]').evaluate(e => e === document.activeElement));
      await filter('software'); await selected(ids[0]); s = await state(); assert.equal(s.counter, '01 / 02');
      const m = await metric(); await scroll(m.d * 4.2); await identity(); await browse(1); await selected(ids[1]); assert.equal(await gallery().getAttribute('data-filter'), 'software');
      await filter('all'); await selected(ids[1]); assert.equal((await state()).counter, '02 / 04'); return await state();
    });
    await check('play lock/Back/Escape/focus, selected answer and submitted feedback continuity', async () => {
      await select(ids[0]); const before = await page.evaluate(() => scrollY); await play();
      assert.equal(await answer('Mars').getAttribute('aria-pressed'), 'true');
      await page.mouse.move(700, 200); await page.mouse.wheel(0, 600); await page.waitForTimeout(300); assert.equal(await page.evaluate(() => scrollY), before, 'Play wheel changes page scroll');
      await page.locator('[data-back-to-browsing]').focus(); await page.keyboard.press('Shift+Tab'); assert(await page.locator('[data-study-frame]').evaluate(e => e.contains(document.activeElement)), 'Focus escaped play shell');
      await gameButton('Check answer').click(); assert(await page.locator('[data-study-frame]').getByText('That’s right! +100 points', { exact: true }).isVisible());
      await page.locator('[data-study-canvas]').evaluate(e => e.scrollTop = 120); const saved = await page.locator('[data-study-canvas]').evaluate(e => e.scrollTop);
      await back(true); assert.equal(await page.evaluate(() => scrollY), before);
      await select(ids[2]); await filter('film'); await filter('all'); await select(ids[0]); await play();
      assert.equal(await answer('Mars').getAttribute('aria-pressed'), 'true'); assert.equal(await gameButton('Next question →').count(), 1);
      assert.equal(await page.locator('[data-study-canvas]').evaluate(e => e.scrollTop), saved, 'Play canvas scroll identity lost');
      await snap('play-feedback'); return { savedScroll: saved, position: before };
    });
    await check('partial ordering and completed results/details survive browsing/filter/reverse', async () => {
      await gameButton('Next question →').click(); await answer('True').click(); await gameButton('Check answer').click(); await gameButton('Next question →').click(); await answer('Gravity').click(); await gameButton('Check answer').click(); await gameButton('Next question →').click();
      await answer('Mercury').click(); await answer('Venus').click();
      await continuityTrip();
      assert.equal(await page.locator('[aria-label="Your ordered answer"] button').count(), 2);
      assert.match(await page.locator('[aria-label="Your ordered answer"]').textContent(), /1\. Mercury.*2\. Venus/s);
      await answer('Earth').click(); await answer('Mars').click(); await gameButton('Check answer').click(); await gameButton('See my results →').click();
      await page.locator('[data-study-frame] details summary').first().click();
      await page.locator('[data-study-canvas]').evaluate(e => e.scrollTop = 280); const saved = await page.locator('[data-study-canvas]').evaluate(e => e.scrollTop);
      await snap('results'); await continuityTrip();
      assert.equal(await page.locator('[data-study-frame] details[open]').count(), 1);
      assert.match(await page.locator('[data-study-frame]').textContent(), /You nailed it!/);
      assert.equal(await page.locator('[data-study-canvas]').evaluate(e => e.scrollTop), saved);
      await back(); return { results: '400 points, 4/4', detailsOpen: 1, savedScroll: saved };
    });
    await check('one visible sourced preview, full Nifemi/excerpt Sharon, viewer cleanup', async () => {
      const evidence = [];
      for (const id of ['nifemi', 'sharon']) {
        await select(id); await page.waitForTimeout(300); let s = await bounded(); assert.equal(s.previews.filter(v => v.src).length, 1); const preview = await page.locator(`[data-panel-id="${id}"] video`).elementHandle();
        assert(await preview.evaluate(e => e.muted && !e.paused)); const position = await page.evaluate(() => scrollY);
        await page.locator('[data-project-action]').click(); await page.waitForSelector('dialog[open]');
        assert(await preview.evaluate(e => e.paused && !e.hasAttribute('src')), 'Viewer leaves preview sourced/playing');
        const film = await page.locator('dialog video').elementHandle(); assert.equal(await film.getAttribute('src'), id === 'nifemi' ? '/redesign/nifemi.mp4' : '/redesign/gallery-sharon.mp4');
        assert(await film.evaluate(e => e.paused), 'Viewer autoplays media');
        if (id === 'sharon') assert.match(await page.locator('dialog').textContent(), /excerpt.*full film is not available/s);
        await back(true); assert(await film.evaluate(e => e.paused && !e.hasAttribute('src'))); assert.equal(await page.locator('dialog').count(), 0); assert.equal(await page.evaluate(() => scrollY), position);
        evidence.push({ id, viewerSrc: id === 'nifemi' ? '/redesign/nifemi.mp4' : '/redesign/gallery-sharon.mp4' });
      }
      return evidence;
    });
    await check('Continue and natural finite release pause/unload, reverse retraces entrance', async () => {
      await page.locator('[data-gallery-continue]').click(); await page.waitForTimeout(200);
      assert(await page.locator('[data-team]').evaluate(e => e === document.activeElement));
      assert(await page.locator('[data-team]').evaluate(e => e.getBoundingClientRect().top < innerHeight));
      assert.equal((await bounded()).previews.filter(v => v.src).length, 0);
      await browse(3); const m = await metric(); await page.mouse.move(1200, 300); await page.mouse.wheel(0, 1600); await page.waitForTimeout(300);
      const s = await state(); assert(s.scrollY > m.start + 3 * m.stride, 'Native page scroll blocked at last project');
      assert(await page.locator('[data-team]').evaluate(e => e.getBoundingClientRect().top < innerHeight));
      assert.equal(s.previews.filter(v => v.src).length, 0);
      await scroll(m.d * 4.2); await identity(); assert(await page.locator('[data-study-frame]').evaluate(e => !e.inert));
      await browse(0); return s;
    });
    await check('1920/short/narrow settled control geometry', async () => {
      const evidence = [];
      for (const view of [{ width: 1920, height: 1080 }, { width: 1440, height: 640 }, { width: 390, height: 844 }]) {
        await page.setViewportSize(view); await page.waitForTimeout(100); await browse(0); evidence.push(await geometry(`layout-${view.width}x${view.height}`)); await identity();
      }
      await page.setViewportSize({ width: 1440, height: 900 }); return evidence;
    });
    await check('20-item fixture dynamic range, bounded media/catalog, keyboard window', async () => {
      await installFixture(); const before = requests.length; await load(base, 20); const m = await metric();
      assert.equal(Number((await state()).track.galleryBrowsing), 19 * m.stride);
      await browse(0); let s = await bounded(); assert.equal(s.counter, '01 / 20'); const startGeometry = await geometry('fixture-20-start', 6);
      await row(ids[0]).focus(); await page.keyboard.press('End');
      await page.waitForFunction(() => document.querySelector('[data-gallery]').dataset.focusId === 'fixture-film-20');
      const endGeometry = await geometry('fixture-20-keyboard-end', 6);
      assert(await row('fixture-film-20').evaluate(e => { const r = e.getBoundingClientRect(), w = e.parentElement.parentElement.getBoundingClientRect(); return r.top >= w.top - 1 && r.bottom <= w.bottom + 1; }));
      await page.keyboard.press('ArrowUp'); assert.equal(await gallery().getAttribute('data-focus-id'), 'fixture-film-19'); await page.keyboard.press('Home'); assert.equal(await gallery().getAttribute('data-focus-id'), ids[0]);
      await browse(19); await selected('fixture-film-20'); s = await bounded(); assert.equal(s.counter, '20 / 20'); await geometry('fixture-20-end', 6);
      const downloads = [...new Set(requests.slice(before).filter(url => url.includes('gallery-nifemi.mp4')))]; assert(downloads.length < 20, `All fixture videos downloaded: ${downloads.length}`);
      await filter('software'); assert.equal((await state()).counter, '01 / 02');
      await identity(); return { range: Number(s.track.galleryBrowsing), uniquePreviewDownloads: downloads, startGeometry, endGeometry, boundedEnd: s };
    });
    await check('20-item fixture 1920/short/narrow readable current label and bounded window', async () => {
      await installFixture(20); await load(base, 20); await browse(0); await browse(19);
      const evidence = [];
      for (const view of [{ width: 1920, height: 1080 }, { width: 1440, height: 640 }, { width: 390, height: 844 }]) {
        await page.setViewportSize(view); await page.waitForTimeout(100); await browse(19); await selected('fixture-film-20');
        const layout = await geometry(`fixture-20-${view.width}x${view.height}`, 6);
        assert(layout.visibleRows.some(r => r.text.includes('Fixture film 20')), 'Current fixture name not fully visible');
        evidence.push({ layout, media: await bounded() });
      }
      await page.setViewportSize({ width: 1440, height: 900 }); return evidence;
    });
    await check('single and filtered-single fixture omit browse/rest/exit and release', async () => {
      await installFixture(1); await load(base, 1); await browse(0); let s = await bounded(); assert.equal(s.counter, '01 / 01');
      for (const range of ['galleryBrowsing', 'galleryRest', 'galleryExit']) assert.equal(Number(s.track[range]), 0);
      await geometry('fixture-single', 1); await filter('software'); assert.equal((await state()).counter, '01 / 01'); await filter('film'); s = await state(); assert.equal(s.counter, '0 / 0'); assert.equal(s.panels.length, 0); assert.equal(await page.locator('[data-project-action]').count(), 0);
      await page.locator('[data-gallery-continue]').click(); assert(await page.locator('[data-team]').isVisible());
      await restoreFixture(); await load(); await browse(0); await filter('film'); await identity();
      return { singleRange: s.track, pageBytesRestored: fixtureRestored };
    });
    await check('reduced motion posters, keyboard selection, unpinned range and play/Back', async () => {
      await page.emulateMedia({ reducedMotion: 'reduce' }); await load(); await page.locator('[data-gallery]').scrollIntoViewIfNeeded();
      await page.waitForSelector('[data-gallery][data-reduced="true"]'); let s = await bounded();
      for (const range of ['galleryEntrance', 'galleryBrowsing', 'galleryRest', 'galleryExit']) assert.equal(Number(s.track[range]), 0);
      assert.equal(s.previews.filter(v => v.src).length, 0);
      await row(ids[0]).focus(); await page.keyboard.press('End'); await page.keyboard.press('Enter'); await selected(ids[3]); assert.equal((await bounded()).previews.filter(v => v.src).length, 0);
      await select(ids[0]); await play(); await back(); await identity(); await snap('reduced-1440'); await page.emulateMedia({ reducedMotion: 'no-preference' }); return s;
    });
    await check('reduced study presentation is not occluded by an ordinary neighbour', async () => {
      await page.emulateMedia({ reducedMotion: 'reduce' }); await load(); await page.locator('[data-gallery]').scrollIntoViewIfNeeded(); await select(ids[0]);
      const occlusion = await studyOcclusion();
      await snap('reduced-study-occlusion'); report.reducedOcclusion = occlusion;
      assert(occlusion.coverFront, `Selected static study presentation is covered by ${occlusion.frontPanel}; cover z=${occlusion.coverZ}, neighbour z=${occlusion.panels.map(p => p.z).join(',')}`);
      await page.emulateMedia({ reducedMotion: 'no-preference' }); return occlusion;
    });
    await check('runtime errors and fixture cleanup', async () => { await restoreFixture(); assert.deepEqual(errors, []); assert(fixtureRestored || prior?.fixture?.byteRestored); const contents = await fs.readFile(pageSource); if (fixtureOriginal) assert(contents.equals(fixtureOriginal)); assert(!contents.includes(Buffer.from('galleryFixture'))); assert(!contents.includes(Buffer.from('projects={fixture}'))); return { errors, byteRestored: true }; });
    if (process.argv.includes('--record') || recordOnly) await check('NVENC gallery journey recording', recordJourney);
    report.status = 'passed';
  } catch (error) {
    report.status = 'blocked'; report.failedCheck = current; report.error = error.stack; report.runtimeErrors = errors;
    if (page && !page.isClosed()) { report.failureState = await state().catch(() => null); await snap('failure').catch(() => {}); }
    console.error(error); process.exitCode = 1;
  } finally {
    try { await restoreFixture(); }
    catch (error) { report.cleanupError = error.message; report.status = 'blocked'; process.exitCode = 1; }
    report.fixture = fixtureOriginal ? { method: 'temporary isolated /redesign/page.tsx override', used: true, byteRestored: fixtureRestored }
      : { method: 'temporary isolated /redesign/page.tsx override', used: report.checks.some(c => c.name.includes('fixture') && c.status === 'pass'),
        byteRestored: report.checks.some(c => c.name === 'single and filtered-single fixture omit browse/rest/exit and release' && c.evidence?.pageBytesRestored) };
    report.elapsedMs = Date.now() - started;
    try { await fs.writeFile(path.join(out, 'gallery-verify-results.json'), JSON.stringify(report, null, 2)); }
    finally { if (browser) await browser.close(); }
    console.log(`Gallery QA ${report.status}: ${report.elapsedMs}ms; ${report.checks.length} checks. Browser closed.`);
  }
})();
