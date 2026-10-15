const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const workspace = path.resolve(__dirname, '..');
const statusPath = path.join(__dirname, 'build-status.json');
const logPath = path.join(__dirname, 'build.log');
const log = fs.openSync(logPath, 'w');
const started = new Date().toISOString();
const child = spawn(process.execPath, [path.join(workspace, 'node_modules/next/dist/bin/next'), 'build'], {
  cwd: workspace,
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
  windowsHide: true,
  stdio: ['ignore', log, log],
});
fs.writeFileSync(statusPath, JSON.stringify({ status: 'running', runnerPid: process.pid, pid: child.pid, started }, null, 2));
child.on('error', error => {
  fs.writeFileSync(statusPath, JSON.stringify({ status: 'failed', started, finished: new Date().toISOString(), error: error.message }, null, 2));
});
child.on('close', (code, signal) => {
  fs.closeSync(log);
  fs.writeFileSync(statusPath, JSON.stringify({ status: code === 0 ? 'passed' : 'failed', started, finished: new Date().toISOString(), exitCode: code, signal }, null, 2));
});
