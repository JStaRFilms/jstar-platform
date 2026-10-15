const fs = require('fs');
const logFile = 'C:/CreativeOS/01_Projects/Code/jstar-platform/docs/redesign-review/performance-audit/test-pw.log';
fs.writeFileSync(logFile, 'Starting test-pw.js\n');

try {
  const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

  (async () => {
    const browser = await chromium.launch({
      channel: 'chrome',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    fs.appendFileSync(logFile, 'Navigating to http://localhost:5782/redesign...\n');
    await page.goto('http://localhost:5782/redesign', { waitUntil: 'commit', timeout: 30000 });
    fs.appendFileSync(logFile, 'Committed. Polling document state...\n');

    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(500);
      const state = await page.evaluate(() => {
        return {
          readyState: document.readyState,
          title: document.title,
          bodyExists: !!document.body,
          bodyChildren: document.body ? document.body.children.length : 0,
          rootExists: !!document.querySelector('[class*="root"]'),
          settled: document.querySelector('[data-settled]') ? document.querySelector('[data-settled]').dataset.settled : null,
          screening: document.querySelector('[data-screening]') ? document.querySelector('[data-screening]').dataset.screening : null,
          scriptsCount: document.scripts.length
        };
      });
      fs.appendFileSync(logFile, `Poll ${i}: ${JSON.stringify(state)}\n`);
      if (state.settled !== null) {
        fs.appendFileSync(logFile, 'Settled found! Page hydrated and ready.\n');
        break;
      }
    }

    await browser.close();
    fs.appendFileSync(logFile, 'Browser closed. Finished.\n');
  })().catch(err => {
    fs.appendFileSync(logFile, `Async error: ${err.stack || err.message}\n`);
  });
} catch (e) {
  fs.appendFileSync(logFile, `Sync error: ${e.stack || e.message}\n`);
}
