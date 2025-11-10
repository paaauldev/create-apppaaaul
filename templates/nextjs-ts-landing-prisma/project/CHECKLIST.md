# Checklist
- [ ] Auditoria seguridad
- [ ] Configurar sitemap
- [ ] Configurar plausible
- [ ] Configurar search-console



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