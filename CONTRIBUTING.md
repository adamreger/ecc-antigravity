# 🚧 Work in Progress

> [!NOTE]
> This contributing guide is actively being updated. Some sections may be incomplete.
> Feel free to [open an issue](https://github.com/adamreger/ecc-antigravity/issues) if anything is unclear.

# Contributing to ECC-Antigravity

Thanks for wanting to contribute! This repo is a community resource for Antigravity IDE users.

## Table of Contents

- [What We're Looking For](#what-were-looking-for)
- [Quick Start](#quick-start)
- [Contributing Workflows](#contributing-workflows)
- [Contributing Skills](#contributing-skills)
- [Contributing Rules](#contributing-rules)
- [Pull Request Process](#pull-request-process)

---

## What We're Looking For

### Workflows

New or improved workflow definitions for Antigravity:

- Language-specific review pipelines (Python, Go, Rust, etc.)
- Framework-specific flows (Django, Rails, React, Next.js)
- DevOps automation (Kubernetes, Terraform, CI/CD)
- Specialized workflows (ML pipelines, data engineering, mobile)

### Skills

Domain knowledge and patterns:

- Language best practices
- Framework patterns
- Testing strategies
- Architecture guides

### Rules

Always-follow guidelines organized by language:

- **`common/`** — Language-agnostic (coding style, git, testing, security)
- **`typescript/`** — TypeScript/JavaScript specific
- **`python/`** — Python specific
- **`swift/`** — Swift specific

---

## Quick Start

```bash
# 1. Fork and clone
gh repo fork adamreger/ecc-antigravity --clone
cd ecc-antigravity

# 2. Create a branch
git checkout -b feat/my-contribution

# 3. Add your contribution (see sections below)

# 4. Test locally — install to a test project
./install.sh /path/to/test/project python

# 5. Submit PR
git add . && git commit -m "feat: add my-skill" && git push
```

---

## Contributing Workflows

Workflows are step-by-step instructions invoked via `/workflow-name` in Antigravity.

### File Location

```
workflows/your-workflow.md
```

### Workflow Template

```markdown
---
description: Brief description of what this workflow does
---

# Workflow Name

## Purpose

What this workflow accomplishes.

## Steps

1. First step — what Antigravity should do
2. Second step — validation or execution
3. Final step — output and verification

## Output

What the user receives when the workflow completes.
```

### Workflow Checklist

- [ ] Uses YAML frontmatter with `description`
- [ ] Steps are clear and actionable
- [ ] Tested with Antigravity IDE
- [ ] Follows naming convention: lowercase with hyphens (`my-workflow.md`)

### Existing Workflows

| Workflow | Slash Command | Description |
|----------|--------------|-------------|
| Plan | `/plan` | Implementation planning |
| TDD | `/tdd` | Test-driven development |
| Code Review | `/code-review` | Quality & security review |
| Build Fix | `/build-fix` | Fix build/type errors |
| Security Review | `/security-review` | Security audit |
| Verify | `/verify` | Comprehensive verification |
| Refactor Clean | `/refactor-clean` | Dead code cleanup |
| Python Review | `/python-review` | Python code review |
| Orchestrate | `/orchestrate` | Chain workflows |

---

## Contributing Skills

Skills are knowledge modules that Antigravity uses for context-aware assistance.

### Directory Structure

```
skills/
└── your-skill-name/
    └── SKILL.md
```

### SKILL.md Template

```markdown
---
name: your-skill-name
description: Brief description shown in skill list
---

# Your Skill Title

Brief overview of what this skill covers.

## Core Concepts

Explain key patterns and guidelines.

## Code Examples

\`\`\`typescript
// Include practical, tested examples
function example() {
  // Well-commented code
}
\`\`\`

## Best Practices

- Actionable guidelines
- Do's and don'ts
- Common pitfalls to avoid

## When to Use

Describe scenarios where this skill applies.
```

### Skill Checklist

- [ ] Focused on one domain/technology
- [ ] Includes practical code examples
- [ ] Under 500 lines
- [ ] Uses clear section headers
- [ ] Tested with Antigravity IDE

### Example Skills

| Skill | Purpose |
|-------|---------|
| `coding-standards/` | Universal best practices |
| `frontend-patterns/` | React and Next.js patterns |
| `backend-patterns/` | API and database patterns |
| `security-review/` | Security checklist |
| `python-patterns/` | Python idioms |

---

## Contributing Rules

Rules are always-follow guidelines installed to `.antigravity/rules/` in target projects.

### Directory Structure

```
rules/
├── common/          # Language-agnostic rules
├── typescript/      # TypeScript/JS rules
├── python/          # Python rules
└── swift/           # Swift rules
```

### Rule Format

Rules are markdown files containing clear, actionable guidelines. Each rule file should:

- Focus on a specific concern (e.g., security, testing, coding style)
- Use imperative language ("Always…", "Never…", "Prefer…")
- Include brief code examples where helpful
- Be concise — rules are loaded automatically, so brevity matters

### Rule Checklist

- [ ] Placed in the correct language directory (or `common/` if universal)
- [ ] Follows lowercase-with-hyphens naming (`my-rule.md`)
- [ ] Guidelines are actionable and specific
- [ ] No conflicts with existing rules

---

## Pull Request Process

### 1. PR Title Format

```
feat(workflows): add rust-review workflow
feat(skills): add kubernetes-patterns skill
feat(rules): add go coding standards
fix(skills): update React patterns for v19
docs: improve contributing guide
```

### 2. PR Description

Include:

- **Summary** — What you're adding and why
- **Type** — Workflow, Skill, or Rule
- **Testing** — How you tested this with Antigravity IDE
- **Checklist** — Confirm you've followed the relevant checklist above

### 3. Review Process

1. Maintainers review within 48 hours
2. Address feedback if requested
3. Once approved, merged to main

---

## Guidelines

### Do

- Keep contributions focused and modular
- Include clear descriptions
- Test with Antigravity IDE before submitting
- Follow existing patterns
- Document dependencies

### Don't

- Include sensitive data (API keys, tokens, paths)
- Add overly complex or niche configs
- Submit untested contributions
- Create duplicates of existing functionality

---

## File Naming

- Use lowercase with hyphens: `python-reviewer.md`
- Be descriptive: `tdd-workflow.md` not `workflow.md`
- Match name to filename

---

## Questions?

- **Issues:** [github.com/adamreger/ecc-antigravity/issues](https://github.com/adamreger/ecc-antigravity/issues)

---

Thanks for contributing! Let's build a great resource together. 🚀
