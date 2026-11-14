// Shapes and pure helpers for public job posts. Safe to import from client components.
// Live rows come from `lib/data/public.ts`, which reads the `public_job_posts` view and maps
// each row into a `Job`. The demo database holds SAMPLE vacancies, not real openings, so the
// board keeps a visible "sample listings" label while `listingsAreSample` is true.

/** The demo database is seeded with illustrative vacancies. Set to false before launch. */
export const listingsAreSample = true;

export type JobTypeId = "full_time" | "part_time" | "contract" | "internship";
export type WorkplaceId = "on_site" | "hybrid" | "remote";
export type LevelId = "entry" | "junior" | "mid" | "senior" | "lead";

export const JOB_TYPE_LABEL: Record<JobTypeId, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
};
export const jobTypeIds = Object.keys(JOB_TYPE_LABEL) as JobTypeId[];

export const WORKPLACE_LABEL: Record<WorkplaceId, string> = {
  on_site: "On-site",
  hybrid: "Hybrid",
  remote: "Remote",
};

export const LEVEL_LABEL: Record<LevelId, string> = {
  entry: "Entry level",
  junior: "Junior",
  mid: "Intermediate",
  senior: "Senior",
  lead: "Lead",
};

export interface Job {
  id: string;
  ref: string;
  title: string;
  /** The hiring company's name as published (for Righton clients, a descriptor such as "Law firm"). */
  company: string;
  categoryId: string;
  category: string;
  cityId: string;
  city: string;
  area: string | null;
  type: JobTypeId;
  workplace: WorkplaceId;
  level: LevelId;
  salary: string;
  salaryMin: number | null;
  positions: number;
  description: string;
  qualification: string;
  experience: string;
  duties: string[];
  /** ISO date (YYYY-MM-DD), the last day applications are accepted. */
  deadline: string;
  /** Whole days since publication, in Addis Ababa time. */
  postedDaysAgo: number;
  /** Whole days until the deadline; 0 means it closes today. */
  closesInDays: number;
}

export type Lookup = { id: string; name: string };

export type Sort = "newest" | "closing" | "salary";
export type Posted = "" | "3" | "7";

/** Board filters, mirrored in the /jobs URL so a result set can be shared. */
export type Filters = {
  q: string;
  category: string;
  cities: string[];
  types: JobTypeId[];
  posted: Posted;
  sort: Sort;
};

export const emptyFilters: Filters = { q: "", category: "", cities: [], types: [], posted: "", sort: "newest" };

/** Jobs per "page"; "Show more" asks the server for the next batch. */
export const PAGE_SIZE = 20;

/** Encode filters (plus paging and an open ref) into /jobs search params. */
export function filtersToQuery(f: Filters, extra: { page?: number; ref?: string } = {}): string {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set("q", f.q.trim());
  if (f.category) p.set("category", f.category);
  if (f.cities.length) p.set("city", f.cities.join(","));
  if (f.types.length) p.set("type", f.types.join(","));
  if (f.posted) p.set("posted", f.posted);
  if (f.sort !== "newest") p.set("sort", f.sort);
  if (extra.page && extra.page > 1) p.set("page", String(extra.page));
  if (extra.ref) p.set("ref", extra.ref);
  const qs = p.toString();
  return qs ? `?${qs}` : "";
}

type Params = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const many = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v : v ? [v] : []).flatMap((s) => s.split(",")).map((s) => s.trim()).filter(Boolean);

/** Parse /jobs search params, dropping anything unknown. */
export function parseFilters(sp: Params): Filters & { page: number; ref: string } {
  const sort = one(sp.sort);
  const posted = one(sp.posted);
  const page = Number.parseInt(one(sp.page), 10);
  return {
    q: one(sp.q).slice(0, 100),
    category: one(sp.category).slice(0, 40),
    cities: many(sp.city).slice(0, 20),
    types: many(sp.type).filter((t): t is JobTypeId => t in JOB_TYPE_LABEL),
    posted: posted === "3" || posted === "7" ? posted : "",
    sort: sort === "closing" || sort === "salary" ? sort : "newest",
    page: Number.isFinite(page) && page > 0 ? Math.min(page, 50) : 1,
    ref: one(sp.ref).slice(0, 20),
  };
}

export const location = (j: Pick<Job, "city" | "area">) => (j.area ? `${j.city} · ${j.area}` : j.city);

export const postedLabel = (d: number) => (d === 0 ? "Today" : d === 1 ? "Yesterday" : `${d} days ago`);

/** "Closes today", "Closes tomorrow", "In 12 days". */
export const closesLabel = (d: number) => (d <= 0 ? "Today" : d === 1 ? "Tomorrow" : `In ${d} days`);

/** "Sat 28 Nov" from an ISO date, read as a calendar day (no timezone shift). */
export function deadlineLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, d))
  );
}

export type Status = { label: "New" | "Open" | "Closing" | "Final call"; tone: "new" | "open" | "closing" | "final" };

/** Board status, read like a departures display. */
export function status(j: Pick<Job, "closesInDays" | "postedDaysAgo">): Status {
  if (j.closesInDays <= 3) return { label: "Final call", tone: "final" };
  if (j.closesInDays <= 5) return { label: "Closing", tone: "closing" };
  if (j.postedDaysAgo <= 1) return { label: "New", tone: "new" };
  return { label: "Open", tone: "open" };
}

/** "5+ years, including IFRS reporting" -> "5+ yrs". */
export const experienceShort = (j: Pick<Job, "experience">) => {
  const m = j.experience.match(/(\d+)\+?\s*years?/i);
  return m ? `${m[1]}+ yrs` : null;
};

/** Two-letter monogram standing in for a company logo. */
export const monogram = (j: Pick<Job, "company">) =>
  j.company
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

/** "Finance & Accounting" -> "Finance", for tight chips. */
export const shortCategory = (name: string) => name.split(" & ")[0];
