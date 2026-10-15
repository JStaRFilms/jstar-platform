// Optional browser check. POSTs are fulfilled locally, never sent to the server.
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.CONTACT_TEST_BASE||'http://127.0.0.1:5782';
(async()=>{
 const browser=await chromium.launch({channel:'chrome'});
 try{
  for(const route of ['/','/redesign','/contact']){
   const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
   let posts=0;const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.route('**/*',r=>{
    if(r.request().method()!=='POST')return r.continue();
    if(new URL(r.request().url()).pathname!=='/api/contact')return r.abort();
    posts++;
    return r.fulfill({status:202,contentType:'application/json',body:JSON.stringify({status:'partial',message:'Your enquiry is saved, but we could not confirm the team notification email. Please do not resubmit.',data:{id:'mock-only',saved:true,emailAcceptance:{notification:false,acknowledgement:false,newsletter:null}}})});
   });
   try{
    assert.equal((await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:60000})).status(),200);
    if(route==='/'){
     await page.waitForSelector('[data-font-ready="true"]');
     await page.locator('#studio-navigation a[href="#project-enquiry"]').click();
     const form=page.locator('#project-enquiry');
     await form.locator('input[name="service"][value="Film"]').check();
     await form.locator('input[name="name"]').fill('Controlled UI test');
     await form.locator('input[name="email"]').fill('qa@example.invalid');
     await form.locator('textarea[name="brief"]').fill('A mocked submission, no real email or database write.');
     await form.locator('button[type="submit"]').click();
     await page.waitForFunction(()=>document.querySelector('#project-enquiry [data-status="partial"]'));
     assert(await form.locator('button[type="submit"]').isDisabled());
     assert.equal(await form.locator('input[name="email"]').inputValue(),'qa@example.invalid');
     await page.waitForTimeout(300);assert.equal(posts,1);
     await form.locator('textarea[name="brief"]').fill('An intentional edit can start a new enquiry.');
     assert(await form.locator('button[type="submit"]').isEnabled());
    }else{
     // The legacy header replaces its server skeleton after client hydration.
     await page.locator('nav[aria-label="Main navigation"]').waitFor();
     const form=page.locator('form').filter({has:page.locator('#message')});
     await form.locator('#name').fill('Controlled UI test');
     await form.locator('#email').fill('qa@example.invalid');
     await form.locator('#subject').fill('Mocked enquiry');
     await form.locator('#service').selectOption('wedding');
     await form.locator('#message').fill('A mocked submission, no real email or database write.');
     await form.locator('button[type="submit"]').click();
     await page.getByText('Your enquiry is saved, but we could not confirm the team notification email. Please do not resubmit.',{exact:true}).waitFor();
     assert(await form.locator('button[type="submit"]').isDisabled());
     assert.equal(await form.locator('#email').inputValue(),'qa@example.invalid');
     await page.waitForTimeout(300);assert.equal(posts,1);
     await form.locator('#message').fill('An intentional edit can start a new enquiry.');
     assert(await form.locator('button[type="submit"]').isEnabled());
    }
    assert.deepEqual(errors,[]);
    console.log('PASS '+route+': partial message, retained draft, unchanged resend blocked, edit allowed; POST intercepted');
   }catch(error){
    console.error(JSON.stringify({route,posts,errors,url:page.url()}));
    throw error;
   }finally{await page.close()}
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
