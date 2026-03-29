# Security release gate (pre-deploy checklist)

Run this before promoting a build to production or merging release-critical changes. Tick each item when verified for the target environment.

## Contact API and abuse controls

- [ ] **Successful send flow**: `POST /api/send` with valid JSON, Turnstile (if enabled), and rate limit headroom returns **200** and the message is delivered (Resend inbox or test recipient).
- [ ] **Validation failures**: Invalid or missing fields return **400** with a **sanitized** JSON body (field-level or generic messages only; no stack traces, no internal paths).
- [ ] **Rate limit**: After exceeding limits, response is **429** with **`Retry-After`** header and body **`code: RATE_LIMIT`** (stable public code).
- [ ] **CAPTCHA / Turnstile failure**: Missing or invalid token does **not** call Resend; response is **400** with safe copy and **`code: TURNSTILE_FAILED`** (or equivalent); no vendor internals in the body.
- [ ] **Upstream email failure**: When Resend errors (or simulated failure in staging), response is **5xx** with generic user message; **no** Resend error payload or raw vendor text in the response body.

## Headers and CSP

- [ ] **Content-Security-Policy**: **Enforced** in production (`Content-Security-Policy` present on HTML responses). Set `CSP_ENFORCE=false` only temporarily when tuning in a lower environment; production should stay enforcing. After deploy, spot-check the app: scripts, styles, Turnstile widget, and `POST /api/send` still work.
- [ ] **CSP violations**: In environments where you monitor reports, violations should match expectations (e.g. no unexpected blocked resources). Adjust policy in `proxy.ts` only via controlled changes, not by disabling enforcement in prod without review.
- [ ] **Proxy / baseline security headers**: Responses from the app and from `/api/send` include expected headers from `proxy.ts` (e.g. `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and HSTS when served over HTTPS).

## Secrets and client exposure

- [ ] **Client bundles**: No API keys, salts, or secrets in browser JavaScript beyond **`NEXT_PUBLIC_*`** values that are intentionally public (e.g. Turnstile site key). Run a production build and grep `.next` or use bundle analysis if unsure.
- [ ] **Logs**: Server logs do not print `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_TOKEN`, or `SECURITY_AUDIT_SALT`. Audit lines use hashed identifiers where designed (`ipHash`), not raw message content for security events.

---

**Release owner**: _______________ **Date / commit**: _______________
