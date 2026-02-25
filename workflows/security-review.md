---
description: Security vulnerability detection and remediation. Run after writing code that handles user input, authentication, API endpoints, or sensitive data.
---

# Security Review Workflow

Review code for security vulnerabilities using OWASP Top 10 and common patterns.

## Step 1: Initial Scan

// turbo
1. Run `npm audit --audit-level=high` (Node.js) or equivalent for your stack
2. Search for hardcoded secrets: `grep -rn "sk-\|api_key\|password\|secret" --include="*.{ts,tsx,js,jsx,py}" .`
3. Identify high-risk areas: auth, API endpoints, DB queries, file uploads, payments, webhooks

## Step 2: OWASP Top 10 Check

Review each category:

1. **Injection** — Queries parameterized? User input sanitized? ORMs used safely?
2. **Broken Auth** — Passwords hashed (bcrypt/argon2)? JWT validated? Sessions secure?
3. **Sensitive Data** — HTTPS enforced? Secrets in env vars? PII encrypted? Logs sanitized?
4. **XXE** — XML parsers configured securely? External entities disabled?
5. **Broken Access** — Auth checked on every route? CORS properly configured?
6. **Misconfiguration** — Default creds changed? Debug mode off in prod? Security headers set?
7. **XSS** — Output escaped? CSP set? Framework auto-escaping?
8. **Insecure Deserialization** — User input deserialized safely?
9. **Known Vulnerabilities** — Dependencies up to date? Audit clean?
10. **Insufficient Logging** — Security events logged? Alerts configured?

## Step 3: Code Pattern Review

Flag these patterns immediately:

| Pattern | Severity | Fix |
|---------|----------|-----|
| Hardcoded secrets | CRITICAL | Use environment variables |
| Shell command with user input | CRITICAL | Use safe APIs or execFile |
| String-concatenated SQL | CRITICAL | Parameterized queries |
| `innerHTML = userInput` | HIGH | Use `textContent` or DOMPurify |
| `fetch(userProvidedUrl)` | HIGH | Whitelist allowed domains |
| Plaintext password comparison | CRITICAL | Use `bcrypt.compare()` |
| No auth check on route | CRITICAL | Add authentication middleware |
| No rate limiting | HIGH | Add rate limiting middleware |
| Logging passwords/secrets | MEDIUM | Sanitize log output |

## Step 4: Generate Report

```
## Security Review Summary

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 0     | pass   |
| HIGH     | 0     | pass   |
| MEDIUM   | 0     | info   |

Verdict: [PASS / NEEDS WORK / BLOCKED]
```

## Emergency Response

If you find a CRITICAL vulnerability:
1. Document with detailed report
2. Alert project owner immediately
3. Provide secure code example
4. Verify remediation works
5. Rotate secrets if credentials exposed
