import "server-only";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Demo phase (ADR 0002): there is no login, so /employer acts as this seeded employer.
 * When auth lands, replace getCurrentEmployer() with the signed-in user's profile.
 */
export const DEMO_EMPLOYER_EMAIL = "employer@righton.demo";

export const getCurrentEmployer = cache(async () => {
  const db = createAdminClient();
  const { data: users, error } = await db.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw error;
  const user = users.users.find((u) => u.email === DEMO_EMPLOYER_EMAIL);
  if (!user) throw new Error(`Demo employer ${DEMO_EMPLOYER_EMAIL} not found; run righton-admin/scripts/seed-users.mts`);
  const { data: company, error: cErr } = await db.from("companies").select("*").eq("owner_id", user.id).single();
  if (cErr) throw cErr;
  return { profileId: user.id, email: user.email!, company };
});
