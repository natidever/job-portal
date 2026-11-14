import { AnnouncementBar } from "./AnnouncementBar";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { Featured } from "./Featured";
import { Promotion } from "./Promotion";
import { TopEmployers } from "./TopEmployers";
import { Testimonials } from "./Testimonials";
import { Employers } from "./Employers";
import { Footer } from "./Footer";
import type { Job, Lookup } from "../data/jobs";

export function Landing({
  featured,
  cities,
  categories,
}: {
  featured: Job[];
  cities: Lookup[];
  categories: Lookup[];
}) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <AnnouncementBar />
      <Nav />
      <main id="main">
        <Hero cities={cities} categories={categories} />
        <Featured jobs={featured} />
        <Promotion />
        <TopEmployers />
        <Testimonials />
        <Employers />
      </main>
      <Footer />
    </>
  );
}
