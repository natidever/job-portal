"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentEmployer } from "@/lib/demo";
import { getLookups, todayInAddis, type JobPost } from "@/lib/data/employer";
import { canMove } from "@/lib/data/employer-rules";
import { EXPERIENCE_OPTIONS, JOB_TYPE_OPTIONS, WORKPLACE_OPTIONS } from "@/lib/data/employer-options";
import { STAGE_ORDER, type ApplicationStage } from "@/lib/status";

export type FormResult = { ok: false; message: string; errors: Record<string, string> } | { ok: true; message: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function str(fd: FormData, key: string, max = 10_000): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function revalidateEmployer(jobId?: string) {
  revalidatePath("/employer", "layout");
  if (jobId) revalidatePath(`/employer/jobs/${jobId}`);
  // Public board reads published posts; status changes here can add or remove one.
  revalidatePath("/jobs");
  revalidatePath("/");
}

/** Loads a post only if it belongs to the current employer's company. */
async function ownPost(id: string): Promise<JobPost | null> {
  if (!UUID.test(id)) return null;
  const { company } = await getCurrentEmployer();
  const { data, error } = await createAdminClient()
    .from("job_posts")
    .select("*")
    .eq("id", id)
    .eq("company_id", company.id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// ───────────── Job post form ─────────────

type JobFields = Pick<
  JobPost,
  | "title"
  | "category_id"
  | "city_id"
  | "area"
  | "job_type"
  | "workplace_type"
  | "experience_level"
  | "positions"
  | "salary_min"
  | "salary_max"
  | "salary_note"
  | "description"
  | "qualification"
  | "experience"
  | "duties"
  | "deadline"
>;

function parseMoney(raw: string): number | null | "bad" {
  if (!raw) return null;
  const n = Number(raw.replace(/[,\s]/g, ""));
  if (!Number.isInteger(n) || n < 0 || n > 10_000_000) return "bad";
  return n;
}

async function parseJob(fd: FormData, full: boolean): Promise<{ fields: JobFields; errors: Record<string, string> }> {
  const errors: Record<string, string> = {};
  const { categories, cities } = await getLookups();

  const title = str(fd, "title", 120);
  if (title.length < 3) errors.title = "Give the job a title of at least 3 characters, like “Senior accountant”.";

  const category_id = str(fd, "category_id");
  if (!categories.some((c) => c.id === category_id)) errors.category_id = "Choose the category that fits this job best.";

  const city_id = str(fd, "city_id");
  if (!cities.some((c) => c.id === city_id)) errors.city_id = "Choose the city where the job is based.";

  const job_type = str(fd, "job_type") as JobFields["job_type"];
  if (!JOB_TYPE_OPTIONS.some((o) => o.value === job_type)) errors.job_type = "Choose a job type.";
  const workplace_type = str(fd, "workplace_type") as JobFields["workplace_type"];
  if (!WORKPLACE_OPTIONS.some((o) => o.value === workplace_type)) errors.workplace_type = "Choose where the work happens.";
  const experience_level = str(fd, "experience_level") as JobFields["experience_level"];
  if (!EXPERIENCE_OPTIONS.some((o) => o.value === experience_level)) errors.experience_level = "Choose an experience level.";

  const positionsRaw = str(fd, "positions") || "1";
  const positions = Number(positionsRaw);
  if (!Number.isInteger(positions) || positions < 1 || positions > 500)
    errors.positions = "Enter how many people you are hiring, from 1 to 500.";

  const min = parseMoney(str(fd, "salary_min"));
  const max = parseMoney(str(fd, "salary_max"));
  if (min === "bad") errors.salary_min = "Enter a whole number in ETB, without decimals.";
  if (max === "bad") errors.salary_max = "Enter a whole number in ETB, without decimals.";
  if (typeof min === "number" && typeof max === "number" && max < min)
    errors.salary_max = "The maximum can’t be lower than the minimum.";

  const deadline = str(fd, "deadline");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline) || Number.isNaN(Date.parse(deadline)))
    errors.deadline = "Pick the last day people can apply.";
  else if (deadline <= todayInAddis()) errors.deadline = "The deadline has to be in the future, from tomorrow onwards.";

  const description = str(fd, "description", 6000);
  const qualification = str(fd, "qualification", 3000);
  const experience = str(fd, "experience", 3000);
  const duties = fd
    .getAll("duties")
    .map((d) => (typeof d === "string" ? d.trim().slice(0, 300) : ""))
    .filter(Boolean)
    .slice(0, 20);

  if (full) {
    if (description.length < 40)
      errors.description = "Describe the role in a few sentences (at least 40 characters) so applicants know what it is.";
    if (qualification.length < 3) errors.qualification = "Say what qualification is needed, e.g. “BA in Accounting”.";
    if (duties.length === 0) errors.duties = "Add at least one duty so applicants can picture the day-to-day.";
  }

  return {
    errors,
    fields: {
      title,
      category_id,
      city_id,
      area: str(fd, "area", 80) || null,
      job_type,
      workplace_type,
      experience_level,
      positions: Number.isInteger(positions) ? positions : 1,
      salary_min: typeof min === "number" ? min : null,
      salary_max: typeof max === "number" ? max : null,
      salary_note: str(fd, "salary_note", 120) || null,
      description,
      qualification,
      experience,
      duties,
      deadline,
    },
  };
}

/**
 * Create or edit a post. `intent`:
 * - `draft`: save without sending (new posts and drafts stay Draft; a rejected post keeps its reason).
 * - `submit`: send for review: status → Pending, `submitted_at` set, any rejection reason cleared.
 * Only drafts and rejected posts can be edited; live, pending and closed posts are locked.
 */
export async function saveJob(fd: FormData): Promise<FormResult> {
  const intent = str(fd, "intent");
  if (intent !== "draft" && intent !== "submit") return { ok: false, message: "Unknown action.", errors: {} };
  const id = str(fd, "id");

  const { profileId, company } = await getCurrentEmployer();
  const existing = id ? await ownPost(id) : null;
  if (id && !existing) return { ok: false, message: "This post doesn’t exist or isn’t yours.", errors: {} };
  if (existing && existing.status !== "draft" && existing.status !== "rejected")
    return {
      ok: false,
      message:
        existing.status === "published"
          ? "This post is live, so it can’t be edited here. Contact Righton to change a live post."
          : "This post can’t be edited in its current state.",
      errors: {},
    };

  const { fields, errors } = await parseJob(fd, intent === "submit");
  if (Object.keys(errors).length)
    return {
      ok: false,
      message:
        intent === "submit"
          ? "A few things need fixing before this can go to review."
          : "A few things need fixing before this draft can be saved.",
      errors,
    };

  const db = createAdminClient();
  const now = new Date().toISOString();
  const statusPatch =
    intent === "submit"
      ? { status: "pending" as const, submitted_at: now, rejection_reason: null }
      : existing
        ? {} // a draft stays a draft; a rejected post stays rejected with its reason until resubmitted
        : { status: "draft" as const };

  let jobId = existing?.id;
  if (existing) {
    const { error } = await db
      .from("job_posts")
      .update({ ...fields, ...statusPatch })
      .eq("id", existing.id)
      .eq("company_id", company.id)
      .in("status", ["draft", "rejected"]);
    if (error) return { ok: false, message: "Couldn’t save the post. Please try again.", errors: {} };
  } else {
    const { data, error } = await db
      .from("job_posts")
      .insert({ ...fields, ...statusPatch, company_id: company.id, created_by: profileId })
      .select("id")
      .single();
    if (error) return { ok: false, message: "Couldn’t save the post. Please try again.", errors: {} };
    jobId = data.id;
  }

  revalidateEmployer(jobId);
  redirect(`/employer/jobs/${jobId}?saved=${intent === "submit" ? "submitted" : "draft"}`);
}

/** Draft → Pending from the post page. The stored post must be complete. */
export async function submitPost(id: string): Promise<FormResult> {
  const post = await ownPost(id);
  if (!post) return { ok: false, message: "This post doesn’t exist or isn’t yours.", errors: {} };
  if (post.status !== "draft" && post.status !== "rejected")
    return { ok: false, message: "Only drafts and rejected posts can be sent for review.", errors: {} };

  const fd = new FormData();
  for (const [k, v] of Object.entries(post)) {
    if (k === "duties") (v as string[]).forEach((d) => fd.append("duties", d));
    else if (v != null) fd.set(k, String(v));
  }
  const { errors } = await parseJob(fd, true);
  if (Object.keys(errors).length)
    return {
      ok: false,
      message: "This post isn’t complete yet. Open it in the editor to fill in the missing details.",
      errors,
    };

  const { error } = await createAdminClient()
    .from("job_posts")
    .update({ status: "pending", submitted_at: new Date().toISOString(), rejection_reason: null })
    .eq("id", post.id)
    .in("status", ["draft", "rejected"]);
  if (error) return { ok: false, message: "Couldn’t send the post for review. Please try again.", errors: {} };
  revalidateEmployer(post.id);
  return { ok: true, message: "Sent for review. The Righton team will check it before it goes live." };
}

/** Published → Closed early. Applicants stay; the post leaves the public board. */
export async function closePost(id: string): Promise<FormResult> {
  const post = await ownPost(id);
  if (!post) return { ok: false, message: "This post doesn’t exist or isn’t yours.", errors: {} };
  if (post.status !== "published") return { ok: false, message: "Only a live post can be closed.", errors: {} };
  const { error } = await createAdminClient()
    .from("job_posts")
    // A featured post must be published (featured_is_published), so closing also unfeatures it.
    .update({ status: "closed", closed_at: new Date().toISOString(), is_featured: false })
    .eq("id", post.id)
    .eq("status", "published");
  if (error) return { ok: false, message: "Couldn’t close the post. Please try again.", errors: {} };
  revalidateEmployer(post.id);
  return { ok: true, message: "Post closed. It no longer appears on Righton, and its applicants are kept." };
}

// ───────────── Applicants ─────────────

export async function moveApplicant(applicationId: string, to: string): Promise<FormResult> {
  if (!UUID.test(applicationId)) return { ok: false, message: "Unknown applicant.", errors: {} };
  if (!STAGE_ORDER.includes(to as ApplicationStage)) return { ok: false, message: "Unknown stage.", errors: {} };
  const db = createAdminClient();
  const { data: app, error } = await db.from("applications").select("id, job_id, stage").eq("id", applicationId).maybeSingle();
  if (error) throw error;
  if (!app || !(await ownPost(app.job_id))) return { ok: false, message: "This applicant isn’t on one of your posts.", errors: {} };
  if (!canMove(app.stage, to as ApplicationStage))
    return { ok: false, message: "That move isn’t allowed from the applicant’s current stage.", errors: {} };

  const { error: upErr } = await db
    .from("applications")
    .update({ stage: to as ApplicationStage })
    .eq("id", app.id)
    .eq("stage", app.stage); // guards against a double click racing an earlier move
  if (upErr) return { ok: false, message: "Couldn’t move the applicant. Please try again.", errors: {} };
  revalidateEmployer(app.job_id);
  return { ok: true, message: "Moved." };
}

// ───────────── Company profile ─────────────

const LOGO_MAX = 1024 * 1024;
const LOGO_TYPES: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };

function normaliseWebsite(raw: string): string | null | "bad" {
  if (!raw) return null;
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const u = new URL(withScheme);
    if (!u.hostname.includes(".") || /\s/.test(raw)) return "bad";
    return u.toString().replace(/\/$/, "");
  } catch {
    return "bad";
  }
}

export async function updateCompany(fd: FormData): Promise<FormResult> {
  const { company } = await getCurrentEmployer();
  const errors: Record<string, string> = {};

  const name = str(fd, "name", 100);
  if (name.length < 2) errors.name = "Enter your company’s name as applicants should see it.";
  const description = str(fd, "description", 1500);
  const website = normaliseWebsite(str(fd, "website", 200));
  if (website === "bad") errors.website = "Enter a web address like abaydigital.com.";

  const logo = fd.get("logo");
  const file = logo instanceof File && logo.size > 0 ? logo : null;
  if (file && !LOGO_TYPES[file.type]) errors.logo = "Use a PNG, JPG or WebP image.";
  else if (file && file.size > LOGO_MAX) errors.logo = "The logo must be 1 MB or smaller.";
  const removeLogo = str(fd, "remove_logo") === "1";

  if (Object.keys(errors).length) return { ok: false, message: "A few things need fixing.", errors };

  const db = createAdminClient();
  let logo_path = company.logo_path;
  if (file) {
    const path = `companies/${company.id}/${randomUUID()}.${LOGO_TYPES[file.type]}`;
    const { error } = await db.storage
      .from("logos")
      .upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: false });
    if (error) return { ok: false, message: "Couldn’t upload the logo. Please try again.", errors: {} };
    logo_path = path;
  } else if (removeLogo) {
    logo_path = null;
  }

  const { error } = await db
    .from("companies")
    .update({ name, description: description || null, website, logo_path })
    .eq("id", company.id);
  if (error) return { ok: false, message: "Couldn’t save your company profile. Please try again.", errors: {} };

  // Tidy up the replaced logo, but only one this dashboard uploaded.
  if (company.logo_path && company.logo_path !== logo_path && company.logo_path.startsWith(`companies/${company.id}/`))
    await db.storage.from("logos").remove([company.logo_path]);

  revalidateEmployer();
  return { ok: true, message: "Company profile saved." };
}
