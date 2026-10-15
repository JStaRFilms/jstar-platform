// Logo/content check using normal networking. No music playback or external navigation.
const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const output = path.join(__dirname, 'content-finalisation');
  const report = { url: 'https://johnsax.tailb6e2d3.ts.net:3461/redesign', transport: 'ordinary HTTPS, no interception', errors: [] };
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('pageerror', error => report.errors.push(error.message));
    const response = await page.goto(report.url, { waitUntil: 'domcontentloaded', timeout: 120000 });
    assert.equal(response.status(), 200);
    await page.waitForSelector('[data-font-ready="true"]', { timeout: 60000 });
    await page.getByRole('link', { name: 'Work', exact: true }).click();
    const index = await page.locator('[data-project-id="everything"]').getAttribute('data-project-index');
    await page.evaluate(index => {
      const track = document.querySelector('[data-gallery-count]');
      scrollTo(0, Number(track.dataset.browseStart) + Number(index) * Number(track.dataset.galleryStride));
    }, index);
    await page.waitForTimeout(400);
    await page.locator('[data-project-id="everything"]').click();
    await page.waitForFunction(() => document.querySelector('[data-gallery]').dataset.committedId === 'everything');
    await page.locator('[data-project-action]').click();
    const viewer = page.locator('[data-portfolio-viewer][data-project="everything"]');
    await viewer.waitFor();
    assert.equal(await page.locator('[data-gallery]').getAttribute('data-count'), '13');
    const group = viewer.getByRole('button', { name: 'View Winning Worship Way Christian Centre profile', exact: true });
    assert.equal(await group.locator('img').evaluate(el => getComputedStyle(el).objectFit), 'contain');
    await group.click();
    const detail = page.locator('[data-viewer-drawer]');
    await detail.waitFor();
    const logo = detail.locator('img[data-logo="true"]');
    await logo.waitFor();
    await page.waitForFunction(() => document.querySelector('[data-viewer-drawer] img')?.naturalWidth > 0);
    assert.equal(await logo.evaluate(el => getComputedStyle(el).objectFit), 'contain');
    assert.equal(await logo.evaluate(el => el.naturalWidth / el.naturalHeight), 2 / 3);
    assert.notEqual(await logo.evaluate(el => getComputedStyle(el).backgroundColor), 'rgba(0, 0, 0, 0)');
    assert.equal(await detail.getByRole('link', { name: 'YouTube', exact: false }).getAttribute('href'), 'https://www.youtube.com/@WinningWorshipWay');
    await fs.mkdir(output, { recursive: true });
    await page.screenshot({ path: path.join(output, 'everything-church-profile-desktop.png') });
    await page.setViewportSize({ width: 390, height: 844 });
    assert(await logo.isVisible());
    await page.screenshot({ path: path.join(output, 'everything-church-profile-mobile.png') });
    await page.getByRole('button', { name: 'Close detail', exact: true }).click();
    await viewer.getByRole('button', { name: 'View John Oluleke-Oke profile', exact: true }).click();
    await detail.waitFor();
    assert((await detail.innerText()).includes('Multi-camera filming, editing and colour grading'));
    assert.equal(await detail.locator('img').evaluate(el => getComputedStyle(el).objectFit), 'cover');
    assert.deepEqual(report.errors, []);
    report.status = 'passed'; report.logoContains = true; report.originalPortraitFitUnchanged = true;
  } catch (error) { report.status = 'failed'; report.failure = error.message; process.exitCode = 1; }
  finally { await fs.mkdir(output, { recursive: true }); await fs.writeFile(path.join(output, 'everything.json'), JSON.stringify(report, null, 2)); console.log(JSON.stringify(report)); await browser.close(); }
})();
