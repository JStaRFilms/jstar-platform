const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const dir = __dirname;
const root = path.resolve(dir, '../../../../..');
const builds = { image: { port: 5895, workspace: path.join(dir, 'image-workspace') }, video: { port: 5896, workspace: path.join(dir, 'video-workspace') } };
async function start(label) {
  const { port, workspace } = builds[label];
  const log = fs.openSync(path.join(dir, `playback-${label}-server.log`), 'w');
  const proc = spawn(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'start', '-p', String(port), '-H', '127.0.0.1'], { cwd: workspace, windowsHide: true, stdio: ['ignore', log, log] });
  for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${port}/redesign`)).ok) return { proc, log }; } catch {} await new Promise(r => setTimeout(r, 500)); }
  proc.kill(); fs.closeSync(log); throw Error(`${label} server unavailable`);
}
async function sample(browser, label, run) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await context.route('**/*', route => ['GET', 'HEAD', 'OPTIONS'].includes(route.request().method()) ? route.continue() : route.abort());
  const c = await context.newCDPSession(page);
  await c.send('Network.enable');
  await c.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await c.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1600000 / 8, uploadThroughput: 750000 / 8, connectionType: 'cellular4g' });
  const requests = [];
  c.on('Network.requestWillBeSent', e => { if (/\/redesign\/nifemi(?:-mobile-candidate)?\.mp4$/.test(e.request.url.split('?')[0])) requests.push(e.request.url); });
  try {
    await page.goto(`http://127.0.0.1:${builds[label].port}/redesign`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(() => document.querySelector('[data-denominator]')?.dataset.denominator, undefined, { timeout: 20000 });
    await page.waitForTimeout(600);
    await page.evaluate(() => scrollTo({ top: Number(document.querySelector('[data-denominator]').dataset.denominator) * .8, behavior: 'instant' }));
    await page.evaluate(() => {
      const film = document.querySelector('video');
      window.filmEvents = { waiting: 0, stalled: 0, playing: 0, canplay: 0 };
      for (const type of Object.keys(window.filmEvents)) film.addEventListener(type, () => { window.filmEvents[type]++; });
    });
    const states = [];
    for (const delay of [0, 2000, 4000, 8000]) {
      if (delay) await page.waitForTimeout(delay - states.at(-1).delay);
      states.push(await page.evaluate(delay => {
        const v = document.querySelector('video');
        return { delay, time: v.currentTime, ready: v.readyState, paused: v.paused, muted: v.muted,
          buffered: v.buffered.length ? v.buffered.end(v.buffered.length - 1) : 0,
          dropped: v.getVideoPlaybackQuality().droppedVideoFrames, total: v.getVideoPlaybackQuality().totalVideoFrames,
          events: { ...window.filmEvents }, source: v.currentSrc.split('/').pop() };
      }, delay));
      if (delay === 4000 && run <= 2) await page.screenshot({ path: path.join(dir, `${label}-screening.png`) });
    }
    let continuity;
    if (run <= 2) {
      const film = page.locator('video').first();
      await film.focus();
      await page.keyboard.press('Space');
      await page.getByRole('button', { name: 'Enable sound' }).click();
      const pausedAt = await film.evaluate(v => ({ time: v.currentTime, src: v.currentSrc, paused: v.paused, muted: v.muted }));
      await page.evaluate(() => scrollTo({ top: Number(document.querySelector('[data-denominator]').dataset.denominator) * 2.2, behavior: 'instant' }));
      await page.waitForTimeout(2300);
      const tablet = await page.evaluate(() => {
        const v = document.querySelector('video'), img = [...document.images].find(i => /tablet-scene/.test(i.currentSrc));
        return { loaded: img?.complete && img?.naturalWidth > 0, src: v.currentSrc, time: v.currentTime, paused: v.paused, muted: v.muted };
      });
      await page.evaluate(() => scrollTo({ top: Number(document.querySelector('[data-denominator]').dataset.denominator) * .8, behavior: 'instant' }));
      await page.waitForTimeout(2300);
      const returnState = await film.evaluate(v => ({ src: v.currentSrc, time: v.currentTime, paused: v.paused, muted: v.muted }));
      await film.focus();
      await page.keyboard.press('Space');
      await film.evaluate(v => { v.currentTime = v.duration - .35; });
      await page.waitForTimeout(1200);
      const loop = await film.evaluate(v => ({ time: v.currentTime, paused: v.paused, src: v.currentSrc }));
      continuity = { pausedAt, tablet, returnState, loop };
      await page.setViewportSize({ width: 900, height: 844 });
      await page.waitForTimeout(300);
      continuity.resizedSrc = await film.evaluate(v => v.currentSrc);
    }
    return { label, run, states, requests: [...new Set(requests.map(url => url.split('/').pop()))], continuity };
  } finally { await context.close(); }
}
(async () => {
  const services = []; let browser;
  try {
    for (const label of ['image', 'video']) services.push(await start(label));
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    const result = { profile: '390x844 scale 2; 4x CPU; 150ms RTT; 1.6Mbps down; cold context, start screening at 600ms after DOMContentLoaded; observe 8s', runs: [] };
    for (const [index, label] of ['image', 'video', 'video', 'image', 'image', 'video'].entries()) {
      const run = await sample(browser, label, index + 1);
      result.runs.push(run);
      fs.writeFileSync(path.join(dir, 'playback.json'), JSON.stringify(result, null, 2));
      console.log(label, index + 1, run.states.at(-1).time.toFixed(2), run.states.at(-1).events, run.requests);
    }
  } finally { if (browser) await browser.close(); for (const { proc, log } of services) { proc.kill(); fs.closeSync(log); } }
})().catch(error => { console.error(error); process.exitCode = 1; });
