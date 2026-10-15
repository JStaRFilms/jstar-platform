// Read-only section navigation. All mutating HTTP requests are blocked; no screenshots.
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.CONTACT_TEST_BASE||'http://127.0.0.1:5782';
async function atSection(page,hash,reduced){
 await page.waitForFunction(({hash,reduced})=>{
  if(hash==='#selected-work'){
   const gallery=document.querySelector('[data-gallery]');
   if(!gallery||gallery.getAttribute('aria-hidden')!=='false'||gallery.dataset.committedId!=='adaptive-study-game')return false;
   if(reduced)return Math.abs(gallery.getBoundingClientRect().top)<3;
   const track=document.querySelector('section[data-browse-start]');
   return track&&Math.abs(window.scrollY-Number(track.dataset.browseStart))<3;
  }
  if(hash==='#meet-the-studio'){
   const section=document.querySelector('[data-team]');
   return section&&Math.abs(section.getBoundingClientRect().top+(reduced?0:window.innerHeight*(.8+.4*4.1/8.3)))<3;
  }
  const form=document.querySelector('#project-enquiry');
  return form&&!form.closest('[inert]')&&document.activeElement===form.querySelector('[name="name"]');
 },{hash,reduced},{timeout:15000});
}
(async()=>{
 const browser=await chromium.launch({channel:'chrome'});
 try{
  for(const width of [1440,390])for(const reduced of [false,true])for(const hash of ['#selected-work','#meet-the-studio','#project-enquiry']){
   const page=await browser.newPage({viewport:{width,height:844},reducedMotion:reduced?'reduce':'no-preference',serviceWorkers:'block'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.route('**/*',async route=>{
    if(!['GET','HEAD'].includes(route.request().method()))return route.abort();
    // Exercise a cold font arrival without changing any response bytes.
    if(route.request().url().endsWith('.woff2'))await new Promise(resolve=>setTimeout(resolve,150));
    return route.continue();
   });
   try{
    assert.equal((await page.goto(base+'/'+hash,{waitUntil:'domcontentloaded',timeout:60000})).status(),200);
    await page.waitForSelector('[data-font-ready="true"]');await atSection(page,hash,reduced);
    const video=await page.locator('video').first().elementHandle();
    const draft=page.locator('#project-enquiry textarea');
    // A hash change must use the same landing logic without replacing media or enquiry fields.
    await page.evaluate(()=>{window.location.hash='#project-enquiry'});await atSection(page,'#project-enquiry',reduced);
    await draft.fill('A retained draft while following section links.');
    await page.evaluate(()=>{window.location.hash='#meet-the-studio'});await atSection(page,'#meet-the-studio',reduced);
    await page.goBack();await atSection(page,'#project-enquiry',reduced);
    assert.equal(await draft.inputValue(),'A retained draft while following section links.');
    assert(await video.evaluate(node=>node.isConnected));
    assert.deepEqual(errors,[]);
    console.log(`PASS ${width}px ${reduced?'reduced':'normal'} ${hash}: initial landing, hash change/back, draft and media identity`);
   }catch(error){console.error(JSON.stringify({width,reduced,hash,url:page.url(),errors,position:await page.evaluate(()=>({scroll:window.scrollY,work:document.querySelector('[data-gallery]')?.dataset,teamTop:document.querySelector('[data-team]')?.getBoundingClientRect().top}))}));throw error}finally{await page.close()}
  }
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce',serviceWorkers:'block'});
  await page.route('**/*',r=>['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
  await page.goto(base+'/',{waitUntil:'domcontentloaded'});await page.waitForSelector('[data-font-ready="true"]');
  await page.locator('#studio-navigation a[href="#selected-work"]').click();
  assert.equal(new URL(page.url()).hash,'#selected-work');await atSection(page,'#selected-work',true);
  await page.goto(base+'/',{waitUntil:'domcontentloaded'});await page.waitForSelector('[data-font-ready="true"]');
  await page.locator('#studio-navigation a[href="#project-enquiry"]').click();
  assert.equal(new URL(page.url()).hash,'#project-enquiry');await atSection(page,'#project-enquiry',true);
  await page.close();console.log('PASS nav clicks update shareable fragment URLs');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
