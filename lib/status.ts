import type { Database } from "@/lib/database.types";

export type JobStatus = Database["public"]["Enums"]["job_status"];
export type ApplicationStage = Database["public"]["Enums"]["application_stage"];
/** A published post past its deadline is shown as Expired. Expiry is computed, never stored. */
export type JobDisplayStatus = JobStatus | "expired";

export const JOB_STATUS_LABEL: Record<JobDisplayStatus, string> = {
  draft: "Draft",
  pending: "Pending review",
  published: "Published",
  rejected: "Rejected",
  closed: "Closed",
  expired: "Expired",
};

export const JOB_STATUS_ORDER: JobStatus[] = ["pending", "published", "draft", "rejected", "closed"];

export const STAGE_LABEL: Record<ApplicationStage, string> = {
  new: "New",
  shortlisted: "Shortlisted",
  interview: "Interview",
  offered: "Offered",
  hired: "Hired",
  rejected: "Rejected",
};

/** Pipeline order. Rejected can follow any stage, so it sits last. */
export const STAGE_ORDER: ApplicationStage[] = ["new", "shortlisted", "interview", "offered", "hired", "rejected"];

/** Solid swatch colour per stage, for bars and legends (custom properties in globals.css). */
/** What a seeker sees (map.md: simplified status). Guests see nothing. */
export const SEEKER_STATUS: Record<ApplicationStage, "Under review" | "Interview" | "Hired" | "Not selected"> = {
  new: "Under review",
  shortlisted: "Under review",
  interview: "Interview",
  offered: "Interview",
  hired: "Hired",
  rejected: "Not selected",
};
