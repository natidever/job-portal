"use server";

import { parseFilters, type Filters, type Job } from "@/app/data/jobs";
import { searchJobs } from "./public";

/**
 * Saved jobs live in the visitor's browser (localStorage) until seeker accounts exist,
 * so the board asks for them by ref. Only refs still on the public board come back.
 */
export async function fetchSavedJobs(refs: string[], filters: Filters): Promise<Job[]> {
  if (!Array.isArray(refs) || refs.length === 0) return [];
  const f = parseFilters({
    q: filters.q,
    category: filters.category,
    city: filters.cities,
    type: filters.types,
    posted: filters.posted,
    sort: filters.sort,
  });
  const { jobs } = await searchJobs(f, { refs: refs.slice(0, 100).map(String), limit: 100 });
  return jobs;
}
