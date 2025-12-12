// src/types.ts
// The Skeleton: Zod schemas that enforce strict JSON output from AI.
// The Vercel AI SDK's generateObject() uses these to validate & parse responses.

import { z } from 'zod';

// ============================================================
// TRIAGE SCHEMA (Step 1: The Cheap Gatekeeper)
// ============================================================

/**
 * Risk levels for PR classification.
 */
export const RiskLevel = z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);
export type RiskLevel = z.infer<typeof RiskLevel>;

/**
 * Triage output schema.
 * Used by gpt-4o-mini (cheap model) to quickly classify PRs.
 */
export const TriageSchema = z.object({
    risk_level: RiskLevel.describe(
        'The overall risk classification of this PR based on file changes.'
    ),
    files_to_audit: z
        .array(z.string())
        .max(5)
        .describe(
            'Top 5 most critical files to deeply review (auth, API routes, data processing). Empty if LOW risk.'
        ),
    ignore_reason: z
        .string()
        .nullable()
        .describe(
            'If risk_level is LOW, explain why (e.g., "Only CSS/styling changes"). Null otherwise.'
        ),
});

export type TriageResult = z.infer<typeof TriageSchema>;

// ============================================================
// REVIEW SCHEMA (Step 2: The Deep Analyst)
// ============================================================

/**
 * Severity levels for individual findings.
 */
export const Severity = z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'NITPICK']);
export type Severity = z.infer<typeof Severity>;

/**
 * Categories of issues found.
 */
export const Category = z.enum(['SECURITY', 'PERFORMANCE', 'LOGIC']);
export type Category = z.infer<typeof Category>;

/**
 * Verdict the reviewer gives.
 */
export const Verdict = z.enum(['APPROVE', 'REQUEST_CHANGES', 'COMMENT']);
export type Verdict = z.infer<typeof Verdict>;

/**
 * Tone of the overall review.
 */
export const Tone = z.enum(['encouraging', 'critical', 'neutral']);
export type Tone = z.infer<typeof Tone>;

/**
 * Individual finding/issue in the code.
 */
export const FindingSchema = z.object({
    file: z.string().describe('Relative path to the file, e.g., "src/auth/login.ts"'),
    line: z.number().int().positive().describe('The specific line number in the new code (1-indexed)'),
    severity: Severity.describe('How critical is this issue?'),
    category: Category.describe('What type of issue is this?'),
    message: z.string().max(500).describe('Human-readable explanation of the issue. Max 2 sentences.'),
    fix_prompt: z
        .string()
        .optional()
        .describe(
            'REQUIRED for HIGH/CRITICAL: A specific instruction for an AI coding agent to fix this issue.'
        ),
});

export type Finding = z.infer<typeof FindingSchema>;

/**
 * Summary of the entire review.
 */
export const SummarySchema = z.object({
    risk_score: z
        .number()
        .int()
        .min(0)
        .max(100)
        .describe('0-100 score. 100 = perfectly safe, 0 = extremely dangerous.'),
    verdict: Verdict.describe('The final recommendation for this PR.'),
    tone: Tone.describe('The overall tone of the review based on findings.'),
});

export type Summary = z.infer<typeof SummarySchema>;

/**
 * Full J Star Review output.
 * Used by gpt-4o (expensive model) for deep code analysis.
 */
export const JStarReviewSchema = z.object({
    summary: SummarySchema.describe('High-level summary of the review.'),
    findings: z
        .array(FindingSchema)
        .describe('List of all issues found. Can be empty if code is clean.'),
});

export type JStarReviewResult = z.infer<typeof JStarReviewSchema>;

// ============================================================
// ENVIRONMENT VALIDATION (Fail-fast on missing secrets)
// ============================================================

export const EnvSchema = z.object({
    GITHUB_TOKEN: z.string().min(1, 'GITHUB_TOKEN is required'),
    GROQ_API_KEY: z.string().min(1, 'GROQ_API_KEY is required'),
    GITHUB_REPOSITORY: z.string().min(1, 'GITHUB_REPOSITORY is required'),
    PR_NUMBER: z.string().regex(/^\d+$/, 'PR_NUMBER must be a valid number'),
    COMMENT_ID: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema>;
