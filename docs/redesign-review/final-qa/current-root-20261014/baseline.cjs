const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '../../../..');
const git = 'C:/Program Files/Git/mingw64/bin/git.exe';
const run = args => execFileSync(git, args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const files = [];
function walk(directory) {
  for (const entry of fs.readdirSync(path.join(root, directory), { withFileTypes: true })) {
    const file = directory + '/' + entry.name;
    if (entry.isDirectory()) walk(file);
    else if (/\.(tsx?|css)$/.test(entry.name)) files.push(file);
  }
}
walk('src/app/redesign');
files.push('src/content/selected-work.ts', 'docs/redesign-review/tsconfig.portfolio-viewers.json');
const hashes = Object.fromEntries(files.map(file => [file, crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex')]));
const records = [
  'docs/redesign-review/viewer-polish/main-server.json',
  'docs/redesign-review/performance-audit/recheck/owner-preview/server.json',
];
const protectedRecords = Object.fromEntries(records.map(file => [file, { content: JSON.parse(fs.readFileSync(path.join(root, file), 'utf8')), sha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex') }]));
const status = run(['status', '--porcelain=v1', '--untracked-files=normal']);
const sourceFingerprint = crypto.createHash('sha256').update(JSON.stringify(hashes)).digest('hex');
const output = path.join(__dirname, 'baseline.json');
if (fs.existsSync(output)) throw new Error('Existing QA baseline must not be overwritten');
fs.writeFileSync(output, JSON.stringify({ captured: new Date().toISOString(), root, branch: run(['branch', '--show-current']), head: run(['rev-parse', 'HEAD']), status, hashes, sourceFingerprint, protectedRecords, target: 'https://johnsax.tailb6e2d3.ts.net:3461/redesign', transport: 'current root dev server, ordinary HTTP; no disk-layout transport' }, null, 2));
console.log(JSON.stringify({ files: files.length, sourceFingerprint, output, staged: run(['diff', '--cached', '--name-only']) || 'none' }));
