const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../../../..');
const ts = require(path.join(root, 'node_modules/typescript'));
const baseline = JSON.parse(fs.readFileSync(path.join(__dirname, 'before.json'), 'utf8'));
function data(file) {
  const context = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  vm.runInNewContext(code, context);
  return JSON.parse(JSON.stringify(context.exports));
}
const report = { checked:new Date().toISOString(), checks:[] };
try {
  const staff = data('src/content/about-company.ts').companyData.teamMembers.find(m => m.employeeId === 'JS002');
  assert.deepEqual(staff, baseline.staff);
  assert.equal(staff.name, 'Monjolaoluwa Aminu');
  const projects = data('src/content/selected-work.ts').selectedWork;
  const expected = structuredClone(baseline.selectedWork);
  for (const id of ['books-and-bills', 'fear-women', 'meet-monjolaoluwa']) {
    const project = expected.find(p => p.id === id);
    const credit = project.notes.contributors.find(c => c.id === 'monjola');
    credit.id = staff.employeeId;
    credit.name = staff.name;
    credit.image = staff.imageUrl;
    credit.context = staff.role + ' at J StaR Films Studios.' + (id === 'books-and-bills' ? ' Mass communication graduate.' : '');
    credit.links = [{ label:'YouTube', href:'https://www.youtube.com/@monjolaoluwaaminu' }];
    if (id === 'books-and-bills') project.notes.story[0] = project.notes.story[0].replace('with Monjola helping', 'with Monjolaoluwa Aminu helping');
    if (id === 'fear-women') {
      credit.role = 'Director, acting and project coordination';
      project.notes.story[0] = project.notes.story[0].replace('Monjola, who also co-directed', 'Monjolaoluwa Aminu, who also directed');
      project.notes.pending = project.notes.pending.replace('No sole-direction or script credit is inferred.', 'No script credit is inferred.');
    }
    if (id === 'meet-monjolaoluwa') project.notes.story[0] = project.notes.story[0].replace('Monjola wanted', 'Monjolaoluwa Aminu wanted');
  }
  assert.deepEqual(projects, expected, 'Only approved identity/story/leadership fields may change');
  assert.equal(projects.length, 13);
  assert.equal(projects.find(p => p.id === 'fear-women').notes.contributors.find(c => c.id === 'john').role, baseline.selectedWork.find(p => p.id === 'fear-women').notes.contributors.find(c => c.id === 'john').role);
  for (const [file, hash] of Object.entries(baseline.unchangedFiles)) assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex'), hash, 'Unexpected rendering/state or staff-record change: ' + file);
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'public' + staff.imageUrl))).digest('hex'), baseline.portraitHash);
  report.checks = ['Canonical staff identity and original portrait unchanged', 'Exactly three approved contributor corrections', 'Fear director, John co-director; Books/Meet roles retained', 'All thirteen records/order/media and other contributors unchanged', 'Viewer/quiz/player/rendering files unchanged'];
  report.sourceSha256 = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'src/content/selected-work.ts'))).digest('hex');
  report.passed = true;
} catch (error) { report.passed=false; report.error=error.stack; process.exitCode=1; }
fs.writeFileSync(path.join(__dirname, 'content-results.json'), JSON.stringify(report,null,2));
console.log(JSON.stringify(report));
