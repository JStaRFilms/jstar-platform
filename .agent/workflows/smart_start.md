---
description: Intelligent start-of-work workflow that auto-detects context and creates appropriate issues
---
// turbo-all

# Workflow: Smart Start (Intelligent)

This is the **automated** version of starting work. The agent does all the heavy lifting using the local ops script.

## Usage

```
User: "Use /smart_start. I want to work on [describe what you're doing]."
```

## Agent Steps

### 1. Scan Work (Scripted)

Run the local operations script to get a JSON summary of all active context.

```bash
npx tsx src/scripts/smart-ops.ts start
```

### 2. Analyze User Intent

The script output provides:
- `active_issues`: Open issues in GitHub.
- `project_items`: Drafts and items on the project board.

**Instructions:**
1. **Read** the JSON output from the previous step.
2. **Match** the user's intent to an existing issue or draft.
3. **If matching issue found**:
   - Ask if it's a subtask or the main task.
   - If subtask, create a new issue linked to the parent.
   - If main task, move it to "In Progress" (if not already).
4. **If matching draft found**:
   - Convert it to a real issue.
   - Move to "In Progress".
5. **If NEW**:
   - Create a new issue.
   - Move to "In Progress".

### 3. Execution Commands (Reference)

Examples of commands you might generate based on the analysis:

**Create Issue:**
```bash
gh issue create --title "..." --body "..." --repo JStaRFilms/jstar-platform
```

**Move to In Progress:**
```bash
# Get item ID first if needed
gh project item-edit --id [ITEM_ID] --field-id [STATUS_FIELD_ID] --project-id 3 --text "In Progress"
```
(Note: The script outputs strict JSON. You (the Agent) are the logic engine that decides which `gh` command to run next.)

### 4. Confirmation

Tell the user what was started.
