const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const phase = process.argv[2] || 'after';
if (!['before', 'after'].includes(phase)) throw new Error('Use before or after');
const workspace = path.join(__dirname, phase === 'before' ? 'build-workspace' : 'interaction-fix-workspace');
const log = fs.openSync(path.join(__dirname, `interaction-${phase}-server.log`), 'w');
const server = spawn(process.execPath, [path.resolve('node_modules/next/dist/bin/next'), 'start', '-p', '5893', '-H', '127.0.0.1'], {
  cwd: workspace, windowsHide: true, stdio: ['ignore', log, log],
});
(async () => {
  try {
    let ready = false;
    for (let i = 0; i < 30; i++) {
      try { if ((await fetch('http://127.0.0.1:5893/redesign')).ok) { ready = true; break; } } catch {}
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    if (!ready) throw new Error('Verification server unavailable');
    const child = spawn(process.execPath, [path.join(__dirname, 'verify-interaction-fixes.cjs'), phase], {
      windowsHide: true, env: { ...process.env, REDESIGN_URL: 'http://127.0.0.1:5893/redesign' },
      stdio: ['ignore', fs.openSync(path.join(__dirname, `interaction-${phase}-run.log`), 'w'), fs.openSync(path.join(__dirname, `interaction-${phase}-run.err.log`), 'w')],
    });
    await new Promise(resolve => child.on('exit', code => { console.log(`Verification ${phase}: ${code}`); process.exitCode = code; resolve(); }));
  } finally { server.kill(); fs.closeSync(log); }
})().catch(error => { console.error(error); process.exitCode = 1; });
