---
description: Enforce test-driven development workflow. Write tests FIRST, then implement minimal code to pass. Follow Red-Green-Refactor cycle with 80%+ coverage.
---

# TDD Workflow

Follow the Red-Green-Refactor cycle for all code development.

## Step 1: Define Interfaces (SCAFFOLD)

- Define types/interfaces for inputs and outputs
- Create function signatures with `throw new Error('Not implemented')` or equivalent
- Commit the scaffold

## Step 2: Write Failing Tests (RED)

Write tests that describe the expected behavior:

- Happy path scenarios
- Edge cases (null, empty, max values, boundary values)
- Error conditions (network failures, invalid input)
- Special characters (Unicode, emojis, SQL chars)

## Step 3: Run Tests — Verify FAIL

```bash
# Run the test suite for your project
npm test        # Node.js
pytest          # Python
go test ./...   # Go
```

// turbo

Tests MUST fail at this point. If they pass, the tests are not testing the right thing.

## Step 4: Write Minimal Implementation (GREEN)

- Write only enough code to make the tests pass
- Do not add extra features or optimizations
- Do not handle cases not covered by tests

## Step 5: Run Tests — Verify PASS

```bash
# Run the test suite again
npm test        # Node.js
pytest          # Python
go test ./...   # Go
```

// turbo

All tests must pass. If any fail, fix the implementation (not the tests).

## Step 6: Refactor (IMPROVE)

- Remove duplication
- Improve naming and readability
- Extract constants for magic numbers
- Optimize performance if needed
- **Tests must stay green throughout refactoring**

## Step 7: Verify Coverage

```bash
npm run test:coverage          # Node.js
pytest --cov=app --cov-report=term-missing  # Python
go test -coverprofile=coverage.out ./...     # Go
```

// turbo

Required: 80%+ branches, functions, lines, statements.

## Test Anti-Patterns to Avoid

- ❌ Testing implementation details (internal state) instead of behavior
- ❌ Tests depending on each other (shared state)
- ❌ Asserting too little (passing tests that don't verify anything)
- ❌ Not mocking external dependencies
- ❌ Writing implementation before tests

## Quality Checklist

- [ ] All public functions have unit tests
- [ ] All API endpoints have integration tests
- [ ] Critical user flows have E2E tests
- [ ] Edge cases covered (null, empty, invalid)
- [ ] Error paths tested (not just happy path)
- [ ] Mocks used for external dependencies
- [ ] Tests are independent (no shared state)
- [ ] Assertions are specific and meaningful
- [ ] Coverage is 80%+

## Related Skills

- `skill: tdd-workflow` — detailed mocking patterns and framework-specific examples
