# Rate My Org

> Anonymous company reviews and interview experiences — no sign-in required.

Rate My Org is an open, anonymous platform where employees and former employees can rate and review organizations, share interview experiences, and browse community feedback — entirely without creating an account. Think Glassdoor, but with zero friction: no login, no profile, just honest reviews.

***

## Features

- **Anonymous reviews** — Submit company reviews with 5-star ratings across six categories (work-life balance, compensation, management, culture, growth, and overall)
- **Interview experiences** — Share interview process details, difficulty, questions, and outcome anonymously
- **No authentication** — Browse and submit everything without signing in or creating an account
- **Community feedback** — Mark reviews as helpful or flag misleading content
- **Company discovery** — Search companies by name and location with fuzzy autocomplete
- **Add missing companies** — If a company doesn't exist in the database yet, anyone can add it
- **Anti-bot protection** — Cloudflare Turnstile (invisible CAPTCHA) on all submission forms to keep reviews genuine

***

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Database | Neon (Postgres, serverless) |
| ORM | Drizzle ORM |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Forms | TanStack Form + Zod |
| Data Fetching | TanStack Query |
| Hosting | Vercel (free tier) |
| Anti-Bot | Cloudflare Turnstile |
| Logo Storage | Cloudflare R2 + CDN |
| Search | Postgres `pg_trgm` full-text search |

***

## Design

Rate My Org uses a minimal, editorial aesthetic — near-monochromatic palette (near-black, warm whites, subtle grays) with a vivid green accent for positive signals. Full design system documentation is in [`design.md`](./design.md).

***

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

***

## License

This project is currently unlicensed.
