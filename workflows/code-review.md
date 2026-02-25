---
description: Comprehensive code review for quality, security, and maintainability. Run after writing or modifying code.
---

# Code Review Workflow

Review code changes systematically from CRITICAL to LOW severity.

## Step 1: Gather Context

// turbo
1. Run `git diff --staged` and `git diff` to see all changes
2. If no diff, check recent commits with `git log --oneline -5`
3. Identify which files changed and what feature/fix they relate to

## Step 2: Read Surrounding Code

- Don't review changes in isolation
- Read the full file and understand imports, dependencies, and call sites
- Understand the broader context of each change

## Step 3: Security Review (CRITICAL)

Flag these immediately — they can cause real damage:

- **Hardcoded credentials** — API keys, passwords, tokens in source
- **SQL injection** — String concatenation in queries instead of parameterized
- **XSS vulnerabilities** — Unescaped user input rendered in HTML/JSX
- **Path traversal** — User-controlled file paths without sanitization
- **CSRF vulnerabilities** — State-changing endpoints without CSRF protection
- **Authentication bypasses** — Missing auth checks on protected routes
- **Exposed secrets in logs** — Logging sensitive data

## Step 4: Code Quality Review (HIGH)

- **Large functions** (>50 lines) — Split into smaller functions
- **Large files** (>800 lines) — Extract modules by responsibility
- **Deep nesting** (>4 levels) — Use early returns, extract helpers
- **Missing error handling** — Unhandled promise rejections, empty catch blocks
- **Mutation patterns** — Prefer immutable operations
- **console.log / print statements** — Remove debug logging before merge
- **Missing tests** — New code paths without test coverage
- **Dead code** — Commented-out code, unused imports

## Step 5: Performance Review (MEDIUM)

- Inefficient algorithms (O(n²) when O(n) is possible)
- Missing caching for expensive computations
- Large bundle sizes from full library imports
- Synchronous I/O in async contexts
- N+1 query patterns

## Step 6: Best Practices Review (LOW)

- TODO/FIXME without issue references
- Missing JSDoc/docstrings for public APIs
- Poor naming (single-letter variables in non-trivial contexts)
- Magic numbers without named constants

## Step 7: Generate Report

Only report issues you are confident about (>80% sure it is a real problem):

```
## Review Summary

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 0     | pass   |
| HIGH     | 2     | warn   |
| MEDIUM   | 3     | info   |
| LOW      | 1     | note   |

Verdict: [APPROVE / WARNING / BLOCK]
```

## Confidence-Based Filtering

- **Report** if >80% confident it is a real issue
- **Skip** stylistic preferences unless they violate project conventions
- **Skip** issues in unchanged code unless CRITICAL security issues
- **Consolidate** similar issues (e.g., "5 functions missing error handling")
- **Prioritize** issues that could cause bugs, security vulnerabilities, or data loss

## Approval Criteria

- **Approve**: No CRITICAL or HIGH issues
- **Warning**: HIGH issues only (can merge with caution)
- **Block**: CRITICAL issues found — must fix before merge
