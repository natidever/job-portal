import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { Wordmark } from "@/app/components/Wordmark";
import { contact } from "@/app/data/contact";
import { getCurrentEmployer } from "@/lib/demo";
import { Monogram } from "./ui";
import { Tabs } from "./Tabs";
import "./employer.css";

export const metadata: Metadata = {
  title: { default: "Employer · Righton", template: "%s · Righton employer" },
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function EmployerLayout({ children }: { children: React.ReactNode }) {
  const { company } = await getCurrentEmployer();
  return (
    <div className="em">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="em-bar">
        <div className="em-wrap em-bar__in">
          <a href="/" className="em-bar__brand" aria-label="Righton home">
            <Wordmark />
          </a>
          <span className="em-bar__area">Employer</span>
          <div className="em-bar__co">
            <span className="em-demo" title="Demo phase: there is no sign-in yet, so this workspace acts as a sample employer.">
              <i aria-hidden="true" />
              Demo employer
            </span>
            <span className="em-bar__name">{company.name}</span>
            <Monogram name={company.name} logoPath={company.logo_path} size="sm" />
          </div>
        </div>
      </header>
      <div className="em-tabs">
        <div className="em-wrap em-tabs__in">
          <Tabs />
          <a href="/employer/jobs/new" className="btn btn--primary btn--sm em-tabs__cta">
            <Plus size={18} aria-hidden="true" />
            <span>
              Post<span className="em-cta-long"> a job</span>
            </span>
          </a>
        </div>
      </div>
      <main id="main">{children}</main>
      <footer className="em-foot">
        <div className="em-wrap em-foot__in">
          <span>Righton employer workspace · Every post is reviewed by the Righton team before it goes live.</span>
          <span>
            Need a hand? <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
