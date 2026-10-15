const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const { spawn } = require('node:child_process');
const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const dir = __dirname;
const root = path.resolve(dir, '../../../../..');
const base = path.join(root, 'docs/redesign-review/performance-audit/recheck/interaction-fix-workspace');
const candidate = path.join(dir, 'candidate-workspace');
const phase = process.argv[2];
const next = path.join(root, 'node_modules/next/dist/bin/next');
if (!['prepare', 'trace-baseline', 'trace-candidate', 'compare'].includes(phase)) throw Error('Expected prepare, trace-baseline, trace-candidate or compare');

function prepare() {
  if (fs.existsSync(candidate)) throw Error('Candidate workspace already exists');
  fs.mkdirSync(candidate, { recursive: true });
  fs.writeFileSync(path.join(candidate, '.gitignore'), '*\n');
  for (const name of ['src', 'config']) fs.cpSync(path.join(root, name), path.join(candidate, name), { recursive: true });
  for (const name of ['package.json', 'pnpm-lock.yaml', 'next.config.ts', 'tsconfig.json', 'next-env.d.ts', 'postcss.config.mjs', 'tailwind.config.ts', 'eslint.config.mjs', 'components.json', 'prisma.config.ts']) {
    if (fs.existsSync(path.join(root, name))) fs.copyFileSync(path.join(root, name), path.join(candidate, name));
  }
  for (const name of ['node_modules', 'public', 'prisma']) fs.symlinkSync(path.join(root, name), path.join(candidate, name), 'junction');
  for (const name of ['.env', '.env.local']) if (fs.existsSync(path.join(root, name))) fs.symlinkSync(path.join(root, name), path.join(candidate, name), 'file');
}
async function server(workspace, port) {
  const log = fs.openSync(path.join(dir, `server-${port}.log`), 'w');
  const proc = spawn(process.execPath, [next, 'start', '-p', String(port), '-H', '127.0.0.1'], { cwd: workspace, windowsHide: true, stdio: ['ignore', log, log] });
  for (let i = 0; i < 40; i++) {
    if (proc.exitCode !== null) break;
    try { if ((await fetch(`http://127.0.0.1:${port}/redesign`)).ok) return { proc, log }; } catch {}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  proc.kill(); fs.closeSync(log); throw Error(`Server ${port} unavailable`);
}
const init = () => {
  const samples = { intervals: [], long: [], measuring: false };
  new PerformanceObserver(list => { for (const item of list.getEntries()) if (samples.measuring) samples.long.push(item.duration); }).observe({ type: 'longtask', buffered: true });
  function frame(t) { if (samples.measuring && samples.last) samples.intervals.push(t - samples.last); samples.last = t; requestAnimationFrame(frame); }
  requestAnimationFrame(frame);
  window.startSample = () => { samples.intervals = []; samples.long = []; samples.last = 0; samples.measuring = true; };
  window.stopSample = () => { samples.measuring = false; return { intervals: samples.intervals, long: samples.long }; };
};
async function traceStop(c, label) {
  const finished = new Promise(resolve => c.once('Tracing.tracingComplete', resolve));
  await c.send('Tracing.end');
  const { stream } = await finished;
  const parts = [];
  while (true) { const item = await c.send('IO.read', { handle: stream }); parts.push(Buffer.from(item.data, item.base64Encoded ? 'base64' : 'utf8')); if (item.eof) break; }
  await c.send('IO.close', { handle: stream });
  const file = `trace-${label}.json.gz`;
  fs.writeFileSync(path.join(dir, file), Buffer.concat(parts));
  const events = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(dir, file)))).traceEvents;
  const main = events.find(e => e.name === 'thread_name' && e.args?.name === 'CrRendererMain');
  const timeline = events.filter(e => e.ph === 'X' && e.pid === main.pid && e.tid === main.tid);
  const summary = {};
  for (const name of ['UpdateLayoutTree', 'Layout', 'FireAnimationFrame']) {
    const subset = timeline.filter(e => e.name === name);
    summary[name] = { count: subset.length, totalMs: subset.reduce((s, e) => s + e.dur / 1000, 0), maxMs: Math.max(0, ...subset.map(e => e.dur / 1000)), elementCounts: [...new Set(subset.map(e => e.args?.elementCount).filter(Boolean))] };
  }
  const nested = timeline.filter(e => e.name === 'UpdateLayoutTree' && timeline.some(f => f.name === 'FireAnimationFrame' && f.ts <= e.ts && f.ts + f.dur >= e.ts + e.dur));
  summary.styleInsideRaf = nested.length;
  return { file, summary };
}
async function sample(browser, label, traced, run) {
  const port = label === 'baseline' ? 5894 : 5895;
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.addInitScript(init);
  await context.route('**/*', route => ['GET', 'HEAD', 'OPTIONS'].includes(route.request().method()) ? route.continue() : route.abort());
  const c = await context.newCDPSession(page);
  await c.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await c.send('Performance.enable');
  try {
    await page.goto(`http://127.0.0.1:${port}/redesign`, { waitUntil: 'load' });
    await page.waitForTimeout(2000);
    const denominator = await page.locator('[data-denominator]').evaluate(el => Number(el.dataset.denominator));
    await page.evaluate(y => scrollTo(0, y), denominator * 1.8);
    await page.waitForTimeout(4000);
    if (run === 1 && !traced) await page.screenshot({ path: path.join(dir, `${label}-tablet.png`) });
    if (traced) await c.send('Tracing.start', { categories: 'devtools.timeline,v8,disabled-by-default-devtools.timeline', transferMode: 'ReturnAsStream', streamCompression: 'gzip' });
    const before = await c.send('Performance.getMetrics');
    await page.evaluate(() => window.startSample());
    // Slow input, fast input, reversal and a full follow/settle. Identical order in every run.
    for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 35); await page.waitForTimeout(70); }
    await page.mouse.wheel(0, 360); await page.waitForTimeout(180);
    await page.mouse.wheel(0, -400); await page.waitForTimeout(180);
    await page.waitForTimeout(1500);
    const result = await page.evaluate(() => ({ ...window.stopSample(), y: scrollY, settled: document.querySelector('[data-settled]')?.dataset.settled, quiz: document.querySelector('[data-study-canvas]')?.textContent?.length }));
    const after = await c.send('Performance.getMetrics');
    const metrics = Object.fromEntries(after.metrics.map(m => [m.name, m.value - (before.metrics.find(x => x.name === m.name)?.value ?? 0)]));
    const sorted = [...result.intervals].sort((a, b) => a - b);
    const out = { label, run, traced, scrollY: result.y, settled: result.settled, callbacks: sorted.length,
      p95IntervalMs: sorted[Math.floor(sorted.length * .95)], over33Percent: 100 * sorted.filter(x => x > 33.34).length / sorted.length,
      longTasks: result.long.length, longestTaskMs: Math.max(0, ...result.long),
      styleMs: metrics.RecalcStyleDuration * 1000, layoutMs: metrics.LayoutDuration * 1000,
      styleCount: metrics.RecalcStyleCount, layoutCount: metrics.LayoutCount };
    if (traced) out.trace = await traceStop(c, label);
    return out;
  } finally { await context.close(); }
}
async function main() {
  if (phase === 'prepare') return prepare();
  const services = [];
  let browser;
  try {
    if (phase !== 'trace-candidate') services.push(await server(base, 5894));
    if (phase !== 'trace-baseline') services.push(await server(candidate, 5895));
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    const results = { browser: browser.version(), viewport: '390x844 scale 1 mobile touch', cpu: '4x', network: 'unthrottled local', sequence: '8 x 35px wheel/70ms, +360px, -400px, 1500ms settle', runs: [] };
    const order = phase === 'compare' ? ['baseline', 'candidate', 'candidate', 'baseline', 'baseline', 'candidate'] : [phase === 'trace-baseline' ? 'baseline' : 'candidate'];
    for (let i = 0; i < order.length; i++) {
      const label = order[i], traced = phase !== 'compare';
      const r = await sample(browser, label, traced, i + 1);
      results.runs.push(r);
      fs.writeFileSync(path.join(dir, phase === 'compare' ? 'comparison.json' : `${label}-trace.json`), JSON.stringify(results, null, 2));
      console.log(label, i + 1, 'style', r.styleMs.toFixed(1), 'layout', r.layoutMs.toFixed(1), 'p95', r.p95IntervalMs.toFixed(1), 'long', r.longTasks);
    }
  } finally {
    if (browser) await browser.close();
    for (const { proc, log } of services) { proc.kill(); fs.closeSync(log); }
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
