const {chromium}=require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const phase=process.argv[2]||'before';
 const browser=await chromium.launch({channel:'chrome'});
 const page=await browser.newPage({viewport:{width:390,height:600},hasTouch:true,isMobile:true});
 const report={phase,mode:'Labelled toolbar-height proxy: stable 600px scroll meter, visible viewport 600 to 700 to 600. Not actual browser-toolbar certification.',samples:[],errors:[]};
 page.on('pageerror',e=>report.errors.push(e.message));
 try{
  await page.goto('https://johnsax.tailb6e2d3.ts.net:3461/redesign',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForSelector('[data-font-ready="true"]',{timeout:60000});
  await page.addStyleTag({content:'span[class*="scrollMeter"]{height:600px!important}'});
  await page.evaluate(()=>{dispatchEvent(new Event('resize'));const track=document.querySelector('[data-denominator]');scrollTo(0,Number(track.dataset.denominator)*.95)});
  await page.waitForFunction(()=>document.querySelector('[data-screening]').dataset.screening==='true' && document.querySelector('[data-screening]').dataset.settled==='true',null,{timeout:15000});
  const sample=()=>page.evaluate(()=>{const film=document.querySelector('div[class*="filmFrame"]'),stage=film.parentElement,box=film.getBoundingClientRect(),css=getComputedStyle(stage);return{viewport:innerHeight,y:scrollY,film:{x:box.x,y:box.y,width:box.width,height:box.height},compositionHeight:stage.closest('[data-screening]').style.getPropertyValue('--hero-height'),tabletY:stage.style.getPropertyValue('--tablet-scene-y'),tabletScale:stage.style.getPropertyValue('--tablet-scene-scale'),gapBackground:getComputedStyle(stage,'::after').backgroundImage,stageHeight:stage.clientHeight}});
  report.samples.push(await sample());
  for(const height of [700,600]){await page.setViewportSize({width:390,height});await page.waitForTimeout(600);report.samples.push(await sample())}
  if(phase==='after'){
    for(const s of report.samples){assert.deepEqual(s.film,{x:0,y:0,width:390,height:600});assert.equal(s.tabletY,report.samples[0].tabletY);assert.equal(s.tabletScale,report.samples[0].tabletScale);assert.equal(s.y,report.samples[0].y)}
    assert.equal(report.samples[1].stageHeight,700);assert.match(report.samples[1].gapBackground,/linear-gradient/);assert.deepEqual(report.errors,[]);
  }
 }catch(e){report.failure=e.message;process.exitCode=1}
 finally{fs.writeFileSync(path.join(__dirname,phase+'-toolbar-proxy.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
