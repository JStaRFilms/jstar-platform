const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const dir = __dirname;
const root = path.resolve(dir, '../../../../..');
const step = process.argv[2];
if (!['image', 'video'].includes(step)) throw Error('Use image or video');
const workspace = path.join(dir, `${step}-workspace`);
if (fs.existsSync(workspace)) throw Error(`${workspace} already exists; leave the prior comparison intact`);
fs.mkdirSync(workspace);
fs.writeFileSync(path.join(workspace, '.gitignore'), '*\n');
for (const name of ['src', 'config']) fs.cpSync(path.join(root, name), path.join(workspace, name), { recursive: true });
for (const name of ['package.json', 'pnpm-lock.yaml', 'next.config.ts', 'tsconfig.json', 'next-env.d.ts', 'postcss.config.mjs', 'tailwind.config.ts', 'eslint.config.mjs', 'components.json', 'prisma.config.ts']) {
  if (fs.existsSync(path.join(root, name))) fs.copyFileSync(path.join(root, name), path.join(workspace, name));
}
for (const name of ['node_modules', 'public', 'prisma']) fs.symlinkSync(path.join(root, name), path.join(workspace, name), 'junction');
for (const name of ['.env', '.env.local']) if (fs.existsSync(path.join(root, name))) fs.symlinkSync(path.join(root, name), path.join(workspace, name), 'file');
if (process.argv[3] === '--prepare') process.exit(0);
const log = fs.openSync(path.join(dir, `${step}-build.log`), 'w');
const err = fs.openSync(path.join(dir, `${step}-build.err.log`), 'w');
const r = spawnSync(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'build'], { cwd: workspace, windowsHide: true, timeout: 240000, stdio: ['ignore', log, err] });
fs.closeSync(log); fs.closeSync(err);
console.log(`${step} build exit`, r.status, r.signal);
if (r.error) console.error(r.error);
process.exitCode = r.status ?? 1;
