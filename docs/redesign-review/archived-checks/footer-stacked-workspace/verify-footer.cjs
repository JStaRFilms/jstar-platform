const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const url = process.env.REDESIGN_URL || 'http://127.0.0.1:5909/redesign';
const results = [];
const errors = [];
async function pose(page, fraction) {
  await page.evaluate(fraction => {
    const footer = document.querySelector('footer[class*=footerTrack]');
    const stage = footer.firstElementChild;
    scrollTo({ top: scrollY + footer.getBoundingClientRect().top + fraction * (footer.clientHeight - stage.clientHeight), behavior: 'instant' });
  }, fraction);
  await page.waitForTimeout(350);
}
async function measure(page) {
  return page.evaluate(() => {
    const footer = document.querySelector('footer[class*=footerTrack]');
    const stage = footer.firstElementChild;
    const mark = footer.querySelector('[role=img]');
    const contacts = footer.querySelector('[class*=footerExtra]');
    const legal = footer.querySelector('[class*=footerBottom]');
    const rect = e => ({ top:e.getBoundingClientRect().top, bottom:e.getBoundingClientRect().bottom, height:e.getBoundingClientRect().height });
    return { height:innerHeight, width:innerWidth, y:scrollY,
      track:rect(footer), stage:rect(stage), mark:rect(mark), contacts:rect(contacts), legal:rect(legal),
      visibility:getComputedStyle(mark).visibility,
      mobile:getComputedStyle(mark.querySelector('[data-wordmark-mobile]')).display,
      desktop:getComputedStyle(mark.querySelector('[data-wordmark-desktop]')).display,
      viewBox:mark.querySelector('svg').getAttribute('viewBox'),
      scale:new DOMMatrixReadOnly(getComputedStyle(mark).transform).d,
      groupContainsLogo:contacts.contains(footer.querySelector('[class*=footerLogo]')),
      bottomCovered:stage.contains(document.elementFromPoint(innerWidth/2,innerHeight-2)),
    };
  });
}
(async () => {
  const browser = await chromium.launch({ channel:'chrome' });
  try {
    for (const [width,height] of [[320,480],[320,560],[360,640],[390,844],[412,915],[760,800],[1440,640],[1440,900],[1920,1080]]) {
      const page = await browser.newPage({viewport:{width,height},isMobile:width<=800,hasTouch:width<=800});
      page.on('pageerror',e=>errors.push(e.message));
      await page.route('**/*',r=>['GET','HEAD','OPTIONS'].includes(r.request().method())?r.continue():r.abort());
      await page.goto(url,{waitUntil:'load',timeout:120000});
      await page.waitForFunction(()=>document.querySelector('[data-team]')?.dataset.teamProgress);
      await page.evaluate(()=>document.fonts.ready);
      await page.evaluate(()=>{const f=document.querySelector('footer[class*=footerTrack]');scrollTo({top:scrollY+f.getBoundingClientRect().top-innerHeight*.4,behavior:'instant'})});
      await page.waitForTimeout(500);
      let s=await measure(page);
      assert.equal(s.visibility,'hidden','Wordmark must not grow before the footer pins');
      for (const fraction of [0,.25,.5,.9,1,.5,.25]) {
        await pose(page,fraction);
        s=await measure(page);
        assert.ok(Math.abs(s.stage.top)<2,`Stage drifts at ${width}x${height} ${fraction}: ${JSON.stringify(s)}`);
        assert.ok(Math.abs(s.stage.height-height)<2,'Stage must fill the viewport');
        assert.ok(s.groupContainsLogo,'Logo must belong to the contact group');
        assert.ok(s.bottomCovered,'Footer must cover the bottom of the viewport');
        if(width<=800){assert.equal(s.desktop,'none');assert.notEqual(s.mobile,'none')}
        else {assert.equal(s.mobile,'none');assert.notEqual(s.desktop,'none')}
        const p=Math.min(1,fraction/.9), expected=p*p*(3-2*p);
        assert.ok(Math.abs(s.scale-expected)<.015,`Incorrect stretch at ${width}x${height} ${fraction}`);
        if (fraction>0) {
          assert.equal(s.visibility,'visible');
          assert.ok(Math.abs(s.mark.top-s.contacts.bottom-24)<2,'Wordmark top must stay pinned beneath contacts');
          assert.ok(s.mark.bottom<=s.legal.top-23,'Wordmark must clear the copyright');
        }
        if(fraction>=.9)assert.ok(Math.abs(s.mark.bottom-s.legal.top+24)<2,'Full wordmark must fill all available space');
        results.push({width,height,fraction,scale:s.scale,mark:s.mark,contacts:s.contacts,legal:s.legal});
      }
      await pose(page,.5);
      await page.screenshot({path:path.join(__dirname,`footer-half-${width}-${height}.png`),scale:'css'});
      await pose(page,1);
      await page.screenshot({path:path.join(__dirname,`footer-final-${width}-${height}.png`),scale:'css'});
      await page.getByRole('button',{name:'J StaR Films Studios, back to the beginning',exact:true}).click();
      await page.waitForTimeout(800);
      assert.ok(await page.evaluate(()=>scrollY<2),'Logo must still return to the opening');
      await page.close();
    }
    const page=await browser.newPage({viewport:{width:390,height:700},isMobile:true,hasTouch:true});
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(url,{waitUntil:'load',timeout:120000});
    await page.waitForFunction(()=>document.querySelector('[data-team]')?.dataset.teamProgress);
    for(const height of [700,844,700,844]){
      await page.setViewportSize({width:390,height});await page.waitForTimeout(300);await pose(page,1);
      const s=await measure(page);assert.ok(Math.abs(s.stage.height-height)<2&&s.bottomCovered);assert.ok(Math.abs(s.mark.bottom-s.legal.top+24)<2);
      results.push({resize:height,mark:s.mark});
    }
    for(const [width,height] of [[320,480],[390,844],[1440,900]]){
      await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(500);await pose(page,0);
      const s=await measure(page);assert.ok(Math.abs(s.track.height-s.stage.height)<2,'Reduced motion must remove extra travel');assert.equal(s.scale,1);assert.ok(s.mark.bottom<=s.legal.top-23);
      results.push({reduced:[width,height],mark:s.mark});
    }
    await page.close();assert.deepEqual(errors,[]);
    fs.writeFileSync(path.join(__dirname,'footer-results.json'),JSON.stringify({results,errors},null,2));
    console.log(JSON.stringify({passed:true,checks:results.length,errors}));
  } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
