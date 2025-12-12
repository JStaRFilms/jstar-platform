// src/orchestrator.ts
// The Runner: J Star Code Review Orchestrator
// Uses the Vercel AI SDK for structured output with Zod validation.

import { generateObject } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { Octokit } from '@octokit/rest';

import { TRIAGE_SYSTEM_PROMPT, ANALYST_SYSTEM_PROMPT, buildAnalystUserPrompt } from './prompts.js';
import {
    TriageSchema,
    JStarReviewSchema,
    EnvSchema,
    type TriageResult,
    type JStarReviewResult,
    type Finding,
    type Verdict,
} from './types.js';

// Initialize Groq provider
const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
});

// Model configuration from env
const TRIAGE_MODEL = process.env.TRIAGE_MODEL || 'llama-3.1-8b-instant';
const ANALYST_MODEL = process.env.ANALYST_MODEL || 'llama-3.3-70b-versatile';

// ============================================================
// ENVIRONMENT VALIDATION
// ============================================================

function validateEnv() {
    const result = EnvSchema.safeParse(process.env);
    if (!result.success) {
        console.error('❌ Environment validation failed:');
        result.error.issues.forEach((err) => {
            console.error(`   - ${err.path.join('.')}: ${err.message}`);
        });
        process.exit(1);
    }
    return result.data;
}

// ============================================================
// GITHUB CONTEXT
// ============================================================

interface GitHubContext {
    owner: string;
    repo: string;
    prNumber: number;
    commentId?: number;
    octokit: Octokit;
}

function initGitHub(env: ReturnType<typeof validateEnv>): GitHubContext {
    const [owner, repo] = env.GITHUB_REPOSITORY.split('/');
    return {
        owner,
        repo,
        prNumber: parseInt(env.PR_NUMBER, 10),
        commentId: env.COMMENT_ID ? parseInt(env.COMMENT_ID, 10) : undefined,
        octokit: new Octokit({ auth: env.GITHUB_TOKEN }),
    };
}

// ============================================================
// PR DIFF FETCHING
// ============================================================

async function fetchPRDiff(ctx: GitHubContext): Promise<string> {
    const response = await ctx.octokit.pulls.get({
        owner: ctx.owner,
        repo: ctx.repo,
        pull_number: ctx.prNumber,
        mediaType: { format: 'diff' },
    });

    // The diff comes as a string when mediaType is 'diff'
    return response.data as unknown as string;
}

async function fetchPRFiles(ctx: GitHubContext): Promise<string[]> {
    const response = await ctx.octokit.pulls.listFiles({
        owner: ctx.owner,
        repo: ctx.repo,
        pull_number: ctx.prNumber,
        per_page: 100,
    });

    return response.data.map((file) => file.filename);
}

// ============================================================
// TRIAGE (Step 1: Cheap Gatekeeper)
// ============================================================

async function runTriage(files: string[], diffLength: number): Promise<TriageResult> {
    console.log(`🔍 Running Triage with ${TRIAGE_MODEL}...`);

    const { object } = await generateObject({
        model: groq(TRIAGE_MODEL),
        schema: TriageSchema,
        system: TRIAGE_SYSTEM_PROMPT,
        prompt: `
PR contains ${files.length} files. Diff length: ${diffLength} characters.

Files changed:
${files.map((f) => `- ${f}`).join('\n')}

Classify this PR and identify critical files to audit.
`,
    });

    return object;
}

// ============================================================
// DEEP REVIEW (Step 2: Expensive Analyst)
// ============================================================

async function runDeepReview(filesToAudit: string[], diff: string): Promise<JStarReviewResult> {
    console.log(`🧠 Running Deep Review on ${filesToAudit.length} files with ${ANALYST_MODEL}...`);

    const { object } = await generateObject({
        model: groq(ANALYST_MODEL),
        schema: JStarReviewSchema,
        system: ANALYST_SYSTEM_PROMPT,
        prompt: buildAnalystUserPrompt(filesToAudit, diff),
    });

    return object;
}

// ============================================================
// MARKDOWN FORMATTING
// ============================================================

function formatTriageSkipComment(triage: TriageResult): string {
    return `## ✨ J Star Triage

**Risk Level:** ${triage.risk_level}

${triage.ignore_reason ? `> ${triage.ignore_reason}` : ''}

No critical files detected. Skipping deep review to save tokens. 🎉
`;
}

function formatReviewComment(review: JStarReviewResult): string {
    const scoreEmoji = review.summary.risk_score >= 80 ? '🟢' : review.summary.risk_score >= 50 ? '🟡' : '🔴';
    const verdictEmojiMap: Record<Verdict, string> = {
        APPROVE: '✅',
        REQUEST_CHANGES: '❌',
        COMMENT: '💬',
    };
    const verdictEmoji = verdictEmojiMap[review.summary.verdict];

    let md = `## ${scoreEmoji} J Star Review

**Verdict:** ${verdictEmoji} ${review.summary.verdict} | **Safety Score:** ${review.summary.risk_score}/100

---

`;

    if (review.findings.length === 0) {
        md += `### 🎉 No Issues Found\n\nCode looks clean! Ship it. 🚀\n`;
        return md;
    }

    // Group findings by severity
    const grouped: Record<string, Finding[]> = {
        CRITICAL: review.findings.filter((f: Finding) => f.severity === 'CRITICAL'),
        HIGH: review.findings.filter((f: Finding) => f.severity === 'HIGH'),
        MEDIUM: review.findings.filter((f: Finding) => f.severity === 'MEDIUM'),
        NITPICK: review.findings.filter((f: Finding) => f.severity === 'NITPICK'),
    };

    for (const [severity, findings] of Object.entries(grouped)) {
        if (findings.length === 0) continue;

        const icon = severity === 'CRITICAL' ? '🚨' : severity === 'HIGH' ? '⚠️' : severity === 'MEDIUM' ? '📝' : '💅';
        md += `### ${icon} ${severity} (${findings.length})\n\n`;

        for (const finding of findings) {
            md += `#### \`${finding.file}\` — Line ${finding.line} [\`${finding.category}\`]\n\n`;
            md += `> ${finding.message}\n\n`;

            if (finding.fix_prompt) {
                md += `<details>\n<summary>🤖 AI Fix Prompt</summary>\n\n\`\`\`text\n${finding.fix_prompt}\n\`\`\`\n\n</details>\n\n`;
            }

            md += `---\n\n`;
        }
    }

    md += `\n<sub>Powered by J Star Sentinel 🌟</sub>`;

    return md;
}

// ============================================================
// COMMENT POSTING
// ============================================================

async function postComment(ctx: GitHubContext, body: string): Promise<void> {
    await ctx.octokit.issues.createComment({
        owner: ctx.owner,
        repo: ctx.repo,
        issue_number: ctx.prNumber,
        body,
    });
    console.log('💬 Comment posted to PR.');
}

// ============================================================
// REACTION LOGIC
// ============================================================

async function addReaction(ctx: GitHubContext, reaction: 'eyes' | 'rocket') {
    if (!ctx.commentId) return; // Only works if triggered by a comment

    try {
        await ctx.octokit.reactions.createForIssueComment({
            owner: ctx.owner,
            repo: ctx.repo,
            comment_id: ctx.commentId,
            content: reaction,
        });
        console.log(`👀 Reacted with ${reaction}`);
    } catch (e) {
        console.log("⚠️ Could not react (might be a permission issue or invalid comment ID)");
    }
}

// ============================================================
// MAIN ORCHESTRATOR
// ============================================================

async function main() {
    console.log('🚀 J Star Reviewer Initialized');
    console.log('================================\n');

    // 1. Validate environment
    const env = validateEnv();
    const ctx = initGitHub(env);

    // Quick Win: React immediately if triggered by comment
    await addReaction(ctx, 'eyes');

    console.log(`📦 Reviewing PR #${ctx.prNumber} in ${ctx.owner}/${ctx.repo}\n`);

    // 2. Fetch PR data
    const [diff, files] = await Promise.all([
        fetchPRDiff(ctx),
        fetchPRFiles(ctx),
    ]);
    console.log(`📄 Found ${files.length} changed files (${diff.length} chars diff)\n`);

    // 3. Run Triage
    const triage = await runTriage(files, diff.length);
    console.log(`\n📊 Triage Result:`, JSON.stringify(triage, null, 2), '\n');

    // 4. Check if we should skip deep review
    if (triage.files_to_audit.length === 0) {
        console.log('⏭️  No critical files. Posting skip comment...');
        await postComment(ctx, formatTriageSkipComment(triage));
        return;
    }

    // 5. Run Deep Review
    const review = await runDeepReview(triage.files_to_audit, diff);
    console.log(`\n🔬 Review Result:`, JSON.stringify(review, null, 2), '\n');

    // 6. Post Review Comment
    await postComment(ctx, formatReviewComment(review));

    console.log('\n🏁 J Star Review Complete!');
}

// ============================================================
// RUN
// ============================================================

main().catch((error) => {
    console.error('❌ J Star Reviewer crashed:', error);
    process.exit(1);
});
