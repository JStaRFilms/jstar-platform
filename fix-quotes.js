#!/usr/bin/env node
/**
 * fix-jsx-apostrophes.js
 *
 * Automatically replaces unescaped single quotes in JSX text content with &apos;
 * to prevent React/JSX parsing errors.
 *
 * Safely ignores:
 *  - JS expressions `{ }`
 *  - String literals ('', "")
 *  - Template literals (``)
 *  - JSX attributes
 *  - Already escaped quotes (\' or &apos;)
 *
 * Recursively processes .jsx and .tsx files while skipping node_modules and .next
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const rootDir = process.argv[2] || process.cwd();
const VALID_EXTENSIONS = ['.jsx', '.tsx'];
const IGNORE_DIRS = ['node_modules', '.next', 'dist', 'build'];

function isIgnoredDir(dirPath) {
  return IGNORE_DIRS.some(skip => dirPath.includes(path.sep + skip + path.sep));
}

function findFilesRecursively(dir) {
  const results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (!isIgnoredDir(fullPath)) {
        results.push(...findFilesRecursively(fullPath));
      }
    } else if (VALID_EXTENSIONS.includes(path.extname(item.name))) {
      results.push(fullPath);
    }
  }
  return results;
}

function processFile(filePath) {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(`❌ Error reading file ${filePath}: ${err.message}`);
    return;
  }

  let ast;
  try {
    ast = parse(content, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
      errorRecovery: true,
    });
  } catch (err) {
    console.error(`❌ Parse error in ${filePath}: ${err.message}`);
    return;
  }

  let modified = false;
  let changes = 0;

  traverse(ast, {
    JSXText(path) {
      const original = path.node.value;
      // Replace only unescaped apostrophes not already &apos;
      const newValue = original.replace(/(?<!\\|&apos;)'/g, '&apos;');
      if (newValue !== original) {
        path.node.value = newValue;
        modified = true;
        changes++;
      }
    },
  });

  if (modified) {
    const { code } = generate(ast, { retainLines: true, concise: false });
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`✅ Updated ${filePath} (${changes} change${changes > 1 ? 's' : ''})`);
  } else {
    console.log(`— No changes in ${filePath}`);
  }
}

function main() {
  console.log(`🔍 Scanning directory: ${rootDir}`);
  const files = findFilesRecursively(rootDir);
  if (!files.length) {
    console.log('⚠️  No JSX/TSX files found.');
    return;
  }

  console.log(`Found ${files.length} file(s). Processing...\n`);
  files.forEach(processFile);
  console.log('\n✨ Processing complete.');
}

main();
