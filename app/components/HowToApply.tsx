import { ArrowRight } from "lucide-react";
import { contact } from "../data/contact";

const steps = [
  {
    title: "Find a vacancy",
    body: "Search by title, city or sector. Every listing shows the salary, the deadline and a Ref number.",
  },
  {
    title: "Apply with your CV",
    body: "Send your name, phone number and CV from your phone. No account and no long forms.",
  },
  {
    title: "Get a call if shortlisted",
    body: "Righton reviews every application against the client's brief and calls the people it shortlists.",
  },
];

export function HowToApply() {
  return (
    <section className="howto" id="how-to-apply" aria-labelledby="howto-title">
      <div className="container">
        <h2 id="howto-title" className="h2">
          How applying works
        </h2>
        <div className="howto__grid">
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={s.title} className="step">
                <span className="step__n" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="step__title">{s.title}</h3>
                <p className="step__body">{s.body}</p>
              </li>
            ))}
          </ol>

          <aside className="alerts" aria-labelledby="alerts-title">
            <h3 id="alerts-title" className="alerts__title">
              New vacancies reach Telegram first.
            </h3>
            <p className="alerts__body">
              Every opening is posted to the Righton channel the moment it goes live.
            </p>
            <a href={contact.telegramHref} className="btn btn--white">
              Join {contact.telegramHandle}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
