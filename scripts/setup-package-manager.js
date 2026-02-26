#!/usr/bin/env node
/**
 * Package Manager Setup Script
 *
 * Interactive script to configure preferred package manager.
 * Can be run directly or via the /setup-pm command.
 *
 * Usage:
 *   node scripts/setup-package-manager.js [pm-name]
 *   node scripts/setup-package-manager.js --detect
 *   node scripts/setup-package-manager.js --global pnpm
 *   node scripts/setup-package-manager.js --project bun
 */

const {
  PACKAGE_MANAGERS,
  getPackageManager,
  setPreferredPackageManager,
  setProjectPackageManager,
  getAvailablePackageManagers,
  detectFromLockFile,
  detectFromPackageJson
} = require('./lib/package-manager');

// --- ANSI Colors ---
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const NC = '\x1b[0m';

function showHelp() {
  console.log(`
${BOLD}Package Manager Setup for ECC-Antigravity${NC}

${YELLOW}Usage:${NC}
  node scripts/setup-package-manager.js [options] [package-manager]

${YELLOW}Options:${NC}
  ${CYAN}--detect${NC}        Detect and show current package manager
  ${CYAN}--global <pm>${NC}   Set global preference (saves to ~/.antigravity/package-manager.json)
  ${CYAN}--project <pm>${NC}  Set project preference (saves to .antigravity/package-manager.json)
  ${CYAN}--list${NC}          List available package managers
  ${CYAN}--help${NC}          Show this help message

${YELLOW}Package Managers:${NC}
  ${GREEN}npm${NC}             Node Package Manager (default with Node.js)
  ${GREEN}pnpm${NC}            Fast, disk space efficient package manager
  ${GREEN}yarn${NC}            Classic Yarn package manager
  ${GREEN}bun${NC}             All-in-one JavaScript runtime & toolkit

${YELLOW}Examples:${NC}
  node scripts/setup-package-manager.js --detect
  node scripts/setup-package-manager.js --global pnpm
  node scripts/setup-package-manager.js --project bun
  node scripts/setup-package-manager.js --list
`);
}

function detectAndShow() {
  const pm = getPackageManager();
  const available = getAvailablePackageManagers();
  const fromLock = detectFromLockFile();
  const fromPkg = detectFromPackageJson();

  console.log(`\n${BOLD}=== Package Manager Detection ===${NC}\n`);

  console.log(`${YELLOW}Current selection:${NC}`);
  console.log(`  Package Manager: ${GREEN}${pm.name}${NC}`);
  console.log(`  Source: ${CYAN}${pm.source}${NC}`);
  console.log('');

  console.log(`${YELLOW}Detection results:${NC}`);
  console.log(`  From package.json: ${fromPkg ? GREEN + fromPkg + NC : DIM + 'not specified' + NC}`);
  console.log(`  From lock file: ${fromLock ? GREEN + fromLock + NC : DIM + 'not found' + NC}`);
  console.log(`  Environment var: ${process.env.ANTIGRAVITY_PACKAGE_MANAGER ? GREEN + process.env.ANTIGRAVITY_PACKAGE_MANAGER + NC : DIM + 'not set' + NC}`);
  console.log('');

  console.log(`${YELLOW}Available package managers:${NC}`);
  for (const pmName of Object.keys(PACKAGE_MANAGERS)) {
    const installed = available.includes(pmName);
    const indicator = installed ? `${GREEN}✓${NC}` : `${RED}✗${NC}`;
    const current = pmName === pm.name ? ` ${DIM}(current)${NC}` : '';
    console.log(`  ${indicator} ${pmName}${current}`);
  }

  console.log('');
  console.log(`${YELLOW}Commands:${NC}`);
  console.log(`  Install: ${CYAN}${pm.config.installCmd}${NC}`);
  console.log(`  Run script: ${CYAN}${pm.config.runCmd} [script-name]${NC}`);
  console.log(`  Execute binary: ${CYAN}${pm.config.execCmd} [binary-name]${NC}`);
  console.log('');
}

function listAvailable() {
  const available = getAvailablePackageManagers();
  const pm = getPackageManager();

  console.log(`\n${BOLD}Available Package Managers:${NC}\n`);

  for (const pmName of Object.keys(PACKAGE_MANAGERS)) {
    const config = PACKAGE_MANAGERS[pmName];
    const installed = available.includes(pmName);
    const current = pmName === pm.name ? ` ${DIM}(current)${NC}` : '';

    console.log(`${BOLD}${pmName}${NC}${current}`);
    console.log(`  Installed: ${installed ? GREEN + 'Yes' + NC : RED + 'No' + NC}`);
    console.log(`  Lock file: ${DIM}${config.lockFile}${NC}`);
    console.log(`  Install: ${CYAN}${config.installCmd}${NC}`);
    console.log(`  Run: ${CYAN}${config.runCmd}${NC}`);
    console.log('');
  }
}

function setGlobal(pmName) {
  if (!PACKAGE_MANAGERS[pmName]) {
    console.error(`${RED}Error:${NC} Unknown package manager "${pmName}"`);
    console.error(`Available: ${Object.keys(PACKAGE_MANAGERS).join(', ')}`);
    process.exit(1);
  }

  const available = getAvailablePackageManagers();
  if (!available.includes(pmName)) {
    console.warn(`${YELLOW}Warning:${NC} ${pmName} is not installed on your system`);
  }

  try {
    setPreferredPackageManager(pmName);
    console.log(`\n${GREEN}✓${NC} Global preference set to: ${GREEN}${pmName}${NC}`);
    console.log(`  Saved to: ${CYAN}~/.antigravity/package-manager.json${NC}`);
    console.log('');
  } catch (err) {
    console.error(`${RED}Error:${NC} ${err.message}`);
    process.exit(1);
  }
}

function setProject(pmName) {
  if (!PACKAGE_MANAGERS[pmName]) {
    console.error(`${RED}Error:${NC} Unknown package manager "${pmName}"`);
    console.error(`Available: ${Object.keys(PACKAGE_MANAGERS).join(', ')}`);
    process.exit(1);
  }

  try {
    setProjectPackageManager(pmName);
    console.log(`\n${GREEN}✓${NC} Project preference set to: ${GREEN}${pmName}${NC}`);
    console.log(`  Saved to: ${CYAN}.antigravity/package-manager.json${NC}`);
    console.log('');
  } catch (err) {
    console.error(`${RED}Error:${NC} ${err.message}`);
    process.exit(1);
  }
}

// Main
const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

if (args.includes('--detect')) {
  detectAndShow();
  process.exit(0);
}

if (args.includes('--list')) {
  listAvailable();
  process.exit(0);
}

const globalIdx = args.indexOf('--global');
if (globalIdx !== -1) {
  const pmName = args[globalIdx + 1];
  if (!pmName || pmName.startsWith('-')) {
    console.error(`${RED}Error:${NC} --global requires a package manager name`);
    process.exit(1);
  }
  setGlobal(pmName);
  process.exit(0);
}

const projectIdx = args.indexOf('--project');
if (projectIdx !== -1) {
  const pmName = args[projectIdx + 1];
  if (!pmName || pmName.startsWith('-')) {
    console.error(`${RED}Error:${NC} --project requires a package manager name`);
    process.exit(1);
  }
  setProject(pmName);
  process.exit(0);
}

// If just a package manager name is provided, set it globally
const pmName = args[0];
if (PACKAGE_MANAGERS[pmName]) {
  setGlobal(pmName);
} else {
  console.error(`${RED}Error:${NC} Unknown option or package manager "${pmName}"`);
  showHelp();
  process.exit(1);
}
