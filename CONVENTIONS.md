# Conventions for righton (public site + /employer)

Demo phase (ADR 0002 in `../righton-admin/docs/adr/`): no auth. All data access happens on the server with
`createAdminClient()` from `lib/supabase/admin.ts`, which uses the secret key. Never import it into a client component.
The schema lives in `../righton-admin/supabase/migrations/`; types are in `lib/database.types.ts`. Vocabulary: `../righton-admin/GLOSSARY.md`.

## Folder ownership (parallel agents)
| Owner | Owns |
|---|---|
| **Public site** agent | `app/page.tsx`, `app/jobs/**`, `app/components/**`, `app/data/**`, `app/layout.tsx`, `app/globals.css`, `lib/data/public*.ts`, `app/actions/apply.ts` |
| **Employer** agent | `app/employer/**` (its own layout, components, actions, and CSS module or `app/employer/employer.css`), `lib/data/employer*.ts` |

## Frozen (shared): don't edit; note the change you need in your final report
`lib/supabase/**`, `lib/database.types.ts`, `lib/status.ts`, `lib/format.ts`, `lib/storage.ts`, `lib/demo.ts`, `next.config.mjs`, `package.json`.

The Employer agent styles its pages using the tokens already defined in `app/globals.css` (read-only for it).
A "For employers" link in the public Nav belongs to the Public site agent: the Employer agent requests it.

## Rules
- Server actions: `"use server"`, validate input, write through `createAdminClient()`, then `revalidatePath`.
- Public job reads go through the `public_job_posts` view (published and not past the deadline).
- CVs: upload to bucket `cvs` at `applications/<job_id>/<uuid>.<ext>` (or `seekers/...` later). Store only the path. Show them with `getCvSignedUrl()` (60 s).
- Labels: `lib/status.ts` (`JOB_STATUS_LABEL`, `STAGE_LABEL`, `SEEKER_STATUS`). Dates: `lib/format.ts` (Africa/Addis_Ababa).
- Employer identity: `getCurrentEmployer()` from `lib/demo.ts`.
- Sample data only. No real CVs until auth exists.
