const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

const URL = 'http://localhost:5782/redesign';
const OUT_DIR = path.resolve(__dirname);

async function runScrollAudit() {
  console.log('Starting runtime scroll & animation audit...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Inject frame recorder and longtask observer
  await page.addInitScript(() => {
    window.__frameTimes = [];
    window.__longTasks = [];
    let lastTime = performance.now();
    let recording = false;

    window.__startFrameRecording = () => {
      window.__frameTimes = [];
      window.__longTasks = [];
      recording = true;
      lastTime = performance.now();
      const loop = (now) => {
        if (!recording) return;
        const delta = now - lastTime;
        lastTime = now;
        window.__frameTimes.push({ time: now, delta, scrollY: window.scrollY });
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    };

    window.__stopFrameRecording = () => {
      recording = false;
    };

    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        window.__longTasks.push({
          startTime: entry.startTime,
          duration: entry.duration,
          name: entry.name
        });
      }
    }).observe({ type: 'longtask', buffered: true });
  });

  await page.goto(URL, { waitUntil: 'commit', timeout: 30000 });

  // Wait for settled
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(100);
    const ready = await page.evaluate(() => document.querySelector('[data-settled]')?.dataset.settled === 'true');
    if (ready) break;
  }
  console.log('Page ready and settled.');

  // Get total document scroll height
  const scrollInfo = await page.evaluate(() => {
    return {
      scrollHeight: document.documentElement.scrollHeight,
      innerHeight: window.innerHeight,
      sections: {
        hero: !!document.querySelector('section[id="screening-film"]'),
        gameFrame: !!document.querySelector('.hero_gameFrame__f2k_V'),
        gallery: !!document.querySelector('#selected-work'),
        team: !!document.querySelector('#team-sequence'),
        closing: !!document.querySelector('#closing-sequence'),
      }
    };
  });
  console.log('Scroll info:', JSON.stringify(scrollInfo));

  const totalScroll = scrollInfo.scrollHeight - scrollInfo.innerHeight;
  console.log(`Total scrollable distance: ${totalScroll}px`);

  // SECTION 1: Steady scroll down through the entire page
  console.log('Testing Profile 1: Steady scroll from 0 to bottom...');
  await page.evaluate(() => window.__startFrameRecording());

  const steps = 120;
  const stepDistance = totalScroll / steps;
  for (let i = 1; i <= steps; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), i * stepDistance);
    await page.waitForTimeout(25); // ~40fps user scroll rate
  }
  // Let physics settle
  await page.waitForTimeout(1500);

  await page.evaluate(() => window.__stopFrameRecording());
  const steadyFrames = await page.evaluate(() => window.__frameTimes);
  const steadyLongTasks = await page.evaluate(() => window.__longTasks);

  console.log(`Steady scroll recorded ${steadyFrames.length} frames, ${steadyLongTasks.length} long tasks.`);

  // SECTION 2: Aggressive fast scroll and abrupt reversal
  console.log('Testing Profile 2: Aggressive fast scroll and abrupt reversals...');
  await page.evaluate(() => window.__startFrameRecording());

  // Fast scroll down in 15 large jumps
  for (let i = 1; i <= 15; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), i * (totalScroll / 15));
    await page.waitForTimeout(30);
  }
  await page.waitForTimeout(500);

  // Fast reversal back up
  for (let i = 14; i >= 0; i--) {
    await page.evaluate((y) => window.scrollTo(0, y), i * (totalScroll / 15));
    await page.waitForTimeout(30);
  }
  // Settle
  await page.waitForTimeout(1500);

  await page.evaluate(() => window.__stopFrameRecording());
  const aggressiveFrames = await page.evaluate(() => window.__frameTimes);
  const aggressiveLongTasks = await page.evaluate(() => window.__longTasks);

  console.log(`Aggressive scroll recorded ${aggressiveFrames.length} frames, ${aggressiveLongTasks.length} long tasks.`);

  // SECTION 3: Offscreen & hidden tab audit
  console.log('Testing Offscreen and Hidden Tab behavior...');

  // Scroll to gallery (around 45% of total scroll)
  await page.evaluate((y) => window.scrollTo(0, y), totalScroll * 0.45);
  await page.waitForTimeout(1000);

  const galleryState = await page.evaluate(() => {
    const video = document.querySelector('video');
    const hero = document.querySelector('[data-screening]');
    const gallery = document.querySelector('#selected-work');
    return {
      videoPaused: video ? video.paused : null,
      videoCurrentTime: video ? video.currentTime : null,
      heroScreening: hero ? hero.getAttribute('data-screening') : null,
      galleryVisible: gallery ? gallery.getAttribute('data-visible') : null,
      galleryMode: gallery ? gallery.getAttribute('data-mode') : null,
    };
  });
  console.log('Gallery section offscreen state:', JSON.stringify(galleryState));

  // Scroll to team section (around 75% of total scroll)
  await page.evaluate((y) => window.scrollTo(0, y), totalScroll * 0.75);
  await page.waitForTimeout(1000);

  const teamState = await page.evaluate(() => {
    const video = document.querySelector('video');
    const team = document.querySelector('#team-sequence');
    const gallery = document.querySelector('#selected-work');
    return {
      videoPaused: video ? video.paused : null,
      teamProgress: team ? team.getAttribute('data-team-progress') : null,
      teamMember: team ? team.getAttribute('data-team-member') : null,
      galleryInert: gallery ? gallery.inert : null,
      galleryVisible: gallery ? gallery.getAttribute('data-visible') : null,
    };
  });
  console.log('Team section offscreen state:', JSON.stringify(teamState));

  // Scroll to bottom (Closing / Enquiry)
  await page.evaluate((y) => window.scrollTo(0, y), totalScroll);
  await page.waitForTimeout(1000);

  const closingState = await page.evaluate(() => {
    const closing = document.querySelector('#closing-sequence');
    const video = document.querySelector('video');
    return {
      videoPaused: video ? video.paused : null,
      closingCover: closing ? closing.getAttribute('data-cover') : null,
      brandVisible: closing ? closing.getAttribute('data-brand-visible') : null,
    };
  });
  console.log('Closing section offscreen state:', JSON.stringify(closingState));

  // Hidden tab behavior
  console.log('Testing Hidden tab behavior...');
  await page.evaluate(() => {
    window.__hiddenFrames = 0;
    const count = () => {
      if (document.hidden) window.__hiddenFrames++;
      requestAnimationFrame(count);
    };
    requestAnimationFrame(count);
  });

  // Emulate visibilitychange event
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { value: true, writable: true });
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', writable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForTimeout(1500);

  const hiddenFrames = await page.evaluate(() => window.__hiddenFrames);
  const hiddenVideoPaused = await page.evaluate(() => {
    const video = document.querySelector('video');
    return video ? video.paused : null;
  });
  console.log(`In hidden tab for 1.5s: RAF ran ${hiddenFrames} times, video paused: ${hiddenVideoPaused}`);

  // Restore visibility
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { value: false, writable: true });
    Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });

  // Frame analysis helper
  function analyzeFrames(frames) {
    if (!frames.length) return {};
    const deltas = frames.map(f => f.delta).slice(1); // skip primer
    const sorted = [...deltas].sort((a, b) => a - b);
    const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
    const medianDelta = sorted[Math.floor(sorted.length / 2)];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const maxDelta = sorted[sorted.length - 1];

    const drops20 = deltas.filter(d => d > 20).length;
    const drops33 = deltas.filter(d => d > 33.3).length;
    const drops50 = deltas.filter(d => d > 50).length;

    return {
      totalFrames: frames.length,
      averageFps: Math.round(1000 / avgDelta * 10) / 10,
      medianFrameTimeMs: Math.round(medianDelta * 100) / 100,
      p95FrameTimeMs: Math.round(p95 * 100) / 100,
      maxFrameTimeMs: Math.round(maxDelta * 100) / 100,
      dropsOver20ms: drops20,
      dropsOver33ms: drops33,
      dropsOver50ms: drops50,
      dropRatePercent: Math.round((drops20 / deltas.length) * 1000) / 10
    };
  }

  const results = {
    timestamp: new Date().toISOString(),
    environment: {
      viewport: '1440x900',
      totalScrollDistance: totalScroll
    },
    steadyScroll: {
      metrics: analyzeFrames(steadyFrames),
      longTasks: steadyLongTasks
    },
    aggressiveScroll: {
      metrics: analyzeFrames(aggressiveFrames),
      longTasks: aggressiveLongTasks
    },
    offscreenBehavior: {
      galleryState,
      teamState,
      closingState,
      hiddenTab: {
        rafCountDuringHidden: hiddenFrames,
        videoPausedDuringHidden: hiddenVideoPaused
      }
    }
  };

  const outFile = path.join(OUT_DIR, 'runtime-scroll-metrics.json');
  fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
  console.log('Runtime scroll metrics saved to:', outFile);

  await browser.close();
}

runScrollAudit().catch(err => {
  console.error('Runtime audit error:', err);
  process.exit(1);
});
