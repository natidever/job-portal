import { AlertCircle, ArrowLeft, CheckCircle2, Info } from "lucide-react";
import { contact } from "@/app/data/contact";
import { daysUntil, getApplicants, getMyPost } from "@/lib/data/employer";
import { EXPERIENCE_OPTIONS, JOB_TYPE_OPTIONS, WORKPLACE_OPTIONS, labelOf } from "@/lib/data/employer-options";
import { formatDate, formatSalary, initials, timeAgo } from "@/lib/format";
import { StatusTag, deadlineText } from "../../ui";
import { Pipeline } from "./Pipeline";
import { PostActions } from "./PostActions";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { post } = await getMyPost(id);
  return { title: post.title };
}

const FLASH: Record<string, { title: string; text: string }> = {
  draft: { title: "Draft saved", text: "It stays private until you submit it for review." },
  submitted: {
    title: "Sent for review",
    text: "The Righton team will check it before it goes live. You’ll see the result here.",
  },
};

export default async function PostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; locked?: string }>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const { post, display, categoryName, cityName } = await getMyPost(id);
  const applicants = await getApplicants(post.id);
  const days = daysUntil(post.deadline);
  const flash = sp.saved ? FLASH[sp.saved] : undefined;
  const isNew = applicants.filter((a) => a.stage === "new").length;
  const hasHadApplicants = post.status === "published" || post.status === "closed" || applicants.length > 0;

  return (
    <>
      <section className="em-board" aria-labelledby="post-title">
        <div className="em-wrap">
          <a className="em-back" href="/employer/jobs">
            <ArrowLeft size={16} aria-hidden="true" /> My posts
          </a>
          <div className="em-board__top">
            <div style={{ minWidth: 0 }}>
              <p style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span className="em-ref">{post.ref}</span>
                <StatusTag status={display} />
              </p>
              <h1 id="post-title" className="em-board__title">
                {post.title}
              </h1>
              <p className="em-board__meta">
                {[
                  categoryName,
                  `${cityName}${post.area ? `, ${post.area}` : ""}`,
                  labelOf(JOB_TYPE_OPTIONS, post.job_type),
                  labelOf(WORKPLACE_OPTIONS, post.workplace_type),
                ].join("  ·  ")}
              </p>
            </div>
            <PostActions
              id={post.id}
              status={display}
              title={post.title}
              applicants={applicants.length}
              contactEmail={contact.email}
            />
          </div>
          <div className="em-facts">
            <div className="em-fact">
              <span className="em-fact__n">{applicants.length}</span>
              <span className="em-fact__l">{isNew ? `Applicants · ${isNew} new` : "Applicants"}</span>
            </div>
            <div className="em-fact">
              <span className="em-fact__n">{post.positions}</span>
              <span className="em-fact__l">{post.positions === 1 ? "Position" : "Positions"}</span>
            </div>
            <div className="em-fact">
              <span className="em-fact__n em-fact__n--sm">{formatDate(post.deadline)}</span>
              <span className="em-fact__l">
                {display === "published" ? deadlineText(days) : display === "closed" ? "Deadline (closed early)" : "Deadline"}
              </span>
            </div>
            <div className="em-fact">
              <span className="em-fact__n em-fact__n--sm">{formatSalary(post.salary_min, post.salary_max)}</span>
              <span className="em-fact__l">{post.salary_note || "Monthly salary"}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="em-wrap em-body">
        <div className="em-stack">
          {flash && (
            <div className="em-notice" role="status">
              <CheckCircle2 size={20} aria-hidden="true" />
              <div>
                <strong>{flash.title}</strong>
                <p>{flash.text}</p>
              </div>
            </div>
          )}
          {sp.locked && (
            <div className="em-notice em-notice--plain" role="status">
              <Info size={20} aria-hidden="true" />
              <div>
                <strong>This post can’t be edited right now</strong>
                <p>
                  Only drafts and posts sent back by Righton can be edited. To change a live post, email{" "}
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>.
                </p>
              </div>
            </div>
          )}

          {post.status === "rejected" && (
            <div className="em-reject" role="note">
              <span className="em-reject__icon">
                <AlertCircle size={20} aria-hidden="true" />
              </span>
              <div>
                <p className="em-reject__label">Righton sent this post back</p>
                <p className="em-reject__reason">{post.rejection_reason}</p>
                <p className="em-reject__help">Fix it and resubmit. It goes back into review and this note is cleared.</p>
              </div>
              <a className="btn btn--primary" href={`/employer/jobs/${post.id}/edit`}>
                Edit and resubmit
              </a>
            </div>
          )}

          {hasHadApplicants ? (
            <Pipeline
              applicants={applicants.map((a) => ({
                id: a.id,
                full_name: a.full_name,
                email: a.email,
                phone: a.phone,
                stage: a.stage,
                isSeeker: a.seeker_id != null,
                applied: timeAgo(a.created_at),
                initials: initials(a.full_name),
              }))}
            />
          ) : (
            <section className="em-panel">
              <div className="em-empty">
                <strong>Applicants arrive once the post is live</strong>
                <p>
                  {post.status === "pending"
                    ? "The Righton team is reviewing this post. When it’s published, job seekers can apply and you’ll manage them here."
                    : "Submit this post for review. Once Righton publishes it, applicants will show up here as a pipeline."}
                </p>
              </div>
            </section>
          )}

          <section className="em-panel" aria-labelledby="details-title">
            <div className="em-panel__head">
              <h2 id="details-title" className="em-h2">
                The post
              </h2>
              <span className="em-hint">
                {post.status === "draft" ? `Last saved ${timeAgo(post.updated_at)}` : `Created ${formatDate(post.created_at)}`}
              </span>
            </div>
            <div className="em-details">
              <dl className="em-dl">
                <div>
                  <dt>Experience level</dt>
                  <dd>{labelOf(EXPERIENCE_OPTIONS, post.experience_level)}</dd>
                </div>
                <div>
                  <dt>Job type</dt>
                  <dd>{labelOf(JOB_TYPE_OPTIONS, post.job_type)}</dd>
                </div>
                <div>
                  <dt>Workplace</dt>
                  <dd>{labelOf(WORKPLACE_OPTIONS, post.workplace_type)}</dd>
                </div>
                <div>
                  <dt>Submitted</dt>
                  <dd>{post.submitted_at ? formatDate(post.submitted_at) : "Not yet"}</dd>
                </div>
              </dl>
              <div>
                <h3>Description</h3>
                {post.description ? <p>{post.description}</p> : <p className="em-missing">Not written yet</p>}
              </div>
              <div>
                <h3>Qualification</h3>
                {post.qualification ? <p>{post.qualification}</p> : <p className="em-missing">Not written yet</p>}
              </div>
              {post.experience && (
                <div>
                  <h3>Experience</h3>
                  <p>{post.experience}</p>
                </div>
              )}
              <div>
                <h3>Duties</h3>
                {post.duties.length ? (
                  <ul>
                    {post.duties.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="em-missing">None added yet</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
