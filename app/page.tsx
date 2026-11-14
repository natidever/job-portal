import { Landing } from "./components/Landing";
import { getFeaturedJobs, getLookups } from "@/lib/data/public";

// Featured posts and their "days left" change daily and whenever staff publish, so render per request.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [featured, { cities, categories }] = await Promise.all([getFeaturedJobs(), getLookups()]);
  return <Landing featured={featured} cities={cities} categories={categories} />;
}
