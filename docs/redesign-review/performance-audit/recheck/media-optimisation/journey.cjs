const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const dir = __dirname;
const root = path.resolve(dir, '../../../../..');
const label = process.argv[2] || 'image';
const port = label === 'video' ? 5896 : 5895;
const log = fs.openSync(path.join(dir, `${label}-journey-server.log`), 'w');
const server = spawn(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'start', '-p', String(port), '-H', '127.0.0.1'], { cwd: path.join(dir, `${label}-workspace`), windowsHide: true, stdio: ['ignore', log, log] });
(async () => {
  let browser;
  try {
    let ready = false;
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${port}/redesign`)).ok) { ready = true; break; } } catch {} await new Promise(r => setTimeout(r, 500)); }
    if (!ready) throw Error('Server unavailable');
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    const results = {};
    for (const action of ['direct-team', 'fast-scroll', 'reduced-team']) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: action === 'reduced-team' ? 'reduce' : 'no-preference' });
      const page = await context.newPage();
      await page.route('**/*', route => ['GET', 'HEAD', 'OPTIONS'].includes(route.request().method()) ? route.continue() : route.abort());
      const c = await context.newCDPSession(page);
      await c.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await c.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1600000 / 8, uploadThroughput: 750000 / 8, connectionType: 'cellular4g' });
      await page.goto(`http://127.0.0.1:${port}/redesign`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(600);
      if (action.includes('team')) await page.locator('nav a[href="#meet-the-studio"]').click();
      else await page.evaluate(() => scrollTo({ top: document.querySelector('[data-team]').offsetTop + innerHeight, behavior: 'instant' }));
      const states = [];
      for (const delay of [300, 700, 1600, 3000]) {
        await page.waitForTimeout(delay - (states.at(-1)?.delay ?? 0));
        const state = await page.evaluate(() => {
          const image = document.querySelector('[data-team-person="0"] img');
          const bounds = image.getBoundingClientRect();
          return { scrollY, teamProgress: document.querySelector('[data-team]').dataset.teamProgress,
            portraitInView: bounds.bottom > 0 && bounds.top < innerHeight, loaded: image.complete && image.naturalWidth > 0,
            source: image.currentSrc.split('/').pop() };
        });
        states.push({ delay, ...state });
        if (delay === 700) await page.screenshot({ path: path.join(dir, `${label}-${action}-700.png`) });
      }
      if (action === 'fast-scroll') {
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        await page.waitForTimeout(700);
        await page.evaluate(() => scrollTo({ top: document.querySelector('[data-team]').offsetTop + innerHeight, behavior: 'instant' }));
        await page.waitForTimeout(700);
        states.push({ reverseLoaded: await page.locator('[data-team-person="0"] img').evaluate(img => img.complete && img.naturalWidth > 0) });
      }
      results[action] = states;
      await context.close();
    }
    fs.writeFileSync(path.join(dir, `${label}-journey.json`), JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results));
  } finally { if (browser) await browser.close(); server.kill(); fs.closeSync(log); }
})().catch(error => { console.error(error); process.exitCode = 1; });
