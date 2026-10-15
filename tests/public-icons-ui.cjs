// Public website only. No screenshots, full software app access or mutating requests.
const assert=require('node:assert/strict');
const {chromium,webkit}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.CONTACT_TEST_BASE||'http://127.0.0.1:5782';
async function icon(locator){
 assert.equal(await locator.locator('svg.studio-icon').count(),1);
 await locator.locator('svg.studio-icon').waitFor({state:'visible'});
 const metrics=await locator.locator('svg.studio-icon').evaluate(svg=>({width:parseFloat(getComputedStyle(svg).width),height:svg.getBoundingClientRect().height,font:parseFloat(getComputedStyle(svg).fontSize),decorative:!!svg.closest('[aria-hidden="true"]'),focusable:svg.getAttribute('focusable')}));
 assert(metrics.width>0&&metrics.height>0);assert(Math.abs(metrics.width-metrics.font)<1);
 assert(metrics.decorative);assert.equal(metrics.focusable,'false');
}
(async()=>{
 const engine=process.env.TEST_BROWSER==='webkit'?'webkit':'chromium';
 const browser=await (engine==='webkit'?webkit.launch():chromium.launch({channel:'chrome'}));
 try{
  for(const width of [1440,390]){
   const page=await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce',serviceWorkers:'block'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.route('**/*',r=>['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
   try{
    await page.goto(base+'/#project-enquiry',{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForSelector('[data-font-ready="true"]');
    await page.waitForFunction(()=>!document.querySelector('#project-enquiry')?.closest('[inert]'));
    const form=page.locator('#project-enquiry');
    assert.equal(await form.locator('fieldset svg.studio-icon').count(),3);
    await icon(form.locator('button[type="submit"]'));
    await icon(form.getByRole('link',{name:/Continue on WhatsApp/}));
    for(const label of ['Previous client note','Next client note'])await icon(page.getByRole('button',{name:label,exact:true}));
    await page.evaluate(()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));
    const footer=page.locator('footer').filter({has:page.locator('a[href^="mailto:"]')});
    for(const selector of ['a[href^="mailto:"]','a[href^="tel:"]','a[href^="https://wa.me/"]','a[href*="instagram.com/"]','a[href*="youtube.com/"]'])await icon(footer.locator(selector));
    await icon(footer.getByRole('button',{name:'Back to top',exact:true}));
    assert.equal(await footer.locator('.studio-icon').count(),6);
    assert.equal(await page.locator('[aria-label="J StaR Films Studios"] svg.studio-icon').count(),0);
    await page.evaluate(()=>{window.location.hash='#selected-work'});
    await page.waitForFunction(()=>document.querySelector('[data-gallery]')?.getAttribute('aria-hidden')==='false');
    await page.locator('[data-project-id="nifemi"]').click();
    await page.waitForFunction(()=>document.querySelector('[data-gallery]')?.getAttribute('data-committed-id')==='nifemi');
    await icon(page.locator('[data-project-action][data-project-open-id="nifemi"]'));
    await page.locator('[data-project-action][data-project-open-id="nifemi"]').click();
    const back=page.getByRole('button',{name:'Back to browsing',exact:true});
    await back.waitFor();await icon(back);
    await icon(page.getByRole('button',{name:'Play film',exact:true}));
    await icon(page.getByRole('button',{name:'Open fullscreen cinema',exact:true}));
    await icon(page.getByRole('button',{name:'Previous project',exact:true}));
    await icon(page.getByRole('button',{name:'Next project',exact:true}));
    await page.getByRole('button',{name:'Read more',exact:true}).click();
    await icon(page.getByRole('button',{name:'Close detail',exact:true}));
    await page.getByRole('button',{name:'Close detail',exact:true}).click();
    await back.click();
    const actionGlyphs=await page.locator('a,button').evaluateAll(nodes=>nodes.map(n=>n.textContent).filter(text=>/[↗↘↙↖←→↑↓✓▶⛶Ⅱ↻]/.test(text||'')));
    assert.deepEqual(actionGlyphs,[]);assert.deepEqual(errors,[]);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1));
    console.log(`PASS ${engine} ${width}px: footer/form/gallery/player/detail SVGs, labels, text sizing and no emoji action glyphs`);
   }finally{await page.close()}
  }
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
