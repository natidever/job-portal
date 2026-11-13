import { AnnouncementBar } from "./AnnouncementBar";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { Featured } from "./Featured";
import { Promotion } from "./Promotion";
import { TopEmployers } from "./TopEmployers";
import { Testimonials } from "./Testimonials";
import { Employers } from "./Employers";
import { Footer } from "./Footer";

export function Landing() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <AnnouncementBar />
      <Nav />
      <main id="main">
        <Hero />
        <Featured />
        <Promotion />
        <TopEmployers />
        <Testimonials />
        <Employers />
      </main>
      <Footer />
    </>
  );
}
