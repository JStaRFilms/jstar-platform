// src/test-local.ts
// Local Dry Run: Test J Star Reviewer without touching GitHub
// Usage: npm run test:dry

import { generateObject } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { config } from 'dotenv';

import { TRIAGE_SYSTEM_PROMPT, ANALYST_SYSTEM_PROMPT, buildAnalystUserPrompt } from './prompts.js';
import { TriageSchema, JStarReviewSchema } from './types.js';

// Load .env.local
config({ path: '.env.local' });

// Initialize Groq provider
const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
});

// Model configuration from env
const TRIAGE_MODEL = process.env.TRIAGE_MODEL || 'llama-3.1-8b-instant';
const ANALYST_MODEL = process.env.ANALYST_MODEL || 'llama-3.3-70b-versatile';

// ============================================================
// MOCK PR DATA (Simulated "Bad Code" for Testing)
// ============================================================

const MOCK_FILES = [
    'src/auth/login.ts',
    'src/api/users/route.ts',
    'src/components/Button.tsx',
    'styles/globals.css',
    'README.md',
];

const MOCK_DIFF = `
diff --git a/src/auth/login.ts b/src/auth/login.ts
index 1234567..abcdefg 100644
--- a/src/auth/login.ts
+++ b/src/auth/login.ts
@@ -1,10 +1,25 @@
+import { db } from '../lib/database';
+
 export async function login(req: Request) {
   const { email, password } = await req.json();
   
-  // TODO: Add validation
+  // Query user directly with string interpolation (BAD!)
+  const user = await db.query(\`SELECT * FROM users WHERE email = '\${email}'\`);
   
-  return { success: true };
+  if (!user) {
+    return Response.json({ error: 'User not found' }, { status: 404 });
+  }
+
+  // Plain text password comparison (BAD!)
+  if (user.password !== password) {
+    return Response.json({ error: 'Invalid password' }, { status: 401 });
+  }
+
+  // No rate limiting, no session management
+  return Response.json({ token: user.id });
 }

diff --git a/src/api/users/route.ts b/src/api/users/route.ts
index 7654321..fedcba9 100644
--- a/src/api/users/route.ts
+++ b/src/api/users/route.ts
@@ -5,6 +5,15 @@ export async function GET(req: Request) {
   // Fetch all users
   const users = await db.query('SELECT * FROM users');
   
+  // Exposing all user data including passwords (BAD!)
+  return Response.json(users);
+}
+
+export async function DELETE(req: Request) {
+  const { id } = await req.json();
+  
+  // No authorization check! Anyone can delete users (BAD!)
+  await db.query(\`DELETE FROM users WHERE id = \${id}\`);
   return Response.json({ success: true });
 }

diff --git a/styles/globals.css b/styles/globals.css
index aaaaaaa..bbbbbbb 100644
--- a/styles/globals.css
+++ b/styles/globals.css
@@ -1,3 +1,8 @@
 body {
   font-family: sans-serif;
+  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
+}
+
+.button {
+  border-radius: 8px;
 }
`;

// ============================================================
// DRY RUN PIPELINE
// ============================================================

async function runDryTest() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  🧪 J STAR DRY RUN - Local Test Mode (Groq)');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Validate API key
    if (!process.env.GROQ_API_KEY) {
        console.error('❌ Missing GROQ_API_KEY in .env.local');
        console.log('\n📝 Get your key from: https://console.groq.com/keys\n');
        process.exit(1);
    }

    console.log(`🔧 Config:`);
    console.log(`   Triage Model:  ${TRIAGE_MODEL}`);
    console.log(`   Analyst Model: ${ANALYST_MODEL}\n`);

    console.log('📁 Mock PR Files:');
    MOCK_FILES.forEach((f) => console.log(`   - ${f}`));
    console.log(`\n📄 Mock Diff Length: ${MOCK_DIFF.length} chars\n`);

    // ──────────────────────────────────────────────────────────
    // STAGE 1: TRIAGE
    // ──────────────────────────────────────────────────────────
    console.log('─────────────────────────────────────────────────────────');
    console.log(`  STAGE 1: TRIAGE (${TRIAGE_MODEL})`);
    console.log('─────────────────────────────────────────────────────────\n');

    const triageStart = Date.now();
    const { object: triage } = await generateObject({
        model: groq(TRIAGE_MODEL),
        schema: TriageSchema,
        system: TRIAGE_SYSTEM_PROMPT,
        prompt: `
PR contains ${MOCK_FILES.length} files. Diff length: ${MOCK_DIFF.length} characters.

Files changed:
${MOCK_FILES.map((f) => `- ${f}`).join('\n')}

Classify this PR and identify critical files to audit.
`,
    });
    const triageTime = Date.now() - triageStart;

    console.log('📊 Triage Result:');
    console.log(`   Risk Level: ${triage.risk_level}`);
    console.log(`   Files to Audit: ${JSON.stringify(triage.files_to_audit)}`);
    console.log(`   Ignore Reason: ${triage.ignore_reason || 'N/A'}`);
    console.log(`   ⏱️  Time: ${triageTime}ms\n`);

    if (triage.files_to_audit.length === 0) {
        console.log('✅ Triage says: LOW RISK - No deep review needed!\n');
        return;
    }

    // ──────────────────────────────────────────────────────────
    // STAGE 2: DEEP REVIEW
    // ──────────────────────────────────────────────────────────
    console.log('─────────────────────────────────────────────────────────');
    console.log(`  STAGE 2: DEEP REVIEW (${ANALYST_MODEL})`);
    console.log('─────────────────────────────────────────────────────────\n');

    const reviewStart = Date.now();
    const { object: review } = await generateObject({
        model: groq(ANALYST_MODEL),
        schema: JStarReviewSchema,
        system: ANALYST_SYSTEM_PROMPT,
        prompt: buildAnalystUserPrompt(triage.files_to_audit, MOCK_DIFF),
    });
    const reviewTime = Date.now() - reviewStart;

    console.log('🔬 Review Summary:');
    console.log(`   Risk Score: ${review.summary.risk_score}/100`);
    console.log(`   Verdict: ${review.summary.verdict}`);
    console.log(`   Tone: ${review.summary.tone}`);
    console.log(`   ⏱️  Time: ${reviewTime}ms\n`);

    console.log('📋 Findings:');
    if (review.findings.length === 0) {
        console.log('   ✨ No issues found!\n');
    } else {
        review.findings.forEach((f) => {
            const icon = f.severity === 'CRITICAL' ? '🚨' : f.severity === 'HIGH' ? '⚠️' : '📝';
            console.log(`\n   ${icon} [${f.severity}] ${f.file}:${f.line}`);
            console.log(`      Category: ${f.category}`);
            console.log(`      Message: ${f.message}`);
            if (f.fix_prompt) {
                console.log(`      Fix Prompt: "${f.fix_prompt.substring(0, 60)}..."`);
            }
        });
    }

    // ──────────────────────────────────────────────────────────
    // SUMMARY
    // ──────────────────────────────────────────────────────────
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  📈 DRY RUN COMPLETE');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  Total Time: ${triageTime + reviewTime}ms`);
    console.log(`  Findings: ${review.findings.length}`);
    console.log(`  Verdict: ${review.summary.verdict}`);
    console.log('═══════════════════════════════════════════════════════════\n');
}

runDryTest().catch((error) => {
    console.error('\n❌ Dry Run Failed:', error.message);
    if (error.cause) {
        console.error('   Cause:', error.cause);
    }
    process.exit(1);
});
