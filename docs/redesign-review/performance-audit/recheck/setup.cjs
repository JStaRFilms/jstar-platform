const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const root = process.cwd();
const out = __dirname;
const workspace = path.join(out, 'build-workspace');
if (fs.existsSync(workspace)) throw new Error('Workspace already exists; do not overwrite.');
fs.mkdirSync(workspace);
fs.writeFileSync(path.join(workspace, '.gitignore'), '*\n');
for (const name of ['src','config']) fs.cpSync(path.join(root,name), path.join(workspace,name), {recursive:true});
for (const name of ['package.json','pnpm-lock.yaml','next.config.ts','tsconfig.json','next-env.d.ts','postcss.config.mjs','tailwind.config.ts','eslint.config.mjs','components.json','prisma.config.ts']) {
 if(fs.existsSync(path.join(root,name))) fs.copyFileSync(path.join(root,name),path.join(workspace,name));
}
for(const name of ['node_modules','public','prisma']) fs.symlinkSync(path.join(root,name),path.join(workspace,name),'junction');
// Environment is available to Next without copying secrets into evidence.
for(const name of ['.env','.env.local']) if(fs.existsSync(path.join(root,name))) fs.symlinkSync(path.join(root,name),path.join(workspace,name),'file');
const git = args => cp.execFileSync('git', args, {encoding:'utf8'});
const files = git(['ls-files','src','config','next.config.ts','package.json','pnpm-lock.yaml']).trim().split('\n');
const hashes = Object.fromEntries(files.filter(f=>fs.existsSync(f)).map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')]));
fs.writeFileSync(path.join(out,'baseline.json'),JSON.stringify({timestamp:new Date().toISOString(),root,workspace,commit:git(['rev-parse','HEAD']).trim(),status:git(['status','--short']),diff:git(['diff','--','docs/redesign-review/verify-tablet.cjs']),node:process.version,platform:process.platform,sourceHashes:hashes},null,2));
const child = cp.spawn(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'build'],{cwd:workspace,stdio:['ignore',fs.openSync(path.join(out,'build.log'),'w'),fs.openSync(path.join(out,'build.err.log'),'w')],windowsHide:true});
fs.writeFileSync(path.join(out,'build-pid.json'),JSON.stringify({pid:child.pid}));
child.unref();
console.log(JSON.stringify({workspace,buildPid:child.pid,timestamp:new Date().toISOString()}));
