const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ts=require('typescript');
const root=path.resolve(__dirname,'..');
const compiled=new Map();
const plain=value=>JSON.parse(JSON.stringify(value));
function load(file,dependencies,env={},DateClass=Date){
 if(!compiled.has(file))compiled.set(file,ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText);
 const module={exports:{}};
 vm.runInNewContext(compiled.get(file),{module,exports:module.exports,require:id=>{
  if(!(id in dependencies))throw Error('Unmocked dependency '+id);
  return dependencies[id];
 },process:{env},Date:DateClass,console:{log(){},warn(){},error(){}}},{filename:file});
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
 const writes=[],locks=[],transactions=[];
 const store=options.store??{records:[],now:Date.now(),tail:Promise.resolve()};
 class ClockDate extends Date{constructor(value){super(value??store.now)}static now(){return store.now}}
 function matches(row,where){
  return Object.entries(where).every(([key,value])=>{
   if(key==='OR')return value.some(condition=>matches(row,condition));
   if(key==='submittedAt')return row.submittedAt>=value.gte;
   if(key==='email'&&typeof value==='object')return row.email.toLowerCase()===value.equals.toLowerCase();
   return row[key]===value;
  });
 }
 function query(args){
  return store.records.filter(row=>matches(row,args.where)).sort((a,b)=>b.submittedAt-a.submittedAt).slice(0,args.take??Infinity)
   .map(row=>Object.fromEntries(Object.keys(args.select).map(key=>[key,row[key]])));
 }
 class PrismaClient{
  async $transaction(action,configuration){
   transactions.push(plain(configuration));
   const previous=store.tail;let release;store.tail=new Promise(resolve=>{release=resolve});await previous;
   try{return await action(this)}finally{release()}
  }
  $queryRaw=async(strings,...values)=>{locks.push({sql:strings.join('?'),key:values[0]});return[{locked:1}]};
  contactSubmission={
   findFirst:async args=>query(args)[0]??null,
   findMany:async args=>query(args),
   create:async args=>{writes.push({kind:'submission',...plain(args)});if(options.dbFailure)throw Error('Mock database failure');const record={...args.data,id:'saved-'+(store.records.length+1),submittedAt:new Date(store.now)};store.records.push(record);return record},
  };
  newsletterSubscriber={upsert:async args=>{writes.push({kind:'newsletter',...plain(args)});return{}}};
  contactAnalytics={upsert:async args=>{writes.push({kind:'analytics',...plain(args)});return{}}};
 }
 const route=load('src/app/api/contact/route.ts',{
  '@prisma/client':{PrismaClient},
  '@/lib/email':emails.api,
  'next/server':{NextResponse:{json:(body,init)=>new Response(JSON.stringify(body),{status:init?.status??200,headers:{'content-type':'application/json',...init?.headers}})}},
 },{},ClockDate);
 const body={name:'Ada <script>',email:submission.email,phone:' +234 (123) ',subject:'Film project',service:'Film',message:'Please film our project.',newsletter:false};
 const request=(data=body,headers={})=>new Request('http://localhost.invalid/api/contact',{method:'POST',headers:{'content-type':'application/json','x-forwarded-for':'test-client',...headers},body:JSON.stringify(data)});
 return {route,calls:emails.calls,writes,request,body,store,locks,transactions};
}

test('database save and both provider acceptances return success in team-first order',async()=>{
 const {route,request,calls,writes}=contact();const response=await route.POST(request());const result=await response.json();
 assert.equal(response.status,200);assert.equal(result.status,'success');assert.equal(result.data.saved,true);
 assert.deepEqual(result.data.emailAcceptance,{notification:true,acknowledgement:true,newsletter:null});
 assert.equal(writes[0].kind,'submission');assert.equal(writes[0].data.phone,'+234 (123)');
 assert.deepEqual(calls.map(c=>c.to),[['hey@jstarstudios.com'],[submission.email]]);
 assert(calls[1].html.includes('YOUR ENQUIRY'));assert(calls[1].html.includes('Please film our project.'));
});

test('team rejection reports saved partial and sends no visitor acknowledgement',async()=>{
 const {route,request,calls,writes}=contact([{data:null,error:{message:'Denied'}}]);const response=await route.POST(request());const result=await response.json();
 assert.equal(response.status,202);assert.equal(result.status,'partial');assert.equal(result.data.id,'saved-1');
 assert.equal(result.data.emailAcceptance.notification,false);assert.equal(result.data.emailAcceptance.acknowledgement,false);
 assert.equal(calls.length,1);assert.equal(writes.filter(w=>w.kind==='submission').length,1);
 assert.equal(result.message,'Your enquiry is saved. We had trouble emailing our team. Please do not submit it again. If it is urgent, contact us directly.');
});

test('acknowledgement-only failure never repeats the accepted team message',async()=>{
 const {route,request,calls}=contact([{data:{id:'team-accepted'},error:null},{data:null,error:{message:'Recipient rejected'}}]);const response=await route.POST(request());const result=await response.json();
 assert.equal(response.status,202);assert.equal(result.status,'partial');
 assert.equal(result.data.emailAcceptance.notification,true);assert.equal(result.data.emailAcceptance.acknowledgement,false);
 assert.equal(calls.length,2);assert.equal(result.message,'Your enquiry is saved. We had trouble sending your confirmation email. Please do not submit it again.');
});

test('missing configuration reports saved partial without a provider call',async()=>{
 const {route,request,calls}=contact([],{env:{}});const response=await route.POST(request());
 assert.equal(response.status,202);assert.equal((await response.json()).data.saved,true);assert.equal(calls.length,0);
});

test('newsletter acceptance remains separate and addressed to the visitor',async()=>{
 const {route,request,body,calls,writes}=contact([{data:{id:'team'},error:null},{data:{id:'ack'},error:null},{data:null,error:{message:'Newsletter rejected'}}]);
 const response=await route.POST(request({...body,newsletter:true}));const result=await response.json();
 assert.equal(response.status,202);assert.equal(result.data.emailAcceptance.notification,true);assert.equal(result.data.emailAcceptance.acknowledgement,true);assert.equal(result.data.emailAcceptance.newsletter,false);
 assert.equal(result.message,'Your enquiry is saved. We had trouble sending your newsletter welcome email. Please do not submit it again.');
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

test('saved submissions enforce three per fifteen minutes, including across fresh route instances',async()=>{
 const first=contact();
 for(let i=0;i<3;i++){
  const runtime=i===0?first:contact([],{store:first.store});
  assert.equal((await runtime.route.POST(runtime.request({...runtime.body,subject:'Project '+i}))).status,200);
  first.store.now+=61000;
 }
 const fresh=contact([],{store:first.store});
 const response=await fresh.route.POST(fresh.request({...fresh.body,subject:'Fourth project'}));
 assert.equal(response.status,429);assert(Number(response.headers.get('retry-after'))>60);
 assert.equal(first.store.records.length,3);assert.equal(fresh.calls.length,0);
 first.store.now+=15*60*1000;
 assert.equal((await fresh.route.POST(fresh.request({...fresh.body,subject:'After the window'}))).status,200);
});

test('one-minute cooldown applies to the same IP or email and expires',async()=>{
 const runtime=contact();await runtime.route.POST(runtime.request());
 for(const [data,headers]of [[{...runtime.body,subject:'Another project',email:'another@example.invalid'},{}],[{...runtime.body,subject:'Another project',email:runtime.body.email.toUpperCase()},{'x-forwarded-for':'different-client'}]]){
  const response=await runtime.route.POST(runtime.request(data,headers));
  assert.equal(response.status,429);assert.equal(response.headers.get('retry-after'),'60');assert.equal((await response.json()).retryAfter,60);
 }
 assert.equal(runtime.store.records.length,1);assert.equal(runtime.calls.length,2);
 runtime.store.now+=61000;
 assert.equal((await runtime.route.POST(runtime.request({...runtime.body,subject:'Another project'}))).status,200);
});

test('identical retry across runtimes is received without another save, analytics update or send',async()=>{
 const first=contact();await first.route.POST(first.request());
 const fresh=contact([],{store:first.store});
 const response=await fresh.route.POST(fresh.request());const result=await response.json();
 assert.equal(response.status,200);assert.equal(result.status,'duplicate');assert.equal(result.data.saved,true);
 assert.equal(result.data.id,'saved-1');assert.equal(result.data.emailAcceptance,undefined);
 assert.match(result.message,/No duplicate email/);assert.equal(fresh.calls.length,0);assert.equal(fresh.writes.length,0);
 assert.equal(first.store.records.length,1);
});

test('parallel identical requests share the transaction guard and send one pair only',async()=>{
 const first=contact(),second=contact([],{store:first.store});
 const responses=await Promise.all([first.route.POST(first.request()),second.route.POST(second.request())]);
 assert.deepEqual((await Promise.all(responses.map(r=>r.json()))).map(r=>r.status).sort(),['duplicate','success']);
 assert.equal(first.calls.length+second.calls.length,2);assert.equal(first.store.records.length,1);
 for(const runtime of [first,second]){
  assert.deepEqual(runtime.locks.map(l=>l.key),['jstar-contact:ip:test-client','jstar-contact:email:visitor@example.invalid']);
  assert(runtime.locks.every(l=>l.sql.includes('pg_advisory_xact_lock')));
  assert.deepEqual(runtime.transactions,[{isolationLevel:'ReadCommitted'}]);
 }
});

test('retry after partial acceptance never resends the accepted notification',async()=>{
 const first=contact([{data:{id:'team'},error:null},{data:null,error:{message:'Rejected'}}]);
 assert.equal((await first.route.POST(first.request())).status,202);
 const fresh=contact([],{store:first.store});
 assert.equal((await (await fresh.route.POST(fresh.request())).json()).status,'duplicate');
 assert.equal(first.calls.length,2);assert.equal(fresh.calls.length,0);
});

test('trusted forwarded IP is canonicalised before locking and saving',async()=>{
 const runtime=contact();await runtime.route.POST(runtime.request(runtime.body,{'x-vercel-forwarded-for':' 192.0.2.10, 192.0.2.11 ','x-forwarded-for':'other'}));
 assert.equal(runtime.store.records[0].ipAddress,'192.0.2.10');
 assert.equal(runtime.locks[0].key,'jstar-contact:ip:192.0.2.10');
});

test('visitor acknowledgement contains only its escaped enquiry recap',async()=>{
 const {api,calls}=mailer();
 await api.sendUserConfirmation(submission.email,submission.name,false,{service:submission.service,subject:submission.subject,message:submission.message});
 const html=calls[0].html;
 assert(html.includes('YOUR ENQUIRY'));assert(html.includes('visitor@example.invalid'));
 assert(html.includes('Film &amp; Software'));assert(html.includes('Film &lt;b&gt;request&lt;/b&gt;'));
 assert(html.includes('&lt;img src=x&gt; &amp; edit &quot;this&quot;'));
 assert(!html.includes('<img src=x>'));assert(!html.includes('Reference submission-1'));
 assert.deepEqual(calls[0].to,[submission.email]);assert.equal(calls[0].replyTo,'hey@jstarstudios.com');
});
