import type { Metadata } from "next";
import { ArrowLeft, Check, Mail, Phone } from "lucide-react";
import { AnnouncementBar } from "../components/AnnouncementBar";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { contact } from "../data/contact";
import { getLookups, todayInAddis } from "@/lib/data/employer";
import { VacancyForm } from "./VacancyForm";
import "../employer/employer.css";

export const metadata: Metadata = {
  title: "Send a vacancy · Righton",
  description: "Tell Righton who you need. We publish the vacancy, screen applicants and bring you a shortlist.",
};

function tomorrow(): string {
  const d = new Date(`${todayInAddis()}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default async function VacancyPage() {
  const { categories, cities } = await getLookups();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <AnnouncementBar />
      <Nav />
      <div className="em">
        <main id="main">
          <section className="em-head">
            <div className="em-wrap">
              <a className="em-back" href="/#employers">
                <ArrowLeft size={16} aria-hidden="true" /> Back
              </a>
              <h1 className="em-h1">Vacancy request</h1>
              <p className="em-lede">
                Great teams start with the right people. Tell us about the role, and we will put it in front of
                Ethiopia&rsquo;s best talent and hand you a shortlist worth interviewing.
              </p>
            </div>
          </section>
          <div className="em-wrap em-body">
            <div className="em-form-grid">
              <div className="em-stack">
                <VacancyForm
                  initial={{
                    title: "",
                    category_id: "",
                    city_id: "addis-ababa",
                    area: "",
                    job_type: "full_time",
                    workplace_type: "on_site",
                    experience_level: "mid",
                    positions: 1,
                    salary_min: null,
                    salary_max: null,
                    salary_note: "",
                    description: "",
                    qualification: "",
                    experience: "",
                    duties: [],
                    deadline: "",
                  }}
                  categories={categories}
                  cities={cities}
                  minDeadline={tomorrow()}
                />
              </div>
              <aside className="em-aside" aria-label="Request guidance">
                <div className="em-guide">
                  <div className="em-guide__head">
                    <h2 className="em-h2">What happens next</h2>
                  </div>
                  <ul>
                    <li>
                      <Check size={16} aria-hidden="true" />
                      <span>A recruiter calls you to confirm the role.</span>
                    </li>
                    <li>
                      <Check size={16} aria-hidden="true" />
                      <span>We publish the vacancy on Righton.</span>
                    </li>
                    <li>
                      <Check size={16} aria-hidden="true" />
                      <span>We screen applicants and send you a shortlist to interview.</span>
                    </li>
                  </ul>
                </div>
                <div className="em-guide em-guide--blue">
                  <h2 className="em-h2">Rather talk?</h2>
                  <p>
                    <Phone size={14} aria-hidden="true" /> <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
                    <br />
                    <Mail size={14} aria-hidden="true" /> <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
