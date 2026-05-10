# Add Organization — Progress Tracker

> Plan: `docs/add-organization-plan.md`

## Phases

| #   | Phase                                                         | Status      | Notes                                       |
| --- | ------------------------------------------------------------- | ----------- | ------------------------------------------- |
| 1   | DB Migration — add `status` column to `companies`             | Done        | `company_status` enum + column live in Neon |
| 2   | POST `/api/companies` + `createCompanySchema`                 | Not started |                                             |
| 3   | Filter pending from public queries + `notFound()` on org page | Not started |                                             |
| 4   | `<AddOrganizationModal>` + wire into `CompanySearchInput`     | Not started |                                             |
| 5   | Admin API routes (list, edit, approve, reject, logo)          | Not started | Needs R2 credentials                        |
| 6   | Admin UI — `<PendingCompaniesQueue>` + wire into admin page   | Not started |                                             |

## Status Key

- **Not started** — untouched
- **In progress** — actively being worked on
- **Done** — implemented and verified
- **Blocked** — waiting on something (noted in Notes column)

## Open Items

- [ ] Confirm R2 credentials are available before starting Phase 5 logo upload
