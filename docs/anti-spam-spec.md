# Anti-Spam / Anti-Bot Spec for Anonymous Review Platform

> Implementation spec for Claude Code. Goal: prevent bot and spam submissions on an
> anonymous (no-login) review platform, using only **free** tools, on the existing stack.

## Project context

- **What it is:** A Glassdoor-style platform for company reviews and interview reports, but **fully anonymous** — no user accounts, no sign-in. Users can both view and create submissions anonymously.
- **Stack:** Next.js + TypeScript, Cloudflare R2 (company image storage), Neon (Postgres).
- **Submission types:** `review` and `interview`.

## Goal

Stop bots, AI agents, and casual spam (e.g. an angry ex-employee re-posting the same rant for a company every 10 minutes) **without** any paid service and **without** user accounts.

## Constraints & acceptance criteria

- Must be **free**. No paid APIs or services.
- No user authentication / sign-in. Anonymity is a core product value.
- Enforce **one `review` + one `interview` per company per person** (best-effort).
- "Person" is approximated via signals, not identity — perfect enforcement is impossible without accounts.
- **Accepted edge case:** a determined user who switches IP (VPN) _and_ clears cookies CAN slip a second submission through. This is fine and is NOT considered a failure.
- Privacy by design: never store raw IP addresses.

## Strategy: layered defense

No single control is sufficient. Stack cheap, imperfect controls so abuse becomes more effort than it's worth. Layers 1–2 stop nearly all bots; layer 4 makes human repeat-spam tedious.

---

## Layer 1 — Cloudflare network (config, no code)

The domain is already using Cloudflare for R2, so put the app domain behind the Cloudflare proxy if it isn't already.

- Enable **Bot Fight Mode**.
- Add a **rate-limiting rule** scoped to the submission endpoint only (e.g. `/api/submit`).
- Verify current free-tier rate-limit rule allowances (Cloudflare changes these periodically); even a single rule on the submit route is high value.

**Pros:** Free, no code, blocks most automated traffic before it reaches Next.js/Neon, adds DDoS protection.
**Cons:** Won't stop a determined human or a smart headless browser.

---

## Layer 2 — Cloudflare Turnstile on the submission form

Free, unlimited, privacy-friendly CAPTCHA alternative (usually invisible).

1. Render the Turnstile widget client-side on the create-review / create-interview form.
2. On submit, send the Turnstile token to the server.
3. **Verify server-side** by POSTing to `https://challenges.cloudflare.com/turnstile/v0/siteverify` with the secret key + token. Reject if `success !== true`.

**Pros:** Free with no cap, no Google tracking, strong against bots/headless browsers, easy Next.js integration.
**Cons:** A human in a real browser can still pass it; does nothing for the one-per-company rule.

Required env vars:

- `TURNSTILE_SITE_KEY` (public, client)
- `TURNSTILE_SECRET_KEY` (server only)

---

## Layer 3 — App-level checks (server-side only, never trust the client)

Run all three before writing to Neon:

1. **Honeypot field** — a hidden input real users leave empty. If filled → reject silently.
2. **Timing check** — issue a signed timestamp when the form loads; reject submissions completed in under ~2–3 seconds.
3. **Turnstile verification** — from Layer 2.

**Pros:** Free, no third party, catches naive scripted bots.
**Cons:** Complement only — not a primary defense on its own.

---

## Layer 4 — Enforcement in Neon (the "one per company" rule)

Approximate identity with **two** signals: a salted IP hash and a first-visit cookie.

- Reject a new submission if a row already exists for the same `(company_id, type)` AND (same `ip_hash` OR same `cookie_id`).
- Using both signals means a casual abuser must change IP **and** clear cookies to get a second one through — which is exactly the accepted edge case.
- **Hash the IP with a server secret** (`sha256(ip + IP_HASH_SALT)`); never store raw IPs.
- Add a **global per-IP rate limit** (e.g. max 5 submissions/hour across all companies) so a script can't post one review each across hundreds of companies.

Required env var:

- `IP_HASH_SALT` (server secret)

### Neon schema

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm; -- for Layer 5 near-duplicate detection

CREATE TABLE submissions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   UUID NOT NULL REFERENCES companies(id),
  type         TEXT NOT NULL CHECK (type IN ('review', 'interview')),
  content      TEXT NOT NULL,
  content_hash TEXT NOT NULL,                 -- sha256 of normalized content (exact-dup check)
  ip_hash      TEXT NOT NULL,                 -- sha256(ip + IP_HASH_SALT)
  cookie_id    TEXT NOT NULL,                 -- random UUID set on first visit
  status       TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fast lookups for the one-per-company check
CREATE INDEX idx_submissions_dedup ON submissions (company_id, type, ip_hash);
CREATE INDEX idx_submissions_cookie ON submissions (company_id, type, cookie_id);

-- Trigram index for near-duplicate content search (Layer 5)
CREATE INDEX idx_submissions_content_trgm ON submissions USING gin (content gin_trgm_ops);
```

### Server-side check sketch (TypeScript)

```ts
import crypto from "crypto";

function hashIp(ip: string) {
  return crypto
    .createHash("sha256")
    .update(ip + process.env.IP_HASH_SALT)
    .digest("hex");
}

function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

async function validateSubmission(params: {
  companyId: string;
  type: "review" | "interview";
  content: string;
  ip: string;
  cookieId: string;
  turnstileToken: string;
  honeypot: string;
  formLoadedAt: number; // signed timestamp from form load
}) {
  // Layer 3: honeypot
  if (params.honeypot) return { ok: false, reason: "honeypot" };

  // Layer 3: timing
  if (Date.now() - params.formLoadedAt < 2500) return { ok: false, reason: "too_fast" };

  // Layer 2: Turnstile
  const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY!,
      response: params.turnstileToken,
    }),
  }).then((r) => r.json());
  if (!verify.success) return { ok: false, reason: "turnstile" };

  const ipHash = hashIp(params.ip);

  // Layer 4: global per-IP rate limit (5/hour across all companies)
  const recent = await db.query(
    `SELECT count(*)::int AS n FROM submissions
     WHERE ip_hash = $1 AND created_at > now() - interval '1 hour'`,
    [ipHash],
  );
  if (recent.rows[0].n >= 5) return { ok: false, reason: "rate_limited" };

  // Layer 4: one-per-company (IP OR cookie match)
  const dup = await db.query(
    `SELECT 1 FROM submissions
     WHERE company_id = $1 AND type = $2
       AND (ip_hash = $3 OR cookie_id = $4)
     LIMIT 1`,
    [params.companyId, params.type, ipHash, params.cookieId],
  );
  if (dup.rowCount) return { ok: false, reason: "already_submitted" };

  // Layer 5: near-duplicate content for this company (pg_trgm similarity)
  const norm = normalize(params.content);
  const similar = await db.query(
    `SELECT 1 FROM submissions
     WHERE company_id = $1 AND type = $2
       AND similarity(content, $3) > 0.7
     LIMIT 1`,
    [params.companyId, params.type, norm],
  );
  if (similar.rowCount) return { ok: false, reason: "duplicate_content" };

  return { ok: true, ipHash };
}
```

> Notes:
>
> - Get the real client IP from the Cloudflare `CF-Connecting-IP` header (the proxy sets it).
> - Set `cookie_id` as an HttpOnly cookie (random UUID) on first visit if absent.
> - The `formLoadedAt` timestamp should be signed/HMAC'd so it can't be forged client-side.

---

## Layer 5 — Content dedup (optional, free, fits the stack)

Postgres `pg_trgm` (supported on Neon) catches near-duplicate rants — the reworded-repost case — via a `similarity()` query (see sketch above). Exact duplicates are caught more cheaply via `content_hash`. Either auto-reject above a threshold (e.g. 0.7) or route to a moderation queue (`status = 'pending'`).

**Pros:** Free, in-database, directly targets the angry-reposter scenario.
**Cons:** Threshold needs tuning; aggressive thresholds risk false positives.

---

## Recommended minimum build

If implementing incrementally, this order gives the most protection per unit effort:

1. Layer 1 (Cloudflare config) — biggest win, zero code.
2. Layer 2 (Turnstile) — stops nearly all remaining bots.
3. Layer 4 (Neon dedup + IP/cookie) — enforces one-per-company.
4. Layer 3 (honeypot + timing) — cheap belt-and-suspenders.
5. Layer 5 (content similarity) — handles human reposters.

## Implementation checklist

- [ ] Confirm app domain is proxied through Cloudflare; enable Bot Fight Mode.
- [ ] Add Cloudflare rate-limit rule on the submission endpoint.
- [ ] Register a Turnstile site; add `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY`.
- [ ] Add Turnstile widget to create-review and create-interview forms.
- [ ] Add `IP_HASH_SALT` env var.
- [ ] Run the Neon migration (table + indexes + `pg_trgm`).
- [ ] Set first-visit `cookie_id` (HttpOnly UUID).
- [ ] Add hidden honeypot field + signed `formLoadedAt` to forms.
- [ ] Implement `validateSubmission` server-side (route handler or server action).
- [ ] Read client IP from `CF-Connecting-IP`.
- [ ] Decide: auto-reject vs. moderation queue for duplicate-content hits.
- [ ] Tune the `similarity()` threshold against real data.
