import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { classifyIntent } from '../lib/ai/intent-classifier';

async function runTests() {
    const testCases = [
        { input: 'Write a React component for a button', expected: 'code' },
        { input: 'Roast my code: console.log("hello")', expected: 'roast' },
        { input: 'Explain quantum physics like I am 5', expected: 'simplify' },
        { input: 'What does the bible say about anger?', expected: 'bible' },
        { input: 'Hello, how are you?', expected: 'Universal' },
        { input: '/code function test() {}', expected: 'code' }, // Explicit command check (though classifyIntent handles implicit mostly, route.ts handles explicit)
    ];

    console.log('Running Intent Classification Tests...\n');

    for (const test of testCases) {
        const messages = [{ role: 'user', content: test.input }];
        try {
            // Note: classifyIntent might not handle explicit slash commands if route.ts strips them or handles them before.
            // But our classifyIntent has a heuristic check too.
            const result = await classifyIntent(messages);
            const pass = result === test.expected;
            console.log(`[${pass ? 'PASS' : 'FAIL'}] Input: "${test.input}" -> Detected: ${result} (Expected: ${test.expected})`);
        } catch (error) {
            console.error(`[ERROR] Input: "${test.input}"`, error);
        }
    }
}

runTests();
