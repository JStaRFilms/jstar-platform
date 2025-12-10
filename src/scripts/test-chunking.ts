
import * as cheerio from 'cheerio';

function chunkText(text: string): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    return sentences;
}

async function test() {
    // Test 1: No trailing punctuation
    const input = "This is a sentence. Monjola Aminu";
    const chunks = chunkText(input);
    console.log("Test 1 (No trailing dot):");
    console.log("Input:", input);
    console.log("Chunks:", chunks);
    if (!chunks.some(c => c.includes("Monjola"))) {
        console.log("❌ 'Monjola' was lost!");
    } else {
        console.log("✅ 'Monjola' was preserved.");
    }

    // Test 2: Fetch actual page
    console.log("\nTest 2: Fetching localhost:3000/ ...");
    try {
        const response = await fetch('http://localhost:5782/');
        const html = await response.text();
        const $ = cheerio.load(html);
        $('script, style, nav, footer, header').remove();
        const text = $('main').text() || $('body').text();
        const cleaned = text.replace(/\s+/g, ' ').trim();

        console.log("Page Text Length:", cleaned.length);
        if (cleaned.includes("Monjola")) {
            console.log("✅ 'Monjola' found in page text!");
        } else {
            console.log("❌ 'Monjola' NOT found in page text.");
            // Print a snippet to see what IS there
            console.log("Snippet:", cleaned.substring(0, 500));
        }
    } catch (e) {
        console.error("Error fetching page:", e);
    }
}

test();
