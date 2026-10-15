const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ts=require('typescript');
const root=path.resolve(__dirname,'..');
const compiled=new Map();
const plain=value=>JSON.parse(JSON.stringify(value));
function load(file,dependencies,env={}){
 if(!compiled.has(file))compiled.set(file,ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText);
 const module={exports:{}};
 vm.runInNewContext(compiled.get(file),{module,exports:module.exports,require:id=>{
  if(!(id in dependencies))throw Error('Unmocked dependency '+id);
  return dependencies[id];
 },process:{env},console:{log(){},warn(){},error(){}}},{filename:file});
 return module.exports;
}
function mailer(outcomes=[],env={RESEND_API_KEY:'re_test'}){
 const calls=[];
 class Resend{
  emails={send:async payload=>{
   calls.push(plain(payload));
   const result=outcomes.shift()??{data:{id:'mail-'+calls.length},error:null};
   if(result instanceof Error)throw result;
   return result;
  }};
 }
 return {api:load('src/lib/email.ts',{resend:{Resend},'@/content/contact':load('src/content/contact.ts',{})},env),calls};
}
const submission={id:'submission-1',name:'Ada <script>',email:'visitor@example.invalid',phone:'+234 (123)',subject:'Film <b>request</b>',service:'Film & Software',message:'Please film <img src=x> & edit "this".',newsletter:false,submittedAt:new Date('2026-10-15T00:00:00Z')};

test('company defaults, team/visitor routing and escaped HTML',async()=>{
 const {api,calls}=mailer();
 assert.equal((await api.sendAdminNotification(submission)).success,true);
 assert.equal((await api.sendUserConfirmation(submission.email,submission.name,false)).success,true);
 assert.equal((await api.sendNewsletterSignupConfirmation(submission.email,submission.name)).success,true);
 assert.equal(calls.length,3);
 for(const call of calls)assert.equal(call.from,'J StaR Films Studios <hey@jstarstudios.com>');
 assert.deepEqual(calls[0].to,['hey@jstarstudios.com']);
 assert.equal(calls[0].replyTo,submission.email);
 for(const call of calls.slice(1)){
  assert.deepEqual(call.to,[submission.email]);
  assert.equal(call.replyTo,'hey@jstarstudios.com');
  assert(!call.html.includes('<script>'));
  assert(call.html.includes('Ada &lt;script&gt;'));
 }
 assert(!calls[0].html.includes('<img src=x>'));
 assert(calls[0].html.includes('Film &amp; Software'));
 assert(calls[0].html.includes('&lt;img src=x&gt; &amp; edit &quot;this&quot;'));
});

test('every template uses approved website/social links and no fake unsubscribe',async()=>{
 const {api,calls}=mailer();
 await api.sendAdminNotification(submission);
 await api.sendUserConfirmation(submission.email,submission.name,false);
 await api.sendNewsletterSignupConfirmation(submission.email,submission.name);
 for(const {html} of calls){
  for(const url of ['https://jstarstudios.com','https://www.instagram.com/j_starr.films/','https://youtube.com/@jstarfilms','https://www.linkedin.com/company/j-star-films-studios/'])assert(html.includes(`href="${url}"`),url);
  assert(!html.includes('https://jstarfilms.com'));
  assert(!html.includes('linkedin.com/in/'));
  assert(!html.includes('instagram.com/jstarfilms'));
  assert(!html.includes('href="#"'));
  assert(!html.includes('linear-gradient'));
  assert(html.includes('src="https://jstarstudios.com/redesign/email-studio-logo.png"'));
  assert(html.includes('background="https://jstarstudios.com/redesign/email-grain.png"'));
  assert(html.includes('bgcolor="#001514"'));
  assert(html.includes('class="email-brand"'));
  assert(!html.includes('data:image/'));
  assert(Buffer.byteLength(html)<100000,'Actual email HTML must stay below common clipping limits');
 }
 assert(calls[1].html.includes('https://jstarstudios.com/#selected-work'));
 assert(!calls[1].html.includes('Reference submission-1'));
 assert(!calls[1].html.includes('24 hours'));
 assert(calls[2].html.includes('mailto:hey@jstarstudios.com?subject=Unsubscribe'));
});

test('preserves existing recipient/key names and configurable environment sender',async()=>{
 const {api,calls}=mailer([],{RESEND_API_KEY:'re_test',ADMIN_EMAIL:' team@example.invalid ',EMAIL_FROM:'J StaR Preview <hey@jstarstudios.com>'});
 await api.sendAdminNotification(submission);
 await api.sendUserConfirmation(submission.email,'Ada',false);
 assert.equal(calls[0].from,'J StaR Preview <hey@jstarstudios.com>');
 assert.deepEqual(calls[0].to,['team@example.invalid']);
 assert.equal(calls[1].replyTo,'team@example.invalid');
 assert.deepEqual(calls[1].to,[submission.email]);
});

for(const key of [undefined,'','your_resend_api_key_here','not-a-resend-key'])test('missing/invalid key sends nothing: '+String(key),async()=>{
 const {api,calls}=mailer([],{RESEND_API_KEY:key});
 assert.equal((await api.sendAdminNotification(submission)).success,false);
 assert.equal(calls.length,0);
});

for(const [label,outcome]of [
 ['provider rejection',{data:null,error:{message:'Sender rejected'}}],
 ['missing message ID',{data:{},error:null}],
 ['blank message ID',{data:{id:' '},error:null}],
 ['thrown provider failure',new Error('Mock provider unavailable')],
])test('does not claim acceptance for '+label,async()=>{
 const {api,calls}=mailer([outcome]);
 const result=await api.sendAdminNotification(submission);
 assert.equal(result.success,false);assert.equal(typeof result.error,'string');assert.equal(calls.length,1);
});

function contact(outcomes=[],options={}){
 const emails=mailer(outcomes,options.env??{RESEND_API_KEY:'re_test'});
 const writes=[];
 class PrismaClient{
  contactSubmission={create:async args=>{writes.push({kind:'submission',...plain(args)});if(options.dbFailure)throw Error('Mock database failure');return{id:'saved-1'}}};
  newsletterSubscriber={upsert:async args=>{writes.push({kind:'newsletter',...plain(args)});return{}}};
  contactAnalytics={upsert:async args=>{writes.push({kind:'analytics',...plain(args)});return{}}};
 }
 const route=load('src/app/api/contact/route.ts',{
  '@prisma/client':{PrismaClient},
  '@/lib/email':emails.api,
  'next/server':{NextResponse:{json:(body,init)=>new Response(JSON.stringify(body),{status:init?.status??200,headers:{'content-type':'application/json'}})}},
 });
 const body={name:'Ada <script>',email:submission.email,phone:' +234 (123) ',subject:'Film project',service:'Film',message:'Please film our project.',newsletter:false};
 const request=(data=body)=>new Request('http://localhost.invalid/api/contact',{method:'POST',headers:{'content-type':'application/json','x-forwarded-for':'test-client'},body:JSON.stringify(data)});
 return {route,calls:emails.calls,writes,request,body};
}

test('database save and both provider acceptances return success in team-first order',async()=>{
 const {route,request,calls,writes}=contact();const response=await route.POST(request());const result=await response.json();
 assert.equal(response.status,200);assert.equal(result.status,'success');assert.equal(result.data.saved,true);
 assert.deepEqual(result.data.emailAcceptance,{notification:true,acknowledgement:true,newsletter:null});
 assert.equal(writes[0].kind,'submission');assert.equal(writes[0].data.phone,'+234 (123)');
 assert.deepEqual(calls.map(c=>c.to),[['hey@jstarstudios.com'],[submission.email]]);
});

test('team rejection reports saved partial and sends no visitor acknowledgement',async()=>{
 const {route,request,calls,writes}=contact([{data:null,error:{message:'Denied'}}]);const response=await route.POST(request());const result=await response.json();
 assert.equal(response.status,202);assert.equal(result.status,'partial');assert.equal(result.data.id,'saved-1');
 assert.equal(result.data.emailAcceptance.notification,false);assert.equal(result.data.emailAcceptance.acknowledgement,false);
 assert.equal(calls.length,1);assert.equal(writes.filter(w=>w.kind==='submission').length,1);
 assert.match(result.message,/saved.*team notification/);assert.match(result.message,/do not resubmit/);
});

test('acknowledgement-only failure never repeats the accepted team message',async()=>{
 const {route,request,calls}=contact([{data:{id:'team-accepted'},error:null},{data:null,error:{message:'Recipient rejected'}}]);const response=await route.POST(request());const result=await response.json();
 assert.equal(response.status,202);assert.equal(result.status,'partial');
 assert.equal(result.data.emailAcceptance.notification,true);assert.equal(result.data.emailAcceptance.acknowledgement,false);
 assert.equal(calls.length,2);assert.match(result.message,/acknowledgement/);
});

test('missing configuration reports saved partial without a provider call',async()=>{
 const {route,request,calls}=contact([],{env:{}});const response=await route.POST(request());
 assert.equal(response.status,202);assert.equal((await response.json()).data.saved,true);assert.equal(calls.length,0);
});

test('newsletter acceptance remains separate and addressed to the visitor',async()=>{
 const {route,request,body,calls,writes}=contact([{data:{id:'team'},error:null},{data:{id:'ack'},error:null},{data:null,error:{message:'Newsletter rejected'}}]);
 const response=await route.POST(request({...body,newsletter:true}));const result=await response.json();
 assert.equal(response.status,202);assert.equal(result.data.emailAcceptance.notification,true);assert.equal(result.data.emailAcceptance.acknowledgement,true);assert.equal(result.data.emailAcceptance.newsletter,false);
 assert.deepEqual(calls.map(c=>c.to),[['hey@jstarstudios.com'],[submission.email],[submission.email]]);
 assert(writes.some(w=>w.kind==='newsletter'));
});

test('team failure stops both visitor messages for a newsletter opt-in',async()=>{
 const {route,request,body,calls}=contact([{data:null,error:{message:'Denied'}}]);
 assert.equal((await route.POST(request({...body,newsletter:true}))).status,202);assert.equal(calls.length,1);
});

test('database failure and invalid input send no email',async()=>{
 const failed=contact([],{dbFailure:true});assert.equal((await failed.route.POST(failed.request())).status,500);assert.equal(failed.calls.length,0);
 const invalid=contact();assert.equal((await invalid.route.POST(invalid.request({...invalid.body,email:'bad\r\nemail'}))).status,400);assert.equal(invalid.writes.length,0);assert.equal(invalid.calls.length,0);
});

test('existing per-IP rate limit remains three requests',async()=>{
 const {route,request,calls,writes}=contact();for(let i=0;i<3;i++)assert.equal((await route.POST(request())).status,200);
 assert.equal((await route.POST(request())).status,429);assert.equal(calls.length,6);assert.equal(writes.filter(w=>w.kind==='submission').length,3);
});
