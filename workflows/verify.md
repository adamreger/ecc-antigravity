---
description: Run comprehensive verification on current codebase state. Checks build, types, lint, tests, and git status.
---

# Verify Workflow

Execute verification in this exact order.

## Step 1: Build Check

// turbo
Run the build command for this project. If it fails, report errors and STOP.

## Step 2: Type Check

// turbo
Run the type checker (e.g., `npx tsc --noEmit`, `mypy .`, `go vet ./...`). Report all errors with file:line.

## Step 3: Lint Check

// turbo
Run the linter (e.g., `npx eslint .`, `ruff check .`, `golangci-lint run`). Report warnings and errors.

## Step 4: Test Suite

// turbo
Run all tests. Report pass/fail count and coverage percentage.

## Step 5: Console.log / Debug Audit

Search for debug statements in source files (e.g., `console.log`, `print()`, `fmt.Println` used for debugging). Report locations.

## Step 6: Git Status

// turbo
Show uncommitted changes and files modified since last commit.

## Step 7: Generate Report

```
VERIFICATION: [PASS/FAIL]

Build:    [OK/FAIL]
Types:    [OK/X errors]
Lint:     [OK/X issues]
Tests:    [X/Y passed, Z% coverage]
Logs:     [OK/X debug statements]

Ready for PR: [YES/NO]
```

If any critical issues, list them with fix suggestions.
