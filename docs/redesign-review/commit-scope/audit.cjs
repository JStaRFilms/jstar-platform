const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../../..');
const ts=require(path.join(root,'node_modules/typescript'));
const git=args=>execFileSync('C:/Program Files/Git/mingw64/bin/git.exe',args,{cwd:root,encoding:'utf8',maxBuffer:30000000});
const tracked=git(['ls-files','-z']).split('\0').filter(Boolean);
const untracked=git(['ls-files','--others','--exclude-standard','-z']).split('\0').filter(Boolean);
const modified=git(['diff','--name-only','-z']).split('\0').filter(Boolean);
const source=modified.filter(p=>p.startsWith('src/')).concat(['src/app/redesign/PortfolioMedia.tsx','src/app/redesign/PortfolioViewer.tsx','src/app/redesign/portfolio-viewer.module.css']);
const features=modified.filter(p=>p.startsWith('docs/features/')).concat(['docs/features/HomepageRouteSwap.md','docs/features/PortfolioContributionGuide.md','docs/features/PortfolioViewerIntegration.md']);
const editorial=['portfolio-content-ledger.md','portfolio-design-decisions.md','portfolio-media-manifest.json','portfolio-selected-film-notes.md','portfolio-youtube-shortlist.md','portfolio-youtube-viewer-review.md'].map(p=>'docs/Mockups/01_Public_Website/'+p);
const content=fs.readFileSync(path.join(root,'src/content/selected-work.ts'),'utf8');
const media=untracked.filter(p=>p.startsWith('public/')&&content.includes(p.replace(/^public/,'')));
const groups={source:[...new Set(source)].sort(),media:media.sort(),documentation:[...new Set([...features,...editorial])].sort()};
const include=Object.values(groups).flat();
const included=new Set(include);
const available=new Set([...tracked,...include]);
const problems=[];
for(const p of include)if(!fs.existsSync(path.join(root,p)))problems.push('Missing candidate '+p);
const currentSource=[];
function walk(d){for(const e of fs.readdirSync(path.join(root,d),{withFileTypes:true})){const p=d+'/'+e.name;if(e.isDirectory())walk(p);else if(/\.(tsx?|css|json)$/.test(e.name)&&available.has(p))currentSource.push(p);}}
walk('src');
const config=ts.readConfigFile(path.join(root,'tsconfig.json'),ts.sys.readFile).config;
const options=ts.parseJsonConfigFileContent(config,ts.sys,root).options;
const importsChecked=[];
const assetsChecked=new Set();
for(const p of currentSource){
 const file=path.join(root,p),text=fs.readFileSync(file,'utf8');
 if(/\.tsx?$/.test(p)){
  for(const entry of ts.preProcessFile(text,true,true).importedFiles){
   const spec=entry.fileName;
   if(!spec.startsWith('.')&&!spec.startsWith('@/'))continue;
   let target=ts.resolveModuleName(spec,file,options,ts.sys).resolvedModule?.resolvedFileName;
   if(!target&&/\.css$/.test(spec))target=spec.startsWith('@/')?path.join(root,'src',spec.slice(2)):path.resolve(path.dirname(file),spec);
   if(!target)continue;
   const relative=path.relative(root,target).replace(/\\/g,'/');
   if(relative.startsWith('node_modules/')||relative.startsWith('../'))continue;
   importsChecked.push({from:p,target:relative});
   if(!available.has(relative))problems.push('Import omitted '+p+' -> '+relative);
  }
 }
 const local=[...text.matchAll(/["'`(](\/(?:redesign|team)\/[^"'`\s)${}]+\.[a-zA-Z0-9]+)["'`)]/g)].map(m=>m[1]);
 for(const url of local){assetsChecked.add(url);if(!available.has('public'+url))problems.push('Asset omitted '+p+' -> '+url);}
}
const rows=include.map(p=>({path:p,status:tracked.includes(p)?'modified':'new',bytes:fs.statSync(path.join(root,p)).size,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex')}));
const excluded=untracked.filter(p=>!included.has(p)).concat(modified.filter(p=>!included.has(p))).sort();
const report={created:new Date().toISOString(),approval:'Proposed only. No staging, commit, push or deployment.',head:git(['rev-parse','HEAD']).trim(),branch:git(['branch','--show-current']).trim(),staged:git(['diff','--cached','--name-only']).trim(),groups,files:rows,checks:{candidateFiles:include.length,sourceFiles:currentSource.length,localImports:importsChecked.length,publicAssetRefs:assetsChecked.size,trackedArchiveTs:tracked.filter(p=>p.startsWith('docs/')&&/\.tsx?$/.test(p)).length,problems},excluded,excludedMedia:untracked.filter(p=>p.startsWith('public/')&&!included.has(p)).map(p=>({path:p,bytes:fs.statSync(path.join(root,p)).size})),existingValidation:{routeBuild:'docs/redesign-review/route-swap/build-status.json',scope:'docs/redesign-review/route-swap/scope-verification.json',production:'docs/redesign-review/route-swap/production-route-results.json',privateHttps:'docs/redesign-review/route-swap/private-https-route-results.json'}};
fs.writeFileSync(path.join(__dirname,'manifest.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({head:report.head,branch:report.branch,staged:report.staged,counts:Object.fromEntries(Object.entries(groups).map(([k,v])=>[k,v.length])),mediaMiB:media.reduce((n,p)=>n+fs.statSync(path.join(root,p)).size,0)/1048576,checks:report.checks,excludedCount:excluded.length,excludedMedia:report.excludedMedia},null,2));
if(problems.length||report.staged)process.exitCode=1;
