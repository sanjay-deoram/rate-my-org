# RateMyCompany — Product Requirements Document

**Anonymous Company Review Platform**

| Field   | Detail                                                                                                         |
| ------- | -------------------------------------------------------------------------------------------------------------- |
| Version | 1.0                                                                                                            |
| Date    | April 2026                                                                                                     |
| Status  | Draft                                                                                                          |
| Stack   | TypeScript, Next.js, Neon (Postgres), Drizzle ORM, TanStack Form, TanStack Query, Zod, Tailwind CSS, shadcn/ui |
| Hosting | Vercel (free tier)                                                                                             |

---

## 1. Executive Summary

RateMyCompany is an anonymous, public-facing platform where employees and former employees can rate and review the companies they work for. The experience is modeled after Glassdoor: visitors can browse company profiles, read reviews, view interview experiences, and participate in discussions — all without any sign-in or account creation. There is no authentication layer whatsoever. All submitted content is anonymous. The platform enforces anti-bot measures at both the frontend and backend API level to ensure review integrity while keeping the barrier to entry as low as possible.

The product will launch as a free-tier deployment using Next.js on Vercel, Neon Postgres for the database, Drizzle ORM as the data layer, and Tailwind CSS with shadcn/ui for the frontend.

---

## 2. Goals and Non-Goals

### 2.1 Goals

- Allow anyone to browse company reviews, interview experiences, and discussions without signing in
- Enable anonymous submission of reviews, interview experiences, and discussion posts
- Implement a Glassdoor-style 5-star rating system across six categories
- Prevent bot and spam submissions through layered anti-abuse measures
- Allow users to add new companies that don't yet exist in the database
- Operate entirely within free-tier infrastructure limits

### 2.2 Non-Goals (v1)

- User accounts, profiles, or authentication — there is no sign-in anywhere in the platform, period
- User image or file uploads of any kind — only admins can upload company logos
- Employer-side dashboards or verified employer responses
- Salary estimation or job listing features
- Mobile native apps (responsive web only)
- Paid advertising or monetization

---

## 3. Tech Stack

| Layer            | Technology                          | Notes                                                                                                                                                                                                                                |
| ---------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Language         | TypeScript                          | Strict mode across the entire codebase, shared types between frontend and backend                                                                                                                                                    |
| Framework        | Next.js (App Router)                | SSR for public pages, API routes for submissions                                                                                                                                                                                     |
| Database         | Neon (Postgres)                     | Free tier: 0.5 GB, serverless, autoscale-to-zero                                                                                                                                                                                     |
| ORM              | Drizzle ORM                         | Lightweight, SQL-like syntax, type-safe, native Neon serverless support, minimal bundle size                                                                                                                                         |
| Styling          | Tailwind CSS                        | Utility-first, pairs with shadcn/ui                                                                                                                                                                                                  |
| Components       | shadcn/ui                           | Accessible, composable UI primitives                                                                                                                                                                                                 |
| Forms            | TanStack Form + Zod                 | Type-safe form state and field validation. Zod schemas shared between client forms and server API routes — define once, validate in both places.                                                                                     |
| Data Fetching    | TanStack Query                      | Client-side data fetching for search autocomplete, votes, and reports. Provides caching, deduplication, stale-while-revalidate, automatic retries, and loading/error states. Not used for server-rendered pages (SSR handles those). |
| State Management | None (React built-ins)              | No global state library needed. `useState` for local component state, `useSearchParams` for filters/sort. TanStack Query manages server state for client-side interactions.                                                          |
| Hosting          | Vercel                              | Free tier: 100 GB bandwidth, serverless functions                                                                                                                                                                                    |
| Anti-Bot         | Cloudflare Turnstile                | Free invisible CAPTCHA on all submission forms                                                                                                                                                                                       |
| Search           | Postgres pg_trgm + full-text search | Fuzzy autocomplete, no external API, scales to thousands of companies for free                                                                                                                                                       |
| Logo Storage     | Cloudflare R2 + Cloudflare CDN      | Free tier: 10 GB storage, 10M reads/mo, zero egress. Served via custom subdomain (e.g. `logos.yourdomain.com`) through Cloudflare's free CDN for caching and fast global delivery.                                                   |

---

## 4. Core Features

### 4.1 Search and Company Discovery

**Description:** The platform has a two-step search flow: a homepage search bar that routes users to a dedicated search page, and then from search results into individual company profiles.

**Homepage Search Bar:**

- Prominent search input on the homepage
- As the user types, a lightweight autocomplete dropdown suggests matching company names (debounced, powered by `pg_trgm` fuzzy matching). Autocomplete queries managed via TanStack Query for caching, deduplication, and stale-while-revalidate (e.g. hitting backspace serves cached results instantly).
- Pressing Enter or clicking a suggestion navigates to `/search?q=<query>` — the dedicated search page
- The search bar is also present in the global navigation header on every page

**Search Page (`/search`):**

- Full search interface with two input fields: company name and location (city, country, or region)
- Results are filtered by both fields when provided (e.g. searching "Chase" + "Toronto" narrows to that specific location)
- Results displayed as company cards: name, logo, overall rating, review count, headquarters
- Sort options: best match, highest rated, most reviewed
- If no results are found, show a call-to-action to add the company
- Company directory is entirely community-driven: companies are added by users and searchable by all future visitors. No external company API — the directory grows organically.

**Company Profile Page (`/companies/[slug]`):**

- Tabbed navigation: Overview, Reviews, Interviews
- Overview tab shows aggregate star ratings for each of the six categories, overall score, and a rating distribution bar chart
- **Role search within company:** On the Reviews and Interviews tabs, a search/filter input allows users to search by job title or role (e.g. "Software Developer"). This filters reviews and interviews to only show entries where the submitter provided a matching job title.
- Additional sort and filter options: highest rated, most reviewed, recently reviewed, employment status, date range

### 4.2 Add a Company

**Description:** If a user searches for a company that does not exist, they can create it. This prevents the platform from being limited to a pre-seeded list.

**Requirements:**

- Inline prompt when search returns no results: a call-to-action to add the company
- **Required fields:** Company name, industry/sector, headquarters location (city, country)
- **Optional fields:** Company website URL, company size range (e.g. 1–50, 51–200, 201–1000, 1000+), year founded, brief description. No image upload — logos are added by admins only.
- Duplicate detection: fuzzy match against existing companies before allowing creation. If an exact name match exists in a different location, allow creation but clarify to the user which company already exists. If name + headquarters matches, block as duplicate.
- Cloudflare Turnstile verification on submission
- New companies appear immediately but can be flagged for moderation

### 4.3 Company Reviews

**Description:** The primary content type. Employees and former employees submit anonymous reviews rating the company across six categories and providing written feedback. Visitors can read all reviews without signing in.

**Rating Categories (each rated 1–5 stars):**

- Diversity and Inclusion
- Work-Life Balance
- Culture and Values
- Senior Management
- Career Opportunities
- Compensation and Benefits

**Review Form Fields:**

- **Required:** Overall rating (1–5), ratings for each of the six categories, review title, pros (text), cons (text)
- **Optional:** Employment status (current/former), job title or department, time employed (range), advice to management (text)
- No sign-in required; all reviews are anonymous

**Display Requirements:**

- Reviews listed in reverse chronological order by default
- Filter by: rating (1–5), employment status, date range
- Sort by: most recent, highest rated, lowest rated, most helpful
- Each review shows: date submitted, overall star rating, category breakdown, pros/cons text, job title (if provided), and a helpful/not helpful vote counter

### 4.4 Interview Experiences

**Description:** Users can share their interview experience at a company, including the process, difficulty, questions asked, and outcome. Visitors can read all interview entries without signing in.

**Submission Fields:**

- **Required:** Interview difficulty (1–5 scale), overall experience (positive/neutral/negative), interview description (text)
- **Optional:** Job title applied for, interview date (month/year), how they got the interview (applied online, recruiter, referral, etc.), offer received (yes/no/pending), interview questions (text list)

**Display Requirements:**

- Listed in reverse chronological order
- Filter by: experience sentiment, difficulty level, offer outcome
- Each entry shows: difficulty meter, experience badge (positive/neutral/negative), description text, and any listed questions

### 4.5 Community Feedback on Reviews and Interviews

**Description:** Instead of a discussion forum, each review and interview entry has lightweight community feedback controls. Visitors can signal whether content is helpful or not, and flag content they believe is false or misleading.

**Requirements:**

- Every review and interview entry displays three inline actions: thumbs up (helpful), thumbs down (not helpful), and a report/flag button
- **Thumbs up / Thumbs down:** Simple like/dislike count displayed on each entry. One vote per IP per entry (tracked via hashed IP, no sign-in). Helps surface the most trusted reviews. Vote mutations handled via TanStack Query with optimistic updates (count updates instantly in the UI, rolls back on failure).
- **Report button:** Opens a small dropdown or modal with predefined report reasons: "False information," "Spam or fake review," "Offensive content," "Not relevant to this company," and an optional free-text field for additional context. Report form uses TanStack Form + Zod for validation, submission via TanStack Query mutation.
- Reports are logged to the moderation queue in the admin panel with the report reason, the content ID, and a timestamp
- Content that accumulates a configurable number of reports (e.g. 3+) is auto-hidden with a "This review has been flagged by the community" notice, pending admin review
- Turnstile verification on report submissions to prevent bot abuse of the flagging system
- Sort/filter options on reviews and interviews should include "Most helpful" (sorted by net upvotes)

---

## 5. Rating System Design

The rating system mirrors the Glassdoor model. Each review captures granular category scores that roll up into an overall company rating.

### Calculation

- **Per-review overall rating:** Submitted directly by the reviewer as a single 1–5 star score (not computed from categories)
- **Company overall rating:** Weighted average of all per-review overall ratings, displayed to one decimal place (e.g. 3.8)
- **Per-category company score:** Simple average of that category across all reviews, displayed to one decimal place
- **Rating distribution:** Bar chart showing count of 1-star, 2-star, 3-star, 4-star, and 5-star reviews
- **Minimum threshold:** Company ratings are not displayed publicly until at least 3 reviews have been submitted (prevents skewed scores from 1–2 reviews)

### Display

- Star icons with partial fill (e.g. 3.8 shows 3 full stars + 80% filled 4th star)
- Numeric score beside stars
- Color coding: green for 4.0+, yellow for 3.0–3.9, red for below 3.0

---

## 6. Anti-Bot and Spam Prevention

Since the platform is fully anonymous with no user accounts, anti-abuse measures are critical. The following layered approach prevents automated and spammy submissions without requiring sign-in.

| Layer | Mechanism               | Details                                                                                                                                  |
| ----- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Cloudflare Turnstile    | Invisible CAPTCHA on every submission form. Free, privacy-friendly, no user friction.                                                    |
| 2     | Honeypot Fields         | Hidden form fields invisible to real users. If filled, the submission is silently discarded.                                             |
| 3     | Time-Based Validation   | Record when the form is rendered. Reject submissions completed in under 5 seconds.                                                       |
| 4     | IP Rate Limiting        | Via Next.js middleware: max 3 review submissions per IP per hour, max 20 votes per IP per hour.                                          |
| 5     | Content Heuristics      | Flag reviews with: fewer than 50 characters in pros or cons, duplicate text across submissions, excessive links or promotional language. |
| 6     | Manual Moderation Queue | Flagged submissions go to an admin review queue. Admin panel is a simple password-protected page.                                        |

### Backend API Protection

Since all submissions flow through Next.js API routes, the backend itself must be hardened against direct abuse (e.g. someone bypassing the frontend and hitting `/api/*` endpoints directly with curl or scripts).

- **Server-side Turnstile validation:** Every API route that accepts a submission must verify the Turnstile token server-side by calling Cloudflare's `/siteverify` endpoint. Never trust the client alone.
- **Global API rate limiting:** Use a middleware-based rate limiter (e.g. `next-rate-limit` or a custom middleware using Vercel KV / in-memory store) applied to all `/api/*` routes. Suggested limits: 60 requests per IP per minute globally, with tighter per-endpoint limits (e.g. 3 review submissions per IP per hour).
- **Request size limits:** Cap request body size (e.g. 10 KB for reviews, 5 KB for discussion posts) to prevent payload abuse.
- **Input validation and sanitization:** Validate all fields server-side with a schema validator (e.g. Zod). Strip HTML tags, reject excessively long strings, and enforce minimum lengths on review text fields.
- **Bot fingerprinting headers:** Check for missing or suspicious headers (e.g. no `User-Agent`, no `Referer` from your own domain). These aren't foolproof but add friction for lazy scripts.
- **CSRF-like origin check:** Verify that the `Origin` or `Referer` header matches your own domain on all POST requests. Reject requests from unknown origins.
- **Abuse logging:** Log flagged or rejected submissions (IP hash, timestamp, reason) to a separate table for pattern analysis. This helps you tune rate limits and identify coordinated spam campaigns.

---

## 7. Admin Panel

There is a single admin (the site owner). No admin user table or auth library is needed.

### Authentication

- A single `ADMIN_PASSWORD` environment variable is set in Vercel
- The `/admin` route displays a password input form
- On submission, the password is validated server-side against the env var
- On success, a signed JWT (or hashed token) is set as an HTTP-only cookie with a configurable expiry (e.g. 24 hours)
- All admin API routes (`/api/admin/*`) check for this cookie via middleware before processing any request
- Failed login attempts are rate limited (max 5 attempts per IP per 15 minutes)

### Admin Capabilities

- **Moderation queue:** View and resolve flagged reviews and interviews, including community-reported content with report reasons
- **Company management:** Edit company details (name, industry, headquarters, description, website, size, year founded)
- **Logo uploads:** Upload or replace company logos to Cloudflare R2 via the admin panel. Logos are resized to a standard dimension (200x200) and converted to WebP before upload. Served through Cloudflare's free CDN via a custom subdomain (e.g. `logos.yourdomain.com`).
- **Company deletion/merge:** Remove duplicate companies or merge them (reassigning all reviews and interviews to the surviving company)
- **Content removal:** Delete individual reviews or interviews that violate guidelines
- **Abuse log viewer:** Browse the abuse log table to identify spam patterns and tune rate limits

---

## 8. Data Model (Drizzle Schema Overview)

The following outlines the core entities and their relationships. This is a conceptual overview for planning purposes; the actual Drizzle schema will be implemented during development.

### 8.1 Company

| Field        | Type     | Notes                                                                                                                                    |
| ------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| id           | UUID     | Primary key                                                                                                                              |
| name         | String   | Indexed, not unique alone (see constraint below)                                                                                         |
| slug         | String   | URL-friendly, globally unique. Auto-generated from name; disambiguated with location or suffix if needed (e.g. `chase`, `chase-toronto`) |
| industry     | String   | Sector/industry label                                                                                                                    |
| headquarters | String   | City, country                                                                                                                            |
| website      | String?  | Optional URL                                                                                                                             |
| size         | Enum?    | 1–50, 51–200, 201–1000, 1000+                                                                                                            |
| founded      | Int?     | Year                                                                                                                                     |
| description  | String?  | Brief overview                                                                                                                           |
| logoUrl      | String?  | Cloudflare R2 URL via CDN (e.g. `https://logos.yourdomain.com/apple.webp`), admin-managed, no user uploads                               |
| createdAt    | DateTime | Auto-set                                                                                                                                 |

**Uniqueness constraint:** Composite unique on (name, headquarters). Two companies can share a name if they are in different locations. The slug is always globally unique.

### 8.2 Review

| Field              | Type     | Notes                                                     |
| ------------------ | -------- | --------------------------------------------------------- |
| id                 | UUID     | Primary key                                               |
| companyId          | UUID     | FK to Company                                             |
| overallRating      | Int      | 1–5                                                       |
| diversityRating    | Int      | 1–5                                                       |
| workLifeRating     | Int      | 1–5                                                       |
| cultureRating      | Int      | 1–5                                                       |
| managementRating   | Int      | 1–5                                                       |
| careerRating       | Int      | 1–5                                                       |
| compensationRating | Int      | 1–5                                                       |
| title              | String   | Review headline                                           |
| pros               | Text     | Required                                                  |
| cons               | Text     | Required                                                  |
| adviceToMgmt       | Text?    | Optional                                                  |
| employmentStatus   | Enum?    | current/former                                            |
| jobTitle           | String?  | Optional                                                  |
| upvotes            | Int      | Default 0, derived from Vote table                        |
| downvotes          | Int      | Default 0, derived from Vote table                        |
| reportCount        | Int      | Default 0, auto-hidden at configurable threshold (e.g. 3) |
| flagged            | Boolean  | Default false                                             |
| createdAt          | DateTime | Auto-set                                                  |
| ipHash             | String   | Hashed IP for rate limiting only                          |

### 8.3 Interview

| Field         | Type     | Notes                                            |
| ------------- | -------- | ------------------------------------------------ |
| id            | UUID     | Primary key                                      |
| companyId     | UUID     | FK to Company                                    |
| difficulty    | Int      | 1–5                                              |
| experience    | Enum     | positive/neutral/negative                        |
| description   | Text     | Full interview narrative                         |
| jobTitle      | String?  | Role applied for                                 |
| interviewDate | String?  | Month/year                                       |
| source        | Enum?    | online/recruiter/referral/other                  |
| offerReceived | Enum?    | yes/no/pending                                   |
| questions     | Text?    | Interview questions, newline separated           |
| createdAt     | DateTime | Auto-set                                         |
| ipHash        | String   | Hashed IP                                        |
| upvotes       | Int      | Default 0, derived from Vote table               |
| downvotes     | Int      | Default 0, derived from Vote table               |
| reportCount   | Int      | Default 0, auto-hidden at configurable threshold |
| flagged       | Boolean  | Default false                                    |

### 8.4 Vote

| Field      | Type     | Notes                              |
| ---------- | -------- | ---------------------------------- |
| id         | UUID     | Primary key                        |
| targetType | Enum     | review / interview                 |
| targetId   | UUID     | FK to Review or Interview          |
| value      | Int      | +1 (thumbs up) or -1 (thumbs down) |
| ipHash     | String   | One vote per IP per target         |
| createdAt  | DateTime | Auto-set                           |

Unique constraint on (targetType, targetId, ipHash) to enforce one vote per visitor per entry.

### 8.5 Report

| Field      | Type     | Notes                                                       |
| ---------- | -------- | ----------------------------------------------------------- |
| id         | UUID     | Primary key                                                 |
| targetType | Enum     | review / interview                                          |
| targetId   | UUID     | FK to Review or Interview                                   |
| reason     | Enum     | false_information / spam_or_fake / offensive / not_relevant |
| details    | Text?    | Optional free-text context                                  |
| ipHash     | String   | Hashed IP                                                   |
| resolved   | Boolean  | Default false (admin marks resolved)                        |
| createdAt  | DateTime | Auto-set                                                    |

### 8.6 Abuse Log

| Field     | Type     | Notes                                                              |
| --------- | -------- | ------------------------------------------------------------------ |
| id        | UUID     | Primary key                                                        |
| ipHash    | String   | Hashed IP                                                          |
| endpoint  | String   | API route hit (e.g. /api/reviews)                                  |
| reason    | String   | Why it was rejected (rate limit, failed Turnstile, honeypot, etc.) |
| payload   | Text?    | Optional sanitized snapshot of the request body                    |
| createdAt | DateTime | Auto-set                                                           |

---

## 9. Page and Route Structure

| Route                              | Description                                                                                 | Protection                  |
| ---------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------- |
| `/`                                | Homepage: search bar with autocomplete, featured companies, recent reviews                  | None                        |
| `/search`                          | Dedicated search page with company name + location filters, displays matching company cards | None                        |
| `/companies/[slug]`                | Company profile (tabbed: Overview, Reviews, Interviews) with role search within tabs        | None                        |
| `/companies/[slug]/reviews/new`    | Submit a review form                                                                        | Turnstile + API rate limit  |
| `/companies/[slug]/interviews/new` | Submit an interview experience form                                                         | Turnstile + API rate limit  |
| `/companies/new`                   | Add a new company form                                                                      | Turnstile + API rate limit  |
| `/api/search`                      | Search API endpoint for autocomplete and search page queries                                | Rate limited                |
| `/api/vote`                        | Submit a thumbs up/down on a review or interview                                            | IP-based dedup + rate limit |
| `/api/report`                      | Report a review or interview                                                                | Turnstile + rate limit      |
| `/admin`                           | Moderation queue, reports, company management, logo uploads                                 | Password-protected          |

---

## 10. Free Tier Constraints and Mitigations

| Service              | Limit                                          | Mitigation                                                                                                       |
| -------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Vercel               | 100 GB bandwidth/mo, 100K function invocations | SSR with ISR caching on company pages; static generation where possible                                          |
| Neon                 | 0.5 GB storage, cold starts on idle            | Drizzle's native Neon serverless driver keeps connections lightweight; monitor storage                           |
| Cloudflare Turnstile | Unlimited verifications                        | No mitigation needed                                                                                             |
| Cloudflare R2        | 10 GB storage, 10M reads/mo, 1M writes/mo      | Logos resized to 200x200 WebP before upload to minimize storage; Cloudflare CDN caches at edge for fast delivery |

---

## 11. Future Considerations (Post-MVP)

- Employer-claimed profiles with verified response capability
- Salary data submission and aggregation
- Comparison tool to compare two or more companies side by side
- Email-based verification (submit review, confirm via one-time link) for higher trust scores
- Full-text search with Meilisearch or similar for scaling the company directory
- Content moderation AI to auto-flag toxic or fake reviews
- Analytics dashboard for site-wide trends (most reviewed industries, average scores over time)

---

## 12. Success Metrics

- **Spam rate:** Less than 5% of submitted reviews flagged as spam or bot-generated
- **Content quality:** Average review length exceeds 100 words across pros and cons combined
- **Company coverage:** 100+ companies added within first 3 months of launch
- **Page load:** Company profile pages load in under 2 seconds on 3G connections
- **Uptime:** 99.5%+ availability on free-tier infrastructure
