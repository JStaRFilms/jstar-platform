const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const name=process.argv[2];if(!['measure-clean','journey','mobile-lifecycle','release-check','section-traces','hidden-tab'].includes(name))throw new Error('Unknown audit script');
const child=cp.spawn(process.execPath,[path.join(__dirname,name+'.cjs')],{cwd:process.cwd(),windowsHide:true,stdio:['ignore',fs.openSync(path.join(__dirname,name+'.log'),'w'),fs.openSync(path.join(__dirname,name+'.err.log'),'w')]});
fs.writeFileSync(path.join(__dirname,name+'-pid.json'),JSON.stringify({pid:child.pid,script:name,started:new Date().toISOString()}));
child.on('exit',code=>{fs.writeFileSync(path.join(__dirname,name+'-exit.json'),JSON.stringify({code,time:new Date().toISOString()}));console.log({name,code});process.exitCode=code||0;});
