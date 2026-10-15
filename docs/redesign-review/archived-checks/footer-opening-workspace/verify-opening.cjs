const { chromium } = require('C:/Users/johno/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const url=process.env.REDESIGN_URL||'http://127.0.0.1:5911/redesign';
const results=[],errors=[];
async function move(page,topFraction){
  await page.evaluate(f=>{const e=document.querySelector('footer[class*=footerTrack]');scrollTo({top:scrollY+e.getBoundingClientRect().top-innerHeight*f,behavior:'instant'})},topFraction);
  await page.waitForTimeout(400);
}
async function state(page){return page.evaluate(()=>{
  const footer=document.querySelector('footer[class*=footerTrack]'),stage=footer.firstElementChild,contacts=footer.querySelector('[class*=footerExtra]'),legal=footer.querySelector('[class*=footerBottom]'),mark=footer.querySelector('[role=img]');
  const rect=e=>({top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom,height:e.getBoundingClientRect().height});
  return{height:innerHeight,footer:rect(footer),stage:rect(stage),contacts:rect(contacts),legal:rect(legal),mark:rect(mark),bottomPin:legal.offsetTop-24,visibility:getComputedStyle(mark).visibility,scale:new DOMMatrixReadOnly(getComputedStyle(mark).transform).d,mobile:getComputedStyle(mark.querySelector('[data-wordmark-mobile]')).display,desktop:getComputedStyle(mark.querySelector('[data-wordmark-desktop]')).display};
})}
(async()=>{const b=await chromium.launch({channel:'chrome'});try{
  for(const[width,height]of[[320,480],[320,560],[360,640],[390,844],[412,915],[1440,640],[1440,900],[1920,1080]]){
    const p=await b.newPage({viewport:{width,height},isMobile:width<=800,hasTouch:width<=800});p.on('pageerror',e=>errors.push(e.message));
    await p.route('**/*',r=>['GET','HEAD','OPTIONS'].includes(r.request().method())?r.continue():r.abort());
    await p.goto(url,{waitUntil:'load',timeout:120000});await p.waitForFunction(()=>document.querySelector('[data-team]')?.dataset.teamProgress);await p.evaluate(()=>document.fonts.ready);
    let entryGrowth=false,firstBottom=null;
    for(const fraction of[.7,.5,.35,.2,.1,0,-.25,-.55,.2,.35,.7]){
      await move(p,fraction);const s=await state(p),available=Math.max(0,s.bottomPin-s.contacts.bottom-24);
      assert.ok(Math.abs(s.stage.height-height)<2,`Viewport coverage ${width}x${height}`);
      assert.ok(Math.abs(s.mark.height-available)<2,`Empty space during opening ${width}x${height} ${fraction}: ${JSON.stringify(s)}`);
      if(available>1){
        assert.equal(s.visibility,'visible');assert.ok(Math.abs(s.mark.top-s.contacts.bottom-24)<2,'Upper edge must follow contacts');
        assert.ok(Math.abs(s.mark.bottom-s.bottomPin)<2,'Lower edge must stay fixed');assert.ok(s.mark.bottom<s.legal.top,'Wordmark must not cross copyright');
        if(firstBottom===null)firstBottom=s.mark.bottom;else assert.ok(Math.abs(firstBottom-s.mark.bottom)<2,'Lower pin drifted');
        if(fraction>0)entryGrowth=true;
      }else assert.equal(s.visibility,'hidden');
      if(width<=800){assert.equal(s.desktop,'none');assert.notEqual(s.mobile,'none')}else{assert.equal(s.mobile,'none');assert.notEqual(s.desktop,'none')}
      if(fraction<=0)assert.ok(Math.abs(s.stage.top)<2,'Finished footer must stay pinned');
      results.push({width,height,fraction,available,mark:s.mark,contacts:s.contacts,stage:s.stage});
    }
    assert.ok(entryGrowth,'Stretch must begin before the stage reaches the top');
    for(const [name,fraction]of[['compressed',.2],['opening',.1],['full',0]]){
      await move(p,fraction);await p.screenshot({path:path.join(__dirname,`footer-${name}-${width}-${height}.png`),scale:'css'});
    }
    await p.getByRole('button',{name:'J StaR Films Studios, back to the beginning',exact:true}).click();await p.waitForTimeout(800);
    assert.ok(await p.evaluate(()=>scrollY<2),'Logo navigation must still reach the opening');await p.close();
  }
  const p=await b.newPage({viewport:{width:390,height:700},isMobile:true,hasTouch:true});p.on('pageerror',e=>errors.push(e.message));await p.goto(url,{waitUntil:'load'});await p.waitForFunction(()=>document.querySelector('[data-team]')?.dataset.teamProgress);
  for(const height of[700,844,700]){await p.setViewportSize({width:390,height});await p.waitForTimeout(350);await move(p,.2);const s=await state(p);assert.ok(Math.abs(s.mark.top-s.contacts.bottom-24)<2&&Math.abs(s.mark.bottom-s.bottomPin)<2);results.push({resize:height,mark:s.mark})}
  await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(500);await move(p,0);const s=await state(p);assert.equal(s.scale,1);assert.ok(Math.abs(s.footer.height-s.stage.height)<2&&Math.abs(s.mark.top-s.contacts.bottom-24)<2&&s.mark.bottom<s.legal.top);results.push({reduced:true,mark:s.mark});await p.close();
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(__dirname,'opening-results.json'),JSON.stringify({results,errors},null,2));console.log(JSON.stringify({passed:true,checks:results.length,errors}));
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
