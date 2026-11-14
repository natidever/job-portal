import type { Database } from "@/lib/database.types";

type Enums = Database["public"]["Enums"];
export type JobType = Enums["job_type"];
export type WorkplaceType = Enums["workplace_type"];
export type ExperienceLevel = Enums["experience_level"];

/** Labels for the job-post enums, in the order the form offers them. Safe to import on the client. */
export const JOB_TYPE_OPTIONS: { value: JobType; label: string }[] = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

export const WORKPLACE_OPTIONS: { value: WorkplaceType; label: string }[] = [
  { value: "on_site", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
  { value: "remote", label: "Remote" },
];

export const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string; hint: string }[] = [
  { value: "entry", label: "Entry", hint: "0–1 yrs" },
  { value: "junior", label: "Junior", hint: "1–3 yrs" },
  { value: "mid", label: "Mid", hint: "3–5 yrs" },
  { value: "senior", label: "Senior", hint: "5+ yrs" },
  { value: "lead", label: "Lead", hint: "Manages a team" },
];

export const labelOf = <T extends string>(opts: { value: T; label: string }[], v: T) =>
  opts.find((o) => o.value === v)?.label ?? v;
