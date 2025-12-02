---
description: Intelligent start-of-work workflow that auto-detects context and creates appropriate issues
---
// turbo-all

# Workflow: Smart Start (Intelligent)

This is the **automated** version of starting work. The agent does all the heavy lifting.

## Usage

```
User: "Use /smart_start. I want to work on [describe what you're doing]."
```

## Agent Steps

## Agent Steps

### 1. Scan ALL Work (Issues + Project Board)

**Get GitHub Issues:**
```bash
# Get all real issues (open and recently closed)
gh issue list --repo JStaRFilms/jstar-platform --state all --limit 50 --json number,title,state,labels
```

**Get Project Board Items:**
```bash
# Get all items on project board (includes draft items)
gh project item-list 3 --owner JStaRFilms --format json --limit 50
```

**Important**: Project board can have:
- **Real Issues**: Items linked to GitHub issues
- **Draft Issues**: Planning items not yet converted to issues

### 2. Analyze User Intent

- Parse what the user said they want to work on
- **Search BOTH** GitHub issues AND project draft items for keywords
- Show user matching items from both sources

**Example:**
```
User said: "working on the public vault feature"

Found in GitHub Issues:
- None

Found on Project Board (Drafts):
- [FR010] Public Vault (Draft, Status: Todo)

Ask: "Found draft item 'Public Vault' on the board. Should I convert this to a real issue and start work?"
```

### 3. Smart Issue Creation

**If user selects a GitHub Issue:**
- Ask: "Is this a subtask of #X or the whole thing?"
- If subtask: Create `[SUBTASK]` linked to parent
- If whole thing: Just move issue to "In Progress"

**If user selects a Draft Item:**
- Convert draft to real GitHub issue:
  ```bash
  # Create issue from draft's title and body
  gh issue create --title "[DRAFT_TITLE]" --body "[DRAFT_BODY]" --repo JStaRFilms/jstar-platform
  ```
- Link the new issue to the project board item (replaces draft)
- Move to "In Progress"

**If it's completely new:**
- Create new issue with descriptive title
- Add to project board
- Move to "In Progress"

### 4. Confirmation

Tell user:
```
✅ Started: [SUBTASK] Fix message persistence in chat (#14)
   Part of: #8 - Chat widget not saving messages
   View: https://github.com/JStaRFilms/jstar-platform/issues/14
```

## Full Example Flow

### Example 1: Working on Draft Item

```
User: "Use /smart_start. I'm working on the Public Vault feature."

Agent scans:
- GitHub Issues: None matching "public vault"
- Project Board: [FR010] Public Vault (Draft, Status: Todo)

Agent: "I found a draft item 'Public Vault' on your board. Should I convert it to a real issue and start work?"

User: "Yes"

Agent:
1. Creates Issue #16 from draft: "[FR010] Public Vault"
2. Links issue to existing project board item (replaces draft)
3. Moves to "In Progress"
4. Confirms: "✅ Created Issue #16 from draft and moved to In Progress!"
```

### Example 2: Working on Existing Issue

```
User: "Use /smart_start. I'm adding folder organization to JohnGPT."

Agent scans:
- GitHub Issues: #5 - Implement JohnGPT Advanced Features (OPEN)
- Project Board: Same issue appears there

Agent: "I found #5: JohnGPT Advanced Features. Is this a subtask of #5?"

User: "Yes"

Agent:
1. Creates #17: [SUBTASK] Add folder organization to conversations
2. Links to #5 in body: "Part of #5"
3. Adds to project board
4. Moves to "In Progress"
5. Updates #5 with checklist item

Agent: "✅ Created subtask #17 (part of #5) and moved to In Progress!"
```

### Example 3: Completely New Work

```
User: "Use /smart_start. I'm fixing a navbar responsive bug."

Agent scans:
- GitHub Issues: None matching
- Project Board: None matching

Agent: "No related items found. Creating new issue..."

Agent:
1. Creates #18: "[BUG] Fix navbar responsive layout"
2. Adds to project board
3. Moves to "In Progress"

Agent: "✅ Created new issue #18 and moved to In Progress!"
```

## Script Support

This workflow is **conversational** and requires agent intelligence. No automated script needed - the agent makes smart decisions based on context.
