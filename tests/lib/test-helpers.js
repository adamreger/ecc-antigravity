/**
 * Shared test helpers — ANSI-colored output for the test suite.
 *
 * Usage:
 *   const { test, section, header, summary } = require('../lib/test-helpers');
 */

// --- ANSI escape codes ---
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const NC = '\x1b[0m'; // reset

/**
 * Print a styled header for the entire test file.
 * e.g. header('CI Validators')
 */
function header(title) {
    console.log(`\n${BOLD}${CYAN}  ${title}${NC}\n`);
}

/**
 * Print a styled section separator.
 * e.g. section('validate-workflows.js')
 */
function section(title) {
    console.log(`${BOLD}${YELLOW}  ${title}${NC}`);
}

/**
 * Run a single test case. Returns true on pass, false on fail.
 *
 * @param {string} name - Test description
 * @param {Function} fn - Test body (should throw on failure)
 * @returns {boolean}
 */
function test(name, fn) {
    try {
        fn();
        console.log(`  ${GREEN}✓${NC} ${name}`);
        return true;
    } catch (err) {
        console.log(`  ${RED}✗${NC} ${name}`);
        console.log(`    ${DIM}${err.message}${NC}`);
        return false;
    }
}

/**
 * Print a styled summary line at the end of a test file.
 *
 * @param {number} passed
 * @param {number} failed
 */
function summary(passed, failed) {
    const passStr = `${GREEN}${passed} passed${NC}`;
    const failStr = failed > 0 ? `${RED}${failed} failed${NC}` : `${failed} failed`;
    console.log(`\n  ${passStr}, ${failStr}\n`);
}

module.exports = { test, section, header, summary, GREEN, RED, YELLOW, CYAN, BOLD, DIM, NC };
