---
description: Intelligent end-of-work workflow that auto-detects what you completed
---
// turbo-all
# Workflow: Smart Complete (Intelligent)

This is the **automated** version of completing work. The agent figures out what you finished using the local ops script.

## Usage

```
User: "Use /smart_complete. I finished [describe what you did]."
```

## Agent Steps

### 1. Scan Work (Scripted)

Run the local operations script to get a JSON summary of all active context.

```bash
npx tsx src/scripts/smart-ops.ts complete
```

### 2. Match Work to Issues

The script output provides:
- `active_issues`: Issues with "In Progress" or Open status.
- `project_items`: The state of the board.

**Instructions:**
1. **Read** the JSON output.
2. **Match** the user's completed work description to one of the active issues.
3. **If match found**:
   - Close the issue (`gh issue close ...`).
   - Move to "Done" on the project board (`gh project item-edit ...`).
   - Check if parent issue is now fully complete.
4. **If matching draft found**:
   - Convert to issue first (for record keeping), then close it immediately? Or just archive the draft?
   - *Preference*: Convert to issue, then close, so it's in the repo history.
5. **If partial work**:
   - Don't close.
   - Add a comment (`gh issue comment ...`).
   - Ask user if they want to update the status.

### 3. Execution Commands (Reference)

**Close Issue:**
```bash
gh issue close [NUMBER] --comment "Completed via Smart Complete"
```

**Update Project Status:**
(Use `gh project item-edit` similar to Smart Start)

### 4. Confirmation

Tell the user what was closed/updated.
