---
description: Python code review for PEP 8 compliance, Pythonic idioms, type hints, security, and performance. Run after writing or modifying Python code.
---

# Python Review Workflow

Review Python code changes for quality, security, and Pythonic patterns.

## Step 1: Gather Context

// turbo
1. Run `git diff -- '*.py'` to see recent Python file changes
2. Run static analysis tools if available:
   ```bash
   mypy .                    # Type checking
   ruff check .              # Fast linting
   black --check .           # Format check
   bandit -r .               # Security scan
   ```
3. Focus on modified `.py` files

## Step 2: Security Review (CRITICAL)

- **SQL Injection**: f-strings in queries — use parameterized queries
- **Command Injection**: unvalidated input in `subprocess` — use list args
- **Path Traversal**: user-controlled paths — validate with `os.path.normpath`, reject `..`
- **Eval/exec abuse**, **unsafe deserialization**, **hardcoded secrets**
- **Weak crypto** (MD5/SHA1 for security), **YAML unsafe load** (`yaml.safe_load` only)
- **Bare except**: `except: pass` — catch specific exceptions
- **Swallowed exceptions**: silent failures — log and handle
- **Missing context managers**: use `with` for file/resource management

## Step 3: Type Hints & Pythonic Patterns (HIGH)

- Public functions without type annotations
- Using `Any` when specific types are possible
- Missing `Optional` for nullable parameters
- Use list comprehensions over C-style loops
- Use `isinstance()` not `type() ==`
- Use `Enum` not magic numbers
- Use `"".join()` not string concatenation in loops
- Mutable default arguments: `def f(x=[])` → use `def f(x=None)`

## Step 4: Code Quality (HIGH)

- Functions > 50 lines or > 5 parameters (use dataclass)
- Deep nesting (> 4 levels) — use early returns
- Duplicate code patterns
- Magic numbers without named constants

## Step 5: Best Practices (MEDIUM)

- PEP 8: import order, naming conventions, spacing
- Missing docstrings on public functions
- `print()` instead of `logging`
- `from module import *` — namespace pollution
- `value == None` — use `value is None`
- Shadowing builtins (`list`, `dict`, `str`)

## Step 6: Framework-Specific Checks

- **Django**: `select_related`/`prefetch_related` for N+1, `atomic()` for multi-step, migrations
- **FastAPI**: CORS config, Pydantic validation, response models, no blocking in async
- **Flask**: Proper error handlers, CSRF protection

## Step 7: Generate Report

```
[SEVERITY] Issue title
File: path/to/file.py:42
Issue: Description
Fix: What to change
```

### Approval Criteria

- **Approve**: No CRITICAL or HIGH issues
- **Warning**: MEDIUM issues only (can merge with caution)
- **Block**: CRITICAL or HIGH issues found
