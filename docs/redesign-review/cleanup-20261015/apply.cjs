const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../../..');
const plan=require('./plan.json');
const git=args=>execFileSync('C:/Program Files/Git/mingw64/bin/git.exe',args,{cwd:root,encoding:'utf8',maxBuffer:30000000}).trim();
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
if(git(['rev-parse','HEAD'])!==plan.head||git(['diff','--cached','--name-only']))throw Error('Git state changed, stop');
const protectedHashes={};
for(const workspace of plan.protectedWorkspaces){
 function snapshot(dir){
  for(const entry of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){
   if(entry.isSymbolicLink()||['.next','.next-dev','node_modules','.git'].includes(entry.name))continue;
   const relative=dir+'/'+entry.name;
   if(entry.isDirectory())snapshot(relative);
   else protectedHashes[relative]=sha(path.join(root,relative));
  }
 }
 snapshot(workspace);
}
const liveHeroBefore=sha(path.join(root,'public/redesign/nifemi.mp4'));
for(const row of plan.remove){
 const file=path.resolve(root,row.path);
 if(!file.startsWith(root+path.sep)||plan.protectedWorkspaces.some(d=>row.path.startsWith(d+'/')))throw Error('Protected or outside deletion target '+row.path);
 const stat=fs.lstatSync(file);
 const parent=fs.realpathSync(path.dirname(file));
 if(!stat.isFile()||stat.isSymbolicLink()||!parent.startsWith(fs.realpathSync(root)+path.sep)||sha(file)!==row.sha256)throw Error('Changed/non-regular deletion target '+row.path);
}
for(const row of plan.copyArchivedEvidence){
 const destination=path.join(root,row.target);
 if(fs.existsSync(destination))throw Error('Archive-copy destination exists '+row.target);
 fs.mkdirSync(path.dirname(destination),{recursive:true});
 fs.copyFileSync(path.join(root,row.source),destination);
 if(sha(destination)!==sha(path.join(root,row.source)))throw Error('Copy hash mismatch');
}
const exclusions=plan.protectedWorkspaces.map(d=>'/'+d+'/').concat(plan.localOnly.map(p=>'/'+p));
const excludeFile=path.join(root,'.git/info/exclude');
const oldExclude=fs.readFileSync(excludeFile,'utf8');
const header='# Owner-approved local preview/source archives, cleanup 2026-10-15';
if(oldExclude.includes(header))throw Error('Cleanup exclusions already applied');
fs.appendFileSync(excludeFile,'\n'+header+'\n'+exclusions.join('\n')+'\n');
for(const row of plan.remove)fs.unlinkSync(path.join(root,row.path));
const comparisonDir=path.join(root,'src/app/redesign/film-comparison');
if(fs.existsSync(comparisonDir)&&fs.readdirSync(comparisonDir).length===0)fs.rmdirSync(comparisonDir);
const result={finished:new Date().toISOString(),deleted:plan.remove.length,deletedBytes:plan.remove.reduce((n,f)=>n+f.bytes,0),copiedEvidence:plan.copyArchivedEvidence.length,localExclusions:exclusions.length,liveHeroUnchanged:sha(path.join(root,'public/redesign/nifemi.mp4'))===liveHeroBefore,protectedFilesChecked:Object.keys(protectedHashes).length,protectedDrift:Object.entries(protectedHashes).filter(([p,h])=>!fs.existsSync(path.join(root,p))||sha(path.join(root,p))!==h).map(([p])=>p),missingLocalArchives:plan.localOnly.filter(p=>!fs.existsSync(path.join(root,p))),comparisonRemoved:!fs.existsSync(comparisonDir)&&!fs.existsSync(path.join(root,'public/redesign/nifemi-mobile-candidate.mp4'))};
fs.writeFileSync(path.join(__dirname,'result.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
if(!result.liveHeroUnchanged||result.protectedDrift.length||result.missingLocalArchives.length||!result.comparisonRemoved)throw Error('Cleanup preservation check failed');
