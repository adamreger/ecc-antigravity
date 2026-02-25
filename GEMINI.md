# GEMINI.md

This file provides guidance when working with code in this repository.

## Project Overview

This is a collection of production-ready **workflows, skills, and rules** for software development, adapted for **Antigravity IDE**. Originally forked from [everything-claude-code](https://github.com/affaan-m/everything-claude-code).

## Running Tests

```bash
# Run all tests
node tests/run-all.js

# Run individual test files
node tests/lib/utils.test.js
node tests/lib/package-manager.test.js
```

## Architecture

The project is organized into several core components:

- **`workflows/`** — Step-by-step workflow definitions (plan, tdd, code-review, etc.)
- **`skills/`** — Domain knowledge and patterns (coding standards, testing, frameworks)
- **`rules/`** — Always-follow guidelines (security, coding style, testing requirements)
- **`scripts/`** — Utility scripts
- **`tests/`** — Test suite for scripts and utilities

The `install.sh` script copies these to the correct locations in your project:
- `workflows/` → `.agent/workflows/`
- `skills/` → `.agent/skills/`
- `rules/` → `.agent/rules/`

## Key Workflows

Invoke these with the corresponding slash command:

- `/plan` — Implementation planning
- `/tdd` — Test-driven development
- `/code-review` — Quality review
- `/build-fix` — Fix build errors
- `/security-review` — Security audit
- `/verify` — Comprehensive verification
- `/refactor-clean` — Dead code cleanup
- `/python-review` — Python code review
- `/orchestrate` — Chain workflows together

## Development Notes

- Workflow format: Markdown with YAML frontmatter (`description`)
- Skill format: `SKILL.md` with clear sections (When to Use, How It Works, Examples)
- Rule format: Markdown guidelines organized by language (`common/`, `typescript/`, `python/`, `swift/`)
- File naming: lowercase with hyphens (e.g., `python-review.md`, `tdd-workflow.md`)
