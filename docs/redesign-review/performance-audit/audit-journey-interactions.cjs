const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

const URL = 'http://localhost:5782/redesign';
const OUT_DIR = path.resolve(__dirname);

async function runJourneyAudit() {
  console.log('Starting comprehensive Journey & Interaction audit...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const results = {
    timestamp: new Date().toISOString(),
    tests: {}
  };

  await page.goto(URL, { waitUntil: 'commit', timeout: 30000 });

  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(100);
    const ready = await page.evaluate(() => document.querySelector('[data-settled]')?.dataset.settled === 'true');
    if (ready) break;
  }

  // TEST 1: Navigation Skip link and Video sound controls
  console.log('Test 1: Skip to film sound and video controls...');
  await page.keyboard.press('Tab');
  await page.waitForTimeout(200);

  const focusedLinkText = await page.evaluate(() => document.activeElement?.innerText ?? '');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);

  const afterSkip = await page.evaluate(() => {
    const active = document.activeElement;
    const hero = document.querySelector('[data-screening]');
    const v = document.querySelector('video');
    const soundBtn = document.querySelector('#film-sound');
    return {
      activeId: active?.id ?? null,
      activeTag: active?.tagName ?? null,
      heroScreening: hero?.getAttribute('data-screening') ?? null,
      soundMuted: soundBtn?.getAttribute('aria-label') ?? null,
      videoPaused: v?.paused ?? null
    };
  });

  // Toggle sound
  const soundBtn = await page.$('#film-sound');
  let soundToggled = false;
  if (soundBtn) {
    const before = await soundBtn.getAttribute('aria-label');
    await soundBtn.click({ force: true });
    await page.waitForTimeout(300);
    const after = await soundBtn.getAttribute('aria-label');
    soundToggled = before !== after;
  }

  // Video spacebar toggle
  const videoElement = await page.$('video');
  let spaceToggledVideo = false;
  if (videoElement) {
    await videoElement.focus();
    const pausedBefore = await page.evaluate(() => document.querySelector('video')?.paused);
    await page.keyboard.press('Space');
    await page.waitForTimeout(400);
    const pausedAfter = await page.evaluate(() => document.querySelector('video')?.paused);
    spaceToggledVideo = pausedBefore !== pausedAfter;
  }

  results.tests.skipAndVideoControls = {
    focusedLinkText,
    afterSkip,
    soundToggled,
    spaceToggledVideo
  };

  // TEST 2: Scramble effect on title
  console.log('Test 2: Title scramble effect on hover...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);

  const titleElement = await page.$('[class*="firstLine"]');
  let textBefore = '';
  let textDuring = '';
  if (titleElement) {
    textBefore = await titleElement.innerText();
    await titleElement.hover();
    await page.waitForTimeout(200);
    textDuring = await titleElement.innerText();
  }
  results.tests.titleScramble = {
    found: !!titleElement,
    textBefore,
    textDuring,
    changed: textBefore !== textDuring
  };

  // TEST 3: Navigating to Gallery via Header Work link
  console.log('Test 3: Navigating to Gallery via Header Work link...');
  await page.click('nav a[href="#selected-work"]');
  await page.waitForTimeout(1000);

  const galleryInitialState = await page.evaluate(() => {
    const gallery = document.querySelector('#selected-work');
    const hero = document.querySelector('[data-gallery-mode]');
    const activePanel = document.querySelector('[data-committed-id]');
    return {
      galleryFound: !!gallery,
      galleryVisible: gallery?.getAttribute('data-visible'),
      mode: hero?.getAttribute('data-gallery-mode'),
      committedId: activePanel?.getAttribute('data-committed-id'),
      actionBtnText: document.querySelector('[data-project-action]')?.textContent
    };
  });

  // Filter testing
  await page.click('[data-filter-button="software"]');
  await page.waitForTimeout(400);
  const rowsAfterSoftware = await page.evaluate(() => document.querySelectorAll('[data-project-id]').length);

  await page.click('[data-filter-button="film"]');
  await page.waitForTimeout(400);
  const rowsAfterFilm = await page.evaluate(() => document.querySelectorAll('[data-project-id]').length);

  await page.click('[data-filter-button="all"]');
  await page.waitForTimeout(400);
  const rowsAfterAll = await page.evaluate(() => document.querySelectorAll('[data-project-id]').length);

  // TEST 4: Playable Study Game Mode from Gallery
  console.log('Test 4: Entering Playable Study Game mode via Try it...');
  await page.click('[data-project-id="adaptive-study-game"]');
  await page.waitForTimeout(400);

  const tryItButton = await page.$('[data-project-action]');
  let playableModeEntered = false;
  let galleryInertWhenPlaying = false;
  let quizAnswered = false;
  let backToBrowsingWorked = false;

  if (tryItButton) {
    await tryItButton.click();
    await page.waitForTimeout(800);

    const playState = await page.evaluate(() => {
      const hero = document.querySelector('[data-play]');
      const gallery = document.querySelector('#selected-work');
      const gameFrame = document.querySelector('[data-study-frame]');
      const topics = document.querySelectorAll('[class*="study-game_topic"] button');
      return {
        dataPlay: hero?.getAttribute('data-play'),
        galleryInert: gallery?.inert,
        gameFrameInert: gameFrame?.inert,
        topicsCount: topics.length
      };
    });
    playableModeEntered = playState.dataPlay === 'true';
    galleryInertWhenPlaying = playState.galleryInert === true;

    // Pick topic and answer question inside playable mode
    const topicBtn = await page.$('[class*="study-game_topic"] button');
    if (topicBtn) {
      await topicBtn.click();
      await page.waitForTimeout(500);

      const optionBtn = await page.$('[class*="study-game_options"] button');
      if (optionBtn) {
        await optionBtn.click();
        await page.waitForTimeout(300);
        quizAnswered = true;
      }
    }

    // Click "Back to browsing"
    const backBtn = await page.$('[data-back-to-browsing]');
    if (backBtn) {
      await backBtn.click();
      await page.waitForTimeout(500);
      const postBackState = await page.evaluate(() => {
        const hero = document.querySelector('[data-play]');
        return hero?.getAttribute('data-play');
      });
      backToBrowsingWorked = postBackState === 'false' || postBackState === null;
    }
  }

  results.tests.galleryAndStudyGame = {
    galleryInitialState,
    filterCounts: { rowsAfterSoftware, rowsAfterFilm, rowsAfterAll },
    playableModeEntered,
    galleryInertWhenPlaying,
    quizAnswered,
    backToBrowsingWorked
  };

  // TEST 5: Continue to Team Section via [data-gallery-continue]
  console.log('Test 5: Continuing from Gallery to Team Section...');
  const continueBtn = await page.$('[data-gallery-continue]');
  let continueWorked = false;
  if (continueBtn) {
    await continueBtn.click();
    await page.waitForTimeout(1000);
    continueWorked = true;
  }

  const teamState = await page.evaluate(() => {
    const team = document.querySelector('#team-sequence');
    const cutouts = document.querySelectorAll('[data-team-id]');
    return {
      teamFound: !!team,
      cutoutsCount: cutouts.length,
      firstMemberId: cutouts[0]?.getAttribute('data-team-id'),
      firstMemberAria: cutouts[0]?.getAttribute('aria-label')
    };
  });

  // Spotlight first member
  const firstCutout = await page.$('[data-team-id]');
  let spotlightActive = false;
  if (firstCutout) {
    await firstCutout.hover();
    await page.waitForTimeout(300);
    spotlightActive = await page.evaluate(() => {
      const active = document.querySelector('[data-team-spotlight="true"], [data-active-member]');
      return !!active;
    });
  }

  results.tests.teamSection = {
    continueWorked,
    teamState,
    spotlightActive
  };

  // TEST 6: Proceeding to Closing Sequence & Enquiry Form
  console.log('Test 6: Scrolling to Closing Sequence & Testing Form Validation...');
  // Scroll until closing sequence cover is fully active (cover >= 0.95 and form not inert)
  for (let i = 0; i < 20; i++) {
    const isInteractive = await page.evaluate(() => {
      const form = document.querySelector('#project-enquiry');
      return form && !form.closest('[inert]');
    });
    if (isInteractive) break;
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(150);
  }

  const formInspect = await page.evaluate(() => {
    const form = document.querySelector('#project-enquiry');
    const track = document.querySelector('#closing-sequence');
    const submit = form?.querySelector('button[type="submit"]');
    return {
      formFound: !!form,
      formInert: form?.closest('[inert]') ? true : false,
      submitFound: !!submit,
      cover: track?.getAttribute('data-cover')
    };
  });
  console.log('Form inspect:', JSON.stringify(formInspect));

  let emptySubmitMessage = '';
  let scrollBeforeEmptySubmit = 0;
  let scrollAfterEmptySubmit = 0;

  if (formInspect.formFound && !formInspect.formInert) {
    scrollBeforeEmptySubmit = await page.evaluate(() => window.scrollY);
    await page.click('#project-enquiry button[type="submit"]');
    await page.waitForTimeout(300);
    scrollAfterEmptySubmit = await page.evaluate(() => window.scrollY);

    emptySubmitMessage = await page.evaluate(() => {
      const alert = document.querySelector('#project-enquiry [role="status"], #project-enquiry [class*="status"], #project-enquiry [class*="message"]');
      return alert ? alert.innerText : '';
    });
  }

  // Fill partial valid details & check WhatsApp link without submitting
  await page.fill('#project-enquiry input[name="name"]', 'Audit Tester');
  await page.click('#project-enquiry input[value="Film"]');
  await page.fill('#project-enquiry input[name="email"]', 'audit@example.com');
  await page.fill('#project-enquiry input[name="phone"]', '+2348152657887');
  await page.fill('#project-enquiry textarea[name="brief"]', 'This is an automated release audit test brief with sufficient length.');
  await page.waitForTimeout(300);

  const whatsappHref = await page.evaluate(() => {
    const link = document.querySelector('a[href*="wa.me"]');
    return link ? link.getAttribute('href') : null;
  });

  results.tests.enquiryForm = {
    formInspect,
    emptySubmitMessage,
    scrollDidNotJump: Math.abs(scrollBeforeEmptySubmit - scrollAfterEmptySubmit) < 50,
    whatsappHref,
    whatsappContainsDraft: whatsappHref ? whatsappHref.includes('Audit%20Tester') && whatsappHref.includes('Film') : false
  };

  // TEST 7: Return to Opening
  console.log('Test 7: Return to Opening brand link...');
  const brandLink = await page.$('a[class*="journeyBrand"]');
  let returnedToTop = false;
  if (brandLink) {
    await page.evaluate(() => {
      const link = document.querySelector('a[class*="journeyBrand"]');
      if (link) link.click();
    });
    await page.waitForTimeout(1000);
    const yAfterReturn = await page.evaluate(() => window.scrollY);
    returnedToTop = yAfterReturn < 100;
  }
  results.tests.returnToOpening = {
    brandLinkFound: !!brandLink,
    returnedToTop
  };

  const outFile = path.join(OUT_DIR, 'journey-test-results.json');
  fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
  console.log('Journey test results successfully saved to:', outFile);

  await browser.close();
}

runJourneyAudit().catch(err => {
  console.error('Journey audit error:', err);
  process.exit(1);
});
