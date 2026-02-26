# Everything Claude Code — Antigravity Edition

[![CI](https://github.com/adamreger/ecc-antigravity/actions/workflows/ci.yml/badge.svg)](https://github.com/adamreger/ecc-antigravity/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Shell](https://img.shields.io/badge/-Shell-4EAA25?logo=gnu-bash&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/-Python-3776AB?logo=python&logoColor=white)
![Go](https://img.shields.io/badge/-Go-00ADD8?logo=go&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Markdown](https://img.shields.io/badge/-Markdown-000000?logo=markdown&logoColor=white)

> **Fork adapted for [Antigravity IDE](https://antigravity.google).**
> Original repo: [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)

Production-ready **workflows, skills, and rules** for software development, adapted from the battle-tested Claude Code configs by an Anthropic hackathon winner.

---

## 🚀 Quick Start

### Option 1: Install Script (Recommended)

```bash
# Clone this repo
git clone https://github.com/YOUR_USERNAME/ecc-antigravity.git
cd ecc-antigravity

# Install to your project (installs workflows + skills + rules)
./install.sh /path/to/your/project python
./install.sh /path/to/your/project typescript python    # Install multiple languages
./install.sh /path/to/your/project all                  # Install all available languages

# Get help
./install.sh --help
```

The installer copies:
- `workflows/` → `<project>/.agent/workflows/`
- `skills/` → `<project>/.agent/skills/`
- `rules/common/` + language rules → `<project>/.agent/rules/`

### Option 2: Manual Installation

```bash
# Clone this repo
git clone https://github.com/YOUR_USERNAME/ecc-antigravity.git

# Copy to your project manually
mkdir -p YOUR_PROJECT/.agent
cp -r ecc-antigravity/workflows/YOUR_PROJECT/.agent/workflows/
cp -r ecc-antigravity/skills/YOUR_PROJECT/.agent/skills/
cp -r ecc-antigravity/rules/common/YOUR_PROJECT/.agent/rules/common/
cp -r ecc-antigravity/rules/python/YOUR_PROJECT/.agent/rules/python/
# ... pick your stack
```

✨ **That's it!** You now have access to 9 workflows, 50 skills, and 24 rules.

---

## 🌐 Cross-Platform Support

**Windows, macOS, and Linux** are all officially. All scripts have been written in Node.js for maximum compatibility.

### Package Manager Detection

The plugin automatically detects your preferred package manager (npm, pnpm, yarn, or bun) with the following priority:

1. **Environment variable**: `ANTIGRAVITY_PACKAGE_MANAGER`
2. **Project config**: `.antigravity/package-manager.json`
3. **package.json**: `packageManager` field
4. **Lock file**: Detection from package-lock.json, yarn.lock, pnpm-lock.yaml, or bun.lockb
5. **Global config**: `~/.antigravity/package-manager.json`
6. **Fallback**: First available package manager

To set your preferred package manager:

```bash
# Via environment variable
export ANTIGRAVITY_PACKAGE_MANAGER=pnpm

# Via global config
node scripts/setup-package-manager.js --global pnpm

# Via project config
node scripts/setup-package-manager.js --project bun

# Detect current setting
node scripts/setup-package-manager.js --detect
```

Or use the `/setup-pm` workflow in Antigravity.

---

## 📦 What's Inside

```
ecc-antigravity/
├── workflows/            # Workflow definitions (installed to .agent/workflows/)
│   ├── plan.md              # /plan — Implementation planning
│   ├── tdd.md               # /tdd — Test-driven development
│   ├── code-review.md       # /code-review — Quality & security review
│   ├── build-fix.md         # /build-fix — Fix build/type errors
│   ├── security-review.md   # /security-review — Security audit
│   ├── verify.md            # /verify — Comprehensive verification
│   ├── refactor-clean.md    # /refactor-clean — Dead code cleanup
│   ├── python-review.md     # /python-review — Python code review
│   └── orchestrate.md       # /orchestrate — Chain workflows
│
├── skills/               # Domain knowledge & patterns (50+ skills)
│   ├── coding-standards/        # Universal best practices
│   ├── tdd-workflow/            # TDD methodology
│   ├── security-review/         # Security checklist
│   ├── python-patterns/         # Python idioms
│   ├── django-patterns/         # Django best practices
│   ├── frontend-patterns/       # React, Next.js
│   ├── backend-patterns/        # API, database, caching
│   ├── postgres-patterns/       # PostgreSQL optimization
│   └── ... (50+ total)
│
├── rules/                # Always-follow guidelines
│   ├── common/              # Language-agnostic (coding-style, git, testing, security)
│   ├── typescript/          # TypeScript/JS specific
│   ├── python/              # Python specific
│   └── swift/               # Swift specific
│
└── examples/             # Example configurations
    ├── CLAUDE.md                # Example project config
    ├── saas-nextjs-CLAUDE.md    # Real-world SaaS
    └── django-api-CLAUDE.md     # Real-world Django API
```

---

## Available Workflows

| Workflow | Slash Command | Description |
|----------|--------------|-------------|
| Plan | `/plan` | Create implementation plan, break into phases, wait for approval |
| TDD | `/tdd` | Red-Green-Refactor cycle with 80%+ coverage |
| Code Review | `/code-review` | Security → quality → performance → best practices |
| Build Fix | `/build-fix` | Fix build/type errors one at a time with minimal diffs |
| Security Review | `/security-review` | OWASP Top 10, secrets detection, code pattern review |
| Verify | `/verify` | Build → types → lint → tests → debug audit → git status |
| Refactor Clean | `/refactor-clean` | Dead code detection and safe removal |
| Python Review | `/python-review` | PEP 8, type hints, Pythonic patterns, framework checks |
| Orchestrate | `/orchestrate` | Chain workflows (feature, bugfix, refactor, security) |

### Common Workflow Chains

**Starting a new feature:**
```
/plan → /tdd → /code-review → /security-review
```

**Fixing a bug:**
```
/plan → /tdd → /code-review
```

**Preparing for production:**
```
/security-review → /verify
```

---

## Skills (50+)

Skills are domain knowledge documents that Antigravity reads automatically. Each skill lives in `skills/<name>/SKILL.md` with YAML frontmatter.

Key skills include:
- **`coding-standards`** — Universal best practices
- **`tdd-workflow`** — TDD methodology with framework examples
- **`security-review`** — Security checklist and patterns
- **`python-patterns`** — Python idioms and best practices
- **`django-patterns`** / **`django-tdd`** — Django-specific patterns
- **`postgres-patterns`** — PostgreSQL optimization
- **`database-migrations`** — Migration patterns (Prisma, Django, etc.)
- **`api-design`** — REST API design, pagination, errors
- **`deployment-patterns`** — CI/CD, Docker, health checks
- **`continuous-learning-v2`** — Instinct-based pattern learning

See `skills/` for the full list.

---

## Rules

Rules are always-follow guidelines. They're installed to `.agent/rules/` in your project.

**Common rules** (language-agnostic): coding style, git workflow, testing, security, performance  
**Language-specific**: TypeScript, Python, Swift

---

## 🧪 Running Tests

The plugin includes a comprehensive test suite:

```bash
# Run all tests
node tests/run-all.js

# Run individual test files
node tests/lib/utils.test.js
node tests/lib/package-manager.test.js
```

---

## Upstream

This is a fork of [everything-claude-code](https://github.com/affaan-m/everything-claude-code) v1.6.0. Skills and rules are kept in sync with upstream; workflows are Antigravity-specific.

### What Was Changed From Upstream

This fork removes Claude Code-specific features that don't have Antigravity equivalents:

| Removed | Reason |
|---------|--------|
| `hooks/` | Claude Code event triggers — no Antigravity equivalent |
| `contexts/` | Claude Code mode switching — Antigravity manages its own modes |
| `.claude-plugin/` | Claude Code plugin metadata |
| `.claude/` | Claude Code local config |
| `.opencode/` | OpenCode support |
| `commands/multi-*.md` | Multi-model orchestration (5 commands) |
| `commands/pm2.md`, `sessions.md`, `claw.md` | Claude Code infrastructure |
| `commands/go-*.md` | Go-specific commands |
| `agents/go-*.md` | Go-specific agents |

**Agents were converted to workflows** in `workflows/`, adapted to Antigravity's workflow format (8 agents → 9 workflows). The installer copies them to `.agent/workflows/` in target projects.

**Rules updated** to reference workflows instead of Claude Code agents.

---

## License

MIT — Use freely, modify as needed, contribute back if you can.
