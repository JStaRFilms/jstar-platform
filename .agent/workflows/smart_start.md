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

### 1. Scan Existing Issues

```bash
# Get ALL issues (open and recently closed)
gh issue list --repo JStaRFilms/jstar-platform --state all --limit 50 --json number,title,state,labels
```

### 2. Analyze User Intent

- Parse what the user said they want to work on
- Search for related issues by keywords
- Show user matching issues (if any)

**Example:**
```
User said: "fixing the chat save bug"

Found related issues:
- #8: Chat widget not saving messages (OPEN)
- #11: Fix JohnGPT Context Detection (CLOSED)

Ask: "Are you working on #8, or is this something new?"
```

### 3. Smart Issue Creation

**If user confirms existing issue:**
- Ask: "Is this a subtask of #8 or the whole thing?"
- If subtask: Create `[SUBTASK]` linked to parent
- If whole thing: Just move #8 to "In Progress"

**If it's new:**
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

```
User: "Use /smart_start. I'm adding folder organization to JohnGPT."

Agent thinks:
- Searches issues for "folder", "organization", "JohnGPT"
- Finds: #5 - Implement JohnGPT Advanced Features (OPEN)

Agent: "I found #5: JohnGPT Advanced Features. Is this a subtask of #5?"

User: "Yes"

Agent:
1. Creates #15: [SUBTASK] Add folder organization to conversations
2. Links to #5 in body: "Part of #5"
3. Adds to project board
4. Moves to "In Progress"
5. Updates #5 with checklist item

Agent: "✅ Created subtask #15 (part of #5) and moved to In Progress!"
```

## Script Support

This workflow is **conversational** and requires agent intelligence. No automated script needed - the agent makes smart decisions based on context.
