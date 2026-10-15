"""Owner-authorised restart of the verified loopback 5782 preview only."""
import json
import subprocess
from pathlib import Path
from datetime import datetime, timezone

root = Path(__file__).resolve().parents[3]
output = Path(__file__).resolve().parent
verify_and_stop = r"""
$root = Get-CimInstance Win32_Process -Filter 'ProcessId=69140'
$child = Get-CimInstance Win32_Process -Filter 'ProcessId=12736'
if (!$root -or $root.CommandLine -notmatch 'next.* dev .* -p 5782') { throw 'Root process identity changed; no stop authorised.' }
if (!$child -or $child.ParentProcessId -ne 69140 -or $child.CommandLine -notmatch 'jstar-platform.*next.*start-server.js') { throw 'Child process identity changed; no stop authorised.' }
if ($root.ProcessId -eq 79948 -or $child.ProcessId -eq 79948) { throw 'Protected preview matched; abort.' }
Stop-Process -Id 69140 -Force -ErrorAction Stop
$still = Get-CimInstance Win32_Process -Filter 'ProcessId=12736'
if ($still) {
  if ($still.CommandLine -ne $child.CommandLine) { throw 'Child identity changed after root stop; abort.' }
  Stop-Process -Id 12736 -Force -ErrorAction Stop
}
"""
subprocess.run(['powershell.exe', '-NoProfile', '-Command', verify_and_stop], check=True, timeout=25)
command = ['C:/Program Files/nodejs/node.exe', str(root / 'node_modules/next/dist/bin/next'), 'dev', '-H', '127.0.0.1', '-p', '5782']
with (output / 'main-dev-server.stdout.log').open('ab') as stdout, (output / 'main-dev-server.stderr.log').open('ab') as stderr:
    process = subprocess.Popen(command, cwd=root, stdin=subprocess.DEVNULL, stdout=stdout, stderr=stderr,
                               creationflags=subprocess.DETACHED_PROCESS | subprocess.CREATE_NEW_PROCESS_GROUP)
record = {'pid': process.pid, 'port': 5782, 'address': '127.0.0.1', 'workspace': str(root),
          'command': command, 'started': datetime.now(timezone.utc).isoformat(), 'stopped': [69140, 12736],
          'protectedPreviewPid': 79948, 'protectedPreviewPort': 5912}
(output / 'main-server.json').write_text(json.dumps(record, indent=2) + '\n')
print(json.dumps(record))
