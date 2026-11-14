import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentEmployer } from "@/lib/demo";
import { getCvSignedUrl } from "@/lib/storage";

export const dynamic = "force-dynamic";

/**
 * View CV: checks the application belongs to one of the current employer's posts, then redirects to a
 * fresh 60-second signed link. Links are minted per click, never stored or rendered into the page.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new NextResponse("Not found", { status: 404 });

  const { company } = await getCurrentEmployer();
  const db = createAdminClient();
  const { data: app } = await db.from("applications").select("cv_path, job_id").eq("id", id).maybeSingle();
  if (!app) return new NextResponse("Not found", { status: 404 });
  const { data: job } = await db.from("job_posts").select("id").eq("id", app.job_id).eq("company_id", company.id).maybeSingle();
  if (!job) return new NextResponse("Not found", { status: 404 });

  try {
    const url = await getCvSignedUrl(app.cv_path, false);
    return NextResponse.redirect(url, { status: 303, headers: { "Cache-Control": "no-store" } });
  } catch {
    return new NextResponse("This CV couldn’t be opened. It may have been removed.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
