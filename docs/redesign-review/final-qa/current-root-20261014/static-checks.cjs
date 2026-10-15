const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '../../../..');
const node = process.execPath;
const report = { started: new Date().toISOString(), checks: [] };
const targets = ['src/content/selected-work.ts', 'src/app/redesign/Hero.tsx', 'src/app/redesign/SelectedWorkGallery.tsx', 'src/app/redesign/PortfolioViewer.tsx', 'src/app/redesign/PortfolioMedia.tsx', 'src/app/redesign/ClosingSequence.tsx', 'src/app/redesign/TeamSection.tsx'];
function command(name, args, env = process.env) {
  const started = Date.now();
  const result = spawnSync(node, args, { cwd: root, env, encoding: 'utf8', timeout: 180000, maxBuffer: 3000000 });
  report.checks.push({ name, exitCode: result.status, elapsedMs: Date.now() - started, stdout: result.stdout, stderr: result.stderr, error: result.error?.message });
  console.log(name + ': ' + result.status);
}
command('all-current-src scoped TypeScript', [path.join(root, 'node_modules/typescript/bin/tsc'), '-p', 'docs/redesign-review/tsconfig.portfolio-viewers.json', '--noEmit', '--incremental', 'false', '--pretty', 'false']);
const shim = fs.readFileSync(path.join(root, 'node_modules/.bin/eslint.CMD'), 'utf8');
const nodePath = shim.match(/@SET "NODE_PATH=([^"]+)"/)?.[1];
if (!nodePath) throw Error('Configured lint dependency paths unavailable');
command('focused ESLint', [path.join(root, 'node_modules/eslint/bin/eslint.js'), ...targets], { ...process.env, NODE_PATH: nodePath });
try {
  const ts = require(path.join(root, 'node_modules/typescript'));
  const source = fs.readFileSync(path.join(root, 'src/content/selected-work.ts'), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const context = { exports: {}, require: () => { throw Error('Unexpected data dependency'); } };
  vm.runInNewContext(js, context);
  const projects = context.exports.selectedWork;
  const ids = ['adaptive-study-game', 'school-management-system', 'nifemi', 'sharon', 'books-and-bills', 'forest-sequence', 'worship-medley', 'samsung-vivid-colors', 'brushes-of-gold', 'welcome-to-church', 'fear-women', 'everything', 'meet-monjolaoluwa'];
  assert.equal(JSON.stringify(projects.map(p => p.id)), JSON.stringify(ids));
  assert.equal(new Set(projects.map(p => p.id)).size, 13);
  assert.equal(projects.filter(p => p.presentation.type === 'film').length, 2);
  assert.equal(projects.filter(p => p.presentation.type === 'youtube').length, 9);
  const native = projects.filter(p => p.presentation.type === 'film');
  assert.equal(native[0].presentation.fullSrc, '/redesign/nifemi.mp4');
  assert.equal(native[1].presentation.fullSrc, '/redesign/sharon-mobile-candidate.mp4');
  const youtubeIds = ['p1yqihuevu0', 'W9tVsQjrORc', 'xzXaKeQi8YQ', 'mQU9SJwNGo0', 'Up46AtcYwTY', 'c9qb9ZVG48I', 'VYIWXJlIzMs', 'oAmKb6Zy6_4', 'ZdaMD-g-EzQ'];
  assert.equal(JSON.stringify(projects.filter(p => p.presentation.type === 'youtube').map(p => p.presentation.youtubeId)), JSON.stringify(youtubeIds));
  for (const p of projects.filter(p => p.kind === 'software')) {
    assert.match(p.notes.contributors.find(c => c.id === 'john').role, /Lead Architect.*Full.Stack Developer/);
    for (const id of ['JS004', 'JS005']) assert.equal(p.notes.contributors.find(c => c.id === id).role.toLowerCase(), 'studio support');
  }
  const melo = projects.find(p => p.id === 'school-management-system');
  assert.equal(melo.websiteHref, 'https://www.meloschool.com/');
  assert.equal(melo.detailsHref, undefined);
  const assets = new Set();
  for (const p of projects) {
    for (const key of ['poster', 'previewSrc', 'fullSrc', 'src']) if (p.presentation[key]) assets.add(p.presentation[key]);
    for (const c of p.notes?.contributors || []) if (c.image) assets.add(c.image);
  }
  for (const asset of assets) assert.ok(fs.existsSync(path.join(root, 'public', asset)), 'Missing asset ' + asset);
  const baseline = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline.json'), 'utf8'));
  const whitespace = [];
  for (const file of Object.keys(baseline.hashes).filter(p => /\.(tsx?|css)$/.test(p))) fs.readFileSync(path.join(root, file), 'utf8').split('\n').forEach((line, index) => { if (/[ \t]+\r?$/.test(line)) whitespace.push({ file, line: index + 1 }); });
  assert.equal(whitespace.length, 0, JSON.stringify(whitespace));
  report.checks.push({ name: 'current roster, approval-boundary, local assets and source whitespace assertions', exitCode: 0, count: projects.length, assets: assets.size, sourceFingerprint: baseline.sourceFingerprint });
  console.log('content/asset/whitespace assertions: 0');
} catch (error) { report.checks.push({ name: 'content/asset/whitespace assertions', exitCode: 1, error: error.stack }); console.log(error.message); }
report.finished = new Date().toISOString();
report.passed = report.checks.every(c => c.exitCode === 0);
fs.writeFileSync(path.join(__dirname, 'static-results.json'), JSON.stringify(report, null, 2));
if (!report.passed) process.exitCode = 1;
