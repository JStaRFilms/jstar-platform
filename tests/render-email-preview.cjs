// Render actual templates with a stub provider. No live credentials or network calls.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ts=require('typescript');
const root=path.resolve(__dirname,'..');
function load(file,dependencies){
 const code=ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 const module={exports:{}};
 vm.runInNewContext(code,{module,exports:module.exports,require:id=>{
  if(!(id in dependencies))throw Error('Preview refused dependency '+id);
  return dependencies[id];
 },process:{env:{RESEND_API_KEY:'re_render_only'}},console:{log(){},warn(){},error(){}}},{filename:file});
 return module.exports;
}
const emails=[];
class RenderOnlyResend{
 emails={send:async message=>{emails.push(message);return{data:{id:'render-only-not-sent'},error:null}}};
}
(async()=>{
 const contact=load('src/content/contact.ts',{});
 const api=load('src/lib/email.ts',{resend:{Resend:RenderOnlyResend},'@/content/contact':contact});
 await api.sendUserConfirmation('visitor@example.invalid','Example visitor',false);
 await api.sendAdminNotification({id:'DEMO-ONLY',name:'Example visitor',email:'visitor@example.invalid',subject:'A film and software project',service:'Film + Software',message:'An example project brief would appear here.\n\nThe visitor can describe their idea, what they need, and any timing or budget they want to share.',newsletter:false,submittedAt:new Date('2026-10-15T12:00:00Z')});
 const data=JSON.stringify(emails).replace(/</g,'\\u003c');
 const assetData=JSON.stringify(Object.fromEntries(['email-grain.png','email-studio-logo.png'].map(name=>['https://jstarstudios.com/redesign/'+name,'data:image/png;base64,'+fs.readFileSync(path.join(root,'public/redesign',name)).toString('base64')])));
 const output=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>J StaR email preview</title>
<style>
*{box-sizing:border-box}body{margin:0;font-family:var(--font-sans,Arial,sans-serif);color:var(--foreground,#15211b)}
.controls{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:10px}.tabs{display:flex;gap:4px;flex-wrap:wrap}button{font:inherit;cursor:pointer;border:1px solid var(--border,#d5dbd7);border-radius:6px;padding:9px 13px;background:transparent;color:inherit;font-size:13px}button[aria-selected="true"]{background:var(--foreground,#001514);color:var(--background,#fff);border-color:var(--foreground,#001514)}button:focus-visible,input:focus-visible{outline:2px solid var(--ring,#6c8c14);outline-offset:3px}.phone-toggle{font-size:12px;display:flex;align-items:center;gap:7px;color:var(--muted-foreground,#627168)}#context,.note{font-size:12px;color:var(--muted-foreground,#627168);line-height:1.6;margin:8px 0 14px}.inbox{padding:16px;background:var(--muted,#edf0eb);border-radius:var(--radius,8px);width:100%;max-width:100%;margin:0 auto}.phone .inbox{max-width:390px}.envelope{padding-bottom:14px;font-size:12px;line-height:1.7;overflow-wrap:anywhere}.envelope dl{display:grid;grid-template-columns:56px minmax(0,1fr);gap:2px 10px;margin:0 0 8px}dt{color:var(--muted-foreground,#627168)}dd{margin:0}.subject{font-size:14px;font-weight:600;margin:10px 0 0}iframe{display:block;border:0;width:100%;height:900px;background:#f3f4e9}#context strong{font-weight:600;color:var(--foreground,#15211b)}.note{margin:12px 0 0}@media(max-width:420px){button{padding:9px 10px}.controls{gap:8px}.phone-toggle{font-size:11px}.inbox{padding:16px}}
</style></head><body>
<div class="controls"><div class="tabs" role="tablist" aria-label="Email recipient"><button id="visitor-tab" role="tab" aria-controls="email-panel" aria-selected="true">Visitor email</button><button id="team-tab" role="tab" aria-controls="email-panel" aria-selected="false" tabindex="-1">Your studio copy</button></div><label class="phone-toggle"><input id="phone" type="checkbox">Phone width</label></div>
<p id="context"><strong>The visitor receives this.</strong> A short acknowledgement, not the internal enquiry record.</p>
<section id="email-panel" role="tabpanel" aria-labelledby="visitor-tab"><div class="inbox"><div class="envelope"><dl><dt>From</dt><dd id="from"></dd><dt>To</dt><dd id="to"></dd><dt>Reply-To</dt><dd id="reply"></dd></dl><p id="subject" class="subject"></p></div><iframe id="email" title="Visitor acknowledgement email" sandbox="allow-same-origin"></iframe></div></section>
<p class="note">Illustrative content only. These are the actual redesigned templates rendered locally. Nothing is sent. Repository images are inlined for this demo; email image URLs need the assets published on the website. Links are inactive. Browser preview, not a Gmail or Outlook certification.</p>
<script>
const emails=${data};const assets=${assetData};let selected=0;const frame=document.getElementById('email');const buttons=[document.getElementById('visitor-tab'),document.getElementById('team-tab')];
function resize(){const doc=frame.contentDocument;if(!doc)return;frame.style.height='1px';frame.style.height=Math.max(doc.documentElement.scrollHeight,doc.body.scrollHeight)+'px'}
function show(index){selected=index;const email=emails[index];buttons.forEach((b,i)=>{b.setAttribute('aria-selected',String(i===index));b.tabIndex=i===index?0:-1});document.getElementById('email-panel').setAttribute('aria-labelledby',buttons[index].id);document.getElementById('from').textContent=email.from;document.getElementById('to').textContent=email.to.join(', ');document.getElementById('reply').textContent=email.replyTo;document.getElementById('subject').textContent=email.subject;document.getElementById('context').innerHTML=index===0?'<strong>The visitor receives this.</strong> A short acknowledgement, not the internal enquiry record.':'<strong>You receive this at hey@jstarstudios.com.</strong> The brief and contact details. Reply reaches the visitor.';frame.title=index===0?'Visitor acknowledgement email':'Internal team notification email';frame.srcdoc=Object.entries(assets).reduce((html,[url,data])=>html.replaceAll(url,data),email.html)}
frame.addEventListener('load',()=>{resize();const doc=frame.contentDocument;console.log(JSON.stringify({email:selected===0?'visitor':'studio',frameWidth:frame.clientWidth,contentWidth:doc.documentElement.scrollWidth,height:frame.clientHeight}));if(doc.documentElement.scrollWidth>frame.clientWidth+1)console.error('Email horizontal overflow');doc.addEventListener('click',e=>{if(e.target.closest('a'))e.preventDefault()})});buttons.forEach((b,i)=>b.addEventListener('click',()=>show(i)));document.querySelector('[role="tablist"]').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?1:1-selected;show(next);buttons[next].focus()});document.getElementById('phone').addEventListener('change',e=>{document.body.classList.toggle('phone',e.target.checked);requestAnimationFrame(resize)});window.addEventListener('resize',resize);show(0);console.log('Two actual templates; mock provider only; no network or mail sends.');
</script></body></html>`;
 const file=path.join(root,'docs/Mockups/01_Public_Website/email-templates.html');
 fs.writeFileSync(file,output);
 console.log('Rendered two templates without sending: '+file);
})().catch(error=>{console.error(error);process.exitCode=1});
