---
description: Sequential workflow orchestration for complex tasks. Chains plan, tdd, review, and security workflows together.
---

# Orchestrate Workflow

Chain multiple workflows together for complex tasks.

## Workflow Types

### Feature Implementation
Run these workflows in sequence:
1. `/plan` — Create implementation plan, wait for approval
2. `/tdd` — Implement with test-driven development
3. `/code-review` — Review implementation
4. `/security-review` — Security audit

### Bug Fix
1. `/plan` — Investigate and plan the fix
2. `/tdd` — Write test that reproduces bug, then fix
3. `/code-review` — Review the fix

### Refactoring
1. `/plan` — Document what to refactor and why
2. `/code-review` — Review for quality and patterns
3. `/tdd` — Ensure test coverage during refactoring

### Security Audit
1. `/security-review` — Full security review
2. `/code-review` — Quality review
3. `/plan` — Plan remediations

## Execution Pattern

For each workflow in the chain:

1. **Run the workflow** with context from the previous step
2. **Collect output** and key findings
3. **Pass context to the next workflow** in the chain
4. **Aggregate results** into a final report

## Final Report Format

```
ORCHESTRATION REPORT
====================
Workflow: [feature/bugfix/refactor/security]
Task: [description]
Steps: [workflow chain]

SUMMARY
-------
[One paragraph summary]

STEP OUTPUTS
------------
Plan: [summary]
TDD: [summary]
Code Review: [summary]
Security Review: [summary]

FILES CHANGED
-------------
[List all files modified]

TEST RESULTS
------------
[Test pass/fail summary]

RECOMMENDATION
--------------
[SHIP / NEEDS WORK / BLOCKED]
```

## Tips

1. **Start with /plan** for complex features
2. **Always include /code-review** before merge
3. **Use /security-review** for auth/payment/PII code
4. **Run /verify** between steps if needed
