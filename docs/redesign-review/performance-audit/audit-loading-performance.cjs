const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

const URL = 'http://localhost:5782/redesign';
const OUT_DIR = path.resolve(__dirname);
const RUNS = 5;

function median(arr) {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 !== 0 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function stats(arr) {
  if (!arr.length) return { median: 0, min: 0, max: 0, avg: 0 };
  const s = [...arr].sort((a, b) => a - b);
  const min = s[0];
  const max = s[s.length - 1];
  const avg = s.reduce((a, b) => a + b, 0) / s.length;
  return { median: Math.round(median(arr) * 100) / 100, min: Math.round(min * 100) / 100, max: Math.round(max * 100) / 100, avg: Math.round(avg * 100) / 100 };
}

async function measureRun(context, isWarm) {
  const page = await context.newPage({ viewport: { width: 1440, height: 900 } });
  const client = await context.newCDPSession(page);
  await client.send('Performance.enable');
  await client.send('Network.enable');

  const requests = new Map();
  const responses = [];

  client.on('Network.requestWillBeSent', params => {
    requests.set(params.requestId, {
      requestId: params.requestId,
      url: params.request.url,
      method: params.request.method,
      type: params.type,
      wallTime: params.wallTime,
      timestamp: params.timestamp,
      priority: params.request.priority,
      headers: params.request.headers
    });
  });

  client.on('Network.responseReceived', params => {
    const req = requests.get(params.requestId) || {};
    responses.push({
      requestId: params.requestId,
      url: params.response.url,
      status: params.response.status,
      mimeType: params.response.mimeType,
      type: params.type,
      headers: params.response.headers,
      fromDiskCache: params.response.fromDiskCache,
      fromServiceWorker: params.response.fromServiceWorker,
      timing: params.response.timing,
      reqPriority: req.priority
    });
  });

  client.on('Network.loadingFinished', params => {
    const req = requests.get(params.requestId);
    if (req) {
      req.encodedDataLength = params.encodedDataLength;
    }
  });

  const startTime = Date.now();
  await page.goto(URL, { waitUntil: 'commit', timeout: 30000 });

  // Wait for settled attribute
  let settled = false;
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(100);
    const isSettled = await page.evaluate(() => {
      return document.querySelector('[data-settled]')?.dataset.settled === 'true' && document.readyState === 'complete';
    });
    if (isSettled) {
      settled = true;
      break;
    }
  }

  // Wait extra 1s for any post-load activity
  await page.waitForTimeout(1000);

  // In-page performance metrics
  const pageMetrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] || {};
    const paints = performance.getEntriesByType('paint');
    const fcpEntry = paints.find(p => p.name === 'first-contentful-paint');
    const fpEntry = paints.find(p => p.name === 'first-paint');

    // LCP
    let lcp = 0;
    let lcpElement = '';
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    if (lcpEntries.length > 0) {
      const last = lcpEntries[lcpEntries.length - 1];
      lcp = last.startTime;
      lcpElement = last.element ? last.element.tagName + (last.element.className ? '.' + last.element.className : '') : '';
    }

    // CLS
    let cls = 0;
    const shiftEntries = performance.getEntriesByType('layout-shift');
    for (const shift of shiftEntries) {
      if (!shift.hadRecentInput) {
        cls += shift.value;
      }
    }

    return {
      ttfb: nav.responseStart - nav.requestStart,
      fcp: fcpEntry ? fcpEntry.startTime : 0,
      fp: fpEntry ? fpEntry.startTime : 0,
      domInteractive: nav.domInteractive,
      domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
      load: nav.loadEventEnd - nav.startTime,
      lcp,
      lcpElement,
      cls,
      resourcesCount: performance.getEntriesByType('resource').length
    };
  });

  // Calculate transferred bytes by category
  let totalTransferred = 0;
  let jsTransferred = 0;
  let cssTransferred = 0;
  let imgTransferred = 0;
  let mediaTransferred = 0;
  let fontTransferred = 0;
  let otherTransferred = 0;

  const assetList = [];
  for (const [id, req] of requests.entries()) {
    const bytes = req.encodedDataLength || 0;
    totalTransferred += bytes;
    const url = req.url;
    const type = req.type || '';

    if (type === 'Script' || url.endsWith('.js') || url.includes('/_next/static/chunks/')) {
      jsTransferred += bytes;
    } else if (type === 'Stylesheet' || url.endsWith('.css') || url.includes('/_next/static/css/')) {
      cssTransferred += bytes;
    } else if (type === 'Image' || /\.(png|jpe?g|webp|svg|gif|avif)(\?.*)?$/i.test(url)) {
      imgTransferred += bytes;
    } else if (type === 'Media' || /\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
      mediaTransferred += bytes;
    } else if (type === 'Font' || /\.(woff2?|ttf|otf)(\?.*)?$/i.test(url)) {
      fontTransferred += bytes;
    } else {
      otherTransferred += bytes;
    }

    assetList.push({
      url,
      type,
      bytes,
      priority: req.priority,
      timestamp: req.timestamp
    });
  }

  await page.close();

  return {
    isWarm,
    settled,
    ...pageMetrics,
    totalTransferred,
    jsTransferred,
    cssTransferred,
    imgTransferred,
    mediaTransferred,
    fontTransferred,
    otherTransferred,
    requestCount: requests.size,
    assetList
  };
}

(async () => {
  console.log('Starting loading performance audit...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const coldRuns = [];
  const warmRuns = [];

  // Cold runs: new context each time
  console.log('Running 5 cold-load measurements...');
  for (let i = 0; i < RUNS; i++) {
    const context = await browser.newContext();
    const run = await measureRun(context, false);
    coldRuns.push(run);
    console.log(`Cold Run ${i + 1}: FCP=${run.fcp.toFixed(1)}ms, LCP=${run.lcp.toFixed(1)}ms, Total=${Math.round(run.totalTransferred / 1024)}KB, Settled=${run.settled}`);
    await context.close();
  }

  // Warm runs: reuse context to test browser disk & memory cache
  console.log('Running 5 warm-load measurements...');
  const warmContext = await browser.newContext();
  // Primer run
  await measureRun(warmContext, true);
  for (let i = 0; i < RUNS; i++) {
    const run = await measureRun(warmContext, true);
    warmRuns.push(run);
    console.log(`Warm Run ${i + 1}: FCP=${run.fcp.toFixed(1)}ms, LCP=${run.lcp.toFixed(1)}ms, Total=${Math.round(run.totalTransferred / 1024)}KB, Settled=${run.settled}`);
  }
  await warmContext.close();
  await browser.close();

  // Aggregate stats
  const keys = ['ttfb', 'fcp', 'fp', 'domInteractive', 'domContentLoaded', 'load', 'lcp', 'cls', 'totalTransferred', 'jsTransferred', 'cssTransferred', 'imgTransferred', 'mediaTransferred', 'fontTransferred', 'requestCount'];

  const coldSummary = {};
  const warmSummary = {};

  for (const k of keys) {
    coldSummary[k] = stats(coldRuns.map(r => r[k]));
    warmSummary[k] = stats(warmRuns.map(r => r[k]));
  }

  // Identify assets downloaded on initial load
  const sampleCold = coldRuns[0];
  const initialAssets = sampleCold.assetList.sort((a, b) => b.bytes - a.bytes);

  const report = {
    timestamp: new Date().toISOString(),
    environment: {
      url: URL,
      browser: 'Google Chrome (Chromium)',
      viewport: '1440x900',
      buildMode: 'next start (production)',
      commit: '5986347139b2647d56f8f71389e8bae46fd71f14'
    },
    coldSummary,
    warmSummary,
    coldRuns: coldRuns.map(r => { const { assetList, ...rest } = r; return rest; }),
    warmRuns: warmRuns.map(r => { const { assetList, ...rest } = r; return rest; }),
    topTransfersCold: initialAssets.slice(0, 25)
  };

  const outFile = path.join(OUT_DIR, 'loading-metrics.json');
  fs.writeFileSync(outFile, JSON.stringify(report, null, 2));
  console.log('Loading metrics successfully saved to:', outFile);
})().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
