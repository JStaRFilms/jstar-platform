
function chunkText(text: string): string[] {
    // Old regex: /[^.!?]+[.!?]+/g
    // New regex: /[^.!?]+[.!?]+|[^.!?]+$/g
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
    return sentences;
}

const input = "This is a sentence. Monjola Aminu";
const chunks = chunkText(input);

console.log("Input:", input);
console.log("Chunks:", chunks);

if (!chunks.some(c => c.includes("Monjola"))) {
    console.log("❌ 'Monjola' was lost!");
} else {
    console.log("✅ 'Monjola' was preserved.");
}
