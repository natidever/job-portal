import "server-only";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatSalary } from "@/lib/format";
import {
  PAGE_SIZE,
  type Filters,
  type Job,
  type JobTypeId,
  type LevelId,
  type Lookup,
  type WorkplaceId,
} from "@/app/data/jobs";

/**
 * Public reads for the guest site. Every job read goes through the `public_job_posts` view
 * (published and not past the deadline), so drafts, pending, rejected, closed and expired posts
 * can never leak onto the board.
 */

const JOB_COLUMNS = `id, ref, title, area, job_type, workplace_type, experience_level, positions,
  salary_min, salary_max, salary_note, description, qualification, experience, duties,
  deadline, published_at, category_id, city_id,
  category:categories(name), city:cities(name), company:companies(name)`;

const TZ = "Africa/Addis_Ababa";
const DAY = 86_400_000;

/** Today's calendar date in Addis Ababa as a UTC-midnight timestamp. */
function addisToday(now = new Date()): number {
  const [y, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" })
    .format(now)
    .split("-")
    .map(Number);
  return Date.UTC(y, m - 1, d);
}

function addisDay(iso: string): number {
  return addisToday(new Date(iso));
}

type Row = {
  id: string | null;
  ref: string | null;
  title: string | null;
  area: string | null;
  job_type: JobTypeId | null;
  workplace_type: WorkplaceId | null;
  experience_level: LevelId | null;
  positions: number | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_note: string | null;
  description: string | null;
  qualification: string | null;
  experience: string | null;
  duties: string[] | null;
  deadline: string | null;
  published_at: string | null;
  category_id: string | null;
  city_id: string | null;
  category: { name: string } | null;
  city: { name: string } | null;
  company: { name: string } | null;
};

function salaryText(r: Row): string {
  const base = formatSalary(r.salary_min, r.salary_max);
  if (!r.salary_note) return base;
  if (base === "Not stated") return r.salary_note.replace(/^\+\s*/, "");
  return `${base} ${r.salary_note}`;
}

function toJob(r: Row): Job {
  const today = addisToday();
  const [y, m, d] = (r.deadline ?? "").split("-").map(Number);
  return {
    id: r.id!,
    ref: r.ref!,
    title: r.title!,
    company: r.company?.name ?? "Righton client",
    categoryId: r.category_id ?? "",
    category: r.category?.name ?? "",
    cityId: r.city_id ?? "",
    city: r.city?.name ?? "",
    area: r.area,
    type: r.job_type ?? "full_time",
    workplace: r.workplace_type ?? "on_site",
    level: r.experience_level ?? "mid",
    salary: salaryText(r),
    salaryMin: r.salary_min ?? r.salary_max,
    positions: r.positions ?? 1,
    description: r.description ?? "",
    qualification: r.qualification ?? "",
    experience: r.experience ?? "",
    duties: r.duties ?? [],
    deadline: r.deadline ?? "",
    postedDaysAgo: r.published_at ? Math.max(0, Math.round((today - addisDay(r.published_at)) / DAY)) : 0,
    closesInDays: r.deadline ? Math.max(0, Math.round((Date.UTC(y, m - 1, d) - today) / DAY)) : 0,
  };
}

export const getLookups = cache(async (): Promise<{ categories: Lookup[]; cities: Lookup[] }> => {
  const db = createAdminClient();
  const [cats, cities] = await Promise.all([
    db.from("categories").select("id, name").order("sort_order"),
    db.from("cities").select("id, name").order("sort_order"),
  ]);
  if (cats.error) throw cats.error;
  if (cities.error) throw cities.error;
  return { categories: cats.data, cities: cities.data };
});

export type Facets = {
  total: number;
  byType: Partial<Record<JobTypeId, number>>;
  byCity: Record<string, number>;
  byCategory: Record<string, number>;
};

/** Counts across every open job, for the filter panel. Small at demo scale; move to an RPC if the board grows. */
export const getFacets = cache(async (): Promise<Facets> => {
  const { data, error } = await createAdminClient()
    .from("public_job_posts")
    .select("job_type, city_id, category_id");
  if (error) throw error;
  const f: Facets = { total: data.length, byType: {}, byCity: {}, byCategory: {} };
  for (const r of data) {
    if (r.job_type) f.byType[r.job_type] = (f.byType[r.job_type] ?? 0) + 1;
    if (r.city_id) f.byCity[r.city_id] = (f.byCity[r.city_id] ?? 0) + 1;
    if (r.category_id) f.byCategory[r.category_id] = (f.byCategory[r.category_id] ?? 0) + 1;
  }
  return f;
});

/** Words from a free-text query, safe to drop into a to_tsquery / PostgREST filter. */
function terms(q: string): string[] {
  return q
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .slice(0, 6);
}

export async function searchJobs(
  f: Filters,
  opts: { limit?: number; refs?: string[] } = {}
): Promise<{ jobs: Job[]; total: number }> {
  const db = createAdminClient();
  const limit = opts.limit ?? PAGE_SIZE;
  let query = db.from("public_job_posts").select(JOB_COLUMNS, { count: "exact" });

  if (opts.refs) {
    const refs = opts.refs.filter((r) => /^[A-Za-z0-9-]{1,20}$/.test(r));
    if (!refs.length) return { jobs: [], total: 0 };
    query = query.in("ref", refs);
  }
  if (f.category) query = query.eq("category_id", f.category);
  if (f.cities.length) query = query.in("city_id", f.cities);
  if (f.types.length) query = query.in("job_type", f.types);
  if (f.posted) query = query.gte("published_at", new Date(Date.now() - Number(f.posted) * DAY).toISOString());

  const words = terms(f.q);
  if (words.length) {
    // Full-text prefix match on the post's own text (title, ref, area, description, requirements),
    // or a whole-query match on the city, category or company name.
    const whole = words.join(" ");
    const { categories, cities } = await getLookups();
    const cityIds = cities.filter((c) => c.name.toLowerCase().includes(whole)).map((c) => c.id);
    const catIds = categories.filter((c) => c.name.toLowerCase().includes(whole)).map((c) => c.id);
    const { data: companies } = await db.from("companies").select("id").ilike("name", `%${whole}%`).limit(50);
    const or = [`search.fts(simple).${words.map((w) => `${w}:*`).join("&")}`];
    if (cityIds.length) or.push(`city_id.in.(${cityIds.join(",")})`);
    if (catIds.length) or.push(`category_id.in.(${catIds.join(",")})`);
    // Refs ("RT-0148", or just "0148") tokenise unpredictably in the 'simple' parser; match them directly.
    const refish = f.q.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
    if (/\d{2,}/.test(refish)) or.push(`ref.ilike.*${refish}*`);
    if (companies?.length) or.push(`company_id.in.(${companies.map((c) => c.id).join(",")})`);
    query = query.or(or.join(","));
  }

  if (f.sort === "closing") query = query.order("deadline", { ascending: true }).order("published_at", { ascending: false });
  else if (f.sort === "salary")
    query = query.order("salary_min", { ascending: false, nullsFirst: false }).order("published_at", { ascending: false });
  else query = query.order("published_at", { ascending: false });
  query = query.order("ref", { ascending: false }).range(0, limit - 1);

  const { data, error, count } = await query;
  if (error) throw error;
  return { jobs: (data as unknown as Row[]).map(toJob), total: count ?? data.length };
}

/** Published posts staff flagged for the home-page carousel. */
export async function getFeaturedJobs(limit = 8): Promise<Job[]> {
  const { data, error } = await createAdminClient()
    .from("public_job_posts")
    .select(JOB_COLUMNS)
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as unknown as Row[]).map(toJob);
}

export type RefLookup =
  | { state: "open"; job: Job }
  | { state: "closed"; ref: string; title: string }
  | { state: "unknown"; ref: string };

/** A shared /jobs?ref= link: the open job, or why it can't be shown (without leaking unpublished posts). */
export const getJobByRef = cache(async (ref: string): Promise<RefLookup> => {
  const clean = ref.trim().toUpperCase();
  if (!/^[A-Z0-9-]{1,20}$/.test(clean)) return { state: "unknown", ref: clean };
  const db = createAdminClient();
  const { data, error } = await db.from("public_job_posts").select(JOB_COLUMNS).eq("ref", clean).maybeSingle();
  if (error) throw error;
  if (data) return { state: "open", job: toJob(data as unknown as Row) };
  // Only posts that were once public (published, then expired or closed) are acknowledged by title.
  const { data: past } = await db
    .from("job_posts")
    .select("title, status, published_at")
    .eq("ref", clean)
    .maybeSingle();
  if (past && past.published_at && (past.status === "published" || past.status === "closed"))
    return { state: "closed", ref: clean, title: past.title };
  return { state: "unknown", ref: clean };
});

/** Re-check, at apply time, that a job is still on the public board. */
export async function getOpenJobById(id: string): Promise<{ id: string; ref: string; title: string } | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data, error } = await createAdminClient()
    .from("public_job_posts")
    .select("id, ref, title")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data?.id && data.ref && data.title ? { id: data.id, ref: data.ref, title: data.title } : null;
}
