const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const fs = require('node:fs/promises');
const vm = require('node:vm');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  const report = { kind: 'Bounded delivery diagnostic, not a source fix', errors: [], failed: [] };
  page.on('pageerror', e => report.errors.push(e.message));
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Debugger.enable');
  cdp.on('Debugger.scriptFailedToParse', e => report.failed.push(e.url));
  const pending = [];
  page.on('response', response => {
    if (response.url().includes('/app/layout.js')) pending.push((async () => {
      const bytes = await response.body();
      const disk = await fs.readFile('.next/static/chunks/app/layout.js');
      report.layout = { url: response.url(), status: response.status(), bytes: bytes.length, diskBytes: disk.length, identical: bytes.equals(disk) };
      try { new vm.Script(bytes.toString()); report.layout.parse = 'passed'; } catch (e) { report.layout.parse = e.message; }
    })().catch(e => report.readError = e.message));
  });
  await page.goto('http://127.0.0.1:5782/redesign?viewer-polish-diagnostic=1', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForSelector('[data-font-ready="true"]', { timeout: 20000 }).catch(e => report.readyError = e.message);
  report.ready = await page.locator('[data-font-ready="true"]').count();
  await Promise.all(pending);
  await fs.writeFile('docs/redesign-review/viewer-polish/delivery-diagnostic.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
  await browser.close();
})();
