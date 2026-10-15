const fs=require('node:fs');
const path=require('node:path');
const {spawn,spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'../../..');
const build=require('./build-status.json');
if(!build.passed)throw Error('Cannot serve a failed build');
const server=spawn(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'start','-H','127.0.0.1','-p','5793'],{cwd:build.workspace,stdio:['ignore','pipe','pipe']});
let log='';server.stdout.on('data',d=>log+=d);server.stderr.on('data',d=>log+=d);
(async()=>{
 try{
  let ready=false;
  for(let i=0;i<40;i++){
   if(server.exitCode!==null)throw Error('Production validation server exited before readiness: '+log);
   if(log.includes('Ready in')){ready=true;break}
   await new Promise(resolve=>setTimeout(resolve,250));
  }
  if(!ready)throw Error('Production validation server readiness timeout');
  const test=spawnSync(process.execPath,[path.join(__dirname,'verify-routes.cjs')],{cwd:root,env:{...process.env,ROUTE_BASE:'http://127.0.0.1:5793',ROUTE_RECEIPT:'production-route-results.json'},encoding:'utf8',timeout:240000,maxBuffer:100000});
  console.log(test.stdout);console.error(test.stderr);process.exitCode=test.status===0?0:1;
 }catch(error){console.error(error);process.exitCode=1}
 finally{fs.writeFileSync(path.join(__dirname,'production-server.json'),JSON.stringify({workspace:build.workspace,pid:server.pid,address:'127.0.0.1',port:5793,scope:'Temporary local validation of fingerprinted production build, no publishing',log},null,2));server.kill();}
})().catch(e=>{console.error(e);server.kill();process.exitCode=1});
