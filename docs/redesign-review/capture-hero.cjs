// Default: verify only. Pass --capture explicitly to create screenshots/recording.
// PLAYWRIGHT_MODULE points to an existing Playwright installation; no project dependency needed.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const capture = process.argv.includes('--capture');
const viewport = { width: 1860, height: 980 };
const output = __dirname;

async function scroll(page, to, duration = 900) {
  const blur = await page.evaluate(async ({ to, duration }) => {
    const from = scrollY;
    return new Promise(resolve => {
      let start;
      let maximumBlur = 0;
      function step(now) {
        start ??= now;
        const t = Math.min(1, (now - start) / duration);
        maximumBlur = Math.max(maximumBlur, parseFloat(document.querySelector('main > div').style.getPropertyValue('--motion-blur')) || 0);
        scrollTo(0, from + (to - from) * t);
        if (t < 1) requestAnimationFrame(step);
        else resolve(maximumBlur);
      }
      requestAnimationFrame(step);
    });
  }, { to, duration });
  await page.waitForTimeout(150);
  await page.waitForSelector('[data-settled="true"]');
  return blur;
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport, ...(capture ? { recordVideo: { dir: output, size: viewport } } : {}) });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    assert((await page.goto('http://127.0.0.1:5782/redesign', { waitUntil: 'networkidle' })).status() === 200);
    await page.waitForSelector('[data-settled="true"]');
    const reports = [];
    for (const size of [viewport, { width: 1440, height: 900 }, { width: 1280, height: 720 }]) {
      await page.setViewportSize(size);
      await page.waitForTimeout(150);
      const geometry = await page.evaluate(() => {
        const heading = document.querySelector('h1');
        const description = heading.nextElementSibling;
        const range = document.createRange();
        range.selectNodeContents(description);
        return { width: innerWidth, description: range.getBoundingClientRect().toJSON(), fontSize: parseFloat(getComputedStyle(description).fontSize), studioBottom: heading.lastElementChild.getBoundingClientRect().bottom };
      });
      assert(geometry.description.width > size.width * 0.86 && geometry.description.right < size.width * 0.96, 'Opening description does not span the content width');
      assert(geometry.description.top >= geometry.studioBottom, 'Description collides with Studios');
      reports.push({ viewport: size, geometry });
    }
    await page.setViewportSize(viewport);
    await page.waitForTimeout(150);
    if (capture) await page.screenshot({ path: path.join(output, 'opening-revised.png') });
    const distance = await page.evaluate(() => document.querySelector('section').offsetHeight - innerHeight);
    const motionBlur = await scroll(page, Math.ceil(distance * 0.25));
    assert(motionBlur > 0.1 && motionBlur <= 2.5, 'Text blur does not follow motion');
    assert(await page.evaluate(() => parseFloat(document.querySelector('main > div').style.getPropertyValue('--motion-blur')) === 0 && getComputedStyle(document.querySelector('video')).filter === 'none'), 'Blur remains at rest or affects footage');
    await page.waitForFunction(() => !document.querySelector('video').paused);
    const description = await page.evaluate(() => {
      const heading = document.querySelector('h1');
      const p = heading.nextElementSibling;
      return { top: p.getBoundingClientRect().top, fontSize: parseFloat(getComputedStyle(p).fontSize), transform: getComputedStyle(p).transform, studioTransform: getComputedStyle(heading.lastElementChild).transform };
    });
    assert(description.top < reports[0].geometry.description.top - 100 && description.fontSize < reports[0].geometry.fontSize * 0.6, 'Description did not rise and shrink');
    assert(description.transform === description.studioTransform, 'Description does not travel with Studios');
    assert(await page.getByRole('slider').count() === 0 && await page.locator('dialog').count() === 0, 'Player UI remains');
    for (const name of ['Play film', 'Pause film', 'Watch full piece', 'Menu']) assert(await page.getByRole('button', { name, exact: true }).count() === 0);
    const sound = page.locator('#film-sound');
    const control = sound.locator('..');
    assert(await control.getAttribute('data-hint') === 'true', 'Entry hint is missing');
    assert(await sound.textContent() === 'Click to listen', 'Sound discovery copy is missing');
    await page.waitForTimeout(3300);
    assert(await control.evaluate(el => Number(getComputedStyle(el).opacity) < 0.01), 'Sound control does not disappear when idle');
    await page.mouse.move(viewport.width - 250, viewport.height - 30);
    await page.waitForTimeout(250);
    assert(await control.evaluate(el => Number(getComputedStyle(el).opacity) > 0.95), 'Pointer activity does not reveal sound');
    await sound.click();
    assert(await page.locator('video').evaluate(el => !el.muted), 'Unmute failed');
    await sound.click();
    assert(await page.locator('video').evaluate(el => el.muted), 'Mute failed');
    await page.keyboard.press('Tab');
    await sound.focus();
    await page.waitForTimeout(2000);
    assert(await sound.evaluate(el => el.matches(':focus-visible') && getComputedStyle(el).outlineWidth === '3px'), 'Keyboard sound focus is not visible');
    assert(await control.evaluate(el => Number(getComputedStyle(el).opacity) > 0.95), 'Sound control fades while keyboard-focused');
    const film = page.locator('video');
    await film.focus();
    await page.keyboard.press('Space');
    assert(await film.evaluate(el => el.paused), 'Keyboard pause failed');
    await scroll(page, 0);
    await scroll(page, Math.ceil(distance * 0.25));
    assert(await film.evaluate(el => el.paused), 'Manual pause was overridden on re-entry');
    await film.focus();
    await page.keyboard.press('Space');
    await page.waitForFunction(() => !document.querySelector('video').paused);
    await scroll(page, Math.ceil(distance * 0.82));
    const expanded = await film.evaluate(el => ({ bounds: el.getBoundingClientRect().toJSON(), fit: getComputedStyle(el).objectFit, loop: el.loop, muted: el.muted }));
    assert(expanded.bounds.top === 0 && expanded.bounds.width === viewport.width && expanded.bounds.height === viewport.height && expanded.fit === 'cover' && expanded.loop && expanded.muted);
    if (capture) await page.screenshot({ path: path.join(output, 'expanded-revised.png') });
    await film.focus();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(150);
    await page.waitForSelector('[data-settled="true"]');
    assert(await film.evaluate(el => el.paused), 'Exit did not pause the film');
    assert(await page.locator('#studio-navigation').evaluate(el => !el.inert), 'Escape did not restore navigation');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.getByRole('button', { name: 'Expand film', exact: true }).click();
    assert(await film.evaluate(el => el.paused), 'Reduced-motion film autoplayed');
    await film.focus();
    await page.keyboard.press('Space');
    await page.waitForFunction(() => !document.querySelector('video').paused);
    await page.keyboard.press('Escape');
    assert.deepEqual(errors, [], 'Browser errors');
    const recorded = capture ? page.video() : null;
    await page.close();
    if (recorded) await fs.rename(await recorded.path(), path.join(output, 'hero-scroll.webm'));
    await fs.writeFile(path.join(output, 'sound-checks.json'), JSON.stringify({ reports, description, expanded, motionBlur, errors, recordingCreated: capture }, null, 2));
    console.log('PASS: responsive description choreography, one auto-hiding sound control, pointer/keyboard reveal, mute, keyboard pause/Escape, autoplay/full-bleed/loop and reduced motion. Recording created: '+capture);
  } finally { await browser.close(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
