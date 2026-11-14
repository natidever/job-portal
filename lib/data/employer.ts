import "server-only";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentEmployer } from "@/lib/demo";
import type { Database } from "@/lib/database.types";
import type { ApplicationStage, JobDisplayStatus, JobStatus } from "@/lib/status";

export type JobPost = Database["public"]["Tables"]["job_posts"]["Row"];
export type Application = Database["public"]["Tables"]["applications"]["Row"];
export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type City = Database["public"]["Tables"]["cities"]["Row"];

const TZ = "Africa/Addis_Ababa";

/** Today's date in Addis Ababa as YYYY-MM-DD, the same calendar the `deadline` column uses. */
export function todayInAddis(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(now);
}

/** Whole days from today (Addis) to a YYYY-MM-DD deadline. 0 = closes today, negative = past. */
export function daysUntil(deadline: string, now = new Date()): number {
  const a = Date.parse(`${todayInAddis(now)}T00:00:00Z`);
  const b = Date.parse(`${deadline}T00:00:00Z`);
  return Math.round((b - a) / 86_400_000);
}

/** Expiry is computed, never stored: a published post past its deadline shows as Expired. */
export function displayStatus(post: Pick<JobPost, "status" | "deadline">): JobDisplayStatus {
  if (post.status === "published" && daysUntil(post.deadline) < 0) return "expired";
  return post.status;
}

export type PostSummary = JobPost & {
  display: JobDisplayStatus;
  categoryName: string;
  cityName: string;
  applicants: number;
  newApplicants: number;
};

async function lookups() {
  const db = createAdminClient();
  const [cats, cities] = await Promise.all([
    db.from("categories").select("*").order("sort_order"),
    db.from("cities").select("*").order("sort_order"),
  ]);
  if (cats.error) throw cats.error;
  if (cities.error) throw cities.error;
  return { categories: cats.data, cities: cities.data };
}

export const getLookups = lookups;

/** Every post of the current employer's company, newest activity first, with applicant counts. */
export async function getMyPosts(): Promise<PostSummary[]> {
  const { company } = await getCurrentEmployer();
  const db = createAdminClient();
  const [{ data: posts, error }, { categories, cities }] = await Promise.all([
    db.from("job_posts").select("*").eq("company_id", company.id).order("updated_at", { ascending: false }),
    lookups(),
  ]);
  if (error) throw error;
  const ids = posts.map((p) => p.id);
  const apps = ids.length
    ? await db.from("applications").select("job_id, stage").in("job_id", ids)
    : { data: [] as { job_id: string; stage: ApplicationStage }[], error: null };
  if (apps.error) throw apps.error;

  const cat = new Map(categories.map((c) => [c.id, c.name]));
  const city = new Map(cities.map((c) => [c.id, c.name]));
  return posts.map((p) => {
    const mine = apps.data.filter((a) => a.job_id === p.id);
    return {
      ...p,
      display: displayStatus(p),
      categoryName: cat.get(p.category_id) ?? p.category_id,
      cityName: city.get(p.city_id) ?? p.city_id,
      applicants: mine.length,
      newApplicants: mine.filter((a) => a.stage === "new").length,
    };
  });
}

export type RecentApplicant = Pick<Application, "id" | "full_name" | "stage" | "created_at"> & {
  jobId: string;
  jobTitle: string;
};

export async function getOverview() {
  const employer = await getCurrentEmployer();
  const posts = await getMyPosts();
  const db = createAdminClient();
  const ids = posts.map((p) => p.id);
  const recent = ids.length
    ? await db
        .from("applications")
        .select("id, full_name, stage, created_at, job_id")
        .in("job_id", ids)
        .order("created_at", { ascending: false })
        .limit(6)
    : { data: [], error: null };
  if (recent.error) throw recent.error;
  const title = new Map(posts.map((p) => [p.id, p.title]));

  const byStatus = {} as Record<JobDisplayStatus, number>;
  for (const s of ["published", "pending", "draft", "rejected", "closed", "expired"] as JobDisplayStatus[]) byStatus[s] = 0;
  for (const p of posts) byStatus[p.display]++;

  const live = posts.filter((p) => p.display === "published");
  return {
    employer,
    posts,
    byStatus,
    live: live.length,
    totalApplicants: posts.reduce((n, p) => n + p.applicants, 0),
    newApplicants: posts.reduce((n, p) => n + p.newApplicants, 0),
    attention: {
      rejected: posts.filter((p) => p.status === "rejected"),
      drafts: posts.filter((p) => p.status === "draft"),
      closingSoon: live.filter((p) => daysUntil(p.deadline) <= 5),
      unreviewed: live.filter((p) => p.newApplicants > 0),
    },
    recent: recent.data.map((a) => ({
      id: a.id,
      full_name: a.full_name,
      stage: a.stage,
      created_at: a.created_at,
      jobId: a.job_id,
      jobTitle: title.get(a.job_id) ?? "",
    })) as RecentApplicant[],
  };
}

/** One post of the current employer's company, or a 404. Never returns another company's post. */
export async function getMyPost(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { company } = await getCurrentEmployer();
  const db = createAdminClient();
  const { data: post, error } = await db
    .from("job_posts")
    .select("*")
    .eq("id", id)
    .eq("company_id", company.id)
    .maybeSingle();
  if (error) throw error;
  if (!post) notFound();
  const { categories, cities } = await lookups();
  return {
    post,
    display: displayStatus(post),
    categoryName: categories.find((c) => c.id === post.category_id)?.name ?? post.category_id,
    cityName: cities.find((c) => c.id === post.city_id)?.name ?? post.city_id,
  };
}

export async function getApplicants(jobId: string): Promise<Application[]> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("applications")
    .select("*")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export type { JobStatus };
