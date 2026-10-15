// Integrated roster checks. YouTube SDK stub tests are not real playback verification.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const base = process.env.GALLERY_URL || 'http://127.0.0.1:5782/redesign';
const output = path.join(__dirname, 'viewer-polish');
const ids = ['adaptive-study-game', 'school-management-system', 'nifemi', 'sharon', 'books-and-bills', 'forest-sequence', 'worship-medley', 'samsung-vivid-colors', 'brushes-of-gold', 'welcome-to-church', 'fear-women', 'everything', 'meet-monjolaoluwa'];
const youtubeIds = ['p1yqihuevu0', 'W9tVsQjrORc', 'xzXaKeQi8YQ', 'mQU9SJwNGo0', 'Up46AtcYwTY', 'c9qb9ZVG48I', 'VYIWXJlIzMs', 'oAmKb6Zy6_4', 'ZdaMD-g-EzQ'];
const realSDK = process.argv.includes('--real-sdk');
const resultFile = realSDK ? 'real-sdk-results.json' : 'results.json';
const report = { started: new Date().toISOString(), url: base, checks: [], errors: [], parseFailures: [], youtube: realSDK ? 'Real SDK readiness and one bounded Forest playback/loop/pause check. Not all films or real mobile rotation.' : 'SDK stub only. No real YouTube playback claim.', status: 'running' };
let browser, page, current;
async function check(name, fn) {
  current = name;
  const start = Date.now();
  console.log('RUN', name);
  try { const evidence = await fn(); report.checks.push({ name, result: 'pass', elapsedMs: Date.now() - start, evidence }); console.log('PASS', name); }
  catch (error) { report.checks.push({ name, result: 'fail', error: error.message }); throw error; }
  await fs.writeFile(path.join(output, resultFile), JSON.stringify(report, null, 2));
}
async function snap(name) {
  const session = await page.context().newCDPSession(page);
  try {
    const { data } = await session.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await fs.writeFile(path.join(output, name), Buffer.from(data, 'base64'));
  } finally { await session.detach(); }
}
async function settled() {
  await page.waitForFunction(() => document.querySelector('[data-gallery]')?.dataset.settled === 'true', { timeout: 20000 });
  await page.waitForTimeout(220);
}
async function commit(id) {
  const index = await page.locator(`[data-project-id="${id}"]`).getAttribute('data-project-index');
  await page.evaluate(index => {
    const track = document.querySelector('[data-gallery-count]');
    if (document.querySelector('[data-gallery]').dataset.reduced !== 'true') scrollTo(0, Number(track.dataset.browseStart) + Number(index) * Number(track.dataset.galleryStride));
  }, index);
  await settled();
  await page.locator(`[data-project-id="${id}"]`).click();
  await settled();
  assert.equal(await page.locator('[data-gallery]').getAttribute('data-committed-id'), id);
  assert.equal(await page.locator('[data-portfolio-viewer]').count(), 0, 'List must select only');
}
async function open(id, card = false) {
  await commit(id);
  await page.locator(card ? '[data-project-card]' : '[data-project-action]').click();
  await page.waitForSelector(`[data-portfolio-viewer][data-project="${id}"]`);
  await page.waitForFunction(() => document.querySelector('[data-study-frame]').matches(':popover-open'));
}
async function close() {
  await page.locator('[data-back-to-browsing]').click();
  await page.waitForSelector('[data-portfolio-viewer]', { state: 'detached' });
  await settled();
}
async function retained() {
  assert(await page.evaluate(() => window.__game === document.querySelector('[data-study-canvas] > div') && window.__canvas === document.querySelector('[data-study-canvas]') && window.__frame === document.querySelector('[data-study-frame]')), 'Game/frame/canvas DOM identity changed');
}
async function overflow() {
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Page horizontal overflow');
  if (await page.locator('[data-portfolio-viewer]').count()) assert(await page.locator('[data-study-frame]').evaluate(e => e.scrollWidth <= e.clientWidth + 1), 'Viewer horizontal overflow');
}
async function recordTransition(label, action) {
  const directory = path.join(output, `${label}-frames`);
  await fs.mkdir(directory, { recursive: true });
  const cdp = await page.context().newCDPSession(page);
  const writes = [], paints = [];
  let count = 0;
  cdp.on('Page.screencastFrame', event => {
    paints.push({ file: `${String(count).padStart(4, '0')}.png`, timestamp: event.metadata.timestamp });
    writes.push(fs.writeFile(path.join(directory, `${String(count++).padStart(4, '0')}.png`), Buffer.from(event.data, 'base64')));
    void cdp.send('Page.screencastFrameAck', { sessionId: event.sessionId });
  });
  await page.evaluate(() => {
    window.__transition = { frames: [], running: true };
    const read = () => {
      if (!window.__transition.running) return;
      const frame = document.querySelector('[data-study-frame]');
      const viewer = document.querySelector('[data-portfolio-viewer]');
      const target = viewer.querySelector('[data-viewer-sample-slot], [data-viewer-picture]');
      const r = target.getBoundingClientRect();
      window.__transition.frames.push({ time: performance.now(), x: r.x, y: r.y, width: r.width, height: r.height, display: getComputedStyle(frame).display, visible: getComputedStyle(frame).visibility, expanded: viewer.dataset.expanded, handoff: frame.dataset.fullscreenHandoff, fullscreen: document.fullscreenElement === frame });
      requestAnimationFrame(read);
    };
    requestAnimationFrame(read);
  });
  await cdp.send('Page.startScreencast', { format: 'png', maxWidth: 1440, maxHeight: 900, everyNthFrame: 1 });
  await page.waitForTimeout(80);
  const result = await action();
  await page.waitForTimeout(80);
  await cdp.send('Page.stopScreencast');
  await Promise.all(writes);
  await cdp.detach();
  const frames = await page.evaluate(() => { window.__transition.running = false; return window.__transition.frames; });
  assert(frames.length > 8 && count > 3, 'Not enough intermediate frame evidence');
  assert(frames.every(f => f.display !== 'none' && f.visible === 'visible'), 'Fullscreen handoff dropped the painted shell');
  const widths = frames.map(f => f.width);
  const min = Math.min(...widths), max = Math.max(...widths);
  assert(max - min > 100, 'No same-node growth/return');
  assert(widths.some(w => w > min + 20 && w < max - 20), 'Only settled geometry was captured');
  await fs.writeFile(path.join(output, `${label}-geometry.json`), JSON.stringify({ paintedFrames: count, paints, frames }, null, 2));
  return result;
}
async function full() {
  await page.locator('[data-viewer-fullscreen]').click();
  await page.waitForFunction(() => document.fullscreenElement === document.querySelector('[data-study-frame]'));
  await page.waitForSelector('[data-expanded="true"]');
  const motion = await page.locator('[data-portfolio-viewer]').evaluate(e => e.getAnimations({ subtree:true }).filter(a => a.effect instanceof KeyframeEffect && a.effect.getKeyframes().some(f => f.transform || f.opacity)).map(a => a.effect.getKeyframes()));
  await page.waitForTimeout(700);
  return motion;
}
async function exitFull() {
  if (await page.locator('[data-product-exit]').count()) await page.keyboard.press('Escape');
  else await page.locator('[data-viewer-fullscreen]').click();
  await page.waitForFunction(() => !document.fullscreenElement && document.querySelector('[data-study-frame]').matches(':popover-open'));
  const motion = await page.locator('[data-portfolio-viewer]').evaluate(e => e.getAnimations({ subtree:true }).map(a => a.effect.getKeyframes()));
  await page.waitForTimeout(700);
  return motion;
}
async function startup(viewport, reduced = false) {
  if (page && !page.isClosed()) {
    await page.locator('[data-gallery-header] a').click();
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
    await page.getByRole('link', { name: 'Work', exact: true }).click();
    await settled();
    return;
  }
  page = await browser.newPage({ viewport, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  page.on('pageerror', error => { report.errors.push(error.stack || error.message); console.error('PAGE ERROR', error.stack || error.message); });
  const diagnostics = await page.context().newCDPSession(page);
  await diagnostics.send('Debugger.enable');
  diagnostics.on('Debugger.scriptFailedToParse', event => report.parseFailures.push({ url:event.url, startLine:event.startLine, endLine:event.endLine }));
  if (!realSDK) await page.addInitScript(() => {
    window.__yt = { created: [], destroyed: 0, apiStarts: 0, delay: 0 };
    window.__installYT = () => { window.YT = { Player: class {
      constructor(host, options) {
        this.options = options; this.current = 37; this.volume = 100; this.muted = false;
        this.iframe = document.createElement('iframe'); this.iframe.src = 'about:blank';
        host.replaceWith(this.iframe); window.__yt.latest = this; window.__yt.created.push(options.videoId);
        setTimeout(() => options.events.onReady({ target: this }), window.__yt.delay);
      }
      getIframe() { return this.iframe; }
      getCurrentTime() { return this.current; }
      getDuration() { return 180; }
      getVolume() { return this.volume; }
      isMuted() { return this.muted; }
      nativeStart() { this.options.events.onStateChange({ data: 1 }); }
      playVideo() { window.__yt.apiStarts++; this.nativeStart(); }
      pauseVideo() { this.options.events.onStateChange({ data: 2 }); }
      seekTo(seconds) { this.current = seconds; }
      setVolume(value) { this.volume = value; }
      mute() { this.muted = true; }
      unMute() { this.muted = false; }
      destroy() { window.__yt.destroyed++; this.iframe.remove(); }
    } }; };
    window.__installYT();
  });
  if (process.argv.includes('--verified-layout') || process.argv.includes('--disk-layout')) await page.route('**/_next/static/chunks/app/layout.js', async route => {
    try {
      const disk = await fs.readFile(path.resolve('.next/static/chunks/app/layout.js'));
      if (process.argv.includes('--disk-layout')) {
        // Explicit local test transport, never a claimed dev-server delivery fix.
        new (require('node:vm').Script)(disk.toString());
        report.layoutDelivery = { testOnlyLocalCurrentBundle: true, path: '.next/static/chunks/app/layout.js', bytes: disk.length, nodeParse: 'passed', normalHttpDelivery: 'not tested by this run; see truncated-layout-diagnostic.json' };
        await route.fulfill({ status:200, contentType:'application/javascript', body:disk });
      } else {
        const response = await route.fetch({ timeout:120000, maxRetries:0 });
        const body = await response.body();
        report.layoutDelivery = { testOnlyBufferedResponse:true, status:response.status(), bytes:body.length, diskBytes:disk.length, identicalToDisk:body.equals(disk) };
        assert(body.equals(disk), 'Delivered layout differs from current disk bundle');
        new (require('node:vm').Script)(body.toString());
        await route.fulfill({ response, body });
      }
    } catch (error) { report.layoutDeliveryError = error.message; await route.abort('failed'); }
  });
  await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForSelector('[data-font-ready="true"]', { timeout: 60000 });
  await page.addStyleTag({ content: 'nextjs-portal { display:none !important }' });
  await page.evaluate(() => { window.__frame = document.querySelector('[data-study-frame]'); window.__canvas = document.querySelector('[data-study-canvas]'); window.__game = window.__canvas.firstElementChild; });
  await page.getByRole('link', { name: 'Work', exact: true }).click();
  await settled();
}
(async () => {
  await fs.mkdir(output, { recursive: true });
  browser = await chromium.launch({ channel: 'chrome', headless: true, timeout: 30000 });
  try {
    await startup({ width: 1440, height: 900 });
    if (realSDK) {
      await check('real YouTube SDK and first selected iframe readiness', async () => {
        await open('books-and-bills');
        await page.waitForSelector('iframe[title="The Burden of Books and Bills on YouTube"]', { timeout: 25000 });
        assert.match(await page.locator('[data-youtube-picture] iframe').getAttribute('src'), /youtube\.com\/embed\/p1yqihuevu0/);
        await page.waitForFunction(() => !document.querySelector('input[aria-label="Seek video"]').disabled);
        assert(await page.getByRole('button', { name: 'Play film', exact: true }).isEnabled());
        await snap('real-youtube-notes-1440x900.png');
        const iframe = await page.locator('[data-youtube-picture] iframe').elementHandle();
        await full();
        assert(await iframe.evaluate(e => e === document.querySelector('[data-youtube-picture] iframe')));
        const frame = await page.locator('[data-youtube-picture] iframe').boundingBox();
        const controls = await page.locator('[data-viewer-controls]').boundingBox();
        assert(controls.y >= frame.y + frame.height - 1);
        await snap('real-youtube-cinema-1440x900.png');
        await exitFull();
        return { videoId: 'p1yqihuevu0', ready: true, sameIframe: true, externalControls:true, playbackInitiated: false };
      });
      await close();
      await check('real Forest portrait decode, official loop wrap and explicit pause', async () => {
        await open('forest-sequence');
        await page.waitForSelector('iframe[title="3D Forest Sequence on YouTube"]', { timeout:25000 });
        await page.waitForFunction(() => !document.querySelector('button[aria-label="Mute film"]').disabled, undefined, { timeout:25000 });
        const iframe = await page.locator('[data-youtube-picture] iframe').elementHandle();
        const src = await iframe.getAttribute('src');
        assert.match(src, /loop=1/); assert.match(src, /playlist=W9tVsQjrORc/);
        const target = await iframe.contentFrame();
        await page.getByRole('button', { name:'Play film', exact:true }).click();
        await target.waitForFunction(() => { const v=document.querySelector('video'); return v?.videoWidth > 0 && v.currentTime > .1 && !v.paused; }, { timeout:25000 });
        const decoded = await target.locator('video').evaluate(v => ({ width:v.videoWidth, height:v.videoHeight, duration:v.duration }));
        assert(decoded.height > decoded.width);
        await snap('real-forest-portrait-1440x900.png');
        await target.evaluate(() => {
          const video = document.querySelector('video');
          window.__loopPaint = { maximum:video.currentTime, wrapped:false, events:[] };
          const observe = event => {
            window.__loopPaint.events.push({ event:event.type, time:video.currentTime, paused:video.paused });
            window.__loopPaint.maximum = Math.max(window.__loopPaint.maximum, video.currentTime);
            if (window.__loopPaint.maximum > video.duration - 3 && video.currentTime < 3 && !video.paused) window.__loopPaint.wrapped = true;
          };
          for (const event of ['timeupdate','seeked','ended','playing']) video.addEventListener(event, observe);
        });
        // Observe one natural 51-second run. Do not infer a wrap from a post-seek settled time.
        let loopFailure;
        await target.waitForFunction(() => window.__loopPaint.wrapped, undefined, { timeout:70000 }).catch(error => loopFailure = error.message);
        const loopEvidence = await target.evaluate(() => window.__loopPaint);
        await fs.writeFile(path.join(output, 'real-forest-loop-events.json'), JSON.stringify(loopEvidence, null, 2));
        assert(await iframe.evaluate(e => e === document.querySelector('[data-youtube-picture] iframe')));
        await page.mouse.move(80, 80);
        await page.waitForFunction(() => document.querySelector('[data-portfolio-viewer]').dataset.idle === 'false');
        await page.getByRole('button', { name:'Pause film', exact:true }).click();
        await target.waitForFunction(() => document.querySelector('video')?.paused);
        await page.getByRole('button', { name:'Read more' }).click();
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('[data-portfolio-viewer]').getAttribute('data-playing'), 'false');
        await close();
        assert(await iframe.evaluate(e => !e.isConnected));
        assert(!loopFailure, loopFailure);
        return { decoded, supportedLoop:true, actualNaturalWrap:true, sameIframe:true, explicitPause:true, sourceLetterboxing:'preserved', actualDeviceRotation:'not tested' };
      });
      assert.deepEqual(report.errors, []);
      report.status = 'passed';
      return;
    }
    await check('opening/project transitions, lock restoration, fitted media and independent glass notes', async () => {
      await commit('nifemi');
      const original = await page.evaluate(() => ({ html:document.documentElement.style.overflow, gutter:document.documentElement.style.scrollbarGutter, body:document.body.style.overflow, padding:document.body.style.paddingRight, scroll:scrollY }));
      await page.locator('[data-project-action]').click();
      await page.waitForSelector('[data-portfolio-viewer]');
      assert(await page.locator('[data-portfolio-viewer]').evaluate(e => e.getAnimations({ subtree:true }).some(a => a.effect.getKeyframes().some(f => f.opacity === '0.2'))));
      assert(await page.evaluate(() => getComputedStyle(document.documentElement).overflowY === 'hidden' && getComputedStyle(document.body).overflowY === 'hidden'));
      await page.waitForTimeout(400);
      assert(await page.locator('[data-portfolio-viewer]').evaluate(e => getComputedStyle(e).backgroundColor.endsWith('0.8)') && getComputedStyle(e).backdropFilter.includes('blur') && getComputedStyle(e.parentElement).backgroundColor === 'rgba(0, 0, 0, 0)'));
      await page.getByRole('button', { name: 'View Nifemi profile' }).click();
      await page.waitForTimeout(500);
      const profile = await page.locator('[data-viewer-drawer]').boundingBox();
      assert(profile.x > 800 && Math.abs(profile.y + profile.height / 2 - 450) < 2, 'Sparse profile is not centred in the right region');
      assert(await page.locator('[data-viewer-drawer]').evaluate(e => getComputedStyle(e).backgroundImage.includes('linear-gradient') && parseFloat(getComputedStyle(e.querySelector('p')).fontSize) >= 19));
      await snap('centred-right-profile-1440.png');
      await page.keyboard.press('Escape');
      await page.setViewportSize({ width:1440, height:600 });
      await page.waitForTimeout(350);
      const picture = await page.locator('[data-viewer-picture]').boundingBox();
      const controls = await page.locator('[data-viewer-controls]').boundingBox();
      const arrows = await page.locator('[data-viewer-navigation]').boundingBox();
      assert(picture.y > 54 && controls.y + controls.height < arrows.y, 'Desktop media/actions do not fit available height');
      const notePanel = page.getByRole('complementary', { name:'Studio Notes' });
      assert(await notePanel.evaluate(e => e.scrollHeight > e.clientHeight && getComputedStyle(e).scrollbarWidth === 'none'));
      await notePanel.focus(); await page.keyboard.press('PageDown'); await page.waitForTimeout(350);
      assert(await notePanel.evaluate(e => e.scrollTop > 0), 'Notes cannot scroll with keyboard');
      const after = await page.locator('[data-viewer-picture]').boundingBox();
      assert(Math.abs(after.y - picture.y) < 1, 'Notes scroll moved the desktop picture');
      await snap('independent-panes-1440x600.png');
      await page.locator('[data-viewer-next]').click();
      await page.waitForSelector('[data-project="sharon"]');
      assert(await page.locator('[data-portfolio-viewer]').evaluate(e => e.getAnimations({ subtree:true }).some(a => a.effect.getKeyframes().some(f => f.opacity === '0.2'))));
      await page.waitForTimeout(400);
      await close();
      const restored = await page.evaluate(() => ({ html:document.documentElement.style.overflow, gutter:document.documentElement.style.scrollbarGutter, body:document.body.style.overflow, padding:document.body.style.paddingRight }));
      const { scroll, ...styles } = original;
      assert.deepEqual(restored, styles);
      await page.setViewportSize({ width:1440,height:900 });
      await settled();
      await open('nifemi');
      await page.locator('[data-study-frame]').evaluate(e => { window.__requestFull = e.requestFullscreen; e.requestFullscreen = () => Promise.reject(new Error('labelled rejection')); });
      await page.locator('[data-viewer-fullscreen]').click();
      await page.waitForSelector('[data-portfolio-viewer] [role="alert"]');
      assert.equal(await page.locator('[data-portfolio-viewer]').getAttribute('data-expanded'), 'false');
      assert(await page.locator('[data-study-frame]').evaluate(e => e.matches(':popover-open') && !e.hasAttribute('data-fullscreen-handoff')));
      await page.locator('[data-study-frame]').evaluate(e => { e.requestFullscreen = window.__requestFull; });
      await close();
      await page.setViewportSize({ width:1440,height:600 });
      await open('forest-sequence'); await page.waitForTimeout(400);
      const forestControls = await page.locator('[data-viewer-controls]').boundingBox();
      const forestNav = await page.locator('[data-viewer-navigation]').boundingBox();
      assert(forestControls.y + forestControls.height < forestNav.y, 'Short-desktop portrait controls collide with navigation');
      assert(await page.locator('[data-viewer-controls]').evaluate(e => { const r=e.getBoundingClientRect(); return Array.from(e.querySelectorAll('button,input')).every(item => { const b=item.getBoundingClientRect(); return b.left >= r.left && b.right <= r.right + 1; }); }), 'Portrait controls escape their floating bar');
      await snap('forest-fitted-1440x600.png');
      await close(); await page.setViewportSize({ width:1440,height:900 }); await settled();
      await page.evaluate(() => { window.__yt.created = []; window.__yt.destroyed = 0; });
      return { transitions:true, bodyAndHtmlLockRestored:true, originalScroll:scroll, independentKeyboardScroll:true, centredRightProfile:true, rejectedFullscreen:'labelled stub', minimumPortraitPlayer:'complete iframe, source aspect preserved inside the fitted player' };
    });
    await check('real roster, order, sources and bounded gallery', async () => {
      assert.deepEqual(await page.locator('[data-project-id]').evaluateAll(nodes => nodes.map(e => e.dataset.projectId)), ids);
      assert.equal(await page.locator('[data-gallery]').getAttribute('data-count'), '13');
      assert.equal(await page.locator('[data-gallery]').getAttribute('data-visible-rows'), '6');
      assert.equal(await page.locator('[data-gallery-count]').getAttribute('data-gallery-browsing'), '5400');
      assert.equal(await page.locator('video').first().getAttribute('src'), '/redesign/nifemi.mp4');
      assert.equal(await page.locator('img[src="/redesign/tablet-scene-v1.webp"]').getAttribute('loading'), 'eager');
      for (const id of ids.slice(1)) {
        await commit(id);
        assert(await page.locator('[data-panel-id]').count() <= 3);
        assert(await page.locator('[data-gallery] video[src]').count() <= 1);
      }
      return { ids, all: 13, film: 11, software: 2 };
    });
    await check('captured selected card, focus return and software availability', async () => {
      await commit('adaptive-study-game');
      await page.locator('[data-project-id="adaptive-study-game"]').focus();
      await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowDown');
      await page.waitForFunction(() => document.querySelector('[data-gallery]').dataset.displayedId === 'nifemi');
      await page.waitForTimeout(700);
      assert.equal(await page.locator('[data-gallery]').getAttribute('data-committed-id'), 'adaptive-study-game');
      const card = await page.locator('[data-project-card][data-project-open-id="nifemi"]').boundingBox();
      assert(card && card.width > 0);
      // Real pointer activation, without Playwright scrolling the sticky card and clearing its preview first.
      await page.mouse.click(card.x + card.width / 2, card.y + card.height / 2);
      await page.waitForSelector('[data-project="nifemi"]');
      await close();
      assert.equal(await page.locator('[data-gallery]').getAttribute('data-committed-id'), 'nifemi');
      await open('school-management-system', true);
      assert.equal(await page.locator('[data-portfolio-viewer] a').filter({ hasText: 'Source' }).count(), 0);
      assert.equal(await page.locator('[data-portfolio-viewer]').getByRole('link', { name: 'Visit website' }).getAttribute('href'), 'https://www.meloschool.com/');
      await close();
      assert.equal(await page.evaluate(() => document.activeElement.dataset.projectOpenId), 'school-management-system');
      await open('adaptive-study-game');
      assert.equal(await page.locator('[data-portfolio-viewer] img[src="/portfolio/thumbnails/adaptive-study-game.png"]').count(), 1);
      assert(await page.getByRole('button', { name: 'Try app unavailable' }).isDisabled());
      assert.equal(await page.locator('[data-portfolio-viewer]').getByRole('link', { name: 'Source', exact: false }).getAttribute('href'), 'https://github.com/JStaRFilms/Adaptive-Study-Game');
    });
    await check('same quiz and answers across screens, both sample actions and fullscreen', async () => {
      await page.locator('[data-try-sample]').first().click();
      await page.locator('[data-study-canvas]').getByRole('button', { name: 'Let’s play' }).first().click();
      await page.locator('[data-study-canvas]').getByRole('button', { name: /Mars/ }).click();
      await retained();
      await page.locator('[data-view-screenshot]').click();
      assert(await page.locator('[data-study-canvas]').evaluate(e => e.inert));
      await page.locator('[data-try-sample]').last().click();
      assert.equal(await page.locator('[data-study-canvas]').getByRole('button', { name: /Mars/ }).getAttribute('aria-pressed'), 'true');
      await page.locator('[data-study-canvas]').evaluate(e => e.scrollTop = 100);
      await page.waitForTimeout(150);
      const sampleScroll = await page.locator('[data-study-canvas]').evaluate(e => e.scrollTop);
      assert(sampleScroll > 0);
      const expansion = await recordTransition('sample-entry', full); await retained();
      for (const selector of ['[data-back-to-browsing]', '[data-viewer-ordinal]', '[data-viewer-navigation]', '[data-view-screenshot]', '[data-try-sample]', '[data-viewer-fullscreen]']) assert.equal(await page.locator(selector).first().isVisible(), false, `${selector} occupies app fullscreen`);
      assert(await page.locator('[data-study-canvas]').evaluate(e => { const r = e.getBoundingClientRect(); return Math.abs(r.x) < 1 && Math.abs(r.y) < 1 && Math.abs(r.width - innerWidth) < 1 && Math.abs(r.height - innerHeight) < 1; }));
      await snap('sample-only-fullscreen.png');
      assert(expansion.some(frames => frames.some(f => f.transform?.includes('scale'))), 'Software expansion lost zoom');
      assert.equal(await page.locator('[data-study-canvas]').getByRole('button', { name: /Mars/ }).getAttribute('aria-pressed'), 'true');
      await recordTransition('sample-return', exitFull); await retained();
      assert.equal(await page.locator('[data-study-canvas]').evaluate(e => e.scrollTop), sampleScroll);
      await page.locator('[data-view-screenshot]').click();
      await recordTransition('screenshot-entry', full);
      assert(await page.locator('[data-viewer-sample-slot]').evaluate(e => { const r=e.getBoundingClientRect(); return r.x === 0 && r.y === 0 && r.width === innerWidth && r.height === innerHeight; }));
      assert.equal(await page.locator('[data-back-to-browsing]').isVisible(), false);
      await snap('screenshot-only-fullscreen.png');
      await recordTransition('screenshot-return', exitFull);
      await page.locator('[data-try-sample]').first().click();
      await page.locator('[data-viewer-next]').click();
      await page.waitForSelector('[data-project="school-management-system"]');
      await page.locator('[data-viewer-prev]').click();
      await page.waitForSelector('[data-project="adaptive-study-game"]');
      await retained();
      assert.equal(await page.locator('[data-study-canvas]').getByRole('button', { name: /Mars/ }).getAttribute('aria-pressed'), 'true');
      await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(300); await retained(); await overflow();
      await page.setViewportSize({ width: 1440, height: 900 }); await page.waitForTimeout(300); await retained();
      await close();
      await page.evaluate(() => { const track = document.querySelector('[data-gallery-count]'); scrollTo(0, 4.2 * Number(track.dataset.denominator)); });
      await page.waitForSelector('[data-game-interactive="true"]', { timeout: 20000 });
      await retained();
      assert.equal(await page.locator('[data-study-canvas]').getByRole('button', { name: /Mars/ }).getAttribute('aria-pressed'), 'true');
      await page.evaluate(() => scrollTo(0, Number(document.querySelector('[data-gallery-count]').dataset.browseStart)));
      await settled();
    });
    await check('native full films, confirmed credits, drawer alignment and source cleanup', async () => {
      await page.locator('[data-filter-button="film"]').click(); await settled();
      for (const [id, src] of [['nifemi', '/redesign/nifemi.mp4'], ['sharon', '/redesign/sharon-mobile-candidate.mp4']]) {
        await open(id);
        const video = await page.locator('[data-viewer-picture] video').elementHandle();
        assert.equal(await video.getAttribute('src'), src);
        await page.waitForFunction(() => document.querySelector('[data-viewer-picture] video').readyState >= 2);
        await page.locator('[data-viewer-controls]').getByRole('button', { name: 'Play film', exact: true }).click();
        await page.waitForFunction(() => document.querySelector('[data-viewer-picture] video').currentTime > .2);
        if (id === 'nifemi') {
          await page.evaluate(() => { const v = document.querySelector('[data-viewer-picture] video'); v.currentTime = v.duration - .3; });
          await page.waitForFunction(() => { const v=document.querySelector('[data-viewer-picture] video'); return v.currentTime < 1 && !v.paused && v.loop; }, { timeout: 10000 });
          assert(await video.evaluate(e => e === document.querySelector('[data-viewer-picture] video')));
        }
        await page.evaluate(() => { const v = document.querySelector('[data-viewer-picture] video'); v.pause(); v.currentTime = 8; });
        const zoom = id === 'nifemi' ? await recordTransition('native-entry', full) : await full(); assert(await video.evaluate(e => e === document.querySelector('[data-viewer-picture] video')));
        assert(zoom.some(frames => frames.some(f => f.transform?.includes('scale'))), 'Native expansion lost zoom');
        assert(await video.evaluate(e => Math.abs(e.currentTime - 8) < .2));
        assert(await video.evaluate(e => { const r=e.getBoundingClientRect(); return r.x===0 && r.y===0 && r.width===innerWidth && r.height===innerHeight; }), 'Native footage does not fill viewport');
        for (const control of ['[data-viewer-prev]', '[data-back-to-browsing]', '[data-viewer-controls]', '[data-viewer-ordinal]']) {
          const r = await page.locator(control).boundingBox(); assert(r.x >= 0 && r.y >= 0 && r.y+r.height <= 900);
        }
        await snap(`native-cinema-${id}.png`);
        const reverse = id === 'nifemi' ? await recordTransition('native-return', exitFull) : await exitFull(); assert(await video.evaluate(e => e === document.querySelector('[data-viewer-picture] video')));
        assert(reverse.some(frames => frames.some(f => f.transform?.includes('scale'))), 'Native return lost zoom');
        const notePanel = page.getByRole('complementary', { name: 'Studio Notes' });
        assert(await notePanel.evaluate(e => parseFloat(getComputedStyle(e.querySelector('p')).fontSize) >= 18 && getComputedStyle(e).overflowY === 'auto'));
        console.log('NOTE SIZE', id, await notePanel.evaluate(e => ({ height:e.clientHeight, content:e.scrollHeight })));
        await snap(`native-${id}.png`);
        const notes = await notePanel.boundingBox();
        await page.getByRole('button', { name: 'Read more' }).click();
        await page.waitForTimeout(500);
        const detail = await page.locator('[data-viewer-drawer]').boundingBox(), shell = await page.locator('[data-study-frame]').boundingBox();
        assert(Math.abs(detail.x - notes.x) < 2); assert(detail.height < shell.height - 100); assert(Math.abs(detail.x + detail.width - shell.x - shell.width) < 2);
        assert(await page.locator('[data-viewer-drawer] p').first().evaluate(e => parseFloat(getComputedStyle(e).fontSize) >= 17));
        await snap(`notes-${id}.png`);
        await page.keyboard.press('Escape'); assert.equal(await page.locator('[data-viewer-drawer]').count(), 0);
        const profile = id === 'nifemi' ? 'Oluleke Oke John' : 'Sharon Alalibo';
        await page.getByRole('button', { name: `View ${profile} profile` }).click();
        assert.match(await page.locator('[data-viewer-drawer]').innerText(), id === 'nifemi' ? /Planning, storyboarding, editing, visual effects and colour/ : /Featured subject/);
        await page.waitForTimeout(500);
        await snap(`profile-${id}.png`);
        await page.keyboard.press('Escape');
        if (id === 'nifemi') {
          await page.getByRole('button', { name: 'View Nifemi profile' }).click();
          assert.equal(await page.locator('[data-viewer-drawer] img').count(), 0);
          assert.match(await page.locator('[data-viewer-drawer]').innerText(), /Nifemi\s+Model\s+TikTok/);
          const sparse = await page.locator('[data-viewer-drawer]').boundingBox();
          assert(sparse.height < 320);
          await page.waitForTimeout(500);
          await snap('profile-nifemi-model.png');
          await page.keyboard.press('Escape');
        }
        await close(); assert(await video.evaluate(e => e.paused && !e.hasAttribute('src')));
      }
    });
    await check('filtered ordinals, bounded navigation and close anchor reconciliation', async () => {
      await open('nifemi');
      assert.equal(await page.locator('[data-viewer-counter]').innerText(), 'FILM / 01 / 11');
      assert(await page.locator('[data-viewer-prev]').isDisabled());
      await page.locator('[data-viewer-next]').click();
      await page.waitForSelector('[data-project="sharon"]');
      await close();
      assert.equal(await page.locator('[data-gallery]').getAttribute('data-committed-id'), 'sharon');
      assert.equal(await page.locator('[data-gallery-counter]').innerText(), '02 / 11');
      const position = await page.evaluate(() => { const t = document.querySelector('[data-gallery-count]'); return [scrollY, Number(t.dataset.browseStart) + Number(t.dataset.galleryStride)]; });
      assert(Math.abs(position[0] - position[1]) < 2);
      assert(await page.evaluate(() => document.activeElement.closest('[data-gallery]') !== null));
    });
    await check('YouTube delayed SDK, one queued direct start, exact IDs and external strips', async () => {
      await page.route('https://www.youtube.com/iframe_api', route => route.fulfill({ contentType:'application/javascript', body:'setTimeout(window.__installYT, 1200); window.__installYTReady = setTimeout(() => window.onYouTubeIframeAPIReady?.(), 1250);' }));
      await page.evaluate(() => { delete window.YT; window.__yt.delay = 300; });
      await open('books-and-bills');
      assert.equal(await page.locator('[data-load-youtube]').count(), 0);
      assert(!/Load player|Loading|native YouTube|Credits pending|Still to confirm|being confirmed|No automatic/.test(await page.locator('[data-portfolio-viewer]').innerText()));
      assert.equal(await page.evaluate(() => window.__yt.apiStarts), 0);
      await page.getByRole('button', { name:'Play film', exact:true }).click();
      await page.waitForFunction(() => window.__yt.apiStarts === 1);
      await page.evaluate(() => window.__yt.delay = 0);
      const iframe = await page.locator('[data-youtube-picture] iframe').elementHandle();
      assert(await page.evaluate(() => window.__yt.latest.options.playerVars.loop === 1 && window.__yt.latest.options.playerVars.playlist === window.__yt.latest.options.videoId));
      await page.getByRole('slider', { name: 'Seek video' }).fill('63');
      await page.getByRole('button', { name: 'Mute film' }).click();
      await page.getByRole('button', { name: 'Read more' }).click();
      await page.waitForFunction(() => document.querySelector('[data-portfolio-viewer]').dataset.playing === 'false');
      assert(await iframe.evaluate(e => e === document.querySelector('[data-youtube-picture] iframe')), 'Reading replaced the player');
      await page.waitForTimeout(500);
      assert((await page.locator('[data-viewer-drawer]').boundingBox()).height < 450);
      await snap('youtube-notes-sparse.png');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('[data-portfolio-viewer]').getAttribute('data-playing'), 'false', 'Closing notes restarted playback');
      await page.evaluate(() => window.__yt.latest.nativeStart());
      await page.locator('[data-viewer-fullscreen]').click();
      await page.waitForSelector('[data-expanded="true"]');
      const motion = await page.locator('[data-viewer-picture]').evaluate(e => e.parentElement.getAnimations().map(a => a.effect.getKeyframes()));
      assert(motion.some(frames => frames.some(f => f.opacity === '0.45')), 'YouTube must retain compliant fade motion');
      assert(motion.every(frames => frames.every(f => !f.transform)), 'YouTube motion must not distort the iframe');
      await page.waitForTimeout(700);
      assert(await iframe.evaluate(e => e === document.querySelector('[data-youtube-picture] iframe')));
      assert.equal(await page.evaluate(() => window.__yt.latest.current), 63);
      const boxes = await page.evaluate(() => {
        const rect = e => { const r = e.getBoundingClientRect(); return { x:r.x, y:r.y, right:r.right, bottom:r.bottom }; };
        const frame = rect(document.querySelector('[data-youtube-picture] iframe'));
        return { frame, controls:rect(document.querySelector('[data-viewer-controls]')), title:rect(document.querySelector('[data-viewer-ordinal]').parentElement) };
      });
      assert(boxes.title.bottom <= boxes.frame.y + 1); assert(boxes.controls.y >= boxes.frame.bottom - 1);
      assert(boxes.frame.y < 100 && boxes.frame.bottom > 740, 'YouTube strips should be slim at 900px');
      await snap('youtube-cinema-1440x900.png');
      await exitFull();
      for (let i = 1; i < youtubeIds.length; i++) {
        const old = await page.locator('[data-youtube-picture] iframe').elementHandle();
        await page.locator('[data-viewer-next]').click();
        await page.waitForSelector(`[data-project="${ids[i + 4]}"]`);
        assert(await old.evaluate(e => !e.isConnected));
        await page.waitForSelector('[data-youtube-picture] iframe');
      }
      assert.deepEqual(await page.evaluate(() => window.__yt.created), youtubeIds);
      assert(await page.locator('[data-viewer-next]').isDisabled());
      await page.evaluate(() => { const p = window.__yt.latest; p.options.events.onError({ data: 150 }); p.options.events.onStateChange({ data: 1 }); });
      assert(await page.getByRole('button', { name: 'Play film', exact: true }).isDisabled());
      assert.match(await page.locator('[data-portfolio-viewer] [role="alert"]').innerText(), /Video unavailable/);
      assert.equal(await page.getByRole('link', { name:'Watch on YouTube' }).getAttribute('href'), 'https://www.youtube.com/watch?v=ZdaMD-g-EzQ');
      await close();
      assert.equal(await page.evaluate(() => window.__yt.destroyed), 9);
      return { stub: true, youtubeIds, fullscreenSameIframe: true };
    });
    await check('YouTube queued cancellation on notes, navigation and hidden document', async () => {
      const starts = await page.evaluate(() => window.__yt.apiStarts);
      await page.evaluate(() => window.__yt.delay = 1000);
      await open('books-and-bills');
      await page.getByRole('button', { name:'Play film', exact:true }).click();
      await page.getByRole('button', { name:'Read more' }).click();
      await page.waitForTimeout(1200);
      assert.equal(await page.evaluate(() => window.__yt.apiStarts), starts);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('[data-portfolio-viewer]').getAttribute('data-playing'), 'false');
      await close();
      await open('books-and-bills');
      await page.getByRole('button', { name:'Play film', exact:true }).click();
      await page.evaluate(() => window.__staleYT = window.__yt.latest);
      await page.locator('[data-viewer-next]').click();
      await page.waitForSelector('[data-project="forest-sequence"]');
      await page.waitForTimeout(1200);
      await page.evaluate(() => { window.__staleYT.options.events.onStateChange({ data:1 }); window.__staleYT.options.events.onError({ data:150 }); });
      assert.equal(await page.evaluate(() => window.__yt.apiStarts), starts);
      assert.equal(await page.locator('[data-portfolio-viewer] [role="alert"]').count(), 0);
      assert.equal(await page.locator('[data-portfolio-viewer]').getAttribute('data-playing'), 'false');
      await close();
      await open('books-and-bills');
      await page.getByRole('button', { name:'Play film', exact:true }).click();
      await page.evaluate(() => { Object.defineProperty(document,'hidden',{ configurable:true,value:true }); document.dispatchEvent(new Event('visibilitychange')); });
      await page.waitForTimeout(1200);
      assert.equal(await page.evaluate(() => window.__yt.apiStarts), starts);
      await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); window.__yt.delay=0; });
      assert.equal(await page.locator('[data-portfolio-viewer]').getAttribute('data-playing'), 'false');
      await close();
      await page.evaluate(() => window.__yt.delay = 21000);
      await open('books-and-bills');
      await page.getByRole('button', { name:'Play film', exact:true }).click();
      await page.waitForSelector('[data-portfolio-viewer] [role="alert"]', { timeout:25000 });
      await page.waitForTimeout(1500);
      assert.equal(await page.evaluate(() => window.__yt.apiStarts), starts, 'Late readiness played after timeout');
      assert(await page.getByRole('button', { name:'Play film', exact:true }).isDisabled());
      await close(); await page.evaluate(() => window.__yt.delay = 0);
      return { sdk:'labelled delayed stub', queuedStartsCancelled:true, staleCallbacksIgnored:true, readinessTimeout:true, documentHidden:'simulated' };
    });
    await check('native surface toggle, idle, keyboard, background cleanup and fullscreen close', async () => {
      await open('nifemi');
      const video = await page.locator('[data-viewer-picture] video').elementHandle();
      await page.waitForFunction(() => document.querySelector('[data-viewer-picture] video').readyState >= 2);
      await video.click({ position:{ x:20,y:20 } });
      await page.waitForFunction(() => !document.querySelector('[data-viewer-picture] video').paused);
      await video.click({ position:{ x:20,y:20 } });
      await page.waitForFunction(() => document.querySelector('[data-viewer-picture] video').paused);
      await page.locator('[data-viewer-picture] video').focus();
      await page.keyboard.press('Space');
      await page.waitForFunction(() => !document.querySelector('[data-viewer-picture] video').paused);
      // Pointer use re-arms idle after keyboard playback.
      await page.locator('[data-viewer-controls]').getByRole('button', { name:'Pause film', exact:true }).click();
      await page.locator('[data-viewer-controls]').getByRole('button', { name:'Play film', exact:true }).click();
      await page.mouse.move(5, 5);
      await page.waitForFunction(() => document.querySelector('[data-portfolio-viewer]').dataset.idle === 'true');
      await page.keyboard.press('Tab');
      await page.waitForFunction(() => document.querySelector('[data-portfolio-viewer]').dataset.idle === 'false');
      await page.evaluate(() => document.querySelector('[data-viewer-picture] video').pause());
      await page.waitForFunction(() => document.querySelector('[data-portfolio-viewer]').dataset.playing === 'false');
      assert.equal(await page.locator('[data-portfolio-viewer]').getAttribute('data-idle'), 'false');
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { configurable: true, value: true });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      assert(await video.evaluate(e => e.paused && !e.hasAttribute('src')));
      await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
      await page.waitForFunction(() => document.querySelector('[data-viewer-picture] video').readyState >= 2);
      await full();
      await close();
      await page.waitForFunction(() => !document.fullscreenElement);
      assert(await video.evaluate(e => e.paused && !e.hasAttribute('src')));
      return { hiddenDocumentEvent: 'simulated', nativeFullscreen: 'real browser API' };
    });
    for (const viewport of [{ width:390,height:844 }, { width:390,height:600 }, { width:390,height:480 }, { width:1920,height:1080 }]) {
      await startup(viewport);
      await check(`keyboard last real project, filters and viewer layout ${viewport.width}x${viewport.height}`, async () => {
        await page.locator('[data-project-id="adaptive-study-game"]').focus();
        await page.keyboard.press('End');
        const row = page.locator('[data-project-id="meet-monjolaoluwa"]');
        assert(await row.evaluate(e => document.activeElement === e));
        const r = await row.boundingBox(); assert(r.y > 0 && r.y + r.height < viewport.height);
        await page.keyboard.press('Enter'); await settled();
        await page.locator('[data-project-action]').click();
        assert.equal(await page.locator('[data-viewer-counter]').innerText(), 'ALL / 13 / 13');
        await overflow();
        for (const control of ['[data-viewer-prev]', '[data-viewer-next]']) {
          const arrow = await page.locator(control).boundingBox();
          assert(arrow.y >= 0 && arrow.y + arrow.height <= viewport.height, 'Project arrow below fold');
        }
        const shell = await page.locator('[data-study-frame]').boundingBox();
        assert(shell.x === 0 && shell.y === 0 && shell.width === viewport.width && shell.height === viewport.height);
        await snap(`youtube-${viewport.width}x${viewport.height}.png`);
        await full();
        const yt = await page.locator('[data-youtube-picture] iframe').boundingBox();
        const controls = await page.locator('[data-viewer-controls]').boundingBox();
        assert(yt.height >= 200 && controls.y >= yt.y + yt.height - 1);
        const next = await page.locator('[data-viewer-next]').boundingBox();
        assert(next.y + next.height <= viewport.height);
        await snap(`youtube-cinema-${viewport.width}x${viewport.height}.png`);
        await exitFull();
        if (viewport.height === 480) {
          for (let i=0; i<5; i++) await page.locator('[data-viewer-prev]').click();
          await page.waitForSelector('[data-project="samsung-vivid-colors"]');
          const arrow = await page.locator('[data-viewer-next]').boundingBox();
          assert(arrow.y + arrow.height <= viewport.height);
          await full();
          const title = await page.locator('[data-viewer-ordinal]').evaluate(e => e.parentElement.getBoundingClientRect().bottom);
          const picture = await page.locator('[data-youtube-picture]').boundingBox();
          assert(title <= picture.y && picture.y + picture.height <= viewport.height - 90);
          await snap('youtube-long-title-cinema-390x480.png');
          await exitFull();
        }
        await close();
        await page.locator('[data-filter-button="software"]').click(); await settled();
        assert.equal(await page.locator('[data-gallery]').getAttribute('data-count'), '2');
        await open('adaptive-study-game');
        await page.locator('[data-try-sample]').last().click(); await retained(); await overflow();
        await page.locator('[data-viewer-fullscreen]').scrollIntoViewIfNeeded();
        assert(await page.locator('[data-viewer-fullscreen]').evaluate(e => { const r=e.getBoundingClientRect(); const hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2); return r.bottom < document.querySelector('[data-viewer-navigation]').getBoundingClientRect().top && (hit === e || e.contains(hit)); }), 'Product tools are occluded');
        if (viewport.width === 390) {
          const content = page.getByRole('complementary', { name:'Studio Notes' }).locator('..');
          await content.evaluate(e => {
            const note = e.querySelector('aside');
            const layout = e.getBoundingClientRect(), box = note.getBoundingClientRect();
            e.scrollTop += Math.max(0, box.top - layout.top - layout.height / 2);
          });
          await page.waitForTimeout(150);
          const noteBox = await page.getByRole('complementary', { name:'Studio Notes' }).boundingBox();
          const before = await content.evaluate(e => e.scrollTop);
          const documentScroll = await page.evaluate(() => scrollY);
          const cdp = await page.context().newCDPSession(page);
          await cdp.send('Emulation.setTouchEmulationEnabled', { enabled:true, maxTouchPoints:1 });
          const touchY = Math.min(noteBox.y + 50, viewport.height - 100);
          await cdp.send('Input.dispatchTouchEvent', { type:'touchStart', touchPoints:[{ x:200, y:touchY, id:1 }] });
          for (let step=1; step<=8; step++) {
            await cdp.send('Input.dispatchTouchEvent', { type:'touchMove', touchPoints:[{ x:200, y:touchY - step * 18, id:1 }] });
            await page.waitForTimeout(25);
          }
          await cdp.send('Input.dispatchTouchEvent', { type:'touchEnd', touchPoints:[] });
          await cdp.send('Emulation.setTouchEmulationEnabled', { enabled:false });
          await cdp.detach(); await page.waitForTimeout(350);
          assert(await content.evaluate((e, before) => e.scrollTop > before, before), 'Labelled CDP touch gesture did not reach stacked content');
          assert.equal(await page.evaluate(() => scrollY), documentScroll, 'Touch moved the locked document');
          await page.locator('[data-viewer-fullscreen]').scrollIntoViewIfNeeded();
        }
        const slot = await page.locator('[data-viewer-sample-slot]').evaluate(e => ({ width:e.clientWidth, height:e.clientHeight }));
        assert(Math.abs(slot.width / slot.height - 16 / 9) < .02);
        if (viewport.width === 1920) assert(slot.height > 500, 'Desktop software media is too short');
        await snap(`sample-${viewport.width}x${viewport.height}.png`);
        await close();
        assert.equal(await page.locator('[data-gallery]').getAttribute('data-filter'), 'software');
      });
    }
    await check('orientation capability stub, automatic aspect, manual rotate and own unlock', async () => {
      await startup({ width:390,height:600 });
      await page.evaluate(() => {
        window.__orientationOriginal = Object.getOwnPropertyDescriptor(screen, 'orientation');
        window.__rotation = { locks:[], unlocks:0, type:'portrait-primary' };
        Object.defineProperty(screen,'orientation',{ configurable:true,value:{ get type(){ return window.__rotation.type; }, lock:async direction => { window.__rotation.locks.push(direction); window.__rotation.type=direction+'-primary'; }, unlock:() => window.__rotation.unlocks++ } });
      });
      await open('nifemi');
      await page.waitForFunction(() => document.querySelector('[data-viewer-picture] video').videoWidth > 0);
      const aspect = await page.locator('[data-viewer-picture] video').evaluate(v => v.videoWidth / v.videoHeight);
      await full();
      assert.deepEqual(await page.evaluate(() => window.__rotation.locks), [aspect >= 1 ? 'landscape' : 'portrait']);
      await page.locator('[data-viewer-rotate]').click();
      await page.waitForFunction(() => window.__rotation.locks.length === 2);
      assert.equal(await page.evaluate(() => window.__rotation.locks[1]), aspect >= 1 ? 'portrait' : 'landscape');
      await exitFull();
      assert.equal(await page.evaluate(() => window.__rotation.unlocks), 1);
      await close();
      await open('forest-sequence');
      await page.waitForSelector('[data-youtube-picture] iframe');
      const portrait = await page.locator('[data-youtube-picture] iframe').boundingBox();
      assert(Math.abs(portrait.width / portrait.height - 9 / 16) < .02);
      assert(await page.evaluate(() => window.__yt.latest.options.playerVars.loop === 1 && window.__yt.latest.options.playerVars.playlist === 'W9tVsQjrORc'));
      await snap('forest-portrait-390x600.png');
      await full();
      assert.equal(await page.evaluate(() => window.__rotation.locks.at(-1)), 'portrait');
      await snap('forest-fullscreen-390x600.png');
      await exitFull();
      await close();
      await page.evaluate(() => {
        Object.defineProperty(screen,'orientation',{ configurable:true,value:{ type:'portrait-primary', lock:direction => new Promise(resolve => { window.__rotation.locks.push(direction); window.__resolveRotation=resolve; }), unlock:() => window.__rotation.unlocks++ } });
      });
      await open('nifemi'); await full();
      await page.waitForFunction(() => typeof window.__resolveRotation === 'function');
      await exitFull();
      await page.evaluate(() => window.__resolveRotation());
      await page.waitForFunction(() => window.__rotation.unlocks === 3);
      await close();
      await page.evaluate(() => Object.defineProperty(screen,'orientation',{ configurable:true,value:{ type:'portrait-primary' } }));
      await open('sharon'); await full();
      assert.equal(await page.locator('[data-viewer-rotate]').count(), 0);
      await exitFull(); await close();
      await page.evaluate(() => { if(window.__orientationOriginal) Object.defineProperty(screen,'orientation',window.__orientationOriginal); else delete screen.orientation; });
      return { capability:'labelled stub, Forest portrait, delayed own-lock cleanup and unsupported branch', actualDeviceRotation:'unverified', youtubeLoop:'supported loop=1 and same-video playlist, stub configuration only' };
    });
    await startup({ width:390,height:600 }, true);
    await check('reduced motion, no cover sources, stable sample and native fullscreen', async () => {
      assert.equal(await page.locator('[data-gallery-count]').getAttribute('data-gallery-browsing'), '0');
      assert.equal(await page.locator('[data-gallery] video[src]').count(), 0);
      await open('adaptive-study-game', true);
      await page.locator('[data-try-sample]').first().click(); await retained();
      await page.locator('[data-view-screenshot]').click();
      assert.equal((await full()).length, 0, 'Reduced motion created animation'); await retained(); assert.equal((await exitFull()).length, 0);
      await close(); await overflow();
      await snap('reduced-390x600.png');
    });
    assert.deepEqual(report.errors, []);
    report.status = 'passed';
  } catch (error) {
    report.status = 'blocked'; report.failure = `${current}: ${error.stack}`;
    if (page) await snap('failure.png').catch(() => {});
    process.exitCode = 1; console.error(report.failure);
  } finally {
    await browser.close();
    await fs.writeFile(path.join(output, resultFile), JSON.stringify(report, null, 2));
    console.log('RESULT', report.status, report.checks.length, 'checks', report.errors.length, 'page errors');
  }
})();
