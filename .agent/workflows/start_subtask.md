---
description: Start working on a subtask of a larger feature. Creates a linked GitHub Issue.
---

# Workflow: Start Subtask

Follow these steps when the user wants to work on a **subtask** of a larger feature.

## When to Use This

- You have a parent issue (e.g., #5: "Implement JohnGPT Advanced Features")
- You're working on one specific part (e.g., "Add conversation search")
- You want to track the subtask separately with its own dates

## 1. Identify the Parent Issue

```bash
# Find the parent issue number
gh issue list --search "Parent Feature Name" --state open
```

## 2. Create the Subtask Issue

```bash
# Create subtask with reference to parent
gh issue create \
  --title "[SUBTASK] Specific Task Name" \
  --body "Part of #PARENT_NUMBER

## Description
What this subtask accomplishes.

## Parent Issue
Closes part of #PARENT_NUMBER" \
  --label "subtask" \
  --assignee "@me" \
  --repo JStaRFilms/jstar-platform
```

**Note**: The `[SUBTASK]` prefix helps identify these in lists.

## 3. Add to Project Board

```bash
# Add the subtask URL to the project
gh project item-add 3 --owner JStaRFilms --url <SUBTASK_ISSUE_URL>
```

## 4. Move to "In Progress"

Use the same process as regular issues (see `start_feature.md`).

## 5. Update Parent Issue Checklist

Manually add or check off the item in the parent issue's task list:

```markdown
<!-- In parent issue #5 -->
- [ ] Add conversation search (#NEW_SUBTASK_NUMBER)
- [ ] Implement folder organization
- [ ] Add export feature
```

## 6. Confirm to User

Tell the user:
- "I've created **Subtask #XX** (part of #PARENT_NUMBER) and moved it to **In Progress**."
- "You can view it on the board: https://github.com/users/JStaRFilms/projects/3"

---

## When Completing a Subtask

1. Close the subtask issue normally (`/complete_feature`)
2. Check it off in the parent issue's task list
3. When **all subtasks** are checked, close the parent issue
