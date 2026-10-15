// POSTs are fulfilled locally. Service workers are blocked so none can bypass interception.
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.CONTACT_TEST_BASE||'http://127.0.0.1:5782';
(async()=>{
 const browser=await chromium.launch({channel:'chrome'});
 try{
  for(const {route,width} of [{route:'/',width:1440},{route:'/',width:390},{route:'/redesign',width:1440},{route:'/contact',width:1440}]){
   for(const outcome of ['partial','success','duplicate']){
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce',serviceWorkers:'block'});
    await page.clock.install();
    let posts=0,release,seen;
    const held=new Promise(resolve=>{release=resolve}),requestSeen=new Promise(resolve=>{seen=resolve});
    const defer=route==='/'&&outcome==='success';
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/*',async r=>{
     if(['GET','HEAD'].includes(r.request().method()))return r.continue();
     if(r.request().method()!=='POST'||new URL(r.request().url()).pathname!=='/api/contact')return r.abort();
     posts++;seen();if(defer)await held;
     return r.fulfill({status:outcome==='partial'?202:200,contentType:'application/json',body:JSON.stringify({status:outcome,message:outcome==='partial'?'Your enquiry is saved, but we could not confirm the team notification email. Please do not resubmit.':outcome==='duplicate'?'We already have this enquiry. No duplicate email was sent. You do not need to submit it again.':'Message received successfully',retryAfter:outcome==='partial'?0:60,data:{id:'mock-only',saved:true}})});
    });
    try{
     assert.equal((await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:60000})).status(),200);
     let form;
     if(route==='/'){
      await page.waitForSelector('[data-font-ready="true"]');
      await page.locator('#studio-navigation a[href="#project-enquiry"]').click();
      form=page.locator('#project-enquiry');
      await form.locator('input[name="service"][value="Film"]').check();
      await form.locator('input[name="name"]').fill('Controlled UI test');
      await form.locator('input[name="email"]').fill('qa@example.invalid');
      await form.locator('textarea[name="brief"]').fill('Mocked only. No real email or database write.');
     }else{
      await page.locator('nav[aria-label="Main navigation"]').waitFor();
      form=page.locator('form').filter({has:page.locator('#message')});
      await form.locator('#name').fill('Controlled UI test');
      await form.locator('#email').fill('qa@example.invalid');
      await form.locator('#subject').fill('Mocked enquiry');
      await form.locator('#service').selectOption('wedding');
      await form.locator('#message').fill('Mocked only. No real email or database write.');
     }
     await form.locator('button[type="submit"]').click();
     if(defer){
      await requestSeen;
      assert(await form.locator('button[type="submit"]').isDisabled());
      assert.match(await form.locator('button[type="submit"]').innerText(),/Sending/);
      await form.evaluate(f=>f.requestSubmit());assert.equal(posts,1);release();
     }
     if(outcome==='partial'){
      await page.getByText('Your enquiry is saved, but we could not confirm the team notification email. Please do not resubmit.',{exact:true}).waitFor();
      assert(await form.locator('button[type="submit"]').isDisabled());
      assert.equal(await form.locator('input[name="email"]').inputValue(),'qa@example.invalid');
      await form.locator('textarea').fill('An intentional edit can start a new enquiry.');
      assert(await form.locator('button[type="submit"]').isEnabled());
     }else if(route==='/'){
      await form.locator('[data-status="success"]').waitFor();
      assert.equal(await form.locator('input[name="email"]').inputValue(),'qa@example.invalid');
      assert(await form.locator('input[name="name"]').isDisabled());
      assert.match(await form.locator('button[type="submit"]').innerText(),/Enquiry received/);
      assert(await form.locator('button[type="submit"]').isDisabled());
      assert.equal(await page.locator(':focus').getAttribute('id'),'enquiry-status');
      await form.evaluate(f=>f.requestSubmit());assert.equal(posts,1);
      await form.getByRole('button',{name:'Write another enquiry'}).click();
      assert.equal(await form.locator('input[name="email"]').inputValue(),'');
      assert(await form.locator('button[type="submit"]').isDisabled());
      await page.clock.fastForward(61000);
      assert(await form.locator('button[type="submit"]').isEnabled());
     }else{
      await page.getByText('Enquiry received',{exact:true}).first().waitFor();
      await page.clock.fastForward(6000);
      assert(await page.getByText('Enquiry received',{exact:true}).first().isVisible());
      if(route==='/contact')assert(await form.locator('button[type="submit"]').isDisabled());
     }
     assert.equal(posts,1);assert.deepEqual(errors,[]);
     console.log(`PASS ${route} ${width}px ${outcome}: visible receipt/partial state, repeat protection; POST intercepted`);
    }catch(error){console.error(JSON.stringify({route,width,outcome,posts,errors}));throw error}finally{release();await page.close()}
   }
  }
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce',serviceWorkers:'block'});
  await page.clock.install();let posts=0;
  await page.route('**/*',r=>{
   if(['GET','HEAD'].includes(r.request().method()))return r.continue();
   if(new URL(r.request().url()).pathname!=='/api/contact')return r.abort();
   posts++;return r.fulfill({status:429,headers:{'retry-after':'60'},contentType:'application/json',body:JSON.stringify({status:'error',message:'Please wait 60 seconds before sending another enquiry.',retryAfter:60})});
  });
  await page.goto(base+'/',{waitUntil:'domcontentloaded'});await page.waitForSelector('[data-font-ready="true"]');
  await page.locator('#studio-navigation a[href="#project-enquiry"]').click();
  const form=page.locator('#project-enquiry');
  await form.locator('input[value="Film"]').check();await form.locator('[name="name"]').fill('Cooldown test');await form.locator('[name="email"]').fill('qa@example.invalid');await form.locator('textarea').fill('Mocked cooldown only, never sent.');
  await form.locator('button[type="submit"]').click();await form.locator('[data-status="limited"]').waitFor();
  assert(await form.locator('button[type="submit"]').isDisabled());assert.equal(await form.locator('[name="email"]').inputValue(),'qa@example.invalid');
  await form.evaluate(f=>f.requestSubmit());assert.equal(posts,1);await page.clock.fastForward(61000);assert(await form.locator('button[type="submit"]').isEnabled());
  assert.match(await form.locator('[role="status"]').innerText(),/can now send/);await page.close();
  console.log('PASS / 390px cooldown: retry interval honoured, draft retained, no repeated POST');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
