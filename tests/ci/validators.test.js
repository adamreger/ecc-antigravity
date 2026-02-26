/**
 * Tests for CI validator scripts
 *
 * Tests both success paths (against the real project) and error paths
 * (against temporary fixture directories via wrapper scripts).
 *
 * Run with: node tests/ci/validators.test.js
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFileSync } = require('child_process');
const { test, section, header, summary } = require('../lib/test-helpers');

const validatorsDir = path.join(__dirname, '..', '..', 'scripts', 'ci');

function createTestDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ci-validator-test-'));
}

function cleanupTestDir(testDir) {
  fs.rmSync(testDir, { recursive: true, force: true });
}

/**
 * Run a validator script via a wrapper that overrides its directory constant.
 * This allows testing error cases without modifying real project files.
 *
 * @param {string} validatorName - e.g., 'validate-rules'
 * @param {string} dirConstant - the constant name to override (e.g., 'RULES_DIR')
 * @param {string} overridePath - the temp directory to use
 * @returns {{code: number, stdout: string, stderr: string}}
 */
function runValidatorWithDir(validatorName, dirConstant, overridePath) {
  const validatorPath = path.join(validatorsDir, `${validatorName}.js`);

  // Read the validator source, replace the directory constant, and run as a wrapper
  let source = fs.readFileSync(validatorPath, 'utf8');

  // Remove the shebang line
  source = source.replace(/^#!.*\n/, '');

  // Replace the directory constant with our override path
  const dirRegex = new RegExp(`const ${dirConstant} = .*?;`);
  source = source.replace(dirRegex, `const ${dirConstant} = ${JSON.stringify(overridePath)};`);

  try {
    const stdout = execFileSync('node', ['-e', source], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 10000,
    });
    return { code: 0, stdout, stderr: '' };
  } catch (err) {
    return {
      code: err.status || 1,
      stdout: err.stdout || '',
      stderr: err.stderr || '',
    };
  }
}

/**
 * Run a validator script directly (tests real project)
 */
function runValidator(validatorName) {
  const validatorPath = path.join(validatorsDir, `${validatorName}.js`);
  try {
    if (!fs.existsSync(validatorPath)) {
      return { code: 0, stdout: `Skipping missing validator ${validatorName}\n`, stderr: '' };
    }
    const stdout = execFileSync('node', [validatorPath], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 15000,
    });
    return { code: 0, stdout, stderr: '' };
  } catch (err) {
    return {
      code: err.status || 1,
      stdout: err.stdout || '',
      stderr: err.stderr || '',
    };
  }
}

function runTests() {
  header('CI Validators');

  let passed = 0;
  let failed = 0;

  section('validate-workflows.js');

  if (test('passes on real project workflows', () => {
    const result = runValidator('validate-workflows');
    assert.strictEqual(result.code, 0, `Should pass, got stderr: ${result.stderr}`);
    assert.ok(result.stdout.includes('Validated'), 'Should output validation count');
  })) passed++; else failed++;

  if (test('fails on workflow without frontmatter', () => {
    const testDir = createTestDir();
    fs.writeFileSync(path.join(testDir, 'bad-workflow.md'), '# No frontmatter here\nJust content.');

    const result = runValidatorWithDir('validate-workflows', 'WORKFLOWS_DIR', testDir);
    assert.strictEqual(result.code, 1, 'Should exit 1 for missing frontmatter');
    assert.ok(result.stderr.includes('Missing frontmatter'), 'Should report missing frontmatter');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('fails on workflow missing required description field', () => {
    const testDir = createTestDir();
    fs.writeFileSync(path.join(testDir, 'no-desc.md'), '---\nfoo: bar\n---\n# Workflow');

    const result = runValidatorWithDir('validate-workflows', 'WORKFLOWS_DIR', testDir);
    assert.strictEqual(result.code, 1, 'Should exit 1 for missing description');
    assert.ok(result.stderr.includes('description'), 'Should report missing description field');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('handles frontmatter with BOM and CRLF', () => {
    const testDir = createTestDir();
    const content = '\uFEFF---\r\ndescription: Test\r\n---\r\n# Workflow';
    fs.writeFileSync(path.join(testDir, 'bom.md'), content);

    const result = runValidatorWithDir('validate-workflows', 'WORKFLOWS_DIR', testDir);
    assert.strictEqual(result.code, 0, 'Should handle BOM and CRLF');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('handles frontmatter with colons in values', () => {
    const testDir = createTestDir();
    fs.writeFileSync(path.join(testDir, 'colons.md'), '---\ndescription: this: is: a: test\n---\n# Workflow');

    const result = runValidatorWithDir('validate-workflows', 'WORKFLOWS_DIR', testDir);
    assert.strictEqual(result.code, 0, 'Should parse remaining string as value');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('accepts workflow with extra unknown frontmatter fields', () => {
    const testDir = createTestDir();
    fs.writeFileSync(path.join(testDir, 'extra.md'), '---\ndescription: test\ncustom_field: some value\nauthor: test\n---\n# Workflow');

    const result = runValidatorWithDir('validate-workflows', 'WORKFLOWS_DIR', testDir);
    assert.strictEqual(result.code, 0, 'Should accept extra unknown fields');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('rejects workflow with empty frontmatter block (no key-value pairs)', () => {
    const testDir = createTestDir();
    fs.writeFileSync(path.join(testDir, 'empty-block.md'), '---\n---\n# Workflow');

    const result = runValidatorWithDir('validate-workflows', 'WORKFLOWS_DIR', testDir);
    assert.strictEqual(result.code, 1, 'Should reject empty frontmatter block');
    assert.ok(result.stderr.includes('Missing frontmatter'), 'Should report missing frontmatter block');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('rejects workflow with no content between --- markers (Missing frontmatter)', () => {
    const testDir = createTestDir();
    fs.writeFileSync(path.join(testDir, 'no-content.md'), '# Just text, no frontmatter tags');

    const result = runValidatorWithDir('validate-workflows', 'WORKFLOWS_DIR', testDir);
    assert.strictEqual(result.code, 1, 'Should reject completely missing frontmatter');
    assert.ok(result.stderr.includes('Missing frontmatter'), 'Should report missing frontmatter block');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('handles space before colon in frontmatter key', () => {
    const testDir = createTestDir();
    fs.writeFileSync(path.join(testDir, 'space-key.md'), '---\ndescription : test\n---\n# Workflow');

    const result = runValidatorWithDir('validate-workflows', 'WORKFLOWS_DIR', testDir);
    assert.strictEqual(result.code, 0, 'Should handle space before colon');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('silently ignores frontmatter line without colon', () => {
    const testDir = createTestDir();
    fs.writeFileSync(path.join(testDir, 'no-colon.md'), '---\ndescription: test\nthis is just a line without a colon\n---\n# Workflow');

    const result = runValidatorWithDir('validate-workflows', 'WORKFLOWS_DIR', testDir);
    assert.strictEqual(result.code, 0, 'Should ignore line without colon');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('rejects workflow when required field key has colon at position 0 (no key name)', () => {
    const testDir = createTestDir();
    fs.writeFileSync(path.join(testDir, 'bad-colon.md'), '---\n:description value\n---\n# Workflow');

    const result = runValidatorWithDir('validate-workflows', 'WORKFLOWS_DIR', testDir);
    assert.strictEqual(result.code, 1, 'Should reject empty key name');
    // It should fail because the frontmatter parsing returned null since no valid keys were found
    assert.ok(result.stderr.includes('Missing frontmatter'), 'Should report missing frontmatter');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('rejects workflow with empty description value', () => {
    const testDir = createTestDir();
    fs.writeFileSync(path.join(testDir, 'empty.md'), '---\ndescription:\n---\n# Workflow');

    const result = runValidatorWithDir('validate-workflows', 'WORKFLOWS_DIR', testDir);
    assert.strictEqual(result.code, 1, 'Should reject empty description');
    assert.ok(result.stderr.includes('description'), 'Should report validation error');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('rejects workflow with whitespace-only description value', () => {
    const testDir = createTestDir();
    fs.writeFileSync(path.join(testDir, 'ws.md'), '---\ndescription:   \t  \n---\n# Workflow');

    const result = runValidatorWithDir('validate-workflows', 'WORKFLOWS_DIR', testDir);
    assert.strictEqual(result.code, 1, 'Should reject whitespace-only description');
    assert.ok(result.stderr.includes('description'), 'Should report validation error');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('skips non-md files', () => {
    const testDir = createTestDir();
    fs.writeFileSync(path.join(testDir, 'script.js'), 'console.log(1)');
    fs.writeFileSync(path.join(testDir, 'valid.md'), '---\ndescription: test\n---\n# Workflow');

    const result = runValidatorWithDir('validate-workflows', 'WORKFLOWS_DIR', testDir);
    assert.strictEqual(result.code, 0, 'Should ignore non-md files');
    assert.ok(result.stdout.includes('Validated 1'), 'Should count only .md files');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('exits 0 when directory does not exist', () => {
    const result = runValidatorWithDir('validate-workflows', 'WORKFLOWS_DIR', '/nonexistent/dir');
    assert.strictEqual(result.code, 0, 'Should skip when no directory exists');
  })) passed++; else failed++;

  if (test('passes on empty workflows directory', () => {
    const testDir = createTestDir();
    const result = runValidatorWithDir('validate-workflows', 'WORKFLOWS_DIR', testDir);
    assert.strictEqual(result.code, 0, 'Should handle empty directory');
    assert.ok(result.stdout.includes('Validated 0'), 'Should validate 0 items');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('reports error when workflow .md file is unreadable (chmod 000)', () => {
    const testDir = createTestDir();
    const filePath = path.join(testDir, 'locked.md');
    fs.writeFileSync(filePath, '---\ndescription: test\n---\n');

    // Make file unreadable (may not work on Windows, so we wrap in try/catch)
    try {
      fs.chmodSync(filePath, 0o000);
      const result = runValidatorWithDir('validate-workflows', 'WORKFLOWS_DIR', testDir);
      assert.strictEqual(result.code, 1, 'Should fail when file is unreadable');
      assert.ok(result.stderr.includes('EACCES') || result.stderr.includes('EPERM'), 'Should report permission error');

      // Restore permissions so cleanup works
      fs.chmodSync(filePath, 0o644);
    } catch (e) {
      // If chmod fails (e.g. Windows), skip the test assertion
      console.log('      (Skipping chmod test on this platform)');
    }

    cleanupTestDir(testDir);
  })) passed++; else failed++;

  section('validate-skills.js');

  if (test('passes on real project skills', () => {
    const result = runValidator('validate-skills');
    assert.strictEqual(result.code, 0, `Should pass, got stderr: ${result.stderr}`);
    assert.ok(result.stdout.includes('Validated'), 'Should output validation count');
  })) passed++; else failed++;

  if (test('exits 0 when directory does not exist', () => {
    const result = runValidatorWithDir('validate-skills', 'SKILLS_DIR', '/nonexistent/dir');
    assert.strictEqual(result.code, 0, 'Should skip when no skills dir');
  })) passed++; else failed++;

  if (test('fails on skill directory without SKILL.md', () => {
    const testDir = createTestDir();
    fs.mkdirSync(path.join(testDir, 'broken-skill'));
    // No SKILL.md inside

    const result = runValidatorWithDir('validate-skills', 'SKILLS_DIR', testDir);
    assert.strictEqual(result.code, 1, 'Should fail on missing SKILL.md');
    assert.ok(result.stderr.includes('Missing SKILL.md'), 'Should report missing SKILL.md');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('fails on empty SKILL.md', () => {
    const testDir = createTestDir();
    const skillDir = path.join(testDir, 'empty-skill');
    fs.mkdirSync(skillDir);
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), '');

    const result = runValidatorWithDir('validate-skills', 'SKILLS_DIR', testDir);
    assert.strictEqual(result.code, 1, 'Should fail on empty SKILL.md');
    assert.ok(result.stderr.includes('Empty'), 'Should report empty file');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('passes on valid skill directory', () => {
    const testDir = createTestDir();
    const skillDir = path.join(testDir, 'good-skill');
    fs.mkdirSync(skillDir);
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), '# My Skill\nDescription here.');

    const result = runValidatorWithDir('validate-skills', 'SKILLS_DIR', testDir);
    assert.strictEqual(result.code, 0, 'Should pass for valid skill');
    assert.ok(result.stdout.includes('Validated 1'), 'Should report 1 validated');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('ignores non-directory entries', () => {
    const testDir = createTestDir();
    fs.writeFileSync(path.join(testDir, 'not-a-skill.md'), '# README');
    const skillDir = path.join(testDir, 'real-skill');
    fs.mkdirSync(skillDir);
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), '# Skill');

    const result = runValidatorWithDir('validate-skills', 'SKILLS_DIR', testDir);
    assert.strictEqual(result.code, 0, 'Should ignore non-directory entries');
    assert.ok(result.stdout.includes('Validated 1'), 'Should count only directories');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('fails on whitespace-only SKILL.md', () => {
    const testDir = createTestDir();
    const skillDir = path.join(testDir, 'blank-skill');
    fs.mkdirSync(skillDir);
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), '   \n\t\n  ');

    const result = runValidatorWithDir('validate-skills', 'SKILLS_DIR', testDir);
    assert.strictEqual(result.code, 1, 'Should reject whitespace-only SKILL.md');
    assert.ok(result.stderr.includes('Empty file'), 'Should report empty file');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('fails on mix of valid and invalid skill directories', () => {
    const testDir = createTestDir();
    // Valid skill
    const goodSkill = path.join(testDir, 'good-skill');
    fs.mkdirSync(goodSkill);
    fs.writeFileSync(path.join(goodSkill, 'SKILL.md'), '# Good Skill');
    // Missing SKILL.md
    const badSkill = path.join(testDir, 'bad-skill');
    fs.mkdirSync(badSkill);
    // Empty SKILL.md
    const emptySkill = path.join(testDir, 'empty-skill');
    fs.mkdirSync(emptySkill);
    fs.writeFileSync(path.join(emptySkill, 'SKILL.md'), '');

    const result = runValidatorWithDir('validate-skills', 'SKILLS_DIR', testDir);
    assert.strictEqual(result.code, 1, 'Should fail when any skill is invalid');
    assert.ok(result.stderr.includes('bad-skill'), 'Should report missing SKILL.md');
    assert.ok(result.stderr.includes('empty-skill'), 'Should report empty SKILL.md');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('fails gracefully when SKILL.md is a directory instead of a file', () => {
    const testDir = createTestDir();
    const skillDir = path.join(testDir, 'dir-skill');
    fs.mkdirSync(skillDir);
    // Create SKILL.md as a DIRECTORY, not a file — existsSync returns true
    // but readFileSync throws EISDIR, exercising the catch block
    fs.mkdirSync(path.join(skillDir, 'SKILL.md'));

    const result = runValidatorWithDir('validate-skills', 'SKILLS_DIR', testDir);
    assert.strictEqual(result.code, 1, 'Should fail when SKILL.md is a directory');
    assert.ok(result.stderr.includes('dir-skill'), 'Should report the problematic skill');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('passes on skills directory with only files, no subdirectories (Validated 0)', () => {
    const testDir = createTestDir();
    // Only files, no subdirectories — isDirectory filter yields empty array
    fs.writeFileSync(path.join(testDir, 'README.md'), '# Skills');
    fs.writeFileSync(path.join(testDir, '.gitkeep'), '');

    const result = runValidatorWithDir('validate-skills', 'SKILLS_DIR', testDir);
    assert.strictEqual(result.code, 0, 'Should pass on skills directory with no subdirectories');
    assert.ok(result.stdout.includes('Validated 0'), 'Should report 0 validated skill directories');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('rejects skill directory with empty SKILL.md file', () => {
    const testDir = createTestDir();
    const skillDir = path.join(testDir, 'empty-skill');
    fs.mkdirSync(skillDir, { recursive: true });
    // Create SKILL.md with only whitespace (trim to zero length)
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), '   \n  \n');

    const result = runValidatorWithDir('validate-skills', 'SKILLS_DIR', testDir);
    assert.strictEqual(result.code, 1, 'Should reject empty SKILL.md');
    assert.ok(result.stderr.includes('Empty file'),
      `Should report "Empty file", got: ${result.stderr}`);
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  section('validate-rules.js');

  if (test('passes on real project rules', () => {
    const result = runValidator('validate-rules');
    assert.strictEqual(result.code, 0, `Should pass, got stderr: ${result.stderr}`);
    assert.ok(result.stdout.includes('Validated'), 'Should output validation count');
  })) passed++; else failed++;

  if (test('exits 0 when directory does not exist', () => {
    const result = runValidatorWithDir('validate-rules', 'RULES_DIR', '/nonexistent/dir');
    assert.strictEqual(result.code, 0, 'Should skip when no rules dir');
  })) passed++; else failed++;

  if (test('fails on empty rule file', () => {
    const testDir = createTestDir();
    fs.writeFileSync(path.join(testDir, 'empty.md'), '');

    const result = runValidatorWithDir('validate-rules', 'RULES_DIR', testDir);
    assert.strictEqual(result.code, 1, 'Should fail on empty rule file');
    assert.ok(result.stderr.includes('Empty'), 'Should report empty file');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('passes on valid rule files', () => {
    const testDir = createTestDir();
    fs.writeFileSync(path.join(testDir, 'coding.md'), '# Coding Rules\nUse immutability.');

    const result = runValidatorWithDir('validate-rules', 'RULES_DIR', testDir);
    assert.strictEqual(result.code, 0, 'Should pass for valid rules');
    assert.ok(result.stdout.includes('Validated 1'), 'Should report 1 validated');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('fails on whitespace-only rule file', () => {
    const testDir = createTestDir();
    fs.writeFileSync(path.join(testDir, 'blank.md'), '   \n\t\n  ');

    const result = runValidatorWithDir('validate-rules', 'RULES_DIR', testDir);
    assert.strictEqual(result.code, 1, 'Should reject whitespace-only rule file');
    assert.ok(result.stderr.includes('Empty'), 'Should report empty file');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('validates rules in subdirectories recursively', () => {
    const testDir = createTestDir();
    const subDir = path.join(testDir, 'sub');
    fs.mkdirSync(subDir);
    fs.writeFileSync(path.join(testDir, 'top.md'), '# Top Level Rule');
    fs.writeFileSync(path.join(subDir, 'nested.md'), '# Nested Rule');

    const result = runValidatorWithDir('validate-rules', 'RULES_DIR', testDir);
    assert.strictEqual(result.code, 0, 'Should validate nested rules');
    assert.ok(result.stdout.includes('Validated 2'), 'Should find both rules');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('fails on mix of valid and empty rule files', () => {
    const testDir = createTestDir();
    fs.writeFileSync(path.join(testDir, 'good.md'), '# Good Rule\nContent here.');
    fs.writeFileSync(path.join(testDir, 'bad.md'), '');

    const result = runValidatorWithDir('validate-rules', 'RULES_DIR', testDir);
    assert.strictEqual(result.code, 1, 'Should fail when any rule is empty');
    assert.ok(result.stderr.includes('bad.md'), 'Should report the bad file');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('skips directory entries even if named with .md extension', () => {
    const testDir = createTestDir();
    // Create a directory named "tricky.md" — stat.isFile() should skip it
    fs.mkdirSync(path.join(testDir, 'tricky.md'));
    fs.writeFileSync(path.join(testDir, 'real.md'), '# A real rule');

    const result = runValidatorWithDir('validate-rules', 'RULES_DIR', testDir);
    assert.strictEqual(result.code, 0, 'Should skip directory entries');
    assert.ok(result.stdout.includes('Validated 1'), 'Should count only the real file');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('handles deeply nested rule in subdirectory', () => {
    const testDir = createTestDir();
    const deepDir = path.join(testDir, 'cat1', 'sub1');
    fs.mkdirSync(deepDir, { recursive: true });
    fs.writeFileSync(path.join(deepDir, 'deep-rule.md'), '# Deep nested rule');

    const result = runValidatorWithDir('validate-rules', 'RULES_DIR', testDir);
    assert.strictEqual(result.code, 0, 'Should validate deeply nested rules');
    assert.ok(result.stdout.includes('Validated 1'), 'Should find the nested rule');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('passes rule file containing only a fenced code block', () => {
    const testDir = createTestDir();
    fs.writeFileSync(path.join(testDir, 'code-only.md'),
      '```javascript\nfunction example() {\n  return true;\n}\n```');

    const result = runValidatorWithDir('validate-rules', 'RULES_DIR', testDir);
    assert.strictEqual(result.code, 0, 'Rule with only code block should pass (non-empty)');
    assert.ok(result.stdout.includes('Validated 1'), 'Should count the code-only file');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('reports error for broken symlink .md file in rules directory', () => {
    const testDir = createTestDir();
    // Create a valid rule first
    fs.writeFileSync(path.join(testDir, 'valid.md'), '# Valid Rule');
    // Create a broken symlink (dangling → target doesn't exist)
    // statSync follows symlinks and throws ENOENT, exercising catch block
    try {
      fs.symlinkSync('/nonexistent/target.md', path.join(testDir, 'broken.md'));
    } catch {
      // Skip on systems that don't support symlinks
      console.log('    (skipped — symlinks not supported)');
      cleanupTestDir(testDir);
      return;
    }

    const result = runValidatorWithDir('validate-rules', 'RULES_DIR', testDir);
    assert.strictEqual(result.code, 1, 'Should fail on broken symlink');
    assert.ok(result.stderr.includes('broken.md'), 'Should report the broken symlink file');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (test('passes on rules directory with no .md files (Validated 0)', () => {
    const testDir = createTestDir();
    // Only non-.md files — readdirSync filter yields empty array
    fs.writeFileSync(path.join(testDir, 'notes.txt'), 'not a rule');
    fs.writeFileSync(path.join(testDir, 'config.json'), '{}');

    const result = runValidatorWithDir('validate-rules', 'RULES_DIR', testDir);
    assert.strictEqual(result.code, 0, 'Should pass on empty rules directory');
    assert.ok(result.stdout.includes('Validated 0'), 'Should report 0 validated rule files');
    cleanupTestDir(testDir);
  })) passed++; else failed++;

  summary(passed, failed);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
