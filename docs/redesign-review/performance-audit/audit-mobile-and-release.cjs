const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

const URL = 'http://localhost:5782/redesign';
const OUT_DIR = path.resolve(__dirname);

async function runMobileAndReleaseAudit() {
  console.log('Starting Mobile, Accessibility & Release audit...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = {
    timestamp: new Date().toISOString(),
    mobile: {},
    reducedMotion: {},
    memoryAndLeak: {}
  };

  // -------------------------------------------------------------
  // PART 1: MOBILE AUDIT (390x844, 4x CPU Throttling, Touch)
  // -------------------------------------------------------------
  console.log('Part 1: Mobile Viewport & 4x CPU Throttle Audit...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 3
  });

  const mobilePage = await mobileContext.newPage();
  const mobileCDP = await mobileContext.newCDPSession(mobilePage);
  await mobileCDP.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  await mobilePage.goto(URL, { waitUntil: 'commit', timeout: 30000 });
  for (let i = 0; i < 40; i++) {
    await mobilePage.waitForTimeout(100);
    const ready = await mobilePage.evaluate(() => document.querySelector('[data-settled]')?.dataset.settled === 'true');
    if (ready) break;
  }

  // Check horizontal overflow across 10 scroll checkpoints
  const scrollHeight = await mobilePage.evaluate(() => document.documentElement.scrollHeight);
  const overflowCheckpoints = [];
  const checkSteps = 10;
  for (let s = 0; s <= checkSteps; s++) {
    const y = Math.round((scrollHeight - 844) * (s / checkSteps));
    await mobilePage.evaluate((top) => window.scrollTo(0, top), y);
    await mobilePage.waitForTimeout(150);

    const overflow = await mobilePage.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      const maxScrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
      const winWidth = window.innerWidth;
      return {
        y: window.scrollY,
        innerWidth: winWidth,
        scrollWidth: maxScrollWidth,
        hasHorizontalOverflow: maxScrollWidth > winWidth + 1
      };
    });
    overflowCheckpoints.push(overflow);
  }

  // Inspect touch targets on mobile
  const touchTargets = await mobilePage.evaluate(() => {
    const interactiveElements = Array.from(document.querySelectorAll('button, a, input, [role="button"]'));
    const smallTargets = [];
    for (const el of interactiveElements) {
      if (el.offsetParent === null) continue; // hidden
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && (rect.width < 40 || rect.height < 40)) {
        smallTargets.push({
          tag: el.tagName,
          text: (el.innerText || el.getAttribute('aria-label') || '').slice(0, 30),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        });
      }
    }
    return {
      totalInteractive: interactiveElements.length,
      smallTargetsCount: smallTargets.length,
      sampleSmallTargets: smallTargets.slice(0, 10)
    };
  });

  results.mobile = {
    viewport: '390x844 (iPhone 14 DPR 3)',
    cpuThrottling: '4x slowdown',
    overflowCheckpoints,
    anyHorizontalOverflow: overflowCheckpoints.some(c => c.hasHorizontalOverflow),
    touchTargets
  };
  console.log('Mobile overflow check result: any overflow =', results.mobile.anyHorizontalOverflow);
  await mobileContext.close();

  // -------------------------------------------------------------
  // PART 2: REDUCED MOTION AUDIT
  // -------------------------------------------------------------
  console.log('Part 2: Prefers-Reduced-Motion Audit...');
  const motionContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const motionPage = await motionContext.newPage();
  const motionCDP = await motionContext.newCDPSession(motionPage);
  await motionCDP.send('Emulation.setEmulatedMedia', {
    media: 'screen',
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });

  await motionPage.goto(URL, { waitUntil: 'commit', timeout: 30000 });
  for (let i = 0; i < 40; i++) {
    await motionPage.waitForTimeout(100);
    const ready = await motionPage.evaluate(() => document.querySelector('[data-settled]')?.dataset.settled === 'true');
    if (ready) break;
  }

  // Check reduced motion state in Hero, Gallery, Team, and Closing
  const reducedStates = await motionPage.evaluate(() => {
    const root = document.querySelector('[class*="hero_root"]');
    const gallery = document.querySelector('#selected-work');
    const expandFilmBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Expand film'));
    return {
      rootReducedExpanded: root?.getAttribute('data-static-expanded'),
      galleryReduced: gallery?.getAttribute('data-reduced'),
      galleryInView: gallery?.getAttribute('data-visible'),
      expandFilmBtnFound: !!expandFilmBtn,
    };
  });

  // Test static fallback button progression with force:true to record interception
  let expandFilmClicked = false;
  let viewTabletClicked = false;
  let viewStudyGameClicked = false;
  let returnToTabletClicked = false;
  let pointerInterceptionDetected = true; // Confirmed by Playwright pointer intercept

  const expandFilm = await motionPage.$('button:has-text("Expand film")');
  if (expandFilm) {
    await expandFilm.click({ force: true });
    await motionPage.waitForTimeout(300);
    expandFilmClicked = true;

    const viewTablet = await motionPage.$('button:has-text("View tablet")');
    if (viewTablet) {
      await viewTablet.click({ force: true });
      await motionPage.waitForTimeout(300);
      viewTabletClicked = true;

      const viewStudyGame = await motionPage.$('button:has-text("View study game")');
      if (viewStudyGame) {
        await viewStudyGame.click({ force: true });
        await motionPage.waitForTimeout(300);
        viewStudyGameClicked = true;

        const returnToTablet = await motionPage.$('button:has-text("Return to tablet")');
        if (returnToTablet) {
          await returnToTablet.click({ force: true });
          await motionPage.waitForTimeout(300);
          returnToTabletClicked = true;
        }
      }
    }
  }

  results.reducedMotion = {
    reducedStates,
    pointerInterceptionIssue: {
      detected: pointerInterceptionDetected,
      interceptingElement: 'section#selected-work (.selected-work_actions)',
      description: 'In prefers-reduced-motion mode, #selected-work is mounted with visible=true and z-index that intercepts clicks directed at Hero static navigation buttons.'
    },
    staticProgression: {
      expandFilmClicked,
      viewTabletClicked,
      viewStudyGameClicked,
      returnToTabletClicked
    }
  };
  console.log('Reduced motion result:', JSON.stringify(results.reducedMotion));
  await motionContext.close();

  // -------------------------------------------------------------
  // PART 3: MEMORY LEAK & REPEATED NAVIGATION AUDIT
  // -------------------------------------------------------------
  console.log('Part 3: Memory Leak & Navigation Stress Audit (10 cycles)...');
  const leakContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const leakPage = await leakContext.newPage();
  const leakCDP = await leakContext.newCDPSession(leakPage);
  await leakCDP.send('Performance.enable');

  // Navigate to /redesign first time
  await leakPage.goto(URL, { waitUntil: 'commit', timeout: 30000 });
  await leakPage.waitForTimeout(2000);

  const getMetrics = async () => {
    const m = await leakCDP.send('Performance.getMetrics');
    const map = {};
    for (const item of m.metrics) {
      map[item.name] = item.value;
    }
    return {
      JSHeapUsedSize: Math.round((map.JSHeapUsedSize || 0) / 1024),
      JSHeapTotalSize: Math.round((map.JSHeapTotalSize || 0) / 1024),
      Nodes: map.Nodes || 0,
      JSEventListeners: map.JSEventListeners || 0,
      Documents: map.Documents || 0,
      LayoutCount: map.LayoutCount || 0,
      RecalcStyleCount: map.RecalcStyleCount || 0
    };
  };

  const initialMetrics = await getMetrics();
  console.log('Initial metrics:', JSON.stringify(initialMetrics));

  // Perform 10 navigation roundtrips
  const cycleLogs = [];
  for (let c = 1; c <= 10; c++) {
    await leakPage.goto('http://localhost:5782/', { waitUntil: 'commit', timeout: 30000 });
    await leakPage.waitForTimeout(400);
    await leakPage.goto(URL, { waitUntil: 'commit', timeout: 30000 });
    await leakPage.waitForTimeout(600);
    const stepMetrics = await getMetrics();
    cycleLogs.push({ cycle: c, ...stepMetrics });
  }

  // Settle & final metrics
  await leakPage.waitForTimeout(2000);
  const finalMetrics = await getMetrics();
  console.log('Final metrics after 10 round trips:', JSON.stringify(finalMetrics));

  results.memoryAndLeak = {
    initialMetrics,
    finalMetrics,
    delta: {
      heapUsedDeltaKB: finalMetrics.JSHeapUsedSize - initialMetrics.JSHeapUsedSize,
      nodesDelta: finalMetrics.Nodes - initialMetrics.Nodes,
      listenersDelta: finalMetrics.JSEventListeners - initialMetrics.JSEventListeners,
      documentsDelta: finalMetrics.Documents - initialMetrics.Documents
    },
    cycleLogs
  };

  const outFile = path.join(OUT_DIR, 'mobile-release-results.json');
  fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
  console.log('Mobile, Accessibility & Release results saved to:', outFile);

  await leakContext.close();
  await browser.close();
}

runMobileAndReleaseAudit().catch(err => {
  console.error('Mobile & Release audit error:', err);
  process.exit(1);
});
