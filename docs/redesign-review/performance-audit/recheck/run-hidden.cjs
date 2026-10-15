const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const name=process.argv[2];if(!['measure','journey','mobile-lifecycle','release-check'].includes(name))throw new Error('Unknown audit script');
const pidFile=path.join(__dirname,name+'-pid.json');if(fs.existsSync(pidFile)){const old=JSON.parse(fs.readFileSync(pidFile));try{process.kill(old.pid,0);throw new Error('This audit process is already running')}catch(e){if(e.code!=='ESRCH')throw e}}
const child=cp.spawn(process.execPath,[path.join(__dirname,name+'.cjs')],{cwd:process.cwd(),windowsHide:true,stdio:['ignore',fs.openSync(path.join(__dirname,name+'.log'),'w'),fs.openSync(path.join(__dirname,name+'.err.log'),'w')]});
fs.writeFileSync(pidFile,JSON.stringify({pid:child.pid,script:name,started:new Date().toISOString()}));child.unref();console.log({pid:child.pid,script:name});
