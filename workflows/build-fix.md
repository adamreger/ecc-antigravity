---
description: Incrementally fix build and type errors with minimal, safe changes. Fix one error at a time for safety.
---

# Build Fix Workflow

Fix build and type errors with minimal changes — no refactoring, no architecture changes.

## Step 1: Detect Build System

Identify the project's build tool and run the build:

| Indicator | Build Command |
|-----------|---------------|
| `package.json` with `build` script | `npm run build` or `pnpm build` |
| `tsconfig.json` (TypeScript only) | `npx tsc --noEmit` |
| `Cargo.toml` | `cargo build 2>&1` |
| `go.mod` | `go build ./...` |
| `pyproject.toml` | `python -m py_compile` or `mypy .` |
| `pom.xml` | `mvn compile` |
| `build.gradle` | `./gradlew compileJava` |

// turbo

## Step 2: Parse and Group Errors

1. Run the build command and capture stderr
2. Group errors by file path
3. Sort by dependency order (fix imports/types before logic errors)
4. Count total errors for progress tracking

## Step 3: Fix Loop (One Error at a Time)

For each error:

1. **Read the file** — see error context (10 lines around the error)
2. **Diagnose** — identify root cause (missing import, wrong type, syntax error)
3. **Fix minimally** — smallest change that resolves the error
4. **Re-run build** — verify the error is gone and no new errors introduced
5. **Move to next** — continue with remaining errors

### Common Fixes

| Error | Fix |
|-------|-----|
| `implicitly has 'any' type` | Add type annotation |
| `Object is possibly 'undefined'` | Optional chaining `?.` or null check |
| `Property does not exist` | Add to interface or use optional `?` |
| `Cannot find module` | Check paths, install package, or fix import |
| `Type 'X' not assignable to 'Y'` | Parse/convert type or fix the type |

## Step 4: Guardrails

Stop and ask the user if:
- A fix introduces **more errors than it resolves**
- The **same error persists after 3 attempts**
- The fix requires **architectural changes**
- Build errors stem from **missing dependencies**

## Step 5: Summary

Report:
- Errors fixed (with file paths)
- Errors remaining (if any)
- New errors introduced (should be zero)
- Suggested next steps for unresolved issues
