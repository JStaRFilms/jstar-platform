import json
import pathlib
import subprocess
from datetime import datetime, timezone

root = pathlib.Path('C:/CreativeOS/01_Projects/Code/jstar-platform')
evidence = pathlib.Path(__file__).parent
record = json.loads((root / 'docs/redesign-review/viewer-polish/main-server.json').read_text())
branch = subprocess.check_output(['C:/Program Files/Git/mingw64/bin/git.exe', 'branch', '--show-current'], cwd=root, text=True).strip()
assert branch == 'website-redesign', branch
assert pathlib.Path(record['workspace']) == root
assert record['port'] == 5782 and record['address'] == '127.0.0.1'
with (evidence / 'root-dev.log').open('ab') as stdout, (evidence / 'root-dev.err.log').open('ab') as stderr:
    process = subprocess.Popen(record['command'], cwd=root, stdin=subprocess.DEVNULL, stdout=stdout, stderr=stderr,
        creationflags=subprocess.DETACHED_PROCESS | subprocess.CREATE_NEW_PROCESS_GROUP | subprocess.CREATE_BREAKAWAY_FROM_JOB)
info = {'pid':process.pid, 'port':5782, 'address':'127.0.0.1', 'workspace':str(root), 'command':record['command'], 'started':datetime.now(timezone.utc).isoformat(), 'replacesExitedPid':29496, 'runtime':'detached breakaway process, QA file logs', 'protectedPreview':'No protected process or Tailscale configuration changed'}
(evidence / 'current-root-server.json').write_text(json.dumps(info, indent=2))
print(json.dumps(info))
