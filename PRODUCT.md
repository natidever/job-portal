# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated: Next.js (App Router, TypeScript). Chosen because the product needs server-side handling for application submissions and CV file uploads, plus a staff-only admin area for posting jobs, alongside fast, indexable public job pages. Database, file storage, email delivery, and hosting are not yet decided.

## Users

**Job seekers (primary, public).** Members of the public looking for work. They browse the openings Righton has posted, open a job, and apply. No account is required to apply.

**Righton staff (internal).** The recruiting team that receives openings from client companies and publishes them on the site, then reviews the applications that come in.

**Client companies (indirect, and a public audience).** Employers who hire through Righton. They send their openings to Righton outside the site (by phone, email or Telegram) and do not log in or post jobs themselves. The landing page addresses them as an equal audience alongside job seekers, inviting them to hire through Righton.

## Product Purpose

Righton is the job portal of a recruiting agency. Client companies tell Righton who they want to hire, Righton posts each opening on the portal, and job seekers apply to it. Success means every client opening gets published quickly and attracts qualified applicants, and applying is quick and simple for job seekers.

## Positioning

Every listing is a real vacancy that a Righton client submitted and the Righton team published. Employers cannot post on their own, so the board shows only openings Righton handles directly, not a self-serve marketplace of unvetted posts.

## Operating Context

- Clients submit openings to Righton off-platform (email, phone, etc.). Staff enter them through an admin area.
- Job seekers find a job, read the details, and submit a quick application form: name, email, phone, and CV upload. Applications go to Righton.
- Most job seekers in this market are likely to browse and apply on their phones. This is an assumption, not a confirmed fact.

## Capabilities and Constraints

Confirmed:
- Market: Ethiopia (local). All site copy is in English. Salaries are in ETB.
- Righton has a Telegram channel, a phone number and an email address. The actual handle, number and address are not yet supplied, so use clearly marked placeholders.
- Public job listings and individual job detail pages.
- Guest application form with CV upload on each job. No seeker accounts.
- Staff-only admin for creating, editing, and closing job posts.
- No client logins and no employer self-posting.

Undecided:
- How staff are notified of new applications, and whether applicants get a confirmation email.
- Whether the job-to-client relationship is shown publicly, or whether openings are posted without naming the client company.

## Brand Commitments

- Name: **Righton**. The exact casing or spacing of the wordmark is not confirmed. There is no logo yet.
- The user requires the design to look **sleek, premium and very professional**.
- **Palette pinned by the user (2026-11-13): white and blue.** This replaces the earlier deep-green background reference.
- **The site is image-based.** The first hero must contain a photograph and two buttons.
- Structure reference: `UI inspirations/the strucutre.png` (Afriwork): announcement bar, nav, hero with two actions. Use only the structure, not its branding.

## Evidence on Hand

- Photography: Unsplash photos in `public/images/` (the hero, round and employer images). Sourced via the Unsplash license and used as prototype imagery; replace them with Righton's own photography when it's available.
- Reference screenshots: `UI inspirations/just the background.png` and `UI inspirations/the strucutre.png`.
- No logo, real job postings, client company names or logos, applicant counts, testimonials, or statistics exist yet. Do not fabricate any of them. The reference's "300,000+ applicants" stats and employer logo strip must not be copied or invented. Use clearly marked placeholders until real data arrives.

## Product Principles

1. **Applying is the core action.** Getting from a job to a submitted application must take as few steps as possible and work well on a phone.
2. **Every listing is real and curated.** The site's credibility comes from Righton publishing every opening itself. Never pad the board with fake jobs or invented proof.
3. **Professional before playful.** The audience is trusting Righton with their careers and their CVs, so the product should feel competent and trustworthy above all.
4. **Staff speed matters.** Posting a new client opening and reviewing applicants should be quick for the Righton team. The admin area is part of the product, not an afterthought.
