---
description: Intelligent end-of-work workflow that auto-detects what you completed
---
// turbo-all

# Workflow: Smart Complete (Intelligent)

This is the **automated** version of completing work. The agent figures out what you finished.

## Usage

```
User: "Use /smart_complete. I finished [describe what you did]."
```

## Agent Steps

### 1. Scan Current Work (Issues + Project Board)

**Get GitHub Issues:**
```bash
# Get all open issues with "In Progress" label
gh issue list --repo JStaRFilms/jstar-platform --state open --json number,title,labels
```

**Get Project Board "In Progress" Items:**
```bash
# Get all items currently in progress on the board
gh project item-list 3 --owner JStaRFilms --format json --limit 50
# Filter for items with status = "In Progress"
```

**Combine both** to show complete picture of active work.

### 2. Match Work to Issues

**Show user what's active:**
```
Currently in progress:
- #12: [SUBTASK] Fix message persistence
- #14: [SUBTASK] Add folder organization
- #7: Implement user profiles

Which one(s) did you complete?
```

### 3. Smart Completion

**User says:** "I finished the message persistence fix"

**Agent:**
1. Identifies #12 as the match
2. Checks if it's a subtask (has parent reference)
3. Closes #12
4. Updates parent #8 checklist: `- [x] Fix message persistence (#12)`
5. Moves #12 to "Done" on project board
6. Checks if ALL subtasks of #8 are done → if yes, suggest closing #8 too

### 4. Partial Work Detection

**User says:** "I made progress on folder organization but it's not done yet"

**Agent:**
- Adds comment to #14: "Progress update: [user's description]"
- Keeps in "In Progress"
- Asks: "Want to continue tomorrow or create a new subtask for the remaining work?"

### 5. Multiple Completions

**User says:** "I finished two things: the chat fix and started folder organization"

**Agent:**
1. Closes #12 (chat fix)
2. Keeps #14 (folder org) in progress
3. Asks about any other work done that doesn't match existing issues

## Full Example Flow

```
User: "Use /smart_complete. I fixed the context detection bug."

Agent scans:
- #11: Fix JohnGPT Context Detection (In Progress)
- #12: [SUBTASK] Fix message persistence (In Progress)

Agent: "Did you complete #11 (Fix JohnGPT Context Detection)?"

User: "Yes"

Agent:
1. Closes #11
2. Moves to "Done"
3. Adds completion comment
4. Checks for related open issues

Agent: "✅ Closed #11 and moved to Done! 
       📊 Parent issue #8 now has 1/3 subtasks completed."
```

## Edge Cases

### Nothing in Progress
**Agent:** "I don't see any issues in progress. Did you work on something new? Let me create an issue retroactively."

### User worked on something not tracked
**User:** "I fixed a bug that's not in any issue"

**Agent:**
1. "Let me create an issue for that work."
2. Creates: "[BUG] [user's description]"
3. Immediately closes it as completed
4. Shows in "Done" with today's date as start + end

### Multiple days on same task
**Agent detects:** Issue #14 was opened 3 days ago

**Agent:** "This took 3 days to complete. Want to add a comment explaining the complexity?"

## Script Support

This workflow is **conversational** and requires agent intelligence to match work to issues. No automated script - the agent makes smart decisions.
