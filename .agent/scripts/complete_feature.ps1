param([string]$title)

$projectId = "PVT_kwHOBryib84BJnlJ"
$statusFieldId = "PVTSSF_lAHOBryib84BJnlJzg5unMg"
$doneOptionId = "98236657"

# Fetch items
Write-Host "Fetching items..."
$itemsJson = & "C:\Program Files\GitHub CLI\gh.exe" project item-list 3 --owner JStaRFilms --format json --limit 50
$items = $itemsJson | ConvertFrom-Json | Select-Object -ExpandProperty items

foreach ($item in $items) {
    if ($item.title -eq $title) {
        Write-Host "Completing '$title'..."

        # Move to Done on project board
        & "C:\Program Files\GitHub CLI\gh.exe" project item-edit --id $item.id --project-id $projectId --field-id $statusFieldId --single-select-option-id $doneOptionId

        # Close the issue if it's an issue
        if ($item.type -eq "Issue") {
            $issueNumber = $item.number
            Write-Host "Closing issue #$issueNumber..."
            & "C:\Program Files\GitHub CLI\gh.exe" issue close $issueNumber --repo JStaRFilms/jstar-platform
        }

        break
    }
}
Write-Host "Feature completed!"