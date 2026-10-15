const {chromium}=require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const url=process.env.REDESIGN_URL||'http://127.0.0.1:5913/redesign';
const baseline='http://127.0.0.1:5912/redesign';
const results=[],errors=[];
async function open(browser,width,height,target=url){const p=await browser.newPage({viewport:{width,height},isMobile:width<=800,hasTouch:width<=800});p.on('pageerror',e=>errors.push(e.message));await p.route('**/*',r=>['GET','HEAD','OPTIONS'].includes(r.request().method())?r.continue():r.abort());await p.goto(target,{waitUntil:'load',timeout:120000});await p.waitForFunction(()=>document.querySelector('[data-team]')?.dataset.teamProgress);await p.evaluate(()=>document.fonts.ready);return p}
async function move(p,f){await p.evaluate(f=>{const e=document.querySelector('footer[class*=footerTrack]');scrollTo({top:scrollY+e.getBoundingClientRect().top-innerHeight*f,behavior:'instant'})},f);await p.waitForTimeout(450)}
async function state(p){return p.evaluate(()=>{const e=document.querySelector('footer[class*=footerTrack]'),stage=e.firstElementChild,logo=e.querySelector('[class*=footerLogo]'),contacts=e.querySelector('[class*=footerExtra]'),legal=e.querySelector('[class*=footerBottom]'),mark=e.querySelector('[role=img]');const rect=x=>{const r=x.getBoundingClientRect();return{left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height}};return{logo:rect(logo),contacts:rect(contacts),legal:rect(legal),mark:rect(mark),stage:rect(stage),position:getComputedStyle(logo).position,width:innerWidth,height:innerHeight,bottomPin:legal.offsetTop-24,visibility:getComputedStyle(mark).visibility,mobile:getComputedStyle(mark.querySelector('[data-wordmark-mobile]')).display,desktop:getComputedStyle(mark.querySelector('[data-wordmark-desktop]')).display}})}
(async()=>{const b=await chromium.launch({channel:'chrome'});try{
  for(const[width,height]of[[320,480],[390,844],[412,915],[1440,640],[1440,900],[1920,1080]]){
    const p=await open(b,width,height);const old=width<=800?await open(b,width,height,baseline):null;
    for(const f of[.2,0,-.25,.2]){
      await move(p,f);const s=await state(p);
      if(width>800){assert.equal(s.position,'absolute');assert.ok(Math.abs(s.logo.left+s.logo.width/2-width/2)<1,'Desktop logo must be centered');assert.equal(s.logo.width,height<=780?160:200);assert.ok(Math.abs(s.logo.top-s.stage.top-height*.12)<1,'Desktop logo must return to its original height');assert.equal(s.mobile,'none')}
      else{assert.equal(s.position,'static');assert.equal(s.logo.width,80);assert.ok(s.logo.left>width*.65,'Mobile logo must stay on the right');assert.equal(s.desktop,'none');await move(old,f);const a=await state(old);for(const key of['logo','contacts','mark','legal'])for(const edge of['left','top','right','bottom'])assert.ok(Math.abs(a[key][edge]-s[key][edge])<1,`Mobile ${key} ${edge} changed at ${width}x${height}`);results.push({mobileMatchesBaseline:[width,height,f]})}
      const upper=Math.max(s.contacts.bottom,s.logo.bottom)+24,available=Math.max(0,s.bottomPin-upper);
      assert.ok(Math.abs(s.mark.height-available)<2,'Lettering must fill space beneath both contacts and logo');
      if(available>1){assert.equal(s.visibility,'visible');assert.ok(Math.abs(s.mark.top-upper)<2,'Upper pin must clear restored logo');assert.ok(Math.abs(s.mark.bottom-s.bottomPin)<2,'Bottom pin must not drift')}
      results.push({size:[width,height],fraction:f,logo:s.logo,mark:s.mark});
    }
    await move(p,0);await p.screenshot({path:path.join(__dirname,`footer-logo-${width}-${height}.png`),scale:'css'});
    await p.getByRole('button',{name:'J StaR Films Studios, back to the beginning',exact:true}).click();await p.waitForTimeout(800);assert.ok(await p.evaluate(()=>scrollY<2),'Logo navigation must still return to the opening');await p.close();if(old)await old.close();
  }
  for(const[width,height]of[[390,844],[1440,900]]){const p=await open(b,width,height);await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(500);await move(p,0);const s=await state(p);assert.ok(s.mark.top>=Math.max(s.logo.bottom,s.contacts.bottom)+23&&s.mark.bottom<s.legal.top,'Reduced motion must clear logo and copyright');results.push({reduced:[width,height]});await p.close()}
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(__dirname,'logo-results.json'),JSON.stringify({results,errors},null,2));console.log(JSON.stringify({passed:true,checks:results.length,errors}));
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
