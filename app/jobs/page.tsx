import type { Metadata } from "next";
import { AnnouncementBar } from "../components/AnnouncementBar";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { JobsView } from "../components/JobsView";
import { PAGE_SIZE, deadlineLabel, parseFilters } from "../data/jobs";
import { getFacets, getJobByRef, getLookups, searchJobs, type RefLookup } from "@/lib/data/public";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { ref } = parseFilters(await searchParams);
  if (ref) {
    const hit = await getJobByRef(ref);
    if (hit.state === "open")
      return {
        title: `${hit.job.title} · ${hit.job.city} · Righton`,
        description: `${hit.job.company} is hiring through Righton. ${hit.job.salary}. Apply by ${deadlineLabel(hit.job.deadline)}.`,
      };
  }
  return {
    title: "Discover jobs · Righton",
    description:
      "Every vacancy published on Righton across Ethiopia, with salary and deadline on each listing.",
  };
}

export default async function JobsPage({ searchParams }: Props) {
  const { page, ref, ...filters } = parseFilters(await searchParams);
  const [result, lookups, facets, opened] = await Promise.all([
    searchJobs(filters, { limit: page * PAGE_SIZE }),
    getLookups(),
    getFacets(),
    ref ? getJobByRef(ref) : Promise.resolve<RefLookup | null>(null),
  ]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to jobs
      </a>
      <AnnouncementBar />
      <Nav />
      <JobsView
        filters={filters}
        page={page}
        jobs={result.jobs}
        total={result.total}
        lookups={lookups}
        facets={facets}
        opened={opened}
      />
      <Footer />
    </>
  );
}
