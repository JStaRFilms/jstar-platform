
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

// --- 1. CONFIGURATION (Will be overwritten by Global Generator) ---
const CONFIG = {
    REPO_OWNER: 'JStaRFilms',
    REPO_NAME: 'jstar-platform',
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

// --- 2. TYPES ---
interface Issue {
    number: number;
    title: string;
    state: string;
    labels: { name: string }[];
    body: string;
}

interface ProjectItem {
    id: string;
    title: string;
    status: string;
    content: {
        type: 'Issue' | 'DraftIssue';
        number?: number;
        repository?: string;
    };
}

interface ContextOutput {
    config: typeof CONFIG;
    active_issues: Issue[];
    project_items: ProjectItem[];
    recent_activity: string[];
    timestamp: string;
}

// --- 3. HELPERS ---
async function runGhCommand(command: string): Promise<any> {
    try {
        const { stdout } = await execAsync(command);
        return JSON.parse(stdout);
    } catch (error) {
        console.error(`Error running command: ${command}`, error);
        return [];
    }
}

// --- 4. COMMANDS ---

async function getContext() {
    console.log('🔍 gathering context...');

    // Parallel fetch for speed
    const [issues, projectItems] = await Promise.all([
        // Get Issues
        runGhCommand(`gh issue list --repo ${CONFIG.REPO_OWNER}/${CONFIG.REPO_NAME} --state open --limit 50 --json number,title,state,labels,body`),
        // Get Project Items (Active)
        runGhCommand(`gh project item-list ${CONFIG.PROJECT_NUMBER} --owner ${CONFIG.REPO_OWNER} --format json --limit 50`)
    ]);

    const output: ContextOutput = {
        config: CONFIG,
        active_issues: issues,
        project_items: projectItems?.items || [],
        recent_activity: [], // TODO: Add git log?
        timestamp: new Date().toISOString()
    };

    console.log('✅ Context gathered successfully.');
    console.log('---------------------------------------------------');
    console.log(JSON.stringify(output, null, 2));
    console.log('---------------------------------------------------');
}

// --- 5. MAIN ---
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'start':
            await getContext();
            break;
        case 'complete':
            await getContext(); // Re-use for now, refine later
            break;
        default:
            console.log('Usage: tsx src/scripts/smart-ops.ts [start|complete]');
    }
}

main().catch(console.error);
