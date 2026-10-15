const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const report = { started:new Date().toISOString(), url:'http://127.0.0.1:5782/redesign', sourceFingerprint:require('./baseline.json').sourceFingerprint, checks:[], limitation:'Chrome accessibility tree and DOM checks, not real screen-reader, phone toolbar or Safari certification. No screenshots.' };
(async () => {
  const browser = await chromium.launch({ channel:'chrome' });
  try {
    for (const viewport of [{width:1440,height:900},{width:390,height:844},{width:320,height:480}]) {
      const page = await browser.newPage({ viewport, hasTouch:viewport.width<800, isMobile:viewport.width<800 });
      const check = { viewport, errors:[], blockedPosts:0 };
      report.checks.push(check);
      page.on('pageerror',e=>check.errors.push(e.message));
      await page.route('**/api/contact',r=>{ if(r.request().method()==='POST'){check.blockedPosts++;return r.abort('blockedbyclient')}return r.continue() });
      try {
        await page.goto(report.url,{waitUntil:'domcontentloaded',timeout:60000});
        await page.waitForSelector('[data-font-ready="true"]',{timeout:30000});
        const nav=page.locator('#studio-navigation');
        await nav.locator('a[href="#meet-the-studio"]').click();
        await page.waitForTimeout(1000);
        check.studio=await page.locator('[data-team]').evaluate(e=>({top:e.getBoundingClientRect().top,progress:Number(e.dataset.teamProgress)}));
        // jumpToIntro intentionally skips the entry wipe and lands at intro progress .4.
        assert(Math.abs(check.studio.progress-.4)<.03,'Studio did not land at the approved team intro');
        await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
        await page.waitForTimeout(500);
        await nav.locator('a[href="#selected-work"]').click();
        await page.waitForFunction(()=>document.querySelector('[data-gallery]')?.dataset.settled==='true');
        assert.equal(await page.locator('[data-gallery]').getAttribute('data-committed-id'),'adaptive-study-game');
        check.workFirstProject=true;
        await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
        await page.waitForTimeout(500);
        await nav.locator('a[href="#project-enquiry"]').click();
        await page.waitForTimeout(1000);
        await page.locator('input[name="name"]').fill('Unsubmitted QA fixture');
        await page.locator('input[name="email"]').fill('qa@example.invalid');
        const cdp=await page.context().newCDPSession(page);
        await cdp.send('Accessibility.enable');
        const {nodes}=await cdp.send('Accessibility.getFullAXTree');
        const unnamed=nodes.filter(n=>!n.ignored && ['button','link','textbox','slider','combobox'].includes(n.role?.value) && !n.name?.value).map(n=>({role:n.role.value,nodeId:n.nodeId}));
        const inputs=nodes.filter(n=>!n.ignored && n.role?.value==='textbox').map(n=>n.name?.value);
        check.accessibility={exposedUnnamedControls:unnamed,textboxNames:inputs};
        assert.equal(unnamed.length,0,'Accessible controls lack names');
        assert(inputs.length>=2,'Enquiry fields not exposed in accessibility tree');
        await cdp.detach();
        await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));
        await page.waitForTimeout(500);
        const footer=page.locator('footer');
        const logo=footer.getByRole('button',{name:'J StaR Films Studios, back to the beginning',exact:true});
        const box=await logo.boundingBox();
        assert(box,'Footer logo hidden');
        if(viewport.width>800){assert(Math.abs(box.x+box.width/2-viewport.width/2)<1);assert.equal(box.width,200)}
        else {assert.equal(box.width,80);assert(box.x+box.width/2>viewport.width/2)}
        check.footerLogo=box;
        check.wordmark=await footer.locator('[data-wordmark-mobile], [data-wordmark-desktop]').evaluateAll(groups=>groups.filter(g=>getComputedStyle(g).display!=='none').map(g=>Array.from(g.querySelectorAll('text')).map(t=>t.textContent)));
        assert.equal(JSON.stringify(check.wordmark),JSON.stringify(viewport.width>800?[['J StaR Films','STUDIOS']]:[['J StaR','FILMS STUDIOS']]));
        await logo.click();
        await page.waitForFunction(()=>scrollY<2,null,{timeout:10000});
        await nav.locator('a[href="#project-enquiry"]').click();
        await page.waitForTimeout(700);
        assert.equal(await page.locator('input[name="email"]').inputValue(),'qa@example.invalid');
        assert.equal(check.blockedPosts,0);
        assert.deepEqual(check.errors,[]);
        check.result='pass';
      } catch(error){check.result='fail';check.failure=error.message;}
      await page.close();
      console.log(JSON.stringify(check));
    }
  } finally {
    report.finished=new Date().toISOString();
    report.passed=report.checks.every(c=>c.result==='pass');
    fs.writeFileSync(path.join(__dirname,'navigation-a11y-results.json'),JSON.stringify(report,null,2));
    await browser.close();
    if(!report.passed)process.exitCode=1;
  }
})().catch(e=>{console.error(e);process.exitCode=1;});
