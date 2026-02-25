---
description: Dead code cleanup and consolidation. Remove unused code, duplicates, and dependencies safely with testing between each batch.
---

# Refactor Clean Workflow

Identify and remove dead code, duplicates, and unused exports safely.

## Step 1: Analyze

Run detection tools to find unused code:

```bash
# JavaScript/TypeScript
npx knip                                    # Unused files, exports, dependencies
npx depcheck                                # Unused npm dependencies
npx ts-prune                                # Unused TypeScript exports

# Python
vulture .                                   # Dead code detection

# General
npx eslint . --report-unused-disable-directives  # Unused eslint directives
```

// turbo

Categorize findings by risk:
- **SAFE**: Unused exports, unused dependencies
- **CAREFUL**: Dynamic imports, reflection-based usage
- **RISKY**: Public API surface, shared libraries

## Step 2: Verify Each Item

For each item to remove:
- Grep for all references (including dynamic imports via string patterns)
- Check if it is part of a public API
- Review git history for context on why it was added

## Step 3: Remove Safely

1. Start with SAFE items only
2. Remove one category at a time: deps → exports → files → duplicates
3. Run tests after each batch
4. Commit after each batch with descriptive messages

## Step 4: Consolidate Duplicates

1. Find duplicate components/utilities
2. Choose the best implementation (most complete, best tested)
3. Update all imports, delete duplicates
4. Verify tests pass

## Safety Checklist

Before removing:
- [ ] Detection tools confirm unused
- [ ] Grep confirms no references (including dynamic)
- [ ] Not part of public API
- [ ] Tests pass after removal

After each batch:
- [ ] Build succeeds
- [ ] Tests pass
- [ ] Committed with descriptive message

## When NOT to Use

- During active feature development
- Right before production deployment
- Without proper test coverage
- On code you don't understand
