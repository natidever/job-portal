import { ArrowRight, Clock, FilePen, Inbox, XCircle } from "lucide-react";
import { getOverview, daysUntil } from "@/lib/data/employer";
import { formatLongDay, greeting, timeAgo } from "@/lib/format";
import type { JobDisplayStatus } from "@/lib/status";
import { StageTag, StatusTag, deadlineText, plural } from "./ui";

export const metadata = { title: "Overview" };

const STATUS_ROWS: JobDisplayStatus[] = ["published", "pending", "draft", "rejected", "expired", "closed"];

export default async function OverviewPage() {
  const o = await getOverview();
  const { attention: a } = o;
  const items = a.rejected.length + a.unreviewed.length + a.drafts.length + a.closingSoon.length;

  return (
    <>
      <section className="em-board" aria-labelledby="ov-title">
        <div className="em-wrap">
          <div className="em-board__top">
            <div>
              <p className="em-board__kicker">
                {greeting()} · {formatLongDay()}
              </p>
              <h1 id="ov-title" className="em-board__title">
                {o.employer.company.name}
              </h1>
            </div>
          </div>
          <div className="em-facts">
            <a className="em-fact" href="/employer/jobs?status=published">
              <span className="em-fact__n">{o.live}</span>
              <span className="em-fact__l">
                Live {o.live === 1 ? "post" : "posts"} <ArrowRight size={14} aria-hidden="true" />
              </span>
            </a>
            <div className="em-fact">
              <span className="em-fact__n">{o.totalApplicants}</span>
              <span className="em-fact__l">Total applicants</span>
            </div>
            <div className="em-fact">
              <span className={`em-fact__n ${o.newApplicants ? "em-fact__hot" : ""}`}>{o.newApplicants}</span>
              <span className="em-fact__l">New, not yet reviewed</span>
            </div>
            <a className="em-fact" href="/employer/jobs?status=pending">
              <span className="em-fact__n">{o.byStatus.pending}</span>
              <span className="em-fact__l">
                In review at Righton <ArrowRight size={14} aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </section>

      <div className="em-wrap em-body">
        <div className="em-grid">
          <div className="em-stack">
            <section className="em-panel" aria-labelledby="attn-title">
              <div className="em-panel__head">
                <h2 id="attn-title" className="em-h2">
                  Needs your attention
                </h2>
                {items > 0 && <span className="em-count is-on">{items}</span>}
              </div>
              {items === 0 ? (
                <div className="em-clear">
                  <strong>You’re all caught up</strong>
                  <p>Nothing is waiting on you. New applicants and post reviews will show up here.</p>
                </div>
              ) : (
                <ul className="em-rows">
                  {a.rejected.map((p) => (
                    <li key={p.id} className="em-attn">
                      <span className="em-attn__icon is-danger">
                        <XCircle size={18} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="em-attn__title">{p.title}</p>
                        <p className="em-attn__text">Righton sent this post back. Fix it and resubmit.</p>
                        <p className="em-attn__quote">{p.rejection_reason}</p>
                      </div>
                      <a className="em-link" href={`/employer/jobs/${p.id}/edit`}>
                        Edit and resubmit <ArrowRight size={15} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                  {a.unreviewed.map((p) => (
                    <li key={p.id} className="em-attn">
                      <span className="em-attn__icon is-blue">
                        <Inbox size={18} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="em-attn__title">
                          {plural(p.newApplicants, "new applicant")} on {p.title}
                        </p>
                        <p className="em-attn__text">Shortlist or decline them so nobody waits too long.</p>
                      </div>
                      <a className="em-link" href={`/employer/jobs/${p.id}`}>
                        Review <ArrowRight size={15} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                  {a.closingSoon.map((p) => (
                    <li key={p.id} className="em-attn">
                      <span className="em-attn__icon is-amber">
                        <Clock size={18} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="em-attn__title">{p.title}</p>
                        <p className="em-attn__text">{deadlineText(daysUntil(p.deadline))}. To extend it, contact Righton.</p>
                      </div>
                      <a className="em-link" href={`/employer/jobs/${p.id}`}>
                        Open <ArrowRight size={15} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                  {a.drafts.map((p) => (
                    <li key={p.id} className="em-attn">
                      <span className="em-attn__icon">
                        <FilePen size={18} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="em-attn__title">{p.title}</p>
                        <p className="em-attn__text">Still a draft, saved {timeAgo(p.updated_at)}. Nobody can see it yet.</p>
                      </div>
                      <a className="em-link" href={`/employer/jobs/${p.id}/edit`}>
                        Finish draft <ArrowRight size={15} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="em-panel" aria-labelledby="recent-title">
              <div className="em-panel__head">
                <h2 id="recent-title" className="em-h2">
                  Latest applicants
                </h2>
              </div>
              {o.recent.length === 0 ? (
                <div className="em-clear">
                  <strong>No applicants yet</strong>
                  <p>When people apply to your live posts, they’ll appear here.</p>
                </div>
              ) : (
                <ul className="em-rows">
                  {o.recent.map((r) => (
                    <li key={r.id}>
                      <a className="em-row em-statusrow" href={`/employer/jobs/${r.jobId}`}>
                        <span className="em-row__main">
                          <span className="em-row__title">{r.full_name}</span>
                          <span className="em-row__sub" style={{ display: "block" }}>
                            {r.jobTitle} · applied {timeAgo(r.created_at)}
                          </span>
                        </span>
                        <StageTag stage={r.stage} />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <div className="em-stack">
            <section className="em-panel" aria-labelledby="bystatus-title">
              <div className="em-panel__head">
                <h2 id="bystatus-title" className="em-h2">
                  Your posts
                </h2>
                <a className="em-link" href="/employer/jobs">
                  All posts <ArrowRight size={15} aria-hidden="true" />
                </a>
              </div>
              <ul className="em-rows">
                {STATUS_ROWS.map((s) => {
                  const n = o.byStatus[s];
                  return (
                    <li key={s}>
                      <a className={`em-statusrow ${n ? "" : "is-zero"}`} href={`/employer/jobs?status=${s}`}>
                        <StatusTag status={s} />
                        <span className="cell">{n}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="em-panel" aria-labelledby="how-title">
              <div className="em-panel__head">
                <h2 id="how-title" className="em-h2">
                  How a post goes live
                </h2>
              </div>
              <ol className="em-steps">
                <li>
                  <span>
                    <b>Write it</b>
                    <span>Save a draft as often as you like. Only you can see it.</span>
                  </span>
                </li>
                <li>
                  <span>
                    <b>Righton reviews it</b>
                    <span>The Righton team checks every post. If something needs fixing, you’ll see why here.</span>
                  </span>
                </li>
                <li>
                  <span>
                    <b>It goes live</b>
                    <span>Job seekers apply until the deadline, and you move them through your pipeline.</span>
                  </span>
                </li>
              </ol>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
