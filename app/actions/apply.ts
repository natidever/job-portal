"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { CV_MAX_BYTES, CV_MIME } from "@/lib/storage";
import { getOpenJobById } from "@/lib/data/public";

export type ApplyField = "name" | "phone" | "email" | "cv";
export type ApplyResult =
  | { ok: true; phone: string }
  | { ok: false; reason: "invalid"; errors: Partial<Record<ApplyField, string>> }
  | { ok: false; reason: "duplicate" | "closed" | "error"; message: string };

const ET_PHONE = /^(?:\+?251|0)?([79]\d{8})$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EXT_MIME: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

const DUPLICATE = "You've already applied to this job with this email. Righton will be in touch if you're shortlisted.";

/** Guest application: validate, re-check the job is public, upload the CV, then insert. */
export async function applyToJob(form: FormData): Promise<ApplyResult> {
  const jobId = String(form.get("jobId") ?? "");
  const name = String(form.get("name") ?? "").trim().replace(/\s+/g, " ");
  const email = String(form.get("email") ?? "").trim();
  const phoneRaw = String(form.get("phone") ?? "").replace(/[\s()-]/g, "");
  const cv = form.get("cv");

  const errors: Partial<Record<ApplyField, string>> = {};
  if (!name || name.length > 120) errors.name = "Enter your full name.";
  const phoneMatch = phoneRaw.match(ET_PHONE);
  if (!phoneMatch) errors.phone = "Enter an Ethiopian mobile number, e.g. 0911 234 567.";
  if (!EMAIL.test(email) || email.length > 254) errors.email = "Enter an email address like name@example.com.";

  let ext = "";
  if (!(cv instanceof File) || cv.size === 0) {
    errors.cv = "Attach your CV so Righton can review your application.";
  } else {
    ext = cv.name.slice(cv.name.lastIndexOf(".") + 1).toLowerCase();
    const mime = EXT_MIME[ext];
    if (!mime || !CV_MIME.includes(mime)) errors.cv = "Upload your CV as a PDF or Word file (.pdf, .doc, .docx).";
    else if (cv.size > CV_MAX_BYTES) errors.cv = "That file is over 5 MB. Save a smaller PDF and try again.";
  }
  if (Object.keys(errors).length) return { ok: false, reason: "invalid", errors };

  // Stored in the local 09XXXXXXXX form the rest of the data uses.
  const phone = `0${phoneMatch![1]}`;
  const job = await getOpenJobById(jobId);
  if (!job) {
    return {
      ok: false,
      reason: "closed",
      message: "This vacancy is no longer open, so it can't take new applications. Browse the board for open roles.",
    };
  }

  const db = createAdminClient();

  // Cheap pre-check so a repeat applicant doesn't upload a file for nothing. The unique index
  // on (job_id, lower(email)) is the real guard, handled again at insert time.
  const { data: existing } = await db
    .from("applications")
    .select("id")
    .eq("job_id", job.id)
    .ilike("email", email.replace(/[\\%_]/g, (c) => `\\${c}`))
    .limit(1);
  if (existing?.length) return { ok: false, reason: "duplicate", message: DUPLICATE };

  const file = cv as File;
  const path = `applications/${job.id}/${randomUUID()}.${ext}`;
  const upload = await db.storage
    .from("cvs")
    .upload(path, file, { contentType: EXT_MIME[ext], upsert: false });
  if (upload.error) {
    console.error("CV upload failed", upload.error.message);
    return { ok: false, reason: "error", message: "We couldn't upload your CV. Check your connection and try again." };
  }

  const { error } = await db.from("applications").insert({
    job_id: job.id,
    seeker_id: null,
    full_name: name,
    email,
    phone,
    cv_path: path,
  });
  if (error) {
    await db.storage.from("cvs").remove([path]);
    if (error.code === "23505") return { ok: false, reason: "duplicate", message: DUPLICATE };
    console.error("Application insert failed", error.message);
    return { ok: false, reason: "error", message: "Something went wrong sending your application. Please try again." };
  }

  revalidatePath("/employer", "layout");
  return { ok: true, phone: phoneRaw };
}
