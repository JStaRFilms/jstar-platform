// Local review checks. The injected player is a stub, not verified YouTube playback.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const fs = require('node:fs');
const os = require('node:os');

async function run() {
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'youtube-viewer-check-'));
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.addInitScript(() => {
      window.__mock = { destroyed: 0, apiPlays: 0 };
      window.YT = { Player: class {
        constructor(id, config) {
          this.config = config;
          this.current = 37;
          this.volume = 100;
          this.muted = false;
          this.iframe = document.createElement('iframe');
          this.iframe.src = 'about:blank';
          const host = typeof id === 'string' ? document.getElementById(id) : id;
          host.replaceWith(this.iframe);
          window.__mock.latest = this;
          setTimeout(() => config.events.onReady({ target: this }), 0);
        }
        getIframe() { return this.iframe; }
        getDuration() { return 180; }
        getCurrentTime() { return this.current; }
        getVolume() { return this.volume; }
        isMuted() { return this.muted; }
        setVolume(value) { this.volume = value; }
        mute() { this.muted = true; }
        unMute() { this.muted = false; }
        seekTo(value) { this.current = value; }
        nativeStart() { this.config.events.onStateChange({ data: 1 }); }
        playVideo() { window.__mock.apiPlays++; this.nativeStart(); }
        pauseVideo() { this.config.events.onStateChange({ data: 2 }); }
        destroy() { window.__mock.destroyed++; this.iframe.remove(); }
      } };
    });
    const review = path.resolve(__dirname, '../Mockups/01_Public_Website/studio-notes-youtube.html');
    await page.goto(pathToFileURL(review).href);
    if (await page.locator('iframe').count()) throw new Error('Initial iframe loaded');
    if (await page.locator('#project option').count() !== 9) throw new Error('Incorrect roster');
    for (const index of [0, 4, 8]) {
      await page.selectOption('#project', String(index));
      if (await page.locator('#count').innerText() !== String(index + 1).padStart(2, '0')) throw new Error('Ordinal mismatch');
      await page.waitForFunction(() => document.querySelector('.picture img').naturalWidth > 0, null, { timeout: 5000 });
    }
    if (!await page.locator('#next').isDisabled()) throw new Error('Final next enabled');
    console.log('PASS roster, posters and bounded ordinal');
    await page.selectOption('#project', '0');
    await page.click('#load');
    await page.waitForFunction(() => document.querySelector('iframe') && document.querySelector('#load').hidden, null, { timeout: 5000 });
    if (!await page.locator('#play').isDisabled()) throw new Error('Native first play bypassed');
    await page.evaluate(() => { window.__iframe = document.querySelector('iframe'); window.__mock.latest.nativeStart(); });
    if (!await page.locator('#play').isEnabled()) throw new Error('Controls stayed disabled');
    if (await page.evaluate(() => window.__mock.apiPlays) !== 0) throw new Error('Automatic API start');
    await page.click('#play');
    await page.click('#play');
    await page.locator('#seek').evaluate(element => { element.value = '50'; element.dispatchEvent(new Event('input', { bubbles: true })); });
    if (await page.evaluate(() => window.__mock.latest.current) !== 90) throw new Error('Seek failed');
    await page.click('#mute');
    if (!await page.evaluate(() => window.__mock.latest.muted)) throw new Error('Mute failed');
    await page.locator('#volume').evaluate(element => { element.value = '42'; element.dispatchEvent(new Event('input', { bubbles: true })); });
    if (await page.evaluate(() => window.__mock.latest.volume) !== 42) throw new Error('Volume failed');
    console.log('PASS native-first gating and external controls with injected stub');
    await page.click('#full');
    await page.waitForFunction(() => document.querySelector('#screen').classList.contains('expanded') && document.fullscreenElement === document.querySelector('#screen'), null, { timeout: 5000 });
    if (!await page.evaluate(() => document.querySelector('iframe') === window.__iframe && window.__mock.latest.current === 90)) throw new Error('Fullscreen replaced/reset player');
    const overlap = await page.evaluate(() => {
      const video = document.querySelector('iframe').getBoundingClientRect();
      return ['.filmhead', '.controlbar', '.head', '.foot'].some(selector => {
        const rect = document.querySelector(selector).getBoundingClientRect();
        return rect.left < video.right && rect.right > video.left && rect.top < video.bottom && rect.bottom > video.top;
      });
    });
    if (overlap) throw new Error('Overlay intersects iframe');
    await page.click('#full');
    await page.click('#read');
    await page.locator('#drawer').evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished)));
    const geometry = await page.evaluate(() => {
      const screen = document.querySelector('#screen').getBoundingClientRect();
      const drawer = document.querySelector('#drawer').getBoundingClientRect();
      const notes = document.querySelector('.information').getBoundingClientRect();
      return { full: Math.abs(drawer.height - screen.height) < 2, left: Math.abs(drawer.left - notes.left) < 2,
        right: Math.abs(drawer.right - screen.right) < 2, playerHidden: getComputedStyle(document.querySelector('#cinema')).visibility === 'hidden' };
    });
    if (!Object.values(geometry).every(Boolean)) throw new Error('Drawer geometry ' + JSON.stringify(geometry));
    await page.keyboard.press('Escape');
    if (await page.locator('#layer').isVisible()) throw new Error('Escape failed');
    if (!await page.locator('#read').evaluate(element => element === document.activeElement)) throw new Error('Focus not restored');
    console.log('PASS preserved fullscreen player, unobscured iframe and full-height reading drawer');
    await page.evaluate(() => { window.__old = window.__mock.latest; });
    await page.click('#next');
    if (await page.locator('iframe').count()) throw new Error('Old player retained');
    if (await page.evaluate(() => window.__mock.destroyed) !== 1) throw new Error('Player not destroyed');
    await page.evaluate(() => window.__old.nativeStart());
    if (await page.locator('#screen').evaluate(element => element.classList.contains('is-playing'))) throw new Error('Stale event applied');
    await page.click('#load');
    await page.waitForFunction(() => document.querySelector('#load').hidden, null, { timeout: 5000 });
    await page.evaluate(() => window.__mock.latest.nativeStart());
    await page.locator('.head').click();
    await page.waitForTimeout(2000);
    if (!await page.locator('#screen').evaluate(element => element.classList.contains('controls-idle'))) throw new Error('Idle controls did not hide');
    await page.locator('iframe').focus();
    await page.keyboard.press('Tab');
    if (!await page.locator('#play').evaluate(element => element === document.activeElement)) throw new Error('Keyboard wake after iframe failed');
    console.log('PASS project disposal, stale event rejection, idle controls and keyboard wake');
    for (const width of [1100, 728, 390]) {
      await page.setViewportSize({ width, height: 900 });
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error('Overflow at ' + width);
      await page.click('#read');
      await page.locator('#drawer').evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished)));
      if (width === 390) {
        const drawer = await page.locator('#drawer').boundingBox();
        const screen = await page.locator('#screen').boundingBox();
        if (Math.abs(drawer.width - screen.width) > 2) throw new Error('Mobile drawer width');
      }
      await page.keyboard.press('Escape');
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    if (await page.locator('#cinema').evaluate(element => getComputedStyle(element).transitionDuration) !== '0s') throw new Error('Reduced motion transition');
    await page.selectOption('#project', '0');
    await page.setViewportSize({ width: 1100, height: 900 });
    await page.screenshot({ path: path.join(output, 'notes.png'), fullPage: true });
    if (errors.length) throw new Error('Page errors: ' + errors.join('; '));
    console.log('PASS responsive layout, mobile drawer, reduced motion and zero page errors');
    console.log('Screenshots:', output);
    console.log('Real YouTube SDK/embedding, ads, buffering and view attribution were not tested.');
  } catch (error) {
    await page.screenshot({ path: path.join(output, 'failure.png'), fullPage: true }).catch(() => {});
    console.error('Page errors:', errors);
    console.error('Status:', await page.locator('#status').innerText().catch(() => 'unavailable'));
    console.error('Failure screenshot:', output);
    throw error;
  } finally {
    await browser.close();
  }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
