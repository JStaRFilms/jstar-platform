const {chromium}=require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const phase=process.argv[2]||'before';
const report={phase,url:'https://johnsax.tailb6e2d3.ts.net:3461/redesign',checks:[],errors:[],mode:'DOM-only. Orientation capability and YouTube SDK are labelled stubs; animation cancellation is deliberate. No screenshots/full application use.'};
(async()=>{
 const browser=await chromium.launch({channel:'chrome'});
 const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
 page.on('pageerror',e=>report.errors.push(e.message));
 await page.addInitScript(()=>{
   window.__rotations=[];window.__unlocks=0;
   let type='portrait-primary';
   Object.defineProperty(screen.orientation,'type',{configurable:true,get:()=>type});
   Object.defineProperty(screen.orientation,'lock',{configurable:true,value:async value=>{window.__rotations.push(value);type=value+'-primary'}});
   Object.defineProperty(screen.orientation,'unlock',{configurable:true,value:()=>{window.__unlocks++;type='portrait-primary'}});
   window.YT={Player:class{constructor(host,options){this.options=options;this.current=37;this.muted=false;window.__ownerYT=this;this.frame=document.createElement('iframe');this.frame.src='about:blank';host.replaceWith(this.frame);queueMicrotask(()=>options.events.onReady({target:this}))}getIframe(){return this.frame}getCurrentTime(){return this.current}getDuration(){return 100}getVolume(){return 100}isMuted(){return this.muted}playVideo(){this.options.events.onStateChange({data:1})}pauseVideo(){this.options.events.onStateChange({data:2})}seekTo(t){this.current=t}setVolume(){}mute(){this.muted=true}unMute(){this.muted=false}destroy(){this.frame.remove()}}};
 });
 await page.route('**/api/contact',r=>r.request().method()==='POST'?r.abort('blockedbyclient'):r.continue());
 const state=()=>page.locator('[data-portfolio-viewer]').evaluate(e=>{const n=e.querySelector('aside');return{expanded:e.dataset.expanded,phase:e.dataset.notesPhase,inert:n.inert,visibility:getComputedStyle(n).visibility,display:getComputedStyle(n).display}});
 const open=async id=>{
   await page.evaluate(id=>{const row=document.querySelector(`[data-project-id="${id}"]`),track=document.querySelector('[data-browse-start]');scrollTo(0,Number(track.dataset.browseStart)+Number(row.dataset.projectIndex)*Number(track.dataset.galleryStride))},id);
   await page.waitForFunction(()=>document.querySelector('[data-gallery]').dataset.settled==='true');
   await page.locator(`[data-project-id="${id}"]`).click();
   await page.locator('[data-project-action]').click();
   await page.waitForSelector(`[data-portfolio-viewer][data-project="${id}"]`);
 };
 const full=async()=>{await page.locator('[data-viewer-fullscreen]').click();await page.waitForFunction(()=>!!document.fullscreenElement);await page.waitForTimeout(700)};
 const close=async()=>{if(await page.evaluate(()=>!!document.fullscreenElement))await page.evaluate(()=>document.exitFullscreen());await page.locator('[data-back-to-browsing]').click();await page.waitForFunction(()=>document.querySelector('[data-gallery]').dataset.settled==='true')};
 try{
  await page.goto(report.url,{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForSelector('[data-font-ready="true"]',{timeout:60000});
  await page.getByRole('link',{name:'Work',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('[data-gallery]').dataset.settled==='true');
  await open('school-management-system');
  await full();
  const automatic=await page.evaluate(()=>window.__rotations.slice());
  report.checks.push({name:'software automatic orientation',locks:automatic});
  if(phase==='after'){
    assert.deepEqual(automatic,[]);
    const rotate=page.getByRole('button',{name:'Rotate display',exact:true});
    assert(await rotate.isVisible());assert.equal(await rotate.innerText(),'');assert.equal(await rotate.locator('svg').count(),1);
    await rotate.click();await page.waitForFunction(()=>window.__rotations.includes('landscape'));
    report.checks.push({name:'software manual rotation icon',requested:'landscape',visibleText:false});
  }
  await page.locator('[data-product-exit]').click();
  await page.waitForFunction(()=>!document.fullscreenElement);
  const cancelled=await page.locator('[data-viewer-sample-slot]').evaluate(slot=>{const animations=slot.parentElement.parentElement.getAnimations();animations.forEach(a=>a.cancel());return animations.length});
  await page.waitForTimeout(1500);
  const returned=await state();
  report.checks.push({name:'cancelled software return restores notes',cancelled,state:returned});
  if(phase==='after'){
    assert(cancelled>0);assert.equal(returned.phase,'shown');assert.equal(returned.inert,false);assert.equal(returned.visibility,'visible');
    assert(await page.evaluate(()=>window.__unlocks>0));
  }
  await close();
  if(phase==='after'){
    await open('school-management-system');await full();await page.locator('[data-product-exit]').click();
    await page.waitForFunction(()=>document.querySelector('[data-portfolio-viewer]').dataset.notesPhase==='entering');
    const cancelledNotes=await page.locator('[data-portfolio-viewer] aside').evaluate(e=>{const a=e.getAnimations();a.forEach(a=>a.cancel());return a.length});
    await page.waitForFunction(()=>document.querySelector('[data-portfolio-viewer]').dataset.notesPhase==='shown');
    assert(cancelledNotes>0);assert.equal((await state()).inert,false);
    report.checks.push({name:'cancelled notes slide restores interactivity',cancelledNotes});await close();
  }
  await page.setViewportSize({width:760,height:360});
  await open('sharon');
  if(phase==='after'){await page.waitForFunction(()=>document.querySelector('[data-viewer-picture] video').readyState>=2);await page.evaluate(()=>{window.__ownerNative=document.querySelector('[data-viewer-picture] video');window.__ownerNative.pause();window.__ownerNative.currentTime=8})}
  await full();
  report.checks.push({name:'native fullscreen header surface',style:await page.locator('[data-portfolio-viewer] header').first().evaluate(e=>{const s=getComputedStyle(e);return{background:s.backgroundColor,image:s.backgroundImage,border:s.borderTopWidth,backdrop:s.backdropFilter,textShadow:s.textShadow}})});
  await page.evaluate(()=>document.exitFullscreen());await page.waitForTimeout(1200);
  if(phase==='after'){
    const native=await page.evaluate(()=>({same:window.__ownerNative===document.querySelector('[data-viewer-picture] video'),time:window.__ownerNative.currentTime}));
    assert(native.same);assert(Math.abs(native.time-8)<.25);assert.equal((await state()).phase,'shown');
    report.checks.push({name:'browser-initiated native exit preserves node/time and notes',native});
  }
  await close();
  await open('worship-medley');
  if(phase==='after')await page.evaluate(()=>{window.__ownerIframe=document.querySelector('[data-youtube-picture] iframe');window.__ownerYT.current=63;window.__ownerYT.muted=true});
  await full();
  report.checks.push({name:'short landscape YouTube fullscreen',geometry:await page.locator('[data-youtube-picture] iframe').evaluate(e=>{const r=e.getBoundingClientRect();return{viewport:{width:innerWidth,height:innerHeight},iframe:{x:r.x,y:r.y,width:r.width,height:r.height}}})});
  if(phase==='after'){
    const header=report.checks.find(c=>c.name==='native fullscreen header surface').style;
    assert.equal(header.background,'rgba(0, 0, 0, 0)');assert.equal(header.image,'none');assert.equal(header.border,'0px');assert.equal(header.backdrop,'none');assert.notEqual(header.textShadow,'none');
    const box=report.checks.find(c=>c.name==='short landscape YouTube fullscreen').geometry;
    assert.deepEqual(box.iframe,{x:0,y:0,width:760,height:316});
    const controls=await page.locator('[data-viewer-controls]').boundingBox();assert(controls.y>=316 && controls.y+controls.height<=360);
    await page.locator('[data-viewer-fullscreen]').click();await page.waitForFunction(()=>!document.fullscreenElement && document.querySelector('[data-portfolio-viewer]').dataset.notesPhase==='shown');
    const youtube=await page.evaluate(()=>({same:window.__ownerIframe===document.querySelector('[data-youtube-picture] iframe'),time:window.__ownerYT.current,muted:window.__ownerYT.muted}));
    assert.deepEqual(youtube,{same:true,time:63,muted:true});report.checks.push({name:'YouTube return preserves iframe/time/mute and notes',youtube});
    assert.deepEqual(report.errors,[]);report.passed=true;
  }
 }catch(e){report.failure=e.message;process.exitCode=1}
 finally{fs.mkdirSync(__dirname,{recursive:true});fs.writeFileSync(path.join(__dirname,phase+'-reproduction.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
