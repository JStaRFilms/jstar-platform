const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
(async()=>{
const server=cp.spawn(process.execPath,[path.resolve('node_modules/next/dist/bin/next'),'start','-p','5893','-H','127.0.0.1'],{cwd:path.join(__dirname,'build-workspace'),windowsHide:true,stdio:['ignore',fs.openSync(path.join(__dirname,'start.log'),'w'),fs.openSync(path.join(__dirname,'start.err.log'),'w')]});
fs.writeFileSync(path.join(__dirname,'server-pid.json'),JSON.stringify({pid:server.pid,port:5893,workspace:path.join(__dirname,'build-workspace')}));
try{
let ready=false;for(let i=0;i<180;i++){try{await fetch('http://127.0.0.1:5893/redesign');ready=true;break;}catch{}await new Promise(r=>setTimeout(r,500));}if(!ready)throw new Error('Audit server unavailable');
for(const name of process.argv.slice(2)){await new Promise((resolve,reject)=>{const child=cp.spawn(process.execPath,[path.join(__dirname,'run-check.cjs'),name],{windowsHide:true,stdio:'inherit'});child.on('exit',code=>code===0?resolve():reject(new Error(name+' failed: '+code)));});}
}finally{server.kill();fs.writeFileSync(path.join(__dirname,'server-stopped.json'),JSON.stringify({pid:server.pid,time:new Date().toISOString()}));}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
