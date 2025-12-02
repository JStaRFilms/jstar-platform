# Daily Development Workflow

This document defines the standard process for working on the J StaR Personal Platform. It ensures that our GitHub Project Board remains a "living" reflection of reality without adding overhead to your creative flow.

---

## 🎯 **RECOMMENDED: Smart Workflows** (Zero Manual Work)

These are the **easiest** workflows - you just describe what you're doing, and the agent handles everything.

### **Start of Work** - `/smart_start`

**You say:** *"Use `/smart_start`. I'm working on [describe what you're doing]."*

**Agent will:**
1. 🔍 Scan all existing issues
2. 🤔 Show you related issues if any
3. 💬 Ask if it's new work or part of existing issue
4. ✅ Create appropriate issue/subtask automatically
5. 🚀 Move to "In Progress"

**Example:**
```
You: "Use /smart_start. I'm fixing the chat save bug."

Agent: "Found #8: Chat widget not saving. Part of this or new?"
You: "Part of #8"
Agent: "✅ Created subtask #14 (part of #8) and moved to In Progress!"
```

### **End of Work** - `/smart_complete`

**You say:** *"Use `/smart_complete`. I finished [describe what you did]."*

**Agent will:**
1. 🔍 Check what's currently "In Progress"
2. 🎯 Match your work to the right issue(s)
3. ✅ Close completed issues
4. 📊 Update parent issue checklists
5. 🎉 Move to "Done"

**Example:**
```
You: "Use /smart_complete. I fixed the context detection."

Agent: "Found #11 in progress. Close it?"
You: "Yes"
Agent: "✅ Closed #11 and moved to Done!"
```

---

## 📋 **Alternative: Manual Workflows** (More Control)

If you prefer to specify exactly what to create:

### Phase 1: Start a Task 🚀

**For a NEW top-level feature:**

**You say:** *"Agent, let's work on [Feature Name]. Use `/start_feature`."*

**The Agent will:**
1.  **Create Issue:** Create a **Real GitHub Issue** in the repository (e.g., `Issue #42`).
2.  **Add to Board:** Add this issue to the Roadmap project (https://github.com/users/JStaRFilms/projects/3).
3.  **Move to In Progress:** Move the card to the **In Progress** column.
4.  **Record Start Date:** The issue creation date serves as the start timestamp.

---

**For a SUBTASK of an existing feature:**

**You say:** *"Agent, let's work on [Subtask Name] as part of issue #5. Use `/start_subtask`."*

**The Agent will:**
1.  **Create Subtask Issue:** Create a linked issue with `[SUBTASK]` prefix and reference to parent.
2.  **Add to Board:** Add this subtask to the project board.
3.  **Move to In Progress:** Same as regular issues.
4.  **Update Parent:** Add checklist item to parent issue (if it has a task list).

**Example:**
- Parent: `#5 - Implement JohnGPT Advanced Features`
- Subtask: `#12 - [SUBTASK] Add conversation search` (part of #5)


### Phase 2: The Build (Iterative) 🔨

**You say:** *"I've finished the basic UI, now let's hook up the API."*

**The Agent will:**
1.  **Update:** Add comments to the Issue or update the PR.
2.  **Commit:** Use commit messages like `feat: add UI logic (ref #42)` to link code to the task.

### Phase 3: Finish & Verify ✅

**You say:** *"Okay, that works perfectly. Let's wrap this up. Use `/complete_feature`."*

**The Agent will:**
1.  **Close Issue:** Run `gh issue close #42` with completion comment.
2.  **Move to Done:** Ensure the card moves to **Done** on the roadmap.
3.  **Record End Date:** The issue close date serves as the completion timestamp.
4.  **Celebrate:** Confirm completion with issue and project board links.

---

## Date Tracking

### Start Date
- **Automatically recorded** when GitHub Issue is created
- Visible in issue metadata and project board
- Represents when work actually began

### End Date  
- **Automatically recorded** when GitHub Issue is closed
- Represents when feature was completed and verified
- Used to calculate total time spent

### Viewing Dates
1. **Issue Page**: https://github.com/JStaRFilms/jstar-platform/issues/[NUMBER]
2. **Project Board**: https://github.com/users/JStaRFilms/projects/3 (timeline view)

---

## Agent Instructions (System Prompt)

*For the Agent reading this:*

### When user says "let's work on..." or mentions `/start_feature`
👉 **IMMEDIATELY run the `start_feature` workflow** (see `.agent/workflows/start_feature.md`)

### When user says "let's work on [task] as part of #X" or mentions `/start_subtask`
👉 **IMMEDIATELY run the `start_subtask` workflow** (see `.agent/workflows/start_subtask.md`)
- This creates a linked child issue
- Labels it as "subtask"
- References the parent issue in the body

### When user says "wrap this up" or mentions `/complete_feature`  
👉 **IMMEDIATELY run the `complete_feature` workflow** (see `.agent/workflows/complete_feature.md`)
- For subtasks, also check off the item in parent issue's task list

### If user forgot to mention workflow at start
- You can still create the issue retroactively
- Add a note in the issue body: "Started: YYYY-MM-DD, Completed: YYYY-MM-DD"
- Explain to user that mentioning workflow at START gives better date tracking

---

## Quick Reference

**Project Board**: https://github.com/users/JStaRFilms/projects/3  
**Project ID**: `PVT_kwHOBryib84BJnlJ`  
**Owner**: `JStaRFilms`  
**Repo**: `JStaRFilms/jstar-platform`
