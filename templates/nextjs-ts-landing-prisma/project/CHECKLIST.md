# Checklist
- [ ] Auditoria seguridad
- [ ] Configurar sitemap
- [ ] Configurar plausible
- [ ] Configurar search-console
- [ ] Añadir test e2e



# Prompts
Auditoria de seguridad (claude 4.5 + plan + max mode)
```
ROLE: Senior AppSec engineer auditing a Next.js 15 + TypeScript + Prisma repo + postgresql + betterauth, with Resend on custom linux server.
 
GOAL: Find and fix (1) secret/ENV exposure, (2) XSS, (3) auth/authz/session issues. Also check CSRF, SSRF, SQL/NoSQL injection, headers/CSP, webhooks, uploads, rate limits, CORS, caching/data leakage, logging/PII, CI/CD leaks.
 
METHOD:
- Map quickly: package.json, next.config.*, middleware.ts, app/**/route.ts, server actions, prisma/schema.prisma, auth config, webhook handlers, upload flows.
- Targeted search (must cite file:line + short codeframe):
  • Client files exposing non-NEXT_PUBLIC envs: `process.env.(?!NEXT_PUBLIC_)`
  • XSS sinks: `dangerouslySetInnerHTML|innerHTML`, markdown renderers w/o sanitize
  • Prisma raw: `.$queryRawUnsafe|.$executeRawUnsafe`
  • User-controlled fetch/redirects (SSRF/open redirect)
  • Missing guards on server actions/API routes; RLS gaps
  • CSRF on cookie-backed mutations; Origin/Referer checks
  • Security headers/CSP presence
  • Stripe webhook signature/idempotency
- Output:
  1) “Audit Summary” (risk + 3–6 key issues)
  2) “Findings” table (Sev|Category|File:Line|Evidence|Risk|Short Fix)
  3) Minimal unified diffs for each fix + 1-line verification step
RULES: No hypotheticals—every finding has file:line evidence. Patches must compile.
 
START: Print top 10 checks you’ll run, then proceed with findings → diffs → verification.
```

Testing con cypress (claude 4.5 + plan + max mode)
```
ROLE: Senior AppSec Engineer & QA Automation Lead creating automated Cypress end-to-end tests for a Next.js 15 + TypeScript + Prisma + PostgreSQL + BetterAuth + Resend application running on a custom Linux server.

GOAL:
Build a full Cypress test suite covering both:

Core functionality: authentication, database CRUD, API routes, server actions, webhooks, uploads, and email flows.

Security validation: ensure no ENV/secret leaks, no XSS, CSRF, SSRF, SQLi, header misconfigurations, caching or data leaks, insecure uploads, or missing authorization checks.

✅ METHOD

Map the project structure:

Identify package.json, next.config.*, middleware.ts, app/**/route.ts, server/actions, prisma/schema.prisma, auth/betterauth config, webhooks/, and uploads/.

Generate Cypress tests:

Create cypress/e2e/*.cy.ts files organized by feature (auth, API, uploads, webhooks, etc.).

Use mocked or test database if needed for integration.

Automate:

Login/logout/session flows (BetterAuth)

CRUD operations via UI and API

Webhook and email (Resend) validation

CSRF protection via Origin/Referer headers

CORS and security header checks

Rate limiting and caching behavior

Include automated security scanning tests:

Secrets Exposure: Detect process.env.(?!NEXT_PUBLIC_) values appearing in client-side responses.

XSS: Test any rendering with dangerouslySetInnerHTML or markdown output using injected <script> payloads to ensure sanitization.

SQL Injection: Inject common payloads into form fields or query params.

SSRF/Open Redirects: Test redirects and user-controlled URLs.

Uploads: Validate MIME type, file size, and path traversal protections.

Logging/PII: Ensure sensitive info (tokens, emails, passwords) isn’t leaked to console or network responses.

Test structure & assertions:

Use describe() for each feature/security vector and it() for individual scenarios.

Include verification steps for fixes (e.g., assert sanitized HTML or secure headers).

Use cy.intercept() for API validation and cy.request() for server responses.

🧠 TEST RULES

All tests must run with cypress run --browser chrome --headless and pass deterministically.

Each test must reference real routes, endpoints, and features—no hypotheticals.

Include both UI and API-level tests.

Add cy.task() or fixtures for mocking emails, tokens, or DB data.

Report results grouped as Functional | Security | Regression.

📋 OUTPUT FORMAT

“Test Plan Summary” – table of features covered (Functional | Security | Coverage %).

“Generated Tests” – Cypress test file paths + code snippets.

“Execution Results” – pass/fail summary for each suite.

“Next Steps” – recommended refactors or security hardening items.

🚀 START

Step 1: Print the top 10 Cypress test groups you will generate (by feature or attack vector).
Step 2: Generate the corresponding *.cy.ts files with full Cypress syntax.
Step 3: Include explanations for each test’s purpose, expected outcome, and key security checks.
```