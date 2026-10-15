const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../../..');
const git=args=>execFileSync('C:/Program Files/Git/mingw64/bin/git.exe',args,{cwd:root,encoding:'utf8',maxBuffer:30000000});
const files=git(['ls-files','--others','--exclude-standard','-z']).split('\0').filter(Boolean);
const workspaces=[];
function scan(d,depth=0){
 if(depth>7)return;
 for(const entry of fs.readdirSync(path.join(root,d),{withFileTypes:true})){
  if(!entry.isDirectory()||entry.isSymbolicLink()||['.next','node_modules','.git'].includes(entry.name))continue;
  const p=d+'/'+entry.name;
  if(/workspace|archive/i.test(entry.name))workspaces.push(p);else scan(p,depth+1);
 }
}
scan('docs/redesign-review');
const localFilms=files.filter(p=>p.startsWith('docs/References/videos/')||['public/redesign/sharon.mp4','public/redesign/sharon-playback-candidate.mp4'].includes(p));
const protectedRecords=files.filter(p=>p.startsWith('docs/redesign-review/')&&/(?:server|tailnet|preview-health).*\.json$/.test(path.basename(p)));
const local=[...new Set([...localFilms,...protectedRecords])];
const keep=[],remove=[];
for(const p of files){
 if(workspaces.some(d=>p.startsWith(d+'/'))||local.includes(p))continue;
 const base=path.basename(p);
 let reason;
 if(p.startsWith('src/app/redesign/film-comparison/')||p==='public/redesign/nifemi-mobile-candidate.mp4')reason='Owner explicitly requested removal of the complete comparison test page and unused candidate';
 else if(p.startsWith('docs/redesign-review/')){
  if(/\.(png|jpe?g|webp|gif|mp4|webm|mov|gz|ffconcat|nul)$/i.test(base))reason='Generated QA capture, compressed response or scratch staging file';
  else if(/\.log$/i.test(base)&&p!=='docs/redesign-review/route-swap/build.log')reason='Transient runtime/build console log; structured results retained';
  else if(/(?:^|[-.])(?:pid|exit|stopped)\.json$/.test(base))reason='Stale process/exit marker';
  else if(base==='results-interrupted-null.json')reason='Interrupted NUL-only receipt, never a valid test result';
 }
 if(reason){const s=fs.lstatSync(path.join(root,p));if(s.isSymbolicLink()||!s.isFile())throw Error('Deletion target is not a regular file '+p);remove.push({path:p,bytes:s.size,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex'),reason});}
 else keep.push(p);
}
const archivedEvidence=[];
for(const d of workspaces){
 const checks=path.join(root,d,'checks');if(!fs.existsSync(checks))continue;
 function extract(dir,rel=''){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
   if(e.isSymbolicLink())continue;
   const next=rel?rel+'/'+e.name:e.name;
   if(e.isDirectory())extract(path.join(dir,e.name),next);
   else if(/\.(md|cjs|json)$/.test(e.name)&&!/(pid|server|exit).*\.json$/.test(e.name)){
    const target='docs/redesign-review/archived-checks/'+path.basename(d)+'/'+next;
    archivedEvidence.push({source:d+'/checks/'+next,target});
   }
  }
 }
 extract(checks);
}
const tracked=git(['diff','--name-only','-z']).split('\0').filter(Boolean);
if(tracked.some(p=>p!=='docs/redesign-review/verify-tablet.cjs'))throw Error('Unexpected tracked changes, stop cleanup');
const plan={created:new Date().toISOString(),head:git(['rev-parse','HEAD']).trim(),branch:git(['branch','--show-current']).trim(),authorization:'User requested artifact cleanup and retained-document commit. User chose exact local exclusions for original/reference films/protected previews, then explicitly changed the comparison decision to deleting the full test page and unused candidate. The live hero remains unchanged.',keep:keep.sort(),remove,localOnly:local.sort(),protectedWorkspaces:workspaces.sort(),copyArchivedEvidence:archivedEvidence,trackedToRetain:tracked,stats:{untracked:files.length,keep:keep.length,delete:remove.length,deleteBytes:remove.reduce((n,f)=>n+f.bytes,0),localFiles:local.length,workspaces:workspaces.length,archivedEvidence:archivedEvidence.length}};
fs.writeFileSync(path.join(__dirname,'plan.json'),JSON.stringify(plan,null,2));
console.log(JSON.stringify(plan.stats,null,2));
console.log('Local files\n'+plan.localOnly.join('\n'));
console.log('Other retained extensions\n'+keep.filter(p=>!(/\.(md|html|json|cjs|py|ps1|tsx|css|mp4|log)$/.test(p))).join('\n'));
