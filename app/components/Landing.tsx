"use client";

import { useCallback, useState } from "react";
import { emptyFilters, type Filters, type Job } from "../data/jobs";
import { AnnouncementBar } from "./AnnouncementBar";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { Sectors } from "./Sectors";
import { JobBoard } from "./JobBoard";
import { HowToApply } from "./HowToApply";
import { Employers } from "./Employers";
import { Footer } from "./Footer";
import { ApplyDialog } from "./ApplyDialog";

export function Landing() {
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [filters, setAll] = useState<Filters>(emptyFilters);
  const [focus, setFocus] = useState<{ ref: string; n: number } | null>(null);
  const setFilters = useCallback((f: Partial<Filters>) => setAll((prev) => ({ ...prev, ...f })), []);

  return (
    <>
      <a className="skip-link" href="#vacancies">
        Skip to vacancies
      </a>
      <AnnouncementBar />
      <Nav />
      <main>
        <Hero
          filters={filters}
          onSearch={setFilters}
          onOpen={(ref) => {
            setAll(emptyFilters);
            setFocus((p) => ({ ref, n: (p?.n ?? 0) + 1 }));
          }}
        />
        <JobBoard filters={filters} setFilters={setFilters} onApply={setApplyJob} focus={focus} />
        <Sectors onPick={(sector) => setFilters({ sector })} />
        <HowToApply />
        <Employers />
      </main>
      <Footer />
      <ApplyDialog job={applyJob} onClose={() => setApplyJob(null)} />
    </>
  );
}
