// Standalone Chrome, using the existing external Playwright installation.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const output = __dirname;
const source = 'C:/Users/johno/Documents/Codex/2026-09-30/https-www-jstarstudios-com-https-www/outputs/';

(async () => {
  const { topics } = await import(pathToFileURL(path.join(source, 'quiz-data.mjs')).href);
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const reports = [];
  try {
    const viewports = [{ width: 1860, height: 980 }, { width: 1440, height: 900 }, { width: 1280, height: 720 }, { width: 390, height: 844 }];
    for (const viewport of process.env.QUIZ_VIEWPORT ? viewports.filter(size => size.width === Number(process.env.QUIZ_VIEWPORT)) : viewports) {
      console.log(`Quiz ${viewport.width}×${viewport.height}`);
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto('http://127.0.0.1:5782/redesign', { waitUntil: 'commit', timeout: 90000 });
      assert.equal(response.status(), 200);
      await page.waitForSelector('[data-settled="true"]', { timeout: 90000 });
      await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
      await page.evaluate(() => { window.quizFilm = document.querySelector('video'); window.quizGame = document.querySelector('[data-game-interactive] [inert]'); });
      const distance = await page.evaluate(() => document.querySelector('section').firstElementChild.clientHeight * 2.7 - innerHeight);
      const game = page.locator('[data-theme]').first();
      const frame = game.locator('../..');
      const film = page.locator('video');
      async function phase(progress) {
        await page.evaluate(to => scrollTo(0, to), distance * progress);
        await page.waitForTimeout(150);
        await page.waitForSelector('[data-settled="true"]', { timeout: 25000 });
      }
      async function retain(name, selector) {
        const before = await selector.evaluate(el => el.innerHTML);
        await phase(2.45);
        assert(await frame.evaluate(el => el.inert), 'Small game not inert');
        const inactive = game.locator('button').first();
        await inactive.evaluate(el => el.focus({ preventScroll: true }));
        assert(await inactive.evaluate(el => document.activeElement !== el), 'Inert button accepted focus');
        await phase(4.3);
        assert.equal(await selector.evaluate(el => el.innerHTML), before, `${name} changed on scroll`);
        assert(await frame.evaluate(el => !el.inert), 'Readable game still inert');
      }
      await phase(2.45);
      assert(await film.evaluate(el => !el.paused && el === window.quizFilm), 'Film stopped in tablet hold');
      assert(await frame.evaluate(el => el.inert), 'Tablet game is interactive');
      await page.locator('#film-sound').click();
      assert(await film.evaluate(el => !el.muted));
      const time = await film.evaluate(el => ({ time: el.currentTime, now: performance.now() }));
      await phase(2.9);
      const swipeMedia = await film.evaluate((el, before) => ({ paused: el.paused, time: el.currentTime, advanced: (el.currentTime - before.time + el.duration) % el.duration, elapsed: (performance.now() - before.now) / 1000, duration: el.duration, state: el.readyState }), time);
      console.log('  swipe media', swipeMedia);
      assert(!swipeMedia.paused && swipeMedia.advanced > 0 && swipeMedia.advanced <= swipeMedia.elapsed + 0.5, 'Swipe stopped or jumped film time');
      const registration = await page.evaluate(() => {
        const image = document.querySelector('img[src="/redesign/tablet-scene-v1.png"]');
        const m = new DOMMatrix(getComputedStyle(image.parentElement).transform);
        const game = document.querySelector('[data-theme]').parentElement.parentElement.getBoundingClientRect();
        return { left: game.left - (m.e + 1028 * m.a), top: game.top - (m.f + 224 * m.d), width: game.width - 188 * m.a, height: game.height - 110 * m.d, mask: getComputedStyle(image).maskImage };
      });
      for (const key of ['left', 'top', 'width', 'height']) assert(Math.abs(registration[key]) < 0.15, `Game clipping unregistered: ${key}`);
      assert(registration.mask.includes('tablet-screen-mask.svg'));
      if (viewport.width === 1860) await page.screenshot({ path: path.join(output, 'quiz-swipe.png') });
      await film.focus();
      await phase(3.2);
      assert(await film.evaluate(el => el.paused && el.inert && document.activeElement !== el && !el.muted), 'Concealed film not paused, inert or mute lost');
      await film.dispatchEvent('keydown', { key: ' ', code: 'Space', bubbles: true });
      assert(await film.evaluate(el => el.paused), 'Concealed film restarted through keyboard');
      const concealedTime = await film.evaluate(el => el.currentTime);
      await phase(3.5);
      assert(await frame.evaluate(el => Number(getComputedStyle(el).zIndex) > Number(getComputedStyle(document.querySelector('img[src="/redesign/tablet-scene-v1.png"]').parentElement).zIndex)), 'Growing game is still behind the tablet mask');
      if (viewport.width === 1860) await page.screenshot({ path: path.join(output, 'quiz-emerging.png') });
      await phase(4.3);
      assert(await film.evaluate((el, time) => el.paused && Math.abs(el.currentTime - time) < 0.05, concealedTime));
      assert(await frame.evaluate(el => !el.inert));
      // A tiny scroll within the finished resting range must not lock clicks or text selection.
      await page.evaluate(to => scrollTo(0, to), distance * 4.2);
      await page.waitForTimeout(120);
      assert(await frame.evaluate(el => !el.inert), 'Resting-range scroll locked the game');
      const playButton = game.getByRole('button', { name: 'Let’s play' }).first();
      assert(await playButton.evaluate(el => {
        const box = el.getBoundingClientRect();
        const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
        return hit === el || el.contains(hit);
      }), 'A layer is intercepting game clicks');
      await page.evaluate(to => scrollTo(0, to), distance * 4.3);
      await page.waitForTimeout(120);
      assert(await frame.evaluate(el => !el.inert), 'Returning to the end locked the game');
      const finalGeometry = await frame.boundingBox();
      console.log('  final geometry', finalGeometry);
      // Native scrollY rounds the fractional svh track end to a CSS pixel.
      assert(finalGeometry.width === viewport.width && finalGeometry.height === viewport.height && finalGeometry.x === 0 && Math.abs(finalGeometry.y) < 0.5);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Horizontal page overflow');
      await page.screenshot({ path: path.join(output, `quiz-topics-${viewport.width}.png`) });
      // Scroll must revoke access immediately, not after the follow clock has caught up.
      await game.getByRole('button', { name: 'Let’s play' }).first().focus();
      const beforeScroll = await page.evaluate(() => scrollY);
      await page.keyboard.press('Enter');
      assert.equal(await page.evaluate(() => scrollY), beforeScroll, 'Action focus moved page scroll');
      await game.getByRole('button', { name: 'B Mars', exact: true }).focus();
      await page.keyboard.press('Space');
      assert(await game.getByRole('button', { name: 'B Mars', exact: true }).getAttribute('aria-pressed') === 'true');
      await retain('partial choice', game);
      await game.getByRole('button', { name: 'Check answer', exact: true }).click();
      await retain('feedback', game);
      assert(await game.getByRole('status').textContent() === 'That’s right! +100 pointsIron-rich dust gives Mars its reddish appearance.');
      await game.getByRole('button', { name: 'Next question →', exact: true }).click();
      await game.getByRole('button', { name: 'A True', exact: true }).click();
      await game.getByRole('button', { name: 'Check answer', exact: true }).click();
      await game.getByRole('button', { name: 'Next question →', exact: true }).click();
      await game.getByRole('button', { name: 'C Gravity', exact: true }).click();
      await game.getByRole('button', { name: 'Check answer', exact: true }).click();
      await game.getByRole('button', { name: 'Next question →', exact: true }).click();
      await game.getByRole('button', { name: 'C Mercury', exact: true }).click();
      await game.getByRole('button', { name: 'D Venus', exact: true }).click();
      await retain('partial order', game);
      await game.getByRole('button', { name: 'Remove Venus from position 2', exact: true }).click();
      await game.getByRole('button', { name: 'D Venus', exact: true }).click();
      await game.getByRole('button', { name: 'B Earth', exact: true }).click();
      await game.getByRole('button', { name: 'A Mars', exact: true }).click();
      await game.getByRole('button', { name: 'Check answer', exact: true }).click();
      await game.getByRole('button', { name: 'See my results →', exact: true }).click();
      assert(await game.getByRole('heading', { name: 'You nailed it!' }).count() === 1);
      assert(await game.getByText('400', { exact: true }).count() === 1);
      assert(await game.getByText('100%', { exact: true }).count() === 1);
      await game.locator('summary').first().click();
      await retain('results and open review', game);
      await page.screenshot({ path: path.join(output, `quiz-results-${viewport.width}.png`) });
      await game.getByRole('button', { name: 'Play again ↻', exact: true }).click();
      assert(await game.getByText('Question 1 of 4', { exact: true }).count() === 1);
      assert(await game.getByRole('button', { name: 'Check answer', exact: true }).isDisabled());
      await game.getByRole('button', { name: '← Choose another topic', exact: true }).click();
      // Every approved topic, question, explanation and review answer. One deliberately wrong answer per round.
      for (let topicIndex = 0; topicIndex < topics.length; topicIndex++) {
        const topic = topics[topicIndex];
        await game.getByRole('button', { name: 'Let’s play' }).nth(topicIndex).click();
        for (let index = 0; index < topic.questions.length; index++) {
          const q = topic.questions[index];
          assert(await game.getByRole('heading', { name: q.text, exact: true }).count() === 1);
          const answer = index === 0 ? (q.answer + 1) % q.options.length : q.answer;
          for (const option of Array.isArray(answer) ? answer : [answer]) {
            await game.getByRole('button', { name: `${String.fromCharCode(65 + option)} ${q.options[option]}`, exact: true }).click();
          }
          await game.getByRole('button', { name: 'Check answer', exact: true }).click();
          assert((await game.getByRole('status').textContent()).includes(q.why));
          if (index === 0) assert((await game.getByRole('status').textContent()).includes('Not quite. Here’s why.'));
          await game.getByRole('button', { name: index === 3 ? 'See my results →' : 'Next question →', exact: true }).click();
        }
        assert(await game.getByText('300', { exact: true }).count() === 1);
        assert(await game.getByText('75%', { exact: true }).count() === 1);
        assert(await game.getByText('3 / 4', { exact: true }).count() === 1);
        for (let index = 0; index < 4; index++) {
          const detail = game.locator('details').nth(index);
          await detail.locator('summary').click();
          assert((await detail.textContent()).includes(topics[topicIndex].questions[index].why));
        }
        await game.getByRole('button', { name: 'Try another topic →', exact: true }).click();
      }
      // Fast reversals while moving cannot accept input or change topic view.
      await page.evaluate(async distance => {
        for (const p of [2.9, 4.3, 1.5, 3.6, 2.45]) { scrollTo(0, distance * p); await new Promise(r => setTimeout(r, 80)); }
      }, distance);
      assert(await frame.evaluate(el => el.inert));
      await phase(2.45);
      assert(await film.evaluate(el => !el.paused && !el.muted && el === window.quizFilm && el.playbackRate === 1));
      await film.focus();
      await page.keyboard.press('Space');
      const manualTime = await film.evaluate(el => el.currentTime);
      await phase(4.3);
      await phase(2.45);
      assert(await film.evaluate((el, time) => el.paused && Math.abs(el.currentTime - time) < 0.05 && !el.muted, manualTime), 'Conceal/reverse overrode manual pause');
      await phase(4.3);
      await game.getByRole('button', { name: 'Let’s play' }).first().click();
      await game.getByRole('button', { name: 'B Mars', exact: true }).click();
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.getByRole('button', { name: 'Expand film', exact: true }).click();
      await page.getByRole('button', { name: 'View tablet', exact: true }).click();
      await page.getByRole('button', { name: 'View study game', exact: true }).click();
      assert(await film.evaluate(el => el.paused), 'Reduced motion autoplay');
      assert(await game.getByRole('button', { name: 'B Mars', exact: true }).getAttribute('aria-pressed') === 'true');
      await page.getByRole('button', { name: 'Return to tablet', exact: true }).click();
      await page.getByRole('button', { name: 'View study game', exact: true }).click();
      assert(await game.getByRole('button', { name: 'B Mars', exact: true }).getAttribute('aria-pressed') === 'true');
      assert(await game.locator('h1').evaluate(el => getComputedStyle(el.parentElement.parentElement).animationName === 'none'));
      await page.screenshot({ path: path.join(output, `quiz-reduced-${viewport.width}.png`) });
      assert.equal(await film.count(), 1);
      assert.deepEqual(errors, []);
      reports.push({ viewport, distance, registration, finalGeometry, retention: ['choice', 'order', 'feedback', 'results', 'open review'], allTopics: '300 points / 75% with one wrong answer; all approved explanations checked', keyboard: 'Enter, Space, action focus without page scroll', rapidReversals: 'passed', mediaIntent: 'passed', reducedMotion: 'passed', errors });
      await page.close();
    }
    // A fresh reduced-motion load must hide the opaque portrait, not just a portrait previously faded by scroll.
    const staticPage = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await staticPage.goto('http://127.0.0.1:5782/redesign', { waitUntil: 'commit', timeout: 90000 });
    await staticPage.waitForSelector('[data-settled="true"]', { timeout: 90000 });
    await staticPage.getByRole('button', { name: 'Expand film', exact: true }).click();
    await staticPage.getByRole('button', { name: 'View tablet', exact: true }).click();
    await staticPage.getByRole('button', { name: 'View study game', exact: true }).click();
    assert(await staticPage.locator('img[src="/redesign/tablet-scene-v1.png"]').evaluate(el => getComputedStyle(el.parentElement).visibility === 'hidden'), 'Fresh reduced-motion portrait covers the game');
    assert(await staticPage.locator('video').evaluate(el => el.paused && el.inert), 'Fresh reduced-motion game leaves the film active');
    await staticPage.close();
    // Keep a source preview screenshot for direct visual inspection alongside the native composition.
    const approved = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await approved.goto('http://127.0.0.1:5793/study-game-preview.html', { waitUntil: 'domcontentloaded' });
    await approved.screenshot({ path: path.join(output, 'quiz-approved-topics.png') });
    await approved.close();
    await fs.writeFile(path.join(output, 'quiz-checks.json'), JSON.stringify(reports, null, 2));
    console.log(`PASS: ${reports.length} viewport(s), registered swipe, sole film continuity/intent/mute, persistent session, all topics/scores/review/replay, keyboard, rapid reverse and reduced motion.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error.stack); process.exitCode = 1; });
