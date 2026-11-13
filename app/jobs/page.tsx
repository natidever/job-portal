import type { Metadata } from "next";
import { AnnouncementBar } from "../components/AnnouncementBar";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { JobsView } from "../components/JobsView";

export const metadata: Metadata = {
  title: "Discover jobs · Righton",
  description:
    "Every vacancy Righton publishes for its client companies across Ethiopia, with salary and deadline on each listing.",
};

export default function JobsPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to jobs
      </a>
      <AnnouncementBar />
      <Nav />
      <JobsView />
      <Footer />
    </>
  );
}
