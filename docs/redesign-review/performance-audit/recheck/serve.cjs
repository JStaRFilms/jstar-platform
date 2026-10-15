const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const workspace=path.join(__dirname,'build-workspace');
if(!fs.existsSync(path.join(workspace,'.next/BUILD_ID')))throw new Error('Production build is not complete.');
const child=cp.spawn(process.execPath,[path.resolve('node_modules/next/dist/bin/next'),'start','-p','5893','-H','127.0.0.1'],{cwd:workspace,stdio:['ignore',fs.openSync(path.join(__dirname,'start.log'),'w'),fs.openSync(path.join(__dirname,'start.err.log'),'w')],windowsHide:true});
fs.writeFileSync(path.join(__dirname,'server-pid.json'),JSON.stringify({pid:child.pid,port:5893,workspace}));child.unref();console.log({pid:child.pid,port:5893});
