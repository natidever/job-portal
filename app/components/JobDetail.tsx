"use client";

import { ArrowRight, Send } from "lucide-react";
import {
  JOB_TYPE_LABEL,
  LEVEL_LABEL,
  WORKPLACE_LABEL,
  closesLabel,
  deadlineLabel,
  location,
  postedLabel,
  status,
  type Job,
} from "../data/jobs";

export function JobDetail({
  job,
  onApply,
  compact = false,
}: {
  job: Job;
  onApply: (job: Job) => void;
  compact?: boolean;
}) {
  const s = status(job);
  const share = () => {
    const url = `${window.location.origin}/jobs?ref=${job.ref}`;
    const text = `${job.title} (Ref ${job.ref}), ${location(job)}. Apply through Righton:`;
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener"
    );
  };

  return (
    <article className="jd" aria-labelledby={`jd-${job.ref}`}>
      <header className="jd__head">
        <h3 id={`jd-${job.ref}`} className="jd__title">
          {job.title}
        </h3>
        <p className="jd__org">
          {job.company} · {location(job)} · {job.category}
        </p>

        <dl className="jd__facts">
          <div>
            <dt>Salary</dt>
            <dd>{job.salary}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>
              {JOB_TYPE_LABEL[job.type]}
              {job.workplace !== "on_site" && <span className="jd__aside">{WORKPLACE_LABEL[job.workplace]}</span>}
            </dd>
          </div>
          <div>
            <dt>Positions</dt>
            <dd className="cell">{String(job.positions).padStart(2, "0")}</dd>
          </div>
          <div>
            <dt>Apply by</dt>
            <dd>
              <time dateTime={job.deadline}>{deadlineLabel(job.deadline)}</time>
              <span className="sr-only">({closesLabel(job.closesInDays).toLowerCase()})</span>
              <span className={`status status--dark is-${s.tone}`}>{s.label}</span>
            </dd>
          </div>
        </dl>

        {!compact && (
          <div className="jd__actions">
            <button
              type="button"
              className="btn btn--white btn--lg"
              onClick={() => onApply(job)}
              aria-label={`Apply now for ${job.title}, Ref ${job.ref}`}
            >
              Apply now
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button type="button" className="btn btn--ghost-light btn--lg" onClick={share}>
              <Send size={17} aria-hidden="true" />
              Share on Telegram
            </button>
          </div>
        )}
      </header>

      <div className="jd__body">
        {job.description && (
          <section className="jd__sec">
            <h4>The role</h4>
            {job.description.split(/\n{2,}/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </section>
        )}

        <section className="jd__sec">
          <h4>Requirements</h4>
          <dl className="jd__req">
            <div>
              <dt>Qualification</dt>
              <dd>{job.qualification || "Not specified"}</dd>
            </div>
            <div>
              <dt>Experience</dt>
              <dd>{job.experience || "Not specified"}</dd>
            </div>
            <div>
              <dt>Level</dt>
              <dd>{LEVEL_LABEL[job.level]}</dd>
            </div>
          </dl>
        </section>

        {job.duties.length > 0 && (
          <section className="jd__sec">
            <h4>What you will do</h4>
            <ul className="jd__duties">
              {job.duties.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </section>
        )}

        <section className="jd__sec">
          <h4>About this vacancy</h4>
          <p>
            {job.company} is hiring for this role through Righton. Apply with your name, phone
            number and CV before {deadlineLabel(job.deadline)}. If you are shortlisted, you will get
            a call.
          </p>
        </section>

        <p className="jd__prov">
          <span className="cell">{job.ref}</span>
          <span>Published on Righton · {postedLabel(job.postedDaysAgo)}</span>
        </p>

        {compact && (
          <button type="button" className="jd__share" onClick={share}>
            <Send size={16} aria-hidden="true" />
            Share on Telegram
          </button>
        )}
      </div>
    </article>
  );
}
