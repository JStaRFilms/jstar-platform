const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const dir = __dirname;
const root = path.resolve(dir, '../../../../..');
const builds = [
  { label: 'baseline', workspace: path.join(root, 'docs/redesign-review/performance-audit/recheck/rendering-optimisation/candidate-workspace'), port: 5894 },
  { label: 'image', workspace: path.join(dir, 'image-workspace'), port: 5895 },
];
(async () => {
  const services = []; let browser;
  try {
    for (const build of builds) {
      const log = fs.openSync(path.join(dir, `${build.label}-tablet-server.log`), 'w');
      const proc = spawn(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'start', '-p', String(build.port), '-H', '127.0.0.1'], { cwd: build.workspace, windowsHide: true, stdio: ['ignore', log, log] });
      services.push({ proc, log });
      let ready = false;
      for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${build.port}/redesign`)).ok) { ready = true; break; } } catch {} await new Promise(r => setTimeout(r, 500)); }
      if (!ready) throw Error(`${build.label} unavailable`);
    }
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    const results = {};
    for (const build of builds) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
      const page = await context.newPage();
      const c = await context.newCDPSession(page);
      await c.send('Network.enable');
      await c.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await c.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1600000 / 8, uploadThroughput: 750000 / 8, connectionType: 'cellular4g' });
      await page.goto(`http://127.0.0.1:${build.port}/redesign`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForFunction(() => document.querySelector('[data-denominator]')?.dataset.denominator, undefined, { timeout: 20000 });
      await page.evaluate(() => scrollTo({ top: Number(document.querySelector('[data-denominator]').dataset.denominator) * 2.2, behavior: 'instant' }));
      const states = [];
      for (const delay of [0, 500, 1500, 3000, 5000]) {
        if (delay) await page.waitForTimeout(delay - states.at(-1).delay);
        states.push(await page.evaluate(async delay => {
          const img = [...document.images].find(i => /tablet-scene/.test(i.currentSrc));
          const loaded = img?.complete && img.naturalWidth === 1672 && img.naturalHeight === 941;
          return { delay, revealed: document.querySelector('[data-tablet]')?.dataset.tablet,
            loaded, decoded: loaded ? await img.decode().then(() => true, () => false) : false,
            source: img?.currentSrc?.split('/').pop() };
        }, delay));
      }
      await page.screenshot({ path: path.join(dir, `${build.label}-tablet-pullback.png`) });
      results[build.label] = states;
      await context.close();
    }
    fs.writeFileSync(path.join(dir, 'tablet-ready.json'), JSON.stringify(results, null, 2));
    console.log(results);
  } finally { if (browser) await browser.close(); for (const { proc, log } of services) { proc.kill(); fs.closeSync(log); } }
})().catch(error => { console.error(error); process.exitCode = 1; });
