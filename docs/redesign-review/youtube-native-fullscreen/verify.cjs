const {chromium}=require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const report={url:'https://johnsax.tailb6e2d3.ts.net:3461/redesign',mode:'Ordinary HTTPS; labelled SDK/orientation stubs. Real browser fullscreen, no screenshots/app use or response replacement.',checks:[],errors:[]};
 const browser=await chromium.launch({channel:'chrome'});
 const page=await browser.newPage({viewport:{width:760,height:360},hasTouch:true,isMobile:true});
 page.on('pageerror',e=>report.errors.push(e.message));
 try{
  await page.addInitScript(()=>{
   window.__locks=[];window.__unlocks=0;window.__players=[];
   Object.defineProperty(screen.orientation,'lock',{configurable:true,value:async value=>window.__locks.push(value)});
   Object.defineProperty(screen.orientation,'unlock',{configurable:true,value:()=>window.__unlocks++});
   window.YT={Player:class{
    constructor(host,options){this.options=options;this.current=37;this.muted=false;this.frame=document.createElement('iframe');this.frame.src='about:blank';host.replaceWith(this.frame);window.__players.push(this);window.__latest=this;queueMicrotask(()=>options.events.onReady({target:this}))}
    getIframe(){return this.frame}getCurrentTime(){return this.current}getDuration(){return 100}getVolume(){return 100}isMuted(){return this.muted}
    playVideo(){this.options.events.onStateChange({data:1})}pauseVideo(){this.options.events.onStateChange({data:2})}seekTo(t){this.current=t}mute(){this.muted=true}unMute(){this.muted=false}setVolume(){}destroy(){this.frame.remove()}
   }};
  });
  await page.route('**/api/contact',r=>r.request().method()==='POST'?r.abort('blockedbyclient'):r.continue());
  await page.goto(report.url,{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForSelector('[data-font-ready="true"]',{timeout:60000});
  await page.getByRole('link',{name:'Work',exact:true}).click();
  for(const [id,width,height,orientation] of [['worship-medley',760,360,'landscape'],['forest-sequence',390,844,'portrait']]){
   await page.setViewportSize({width,height});
   await page.evaluate(id=>{const r=document.querySelector(`[data-project-id="${id}"]`),t=document.querySelector('[data-browse-start]');scrollTo(0,Number(t.dataset.browseStart)+Number(r.dataset.projectIndex)*Number(t.dataset.galleryStride))},id);
   await page.waitForFunction(()=>document.querySelector('[data-gallery]').dataset.settled==='true');
   await page.locator(`[data-project-id="${id}"]`).click();await page.locator('[data-project-action]').click();
   await page.waitForFunction(()=>!document.querySelector('[data-viewer-fullscreen]').disabled);
   await page.evaluate(()=>{window.__heldIframe=document.querySelector('[data-youtube-picture] iframe');window.__heldPlayer=window.__latest;window.__latest.current=63;window.__latest.muted=true});
   const vars=await page.evaluate(()=>window.__latest.options.playerVars);
   assert.equal(vars.controls,1);assert.equal(vars.fs,1);assert.equal(await page.locator('[data-youtube-picture] iframe').getAttribute('allowfullscreen'),'');
   await page.locator('[data-viewer-fullscreen]').click();
   await page.waitForFunction(()=>document.fullscreenElement===document.querySelector('[data-youtube-picture] iframe'));
   await page.waitForFunction(value=>window.__locks.at(-1)===value,orientation);
   const box=await page.locator('[data-youtube-picture] iframe').boundingBox();
   assert.deepEqual(box,{x:0,y:0,width,height});
   for(const s of ['[data-viewer-controls]','[data-back-to-browsing]','[data-viewer-navigation]','[data-viewer-ordinal]'])assert.equal(await page.locator(s).isVisible(),false,s+' remains exposed');
   assert(await page.evaluate(()=>document.activeElement===document.querySelector('[data-youtube-picture] iframe')));
   await page.evaluate(()=>document.exitFullscreen());
   await page.waitForFunction(()=>!document.fullscreenElement && document.querySelector('[data-portfolio-viewer]').dataset.expanded==='false' && document.querySelector('[data-portfolio-viewer]').dataset.notesPhase==='shown');
   const state=await page.evaluate(()=>({sameIframe:window.__heldIframe===document.querySelector('[data-youtube-picture] iframe'),samePlayer:window.__heldPlayer===window.__latest,time:window.__latest.current,muted:window.__latest.muted,popover:document.querySelector('[data-study-frame]').matches(':popover-open'),focus:document.activeElement===document.querySelector('[data-viewer-fullscreen]'),inert:document.querySelector('[data-portfolio-viewer] aside').inert}));
   assert.deepEqual(state,{sameIframe:true,samePlayer:true,time:63,muted:true,popover:true,focus:true,inert:false});
   assert(await page.locator('[data-viewer-controls]').isVisible());
   report.checks.push({id,box,nativeControls:vars.controls,nativeFullscreen:vars.fs,orientation,state});
   await page.locator('[data-back-to-browsing]').click();
   await page.waitForFunction(()=>document.querySelector('[data-gallery]').dataset.settled==='true');
  }
  assert.deepEqual(report.errors,[]);report.status='passed';
 }catch(e){report.status='failed';report.failure=e.stack;process.exitCode=1}
 finally{report.finished=new Date().toISOString();fs.writeFileSync(path.join(__dirname,'results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
