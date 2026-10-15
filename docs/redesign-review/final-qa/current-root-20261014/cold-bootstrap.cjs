const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const root = path.resolve(__dirname, '../../../..');
const url = process.env.BOOTSTRAP_URL || 'https://johnsax.tailb6e2d3.ts.net:3461/redesign';
const report = { started: new Date().toISOString(), url, sourceFingerprint:require('./baseline.json').sourceFingerprint, caveat:'Fresh browser contexts with the existing dev process, not process-cold startup or production performance.', attempts:[] };
(async () => {
  const browser = await chromium.launch({ channel:'chrome' });
  try {
    for (let index = 0; index < 3; index++) {
      const context = await browser.newContext({ viewport:{ width:1440, height:900 } });
      const page = await context.newPage();
      const item = { index, errors:[], parseFailures:[], scriptResponses:[], failedRequests:[] };
      report.attempts.push(item);
      const session = await context.newCDPSession(page);
      await session.send('Debugger.enable');
      await session.send('Network.enable');
      await session.send('Network.setCacheDisabled', { cacheDisabled:true });
      session.on('Debugger.scriptFailedToParse', e => item.parseFailures.push({ url:e.url, endLine:e.endLine }));
      page.on('pageerror', e => item.errors.push(e.message));
      page.on('requestfailed', r => item.failedRequests.push({ url:r.url(), error:r.failure()?.errorText }));
      const pending = [];
      page.on('response', response => {
        if (response.request().resourceType() !== 'script') return;
        pending.push((async () => {
          const record = { url:response.url(), status:response.status() };
          try {
            const body = await response.body();
            record.bytes = body.length;
            record.sha256 = crypto.createHash('sha256').update(body).digest('hex');
            const name = decodeURIComponent(new URL(response.url()).pathname);
            if (name.startsWith('/_next/static/')) {
              const file = path.join(root, '.next', name.slice('/_next/'.length));
              if (fs.existsSync(file)) { const disk=fs.readFileSync(file); record.diskBytes=disk.length; record.identicalToDisk=body.equals(disk); }
            }
            if (record.identicalToDisk === false) record.tail = body.toString('utf8').slice(-120);
          } catch (error) { record.readError = error.message; }
          item.scriptResponses.push(record);
        })());
      });
      const started = Date.now();
      try {
        await page.goto(url, { waitUntil:'domcontentloaded', timeout:60000 });
        await page.waitForSelector('[data-font-ready="true"]', { timeout:20000 });
        await page.waitForFunction(() => document.querySelector('[data-team]')?.dataset.teamProgress, null, { timeout:10000 });
        item.hydrated = true;
        item.bootstrapMs = Date.now() - started;
        item.opening = await page.evaluate(() => ({ horizontalOverflow:document.documentElement.scrollWidth > innerWidth + 1, videos:Array.from(document.querySelectorAll('video')).map(v=>({ src:v.getAttribute('src'), readyState:v.readyState, paused:v.paused })), images:Array.from(document.images).filter(i=>i.src.includes('tablet-scene')).map(i=>({src:i.getAttribute('src'),loading:i.loading,complete:i.complete,naturalWidth:i.naturalWidth})), resourceBytes:performance.getEntriesByType('resource').reduce((sum,r)=>sum+r.transferSize,0) }));
      } catch (error) { item.hydrated=false; item.failure=error.message; }
      await Promise.allSettled(pending);
      await context.close();
      console.log(JSON.stringify({ index, hydrated:item.hydrated, bootstrapMs:item.bootstrapMs, errors:item.errors, parseFailures:item.parseFailures, differentScripts:item.scriptResponses.filter(r=>r.identicalToDisk===false) }));
    }
  } finally {
    report.finished = new Date().toISOString();
    fs.writeFileSync(path.join(__dirname, new URL(url).hostname === '127.0.0.1' ? 'cold-bootstrap-local-results.json' : 'cold-bootstrap-results.json'), JSON.stringify(report,null,2));
    await browser.close();
  }
})().catch(e=>{console.error(e);process.exitCode=1;});
