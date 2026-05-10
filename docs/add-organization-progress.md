# Add Organization — Progress Tracker

> Plan: `docs/add-organization-plan.md`

## Phases

| #   | Phase                                                         | Status      | Notes                                             |
| --- | ------------------------------------------------------------- | ----------- | ------------------------------------------------- |
| 1   | DB Migration — add `status` column to `companies`             | Done        | `company_status` enum + column live in Neon       |
| 2   | POST `/api/companies` + `createCompanySchema`                 | Done        | Slug gen, duplicate check, inserts as pending     |
| 3   | Filter pending from public queries + `notFound()` on org page | Done        | GET /api/companies + getCompanyWithStats filtered |
| 4   | `<AddOrganizationModal>` + wire into `CompanySearchInput`     | Done        | Modal + hook created, search input wired          |
| 5   | Admin API routes (list, edit, approve, reject, logo)          | Not started | Needs R2 credentials                              |
| 6   | Admin UI — `<PendingCompaniesQueue>` + wire into admin page   | Not started |                                                   |

## Status Key

- **Not started** — untouched
- **In progress** — actively being worked on
- **Done** — implemented and verified
- **Blocked** — waiting on something (noted in Notes column)

## Open Items

- [ ] Confirm R2 credentials are available before starting Phase 5 logo upload
