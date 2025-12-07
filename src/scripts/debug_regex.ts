
import * as fs from 'fs';
import * as path from 'path';

const fullPath = path.join(process.cwd(), 'src/features/HomePage/components/BlogSection.tsx');
console.log('Reading:', fullPath);

const content = fs.readFileSync(fullPath, 'utf8');
const sectionIdPattern = /id=["']([a-z0-9-]+-section)["']/gi;

console.log('--- File Content Snippet ---');
// print lines around "id="
const lines = content.split('\n');
lines.forEach((line, i) => {
    if (line.includes('id=')) console.log(`${i + 1}: ${line}`);
});
console.log('---------------------------');

let match;
while ((match = sectionIdPattern.exec(content)) !== null) {
    console.log('Found match:', match[1]);
}
console.log('Done scanning.');
