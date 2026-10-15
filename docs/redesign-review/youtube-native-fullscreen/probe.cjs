const {chromium}=require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({channel:'chrome'});
 const page=await browser.newPage({viewport:{width:760,height:360},hasTouch:true,isMobile:true});
 const result={mode:'Browser prototype only: labelled SDK stub, trusted click requests iframe fullscreen directly. No screenshots or response replacement.'};
 try{
  await page.addInitScript(()=>{window.YT={Player:class{constructor(host,opts){this.frame=document.createElement('iframe');this.frame.src='about:blank';host.replaceWith(this.frame);queueMicrotask(()=>opts.events.onReady({target:this}))}getIframe(){return this.frame}getCurrentTime(){return 0}getDuration(){return 100}getVolume(){return 100}isMuted(){return false}pauseVideo(){}playVideo(){}seekTo(){}mute(){}unMute(){}setVolume(){}destroy(){this.frame.remove()}}}});
  await page.goto('https://johnsax.tailb6e2d3.ts.net:3461/redesign',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForSelector('[data-font-ready="true"]',{timeout:60000});
  await page.getByRole('link',{name:'Work',exact:true}).click();
  await page.evaluate(()=>{const t=document.querySelector('[data-browse-start]'),r=document.querySelector('[data-project-id="worship-medley"]');scrollTo(0,Number(t.dataset.browseStart)+Number(r.dataset.projectIndex)*Number(t.dataset.galleryStride))});
  await page.waitForFunction(()=>document.querySelector('[data-gallery]').dataset.settled==='true');
  await page.locator('[data-project-id="worship-medley"]').click();await page.locator('[data-project-action]').click();
  await page.waitForSelector('[data-youtube-picture] iframe');
  await page.locator('[data-viewer-fullscreen]').evaluate(button=>button.addEventListener('click',event=>{event.stopImmediatePropagation();document.querySelector('[data-youtube-picture] iframe').requestFullscreen().catch(e=>window.__probeError=e.message)},true));
  await page.locator('[data-viewer-fullscreen]').click();
  await page.waitForFunction(()=>!!document.fullscreenElement);
  result.entry=await page.evaluate(()=>{const frame=document.querySelector('[data-study-frame]'),iframe=document.querySelector('[data-youtube-picture] iframe'),r=iframe.getBoundingClientRect();return{iframeOwnsFullscreen:document.fullscreenElement===iframe,popoverStillOpen:frame.matches(':popover-open'),box:{x:r.x,y:r.y,width:r.width,height:r.height},viewport:{width:innerWidth,height:innerHeight},error:window.__probeError}});
  await page.evaluate(()=>document.exitFullscreen());
  result.exit=await page.evaluate(()=>({fullscreen:!!document.fullscreenElement,popover:document.querySelector('[data-study-frame]').matches(':popover-open')}));
 }catch(e){result.failure=e.message;process.exitCode=1}
 finally{fs.writeFileSync(path.join(__dirname,'iframe-probe.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
