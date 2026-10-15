const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'../../..');
const workspace=fs.mkdtempSync(path.join(os.tmpdir(),'jstar-route-swap-build-'));
const report={started:new Date().toISOString(),root,workspace,scope:'Isolated temporary production build of all current src and unchanged config. Public/dependency/env directories are linked; archives are not copied. No deployment or dev-cache replacement.'};
const hashes={};
function sourceHashes(directory,prefix='src'){
 for(const entry of fs.readdirSync(directory,{withFileTypes:true})){
  const file=path.join(directory,entry.name),relative=prefix+'/'+entry.name;
  if(entry.isDirectory())sourceHashes(file,relative);
  else hashes[relative]=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
 }
}
try{
 fs.cpSync(path.join(root,'src'),path.join(workspace,'src'),{recursive:true});
 for(const file of ['package.json','pnpm-lock.yaml','tsconfig.json','next.config.ts','next-env.d.ts','postcss.config.mjs','eslint.config.mjs'])if(fs.existsSync(path.join(root,file)))fs.copyFileSync(path.join(root,file),path.join(workspace,file));
 for(const directory of ['node_modules','public'])fs.symlinkSync(path.join(root,directory),path.join(workspace,directory),'junction');
 for(const file of ['.env','.env.local','.env.production','.env.production.local'])if(fs.existsSync(path.join(root,file)))fs.symlinkSync(path.join(root,file),path.join(workspace,file),'file');
 sourceHashes(path.join(root,'src'));
 const original={...hashes};Object.keys(hashes).forEach(k=>delete hashes[k]);sourceHashes(path.join(workspace,'src'));
 if(JSON.stringify(original)!==JSON.stringify(hashes))throw Error('Build source differs from root');
 report.sourceHashes=hashes;
 const shim=fs.readFileSync(path.join(root,'node_modules/.bin/eslint.CMD'),'utf8');
 const dependencyPath=shim.match(/@SET "NODE_PATH=([^"]+)"/)?.[1];
 const built=spawnSync(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'build','--no-lint'],{cwd:workspace,env:{...process.env,...(dependencyPath?{NODE_PATH:dependencyPath}:{})},encoding:'utf8',timeout:480000,maxBuffer:10000000});
 fs.writeFileSync(path.join(__dirname,'build.log'),(built.stdout||'')+'\n'+(built.stderr||''));
 report.exitCode=built.status;report.error=built.error?.message;report.passed=built.status===0;
 console.log('Isolated current-source build '+built.status);
 console.log(((built.stdout||'')+'\n'+(built.stderr||'')).split('\n').filter(l=>/compiled|error|warn|failed|checking|generating|collecting|route|^.?\s*[┌├└]/i.test(l)).slice(-70).join('\n'));
}catch(error){report.passed=false;report.error=error.stack;console.error(error.message)}
report.finished=new Date().toISOString();
fs.writeFileSync(path.join(__dirname,'build-status.json'),JSON.stringify(report,null,2));
if(!report.passed)process.exitCode=1;
