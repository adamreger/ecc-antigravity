#!/usr/bin/env node
/**
 * Run all tests
 *
 * Usage: node tests/run-all.js
 */

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const testsDir = __dirname;
const testFiles = [
  'lib/utils.test.js',
  'lib/package-manager.test.js',
  'scripts/setup-package-manager.test.js',
  'scripts/skill-create-output.test.js',
  'ci/validators.test.js'
];

// --- ANSI escape codes ---
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const NC = '\x1b[0m';

const BOX_W = 58;

// Build a box line with proper padding (accounts for invisible ANSI escapes)
const cBoxLine = (content) => {
  const visible = content.replace(/\x1b\[[0-9;]*m/g, '').length;
  const pad = Math.max(0, BOX_W - visible);
  return `${CYAN}║${NC}${content}${' '.repeat(pad)}${CYAN}║${NC}`;
};

console.log(`\n${CYAN}╔${'═'.repeat(BOX_W)}╗${NC}`);
console.log(cBoxLine(`${BOLD}          ECC-Antigravity — Test Suite${NC}`));
console.log(`${CYAN}╚${'═'.repeat(BOX_W)}╝${NC}`);

let totalPassed = 0;
let totalFailed = 0;
let totalTests = 0;

for (const testFile of testFiles) {
  const testPath = path.join(testsDir, testFile);

  if (!fs.existsSync(testPath)) {
    console.log(`\n  ${YELLOW}⚠${NC} ${DIM}Skipping ${testFile} (not found)${NC}`);
    continue;
  }

  console.log(`\n${DIM}${'─'.repeat(60)}${NC}`);
  console.log(`${DIM}  ${testFile}${NC}`);
  console.log(`${DIM}${'─'.repeat(60)}${NC}`);

  const result = spawnSync('node', [testPath], {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  });

  const stdout = result.stdout || '';
  const stderr = result.stderr || '';

  if (stdout) console.log(stdout);
  if (stderr) console.log(stderr);

  // Parse results — supports both old "Passed: N" and new "N passed" formats
  const combined = stdout + stderr;
  const passedMatch = combined.match(/Passed:\s*(\d+)/) || combined.match(/(\d+) passed/);
  const failedMatch = combined.match(/Failed:\s*(\d+)/) || combined.match(/(\d+) failed/);

  if (passedMatch) totalPassed += parseInt(passedMatch[1], 10);
  if (failedMatch) totalFailed += parseInt(failedMatch[1], 10);
}

totalTests = totalPassed + totalFailed;

const passColor = totalPassed > 0 ? GREEN : NC;
const failColor = totalFailed > 0 ? RED : GREEN;


console.log(`\n${CYAN}╔${'═'.repeat(BOX_W)}╗${NC}`);
console.log(cBoxLine(`${BOLD}                     Final Results                ${NC}`));
console.log(`${CYAN}╠${'═'.repeat(BOX_W)}╣${NC}`);
console.log(cBoxLine(`  Total Tests: ${String(totalTests).padStart(4)}`));
console.log(cBoxLine(`  Passed:      ${passColor}${String(totalPassed).padStart(4)}${NC}  ✓`));
console.log(cBoxLine(`  Failed:      ${failColor}${String(totalFailed).padStart(4)}${NC}  ${totalFailed > 0 ? '✗' : ' '}`));
console.log(`${CYAN}╚${'═'.repeat(BOX_W)}╝${NC}`);

process.exit(totalFailed > 0 ? 1 : 0);
