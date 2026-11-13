"use client";

import { ArrowRight, Send } from "lucide-react";
import { location, postedLabel, status, type Job } from "../data/jobs";
import { sectorLabel } from "./sectorMeta";

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
    const url = `${window.location.origin}${window.location.pathname}#vacancies`;
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
          {job.clientType} · {location(job)} · {sectorLabel[job.sector]}
        </p>

        <dl className="jd__facts">
          <div>
            <dt>Salary</dt>
            <dd>{job.salary}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{job.type}</dd>
          </div>
          <div>
            <dt>Positions</dt>
            <dd className="cell">{String(job.positions).padStart(2, "0")}</dd>
          </div>
          <div>
            <dt>Closes</dt>
            <dd>
              <span className="cell">{job.closesInDays} days</span>
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
        <section className="jd__sec">
          <h4>Requirements</h4>
          <dl className="jd__req">
            <div>
              <dt>Qualification</dt>
              <dd>{job.qualification}</dd>
            </div>
            <div>
              <dt>Experience</dt>
              <dd>{job.experience}</dd>
            </div>
          </dl>
        </section>

        <section className="jd__sec">
          <h4>What you will do</h4>
          <ul className="jd__duties">
            {job.duties.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>

        <section className="jd__sec">
          <h4>About this vacancy</h4>
          <p>
            Righton is recruiting for this role on behalf of a {job.clientType.toLowerCase()}.
            Apply with your name, phone number and CV. If you are shortlisted, a Righton recruiter
            will call you.
          </p>
        </section>

        <p className="jd__prov">
          <span className="cell">{job.ref}</span>
          <span>Received from client · Published by Righton · {postedLabel(job.postedDaysAgo)}</span>
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
