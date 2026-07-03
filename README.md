# Rate My Org

Link: https://rate-my-org.com/

> Anonymous company reviews and interview experiences — no sign-in required.

Rate My Org is an open, anonymous platform where employees and former employees can rate and review organizations, share interview experiences, and browse community feedback — entirely without creating an account. Think Glassdoor, but with zero friction: no login, no profile, just honest reviews.

---

## Features

- **Anonymous reviews** — Submit company reviews with 5-star ratings across six categories (work-life balance, compensation, management, culture, growth, and overall)
- **Interview experiences** — Share interview process details, difficulty, questions, and outcome anonymously
- **No authentication** — Browse and submit everything without signing in or creating an account
- **Community feedback** — Mark reviews as helpful or flag misleading content
- **Company discovery** — Search companies by name and location with fuzzy autocomplete
- **Add missing companies** — If a company doesn't exist in the database yet, anyone can add it
- **Anti-bot protection** — Cloudflare Turnstile (invisible CAPTCHA) on all submission forms to keep reviews genuine

---

## Rate My Org vs. Glassdoor

|                        | Rate My Org                                                   | Glassdoor                                                                                                                 |
| ---------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Sign-in to view**    | Never — browse everything freely                              | Required to read most reviews                                                                                             |
| **Sign-in to submit**  | Never — fully anonymous, no account                           | Required to post a review                                                                                                 |
| **Review takedowns**   | Reviews and interviews are never taken down                   | Employers can flag and request removal; third-party services exist specifically to get reviews deleted                    |
| **Pay-to-play**        | No — we will never accept money to suppress or remove content | An underground economy exists where companies pay to get negative reviews removed; legal pressure can also compel removal |
| **Anonymity**          | Guaranteed — no account, no name, no trace                    | Glassdoor has previously added real names to profiles without consent, causing a mass user exodus                         |
| **Employer influence** | None                                                          | Employers with paid plans can respond, promote, and effectively suppress negative sentiment                               |
| **Content**            | Reviews + interview experiences                               | Reviews, salaries, job listings, interview experiences                                                                    |

The core difference comes down to trust and access. Glassdoor requires you to give something — your identity, your own review — just to read what others wrote. Rate My Org puts no wall between you and the information. You don't sign in to browse, you don't sign in to submit, and no company can pay or pressure us to make a bad review disappear.

---

## Tech Stack

| Layer         | Technology                   |
| ------------- | ---------------------------- |
| Framework     | Next.js 16 (App Router)      |
| Language      | TypeScript (strict mode)     |
| Database      | Neon (Postgres, serverless)  |
| ORM           | Drizzle ORM                  |
| Styling       | Tailwind CSS v4 + shadcn/ui  |
| Forms         | TanStack Form + Zod          |
| Data Fetching | TanStack Query               |
| Hosting       | Vercel (free tier)           |
| Anti-Bot      | Cloudflare Turnstile         |
| Logo Storage  | Cloudflare R2 + CDN          |
| Search        | Postgres `pg_trgm` full-text |

---

## Design

Rate My Org uses a minimal, editorial aesthetic — near-monochromatic palette (near-black, warm whites, subtle grays) with a vivid green accent for positive signals. Full design system documentation is in [`design.md`](./design.md).

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## License

This project is currently unlicensed.
