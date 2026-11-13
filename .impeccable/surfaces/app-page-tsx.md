---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/components/Landing.tsx"]
---

# Surface: Landing page / job portal home (app/page.tsx)

Mode: Persuade (the portal home), with an Operate job board at its core. Two equal audiences: Ethiopian job seekers (search, read a vacancy, apply with CV, no account) and employers (send a vacancy to Righton). English only, ETB.
Pinned by user: white and blue palette; image-based; first hero has a photograph and two buttons (Find work / Hire through Righton) with search alongside; quality bar Welcome to the Jungle; no icon tiles, no pills, no template feel. Structure ref: announcement bar, nav, hero with two actions. No fabricated stats, logos, testimonials; jobs are clearly-marked sample data; contact handles are placeholders.
Unresolved: real Telegram/phone/email; whether client names are shown; real photography.

## Direction contract

THESIS: The vacancy board as a flight-information display: every opening is a departure with a Ref, a destination city, a closing time and a live status. Refuses the category default of a dark photo hero, rounded search pill, pastel icon tiles and card-shell listings.
OWN-WORLD: Drenched board blue #0b2a7a and deeper #061a4d own whole regions (the Openings board, the job detail header, the employer field); terminal white and cool grey #eef1f6 ground; hairlines #d9dfea; amber #f2b632 only for Closing / Final call status. Red Hat Display for headlines, Red Hat Text for body, Red Hat Mono in fixed-width board cells for refs, times, counts, statuses. Square 2-4px corners, hairline rules, no icon tiles, no pills, no shadows on listings; hierarchy by type scale alone.
SCOPE NOTE (2026-11-13): the landing page carries no job posts; the job list lives at /jobs, built from UI inspirations/listing.png (search, tabs, ruled rows, sticky filter panel, detail drawer). Sections: hero, featured jobs carousel, promotion (benefits, figures, CTA), top employers logo band, testimonial wall (two moving rows, from UI inspirations/inspirations.png), employers. Sectors and How applying works were removed at the user's request on 2026-11-14. Figures and quotes are labelled placeholders.
STORY: A seeker sees real, dated, open vacancies at a glance, trusts that Righton curates them, finds one, reads the brief and applies; an employer sees the board and sends a vacancy.
FIRST VIEWPORT: White left column: headline, lede, primary "Find work" and secondary "Hire through Righton". Right (user-directed 2026-11-13, after the Afriwork reference): a pale sky disc with a 3D navy-and-gold suitcase (3dicons, CC0) as the hero object, a map pin and a CV floating smaller around it, and three white chips carrying live listing data (newest job, soonest closing with flap-cell days, count of sample vacancies), each clickable. No photograph and no table in the hero. Below, full width, a square kiosk search: What / Where / Sector / Search.
FORM: Departures Board (Bole International FIDS and airport wayfinding), position 5 of the ordered grounded list, seed key 755a6e1d. Raises: hierarchy by scale alone (variable-font specimen); blue owns whole regions (soundsystem poster); fixed digit cells that flip (nixie counter); provenance line on every listing (memory quilt). Signature interaction: split-flap settle on the Openings board rows and on the results count whenever filters change; reduced motion shows final text.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
