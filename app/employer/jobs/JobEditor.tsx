import { AlertCircle, ArrowLeft, Check } from "lucide-react";
import { contact } from "@/app/data/contact";
import { getLookups, todayInAddis } from "@/lib/data/employer";
import { JobForm, type JobFormValues } from "./JobForm";

function tomorrow(): string {
  const d = new Date(`${todayInAddis()}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

/** Server shell around the client form: page head, rejection note, and the guidance aside. */
export async function JobEditor({
  mode,
  initial,
  rejectionReason,
  back,
}: {
  mode: "new" | "draft" | "rejected";
  initial?: JobFormValues;
  rejectionReason?: string | null;
  back: { href: string; label: string };
}) {
  const { categories, cities } = await getLookups();
  const values: JobFormValues = initial ?? {
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
  };

  const title = mode === "new" ? "Post a job" : mode === "rejected" ? "Fix and resubmit" : "Edit draft";
  const lede =
    mode === "new"
      ? "Describe the role clearly and honestly. The Righton team reviews every post before job seekers see it."
      : mode === "rejected"
        ? "Make the changes the Righton team asked for, then resubmit. You can save along the way."
        : "Pick up where you left off. Nobody can see a draft until you submit it.";

  return (
    <>
      <section className="em-head">
        <div className="em-wrap">
          <a className="em-back" href={back.href}>
            <ArrowLeft size={16} aria-hidden="true" /> {back.label}
          </a>
          <h1 className="em-h1">{title}</h1>
          <p className="em-lede">{lede}</p>
        </div>
      </section>
      <div className="em-wrap em-body">
        <div className="em-form-grid">
          <div className="em-stack">
            {mode === "rejected" && rejectionReason && (
              <div className="em-reject" role="note">
                <span className="em-reject__icon">
                  <AlertCircle size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="em-reject__label">What the Righton team asked you to change</p>
                  <p className="em-reject__reason">{rejectionReason}</p>
                </div>
              </div>
            )}
            <JobForm
              initial={values}
              categories={categories}
              cities={cities}
              minDeadline={tomorrow()}
              mode={mode}
            />
          </div>
          <aside className="em-aside" aria-label="Posting guidance">
            <div className="em-guide">
              <div className="em-guide__head">
                <h2 className="em-h2">What gets approved quickly</h2>
              </div>
              <ul>
                <li>
                  <Check size={16} aria-hidden="true" />
                  <span>A plain job title people would search for, without capitals or exclamation marks.</span>
                </li>
                <li>
                  <Check size={16} aria-hidden="true" />
                  <span>No phone numbers, emails or Telegram handles. Applicants apply through Righton.</span>
                </li>
                <li>
                  <Check size={16} aria-hidden="true" />
                  <span>A real salary range, if you can share one.</span>
                </li>
                <li>
                  <Check size={16} aria-hidden="true" />
                  <span>Duties written as concrete tasks, one per line.</span>
                </li>
              </ul>
            </div>
            <div className="em-guide em-guide--blue">
              <h2 className="em-h2">After it goes live</h2>
              <p>
                Live posts are locked so applicants see what they applied to. To change one, email{" "}
                <a href={`mailto:${contact.email}`}>{contact.email}</a>.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
