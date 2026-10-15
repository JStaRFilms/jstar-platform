const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const dir = __dirname;
const root = path.resolve(dir, '../../../../..');
const builds = {
  baseline: { workspace: path.join(root, 'docs/redesign-review/performance-audit/recheck/rendering-optimisation/candidate-workspace'), port: 5894 },
  image: { workspace: path.join(dir, 'image-workspace'), port: 5895 },
  video: { workspace: path.join(dir, 'video-workspace'), port: 5896 },
};
const step = process.argv[2];
if (!['image', 'video'].includes(step)) throw Error('Use image or video');
const labels = step === 'image' ? ['baseline', 'image'] : ['image', 'video'];

async function start(label) {
  const { workspace, port } = builds[label];
  const log = fs.openSync(path.join(dir, `${label}-server.log`), 'w');
  const proc = spawn(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'start', '-p', String(port), '-H', '127.0.0.1'], { cwd: workspace, windowsHide: true, stdio: ['ignore', log, log] });
  proc.on('error', error => { console.error(label, error); });
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch(`http://127.0.0.1:${port}/redesign`)).ok) return { proc, log }; } catch {}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
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
  const requests = new Map();
  let dcl = 0;
  c.on('Network.requestWillBeSent', e => requests.set(e.requestId, { url: e.request.url, type: e.type, start: e.timestamp, bytes: 0 }));
  c.on('Network.dataReceived', e => { const request = requests.get(e.requestId); if (request) request.bytes += e.encodedDataLength; });
  c.on('Network.loadingFinished', e => { const request = requests.get(e.requestId); if (request) { request.bytes = e.encodedDataLength; request.end = e.timestamp; } });
  const url = `http://127.0.0.1:${builds[label].port}/redesign`;
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    dcl = Date.now();
    await page.waitForTimeout(10000);
    const media = await page.evaluate(async () => {
      const img = document.querySelector('.tabletScene img') ?? [...document.images].find(i => /tablet-scene/.test(i.currentSrc));
      const founder = document.querySelector('[data-team-person="0"] img');
      const film = document.querySelector('video');
      const state = async image => ({ source: image?.currentSrc?.split('/').pop(), complete: image?.complete, width: image?.naturalWidth,
        decoded: image?.complete && image?.naturalWidth > 0 ? await image.decode().then(() => true, () => false) : false });
      return { tablet: await state(img), founder: await state(founder), film: { source: film?.currentSrc?.split('/').pop(), ready: film?.readyState, paused: film?.paused, muted: film?.muted, duration: film?.duration, buffered: film?.buffered?.length ? film.buffered.end(film.buffered.length - 1) : 0 } };
    });
    const records = [...requests.values()].map(r => ({ ...r, path: new URL(r.url).pathname }));
    const bytes = records.reduce((n, r) => n + r.bytes, 0);
    return { label, run, window: '10 s after DOMContentLoaded', totalBytes: bytes,
      tabletBytes: records.filter(r => /tablet-scene-v1\./.test(r.path)).reduce((n, r) => n + r.bytes, 0),
      founderBytes: records.filter(r => /john-oluleke/.test(r.path)).reduce((n, r) => n + r.bytes, 0),
      filmBytes: records.filter(r => /nifemi(?:-mobile-candidate)?\.mp4/.test(r.path)).reduce((n, r) => n + r.bytes, 0),
      media, requests: records.filter(r => /tablet-scene|john-oluleke|nifemi.*\.mp4/.test(r.path)), dcl };
  } finally { await context.close(); }
}
(async () => {
  const services = []; let browser;
  try {
    for (const label of labels) services.push(await start(label));
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    const result = { browser: browser.version(), profile: '390x844 scale 2; Chrome; 4x CPU; 150ms RTT; 1.6Mbps down/0.75Mbps up; cold context; 10s after DCL', order: [], runs: [] };
    for (const [index, label] of [labels[0], labels[1], labels[1], labels[0], labels[0], labels[1]].entries()) {
      const run = await sample(browser, label, index + 1);
      result.runs.push(run); result.order.push(label);
      fs.writeFileSync(path.join(dir, `${step}-cold.json`), JSON.stringify(result, null, 2));
      console.log(label, index + 1, run.totalBytes, run.tabletBytes, run.founderBytes, run.filmBytes);
    }
  } finally { if (browser) await browser.close(); for (const service of services) { service.proc.kill(); fs.closeSync(service.log); } }
})().catch(error => { console.error(error); process.exitCode = 1; });
