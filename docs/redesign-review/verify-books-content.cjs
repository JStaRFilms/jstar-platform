// Factual content regression only. No playback start or external destination navigation.
const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const report = { url: 'https://johnsax.tailb6e2d3.ts.net:3461/redesign', transport: 'ordinary HTTPS, no interception', errors: [] };
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => report.errors.push(error.message));
    const response = await page.goto(report.url, { waitUntil: 'domcontentloaded', timeout: 120000 });
    assert.equal(response.status(), 200);
    await page.waitForSelector('[data-font-ready="true"]', { timeout: 60000 });
    await page.getByRole('link', { name: 'Work', exact: true }).click();
    await page.locator('[data-project-id="books-and-bills"]').click();
    await page.waitForFunction(() => document.querySelector('[data-gallery]').dataset.committedId === 'books-and-bills');
    await page.locator('[data-project-action]').click();
    const viewer = page.locator('[data-portfolio-viewer][data-project="books-and-bills"]');
    await viewer.waitFor();
    assert.equal(await page.locator('[data-gallery]').getAttribute('data-count'), '13');
    assert.equal(await page.locator('[data-project-id="hApE9DNUFN8"]').count(), 0);
    assert.equal(await viewer.getByRole('link', { name: 'Related campus film', exact: false }).getAttribute('href'), 'https://www.youtube.com/watch?v=hApE9DNUFN8');
    await viewer.getByRole('button', { name: 'Read more', exact: false }).click();
    const detail = page.locator('[data-viewer-drawer]');
    await detail.waitFor();
    const text = await detail.innerText();
    assert(text.includes('approached us') && text.includes('We brought in campus B-roll we had already shot'));
    assert(!/\bI\b|\bme\b/.test(text));
    await page.getByRole('button', { name: 'Close detail', exact: true }).click();
    await viewer.getByRole('button', { name: 'View Monjolaoluwa Aminu profile', exact: true }).click();
    await detail.waitFor();
    assert((await detail.innerText()).includes('Project lead'));
    assert((await detail.innerText()).includes('Mass communication graduate.'));
    assert((await detail.innerText()).includes('Chief Brand & Communications Officer'));
    assert.equal(await detail.locator('img').getAttribute('src'), '/team/monjola-aminu.jpg');
    assert.equal(await detail.getByRole('link', { name: 'YouTube', exact: false }).getAttribute('href'), 'https://www.youtube.com/@monjolaoluwaaminu');
    await page.getByRole('button', { name: 'Close detail', exact: true }).click();
    await viewer.getByRole('button', { name: 'View Final-year mass communication students profile', exact: true }).click();
    await detail.waitFor();
    assert((await detail.innerText()).includes('Filming, scripting and voice-over'));
    assert.deepEqual(report.errors, []);
    report.status = 'passed'; report.rosterCount = 13; report.relatedLinkOnly = true;
    report.weVoice = true; report.confirmedProfiles = ['Monjolaoluwa Aminu', 'Final-year mass communication students'];
  } catch (error) { report.status = 'failed'; report.failure = error.message; process.exitCode = 1; }
  finally {
    await fs.mkdir(path.join(__dirname, 'content-finalisation'), { recursive: true });
    await fs.writeFile(path.join(__dirname, 'content-finalisation/books-and-bills-monjola-identity.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report)); await browser.close();
  }
})();
