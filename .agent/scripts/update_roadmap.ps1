$projectId = "PVT_kwHOBryib84BJnlJ"
$statusFieldId = "PVTSSF_lAHOBryib84BJnlJzg5unMg"
$startDateFieldId = "PVTF_lAHOBryib84BJnlJzg5u-5g"
$targetDateFieldId = "PVTF_lAHOBryib84BJnlJzg5u_F8"

$todoOptionId = "f75ad846"
$inProgressOptionId = "47fc9ee4"
$doneOptionId = "98236657"

# Define updates mapping (Title -> {Status, Start, Target})
$updates = @{
    # Phase 1: Foundation (Sept 15 - Oct 15)
    "[FR001] Public Website Structure" = @{status=$doneOptionId; start="2025-09-15"; target="2025-10-01"};
    "[FR002] Theme Toggle" = @{status=$doneOptionId; start="2025-09-20"; target="2025-09-25"};
    "[FR003] Hero Section" = @{status=$doneOptionId; start="2025-09-25"; target="2025-10-05"};
    "[FR024] Admin - Auth" = @{status=$doneOptionId; start="2025-10-01"; target="2025-10-15"};
    
    # Phase 2: Core Features (Oct 15 - Nov 15)
    "[FR025] Admin - Dashboard" = @{status=$doneOptionId; start="2025-10-15"; target="2025-11-01"};
    "[FR013] JohnGPT - Core UI" = @{status=$doneOptionId; start="2025-10-20"; target="2025-11-10"};
    "[FR014] JohnGPT - Multi-Engine" = @{status=$doneOptionId; start="2025-11-01"; target="2025-11-15"};
    
    # Phase 3: Advanced Features (Nov 15 - Dec 1)
    "[FR017] JohnGPT - Personas" = @{status=$doneOptionId; start="2025-11-15"; target="2025-11-30"};
    
    # Phase 4: Current Work (Dec 1 - Dec 15)
    "Complete Database Migration to Neon" = @{status=$inProgressOptionId; start="2025-11-30"; target="2025-12-10"};
    "Implement Chat History & Persistence" = @{status=$inProgressOptionId; start="2025-12-01"; target="2025-12-15"};
    "[FR016] JohnGPT - Brand Voice" = @{status=$inProgressOptionId; start="2025-12-01"; target="2025-12-20"};
    
    # Phase 5: Future (Jan 2026+)
    "[FR034] Virality OS - YouTube Trends" = @{status=$todoOptionId; start="2026-01-01"; target="2026-01-15"};
    "[FR040] Course Builder" = @{status=$todoOptionId; start="2026-02-01"; target="2026-02-28"};
}

# Fetch items
Write-Host "Fetching items..."
$itemsJson = & "C:\Program Files\GitHub CLI\gh.exe" project item-list 3 --owner JStaRFilms --format json --limit 50
$items = $itemsJson | ConvertFrom-Json | Select-Object -ExpandProperty items

foreach ($item in $items) {
    if ($updates.ContainsKey($item.title)) {
        $update = $updates[$item.title]
        Write-Host "Updating '$($item.title)'..."
        
        # Update Status
        & "C:\Program Files\GitHub CLI\gh.exe" project item-edit --id $item.id --project-id $projectId --field-id $statusFieldId --single-select-option-id $update.status
        
        # Update Start Date
        if ($update.start) {
            & "C:\Program Files\GitHub CLI\gh.exe" project item-edit --id $item.id --project-id $projectId --field-id $startDateFieldId --date $update.start
        }
        
        # Update Target Date
        if ($update.target) {
            & "C:\Program Files\GitHub CLI\gh.exe" project item-edit --id $item.id --project-id $projectId --field-id $targetDateFieldId --date $update.target
        }
    }
}
Write-Host "Roadmap updated!"
