---
description: Initialize Smart Ops for this repository (Global Generator)
---
# Workflow: Initialize Smart Ops

This workflow bootstraps the **Smart Start** and **Smart Complete** workflows for the current repository.
It generates the necessary scripts and workflow files, hardcoding the repository context.

## Steps

### 1. Detect Repository Context
The agent should verify the current repository details.
```bash
gh repo view --json owner,name,url
```

### 2. Generate `src/scripts/smart-ops.ts`
Create (or overwrite) the core operations script with the detected config.

**Template to use:**
(Agent: Replace `{{OWNER}}` and `{{REPO}}` with actual values. You must also fetch the Project Board IDs if they are not standard, or use the defaults below).

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

// --- 1. CONFIGURATION ---
const CONFIG = {
  REPO_OWNER: '{{OWNER}}',
  REPO_NAME: '{{REPO}}',
  PROJECT_NUMBER: 3,
  // Hardcoded Board IDs for reliable automation
  BOARD: {
    PROJECT_ID: 'PVT_kwHOBryib84BJnlJ', // J StaR Personal Platform Roadmap
    FIELDS: {
      STATUS: 'PVTSSF_lAHOBryib84BJnlJzg5unMg',
    },
    STATUS_OPTIONS: {
      TODO: 'f75ad846',
      IN_PROGRESS: '47fc9ee4',
      DONE: '98236657',
    }
  }
};

// ... (Rest of the script content)
// Include types, helpers, context logic, and main function here.
// See `src/scripts/smart-ops.ts` for full reference.
```

### 3. Generate Local Workflows
Create `.agent/workflows/smart_start.md` and `.agent/workflows/smart_complete.md`.

(See `smart_start.md` and `smart_complete.md` for templates)

## Agent Action
- Create the files as described above.
- Ensure `src/scripts/smart-ops.ts` is executable.
