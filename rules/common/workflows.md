# Workflow Orchestration

## Available Workflows

Located in `.agent/workflows/` (installed from `workflows/` at repo root):

| Workflow | Purpose | When to Use |
|----------|---------|-------------|
| `/plan` | Implementation planning | Complex features, refactoring |
| `/tdd` | Test-driven development | New features, bug fixes |
| `/code-review` | Code review | After writing code |
| `/security-review` | Security analysis | Before commits |
| `/build-fix` | Fix build errors | When build fails |
| `/verify` | Comprehensive verification | Before PRs |
| `/refactor-clean` | Dead code cleanup | Code maintenance |
| `/python-review` | Python code review | After modifying Python code |
| `/orchestrate` | Chain workflows | Complex multi-step tasks |

## Immediate Workflow Usage

No user prompt needed:
1. Complex feature requests — Use `/plan`
2. Code just written/modified — Use `/code-review`
3. Bug fix or new feature — Use `/tdd`
4. Security-sensitive code — Use `/security-review`

## Multi-Step Tasks

For complex tasks, use `/orchestrate` to chain workflows:

```
Feature:  /plan → /tdd → /code-review → /security-review
Bugfix:   /plan → /tdd → /code-review
Refactor: /plan → /code-review → /tdd
Security: /security-review → /code-review → /plan
```
