$ErrorActionPreference = 'Stop'
$root = 'C:\CreativeOS\01_Projects\Code\jstar-platform'
$existing = Get-CimInstance Win32_Process | Where-Object { $_.ExecutablePath -like '*node.exe' -and $_.CommandLine -like '*next*5782*' }
if ($existing) { throw 'Root5782 CLI already exists. Reuse and verify it instead of launching another.' }
$command = '"C:\Program Files\nodejs\node.exe" "C:\CreativeOS\01_Projects\Code\jstar-platform\node_modules\next\dist\bin\next" dev -H 127.0.0.1 -p 5782'
$startup = New-CimInstance -ClassName Win32_ProcessStartup -ClientOnly -Property @{ ShowWindow = [uint16]0 }
$created = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{ CommandLine = $command; CurrentDirectory = $root; ProcessStartupInformation = $startup }
if ($created.ReturnValue -ne 0) { throw ('Local root launch failed: ' + $created.ReturnValue) }
$record = [ordered]@{ pid = $created.ProcessId; port = 5782; address = '127.0.0.1'; workspace = $root; command = $command; started = (Get-Date).ToUniversalTime().ToString('o'); runtime = 'Local WMI-created dev process, independent of temporary QA execution'; protectedPreview = 'No protected process/workspace or Tailscale configuration changed' }
$json = $record | ConvertTo-Json
[System.IO.File]::WriteAllText(($root + '\docs\redesign-review\owner-mobile-corrections\root-server.json'), $json, [System.Text.UTF8Encoding]::new($false))
Write-Output $json
