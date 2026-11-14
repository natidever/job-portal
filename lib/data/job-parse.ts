import "server-only";
import { getLookups, todayInAddis, type JobPost } from "@/lib/data/employer";
import { EXPERIENCE_OPTIONS, JOB_TYPE_OPTIONS, WORKPLACE_OPTIONS } from "@/lib/data/employer-options";

/** Shared job-post validation: the employer editor and the public vacancy request both use it. */

export function str(fd: FormData, key: string, max = 10_000): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export type JobFields = Pick<
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

export async function parseJob(fd: FormData, full: boolean): Promise<{ fields: JobFields; errors: Record<string, string> }> {
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

