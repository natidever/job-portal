import { initials } from "@/lib/format";
import { JOB_STATUS_LABEL, STAGE_LABEL, type ApplicationStage, type JobDisplayStatus } from "@/lib/status";

/** Public URL of an object in the public `logos` bucket. */
export function logoUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/logos/${path}`;
}

export function Monogram({
  name,
  logoPath,
  size,
}: {
  name: string;
  logoPath?: string | null;
  size?: "sm" | "lg";
}) {
  const clean = name.replace(/\(.*?\)/g, "").trim() || name;
  return (
    <span className={`em-mono ${size ? `em-mono--${size}` : ""}`} aria-hidden="true">
      {logoPath ? <img src={logoUrl(logoPath)} alt="" /> : initials(clean)}
    </span>
  );
}

export function StatusTag({ status }: { status: JobDisplayStatus }) {
  return <span className={`em-st em-st--${status}`}>{JOB_STATUS_LABEL[status]}</span>;
}

export function StageTag({ stage }: { stage: ApplicationStage }) {
  return <span className={`em-st em-st--${stage}`}>{STAGE_LABEL[stage]}</span>;
}

/** "Closes in 3 days", "Closes today", "Closed 2 days ago": the deadline as people say it. */
export function deadlineText(days: number): string {
  if (days > 1) return `Closes in ${days} days`;
  if (days === 1) return "Closes tomorrow";
  if (days === 0) return "Closes today";
  if (days === -1) return "Deadline was yesterday";
  return `Deadline passed ${-days} days ago`;
}

export function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}
