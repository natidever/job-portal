import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

/** A 60-second signed link to a CV in the private `cvs` bucket. Generate on demand, never store. */
export async function getCvSignedUrl(cvPath: string, download = true): Promise<string> {
  const { data, error } = await createAdminClient().storage.from("cvs").createSignedUrl(cvPath, 60, { download });
  if (error) throw error;
  return data.signedUrl;
}

export const CV_MAX_BYTES = 5 * 1024 * 1024;
export const CV_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
