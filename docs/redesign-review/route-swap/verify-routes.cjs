const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const base=process.env.ROUTE_BASE||'http://127.0.0.1:5782';
const report={started:new Date().toISOString(),base,checks:[],limits:'Chrome desktop/mobile emulation, no screenshots, real submission or full software app access. Device rotation and permanent dev-delivery reliability are not certified.'};
(async()=>{
 const browser=await chromium.launch({channel:'chrome'});
 try{
  for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
   const context=await browser.newContext({viewport,hasTouch:viewport.width<800,isMobile:viewport.width<800});
   const page=await context.newPage();let posts=0;const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.route('**/api/contact',r=>{if(r.request().method()==='POST'){posts++;return r.abort('blockedbyclient')}return r.continue()});
   for(const legacy of [false,true]){
    const check={viewport,route:legacy?'/redesign':'/',errors:[]};report.checks.push(check);errors.length=0;
    try{
     const response=await page.goto(base+check.route,{waitUntil:'domcontentloaded',timeout:90000});
     assert.equal(response.status(),200);assert.equal(new URL(page.url()).pathname,check.route);assert.equal(response.request().redirectedFrom(),null);
     const canonical=new URL(await page.locator('link[rel="canonical"]').getAttribute('href')).href;
     assert.equal(canonical,'https://www.jstarstudios.com'+(legacy?'/redesign':'/'));
     check.metadata={title:await page.title(),canonical,robots:await page.locator('meta[name="robots"]').getAttribute('content'),ogUrl:new URL(await page.locator('meta[property="og:url"]').getAttribute('content')).href};
     assert.equal(check.metadata.ogUrl,canonical);assert(!check.metadata.title.includes('Hero review'));
     assert(legacy?check.metadata.robots.includes('noindex'):!check.metadata.robots.includes('noindex'));
     if(!legacy){
      await page.waitForSelector('[data-font-ready="true"]',{timeout:45000});
      assert.equal(await page.locator('#studio-navigation').count(),1);
      assert.equal(await page.locator('nav.glassmorphism-header').count(),0);
      const hero=page.locator('video[src="/redesign/nifemi.mp4"]');assert(await hero.count()>=1);
      const nav=page.locator('#studio-navigation');
      await nav.locator('a[href="#selected-work"]').click();
      await page.waitForFunction(()=>document.querySelector('[data-gallery]')?.dataset.settled==='true');
      assert.equal(await page.locator('[data-gallery]').getAttribute('data-committed-id'),'adaptive-study-game');
      await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(500);
      await nav.locator('a[href="#meet-the-studio"]').click();await page.waitForTimeout(1000);
      const progress=await page.locator('[data-team]').getAttribute('data-team-progress');assert(Math.abs(Number(progress)-.4)<.03);
      await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(500);
      await nav.locator('a[href="#project-enquiry"]').click();await page.waitForTimeout(800);
      await page.locator('input[name="email"]').fill('qa@example.invalid');
      await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));await page.waitForTimeout(600);
      await page.locator('footer').getByRole('button',{name:'J StaR Films Studios, back to the beginning',exact:true}).click();
      await page.waitForFunction(()=>scrollY<2);
      await nav.locator('a[href="#project-enquiry"]').click();await page.waitForTimeout(800);
      assert.equal(await page.locator('input[name="email"]').inputValue(),'qa@example.invalid');
      check.newUi={workFirst:true,studioProgress:progress,enquiryDraftRetained:true,footerReturnsToTop:true};
     }else{
      await page.locator('nav[aria-label="Main navigation"]').waitFor({timeout:45000});
      assert.equal(await page.locator('#studio-navigation').count(),0);
      const main=page.locator('main').first();assert(!(await main.getAttribute('class')).includes('pt-12'));
      const section=page.locator('#about-section, #about').first();assert.equal(await section.count(),1);
      if(viewport.width>800)await page.getByRole('button',{name:'Scroll to about',exact:true}).click();
      else await page.locator('nav').filter({has:page.getByText('Home',{exact:true})}).getByRole('button',{name:'About',exact:true}).click();
      await page.waitForTimeout(1300);
      const top=(await section.boundingBox()).y;assert(top<160&&top>-160,'Legacy About button did not scroll its section: '+top);
      assert.equal(new URL(page.url()).pathname,'/redesign');
      if(viewport.width<800){await page.locator('nav').filter({has:page.getByText('Home',{exact:true})}).getByRole('button',{name:'Home',exact:true}).click();await page.waitForFunction(()=>scrollY<2);}
      check.legacyUi={globalChrome:true,originalPadding:true,sectionScroll:true};
      if(viewport.width>800){
       await page.getByRole('button',{name:'Scroll to about',exact:true}).hover();
       await page.mouse.down();await page.waitForURL('**/about');await page.mouse.up();
       await page.getByRole('link',{name:'J StaR Films homepage',exact:true}).click();
      }else{await page.goto(base+'/about',{waitUntil:'domcontentloaded'});await page.getByRole('link',{name:'J StaR Films homepage',exact:true}).click();}
      await page.waitForURL(base+'/');await page.waitForSelector('[data-font-ready="true"]');
      assert.equal(await page.locator('#studio-navigation').count(),1);assert.equal(await page.locator('nav.glassmorphism-header').count(),0);
      check.secondaryPageHomeReturnsToNewUi=true;
     }
     assert.equal(posts,0);assert.deepEqual(errors,[]);check.result='pass';
    }catch(e){check.result='fail';check.failure=e.message;check.errors=[...errors];}
    console.log(JSON.stringify(check));
   }
   await context.close();
  }
 }finally{report.finished=new Date().toISOString();report.passed=report.checks.every(c=>c.result==='pass');fs.writeFileSync(path.join(__dirname,process.env.ROUTE_RECEIPT||'route-results.json'),JSON.stringify(report,null,2));await browser.close();if(!report.passed)process.exitCode=1;}
})().catch(e=>{console.error(e);process.exitCode=1});
