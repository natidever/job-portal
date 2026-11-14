"use server";

import type { FormResult } from "@/app/employer/actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseJob, str } from "@/lib/data/job-parse";

const ET_PHONE = /^(?:\+?251|0)?[79]\d{8}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Public vacancy request: the requester's contact details plus a complete job post. */
export async function requestVacancy(fd: FormData): Promise<FormResult> {
  const errors: Record<string, string> = {};

  const company = str(fd, "company", 100);
  if (company.length < 2) errors.company = "Enter your company’s name.";
  const contactName = str(fd, "contact_name", 100);
  if (contactName.length < 2) errors.contact_name = "Enter the name of the person we should call.";
  const phone = str(fd, "phone", 30).replace(/[\s-]/g, "");
  if (!ET_PHONE.test(phone)) errors.phone = "Enter an Ethiopian number, e.g. 0911 234 567.";
  const email = str(fd, "email", 200);
  if (email && !EMAIL.test(email)) errors.email = "Enter an email like name@company.com, or leave it empty.";

  const job = await parseJob(fd, true);
  Object.assign(errors, job.errors);

  if (Object.keys(errors).length)
    return { ok: false, message: "A few things need fixing before we can receive this vacancy.", errors };

  // Save: reuse a staff-managed client of the same name, else create one; the post goes straight
  // to the admin review queue as Pending; the contact lives in vacancy_requests (server-only).
  const db = createAdminClient();
  const fail: FormResult = { ok: false, message: "We couldn’t send your vacancy. Please try again.", errors: {} };

  const { data: found, error: findErr } = await db
    .from("companies")
    .select("id")
    .is("owner_id", null)
    .ilike("name", company.replace(/[\\%_]/g, (c) => `\\${c}`))
    .limit(1)
    .maybeSingle();
  if (findErr) return fail;
  let companyId = found?.id;
  let createdCompany = false;
  if (!companyId) {
    const { data, error } = await db.from("companies").insert({ name: company }).select("id").single();
    if (error) return fail;
    companyId = data.id;
    createdCompany = true;
  }

  const { data: post, error: postErr } = await db
    .from("job_posts")
    .insert({ ...job.fields, company_id: companyId, status: "pending", submitted_at: new Date().toISOString() })
    .select("id")
    .single();
  if (postErr) {
    if (createdCompany) await db.from("companies").delete().eq("id", companyId);
    return fail;
  }

  const { error: reqErr } = await db.from("vacancy_requests").insert({
    job_id: post.id,
    contact_name: contactName,
    contact_phone: phone,
    contact_email: email || null,
  });
  if (reqErr) {
    await db.from("job_posts").delete().eq("id", post.id);
    if (createdCompany) await db.from("companies").delete().eq("id", companyId);
    return fail;
  }

  return {
    ok: true,
    message: "Thank you. A Righton recruiter will call you to confirm the details before the vacancy is published.",
  };
}
