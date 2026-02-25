---
description: Create a comprehensive implementation plan before writing any code. Restate requirements, assess risks, and break down into phases.
---

# Plan Workflow

Follow these steps to create a thorough implementation plan.

## Step 1: Restate Requirements

- Understand the feature request completely
- Ask clarifying questions if needed
- Restate requirements in clear, specific terms
- List assumptions and constraints
- Identify success criteria

## Step 2: Analyze Existing Codebase

- Review existing architecture for affected areas
- Identify patterns and conventions already in use
- Find similar implementations to follow
- Identify reusable components or utilities
- Document technical debt in affected areas

## Step 3: Create Step-by-Step Plan

Break down into phases with specific, actionable steps. For each step include:

- **File path** and location of changes
- **Action**: Specific change to make
- **Why**: Reason for this step
- **Dependencies**: What must be done first
- **Risk**: Low/Medium/High

Use this template:

```markdown
# Implementation Plan: [Feature Name]

## Overview
[2-3 sentence summary]

## Requirements
- [Requirement 1]
- [Requirement 2]

## Architecture Changes
- [Change 1: file path and description]

## Implementation Steps

### Phase 1: [Phase Name]
1. **[Step Name]** (File: path/to/file)
   - Action: Specific action to take
   - Why: Reason for this step
   - Dependencies: None / Requires step X
   - Risk: Low/Medium/High

### Phase 2: [Phase Name]
...

## Testing Strategy
- Unit tests: [files to test]
- Integration tests: [flows to test]
- E2E tests: [user journeys to test]

## Risks & Mitigations
- **Risk**: [Description]
  - Mitigation: [How to address]

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

## Step 4: Present Plan and Wait

- Present the complete plan to the user
- **WAIT for explicit user confirmation before writing any code**
- If modifications requested, update the plan and present again

## Sizing and Phasing

For large features, break into independently deliverable phases:

- **Phase 1**: Minimum viable — smallest slice that provides value
- **Phase 2**: Core experience — complete happy path
- **Phase 3**: Edge cases — error handling, edge cases, polish
- **Phase 4**: Optimization — performance, monitoring, analytics

Each phase should be mergeable independently.

## Best Practices

1. **Be Specific**: Use exact file paths, function names, variable names
2. **Consider Edge Cases**: Think about error scenarios, null values, empty states
3. **Minimize Changes**: Prefer extending existing code over rewriting
4. **Maintain Patterns**: Follow existing project conventions
5. **Enable Testing**: Structure changes to be easily testable
6. **Think Incrementally**: Each step should be verifiable
7. **Document Decisions**: Explain why, not just what

## Red Flags to Check

- Plans with no testing strategy
- Steps without clear file paths
- Phases that cannot be delivered independently
- Large functions (>50 lines)
- Deep nesting (>4 levels)
- Missing error handling
