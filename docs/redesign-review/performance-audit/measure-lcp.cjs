const fs = require('fs');
const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.addInitScript(() => {
    window.__lcp = 0;
    window.__lcpElement = '';
    window.__cls = 0;
    new PerformanceObserver(list => {
      const entries = list.getEntries();
      for (const entry of entries) {
        window.__lcp = entry.startTime;
        window.__lcpElement = entry.element ? entry.element.tagName + (entry.element.className ? '.' + entry.element.className : '') : '';
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__cls += entry.value;
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });

  await page.goto('http://localhost:5782/redesign', { waitUntil: 'commit' });
  await page.waitForTimeout(3000);

  const data = await page.evaluate(() => {
    return {
      lcp: window.__lcp,
      lcpElement: window.__lcpElement,
      cls: window.__cls
    };
  });

  console.log('LCP and CLS result:', JSON.stringify(data));
  await browser.close();
})();
