import { AlertCircle, ArrowRight, ChevronRight, Plus } from "lucide-react";
import { getMyPosts, daysUntil, type PostSummary } from "@/lib/data/employer";
import { formatDate, timeAgo } from "@/lib/format";
import { JOB_STATUS_LABEL, type JobDisplayStatus } from "@/lib/status";
import { StatusTag, deadlineText } from "../ui";

export const metadata = { title: "My posts" };

const FILTERS: { key: "all" | JobDisplayStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "published", label: JOB_STATUS_LABEL.published },
  { key: "pending", label: JOB_STATUS_LABEL.pending },
  { key: "draft", label: "Drafts" },
  { key: "rejected", label: JOB_STATUS_LABEL.rejected },
  { key: "expired", label: JOB_STATUS_LABEL.expired },
  { key: "closed", label: JOB_STATUS_LABEL.closed },
];

function stateLine(p: PostSummary): { text: string; soon?: boolean } {
  switch (p.display) {
    case "published": {
      const d = daysUntil(p.deadline);
      return { text: deadlineText(d), soon: d <= 5 };
    }
    case "pending":
      return { text: `Submitted ${p.submitted_at ? timeAgo(p.submitted_at) : ""}`.trim() };
    case "draft":
      return { text: `Edited ${timeAgo(p.updated_at)}` };
    case "rejected":
      return { text: "Needs changes" };
    case "expired":
      return { text: `Deadline was ${formatDate(p.deadline)}` };
    case "closed":
      return { text: p.closed_at ? `Closed ${timeAgo(p.closed_at)}` : "Closed" };
  }
}

export default async function MyPostsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const posts = await getMyPosts();
  const active = FILTERS.some((f) => f.key === status) ? (status as (typeof FILTERS)[number]["key"]) : "all";
  const count = (k: (typeof FILTERS)[number]["key"]) => (k === "all" ? posts.length : posts.filter((p) => p.display === k).length);
  const shown = active === "all" ? posts : posts.filter((p) => p.display === active);

  return (
    <>
      <section className="em-head">
        <div className="em-wrap em-head__row">
          <div>
            <h1 className="em-h1">My posts</h1>
            <p className="em-lede">
              Every post you’ve written, from first draft to closed. Live posts are locked; contact Righton to change one.
            </p>
          </div>
        </div>
      </section>

      <div className="em-wrap em-body">
        <nav aria-label="Filter by status" className="em-filter">
          {FILTERS.filter((f) => f.key === "all" || f.key === active || count(f.key) > 0).map((f) => (
            <a
              key={f.key}
              className="em-chip"
              href={f.key === "all" ? "/employer/jobs" : `/employer/jobs?status=${f.key}`}
              aria-current={active === f.key ? "true" : undefined}
            >
              {f.label}
              <span className="em-count">{count(f.key)}</span>
            </a>
          ))}
        </nav>

        <section className="em-panel" aria-label="Posts">
          {shown.length === 0 ? (
            <div className="em-empty">
              <strong>{posts.length === 0 ? "Your first post starts here" : "Nothing here right now"}</strong>
              <p>
                {posts.length === 0
                  ? "Write a job post, send it for review, and Righton will publish it to job seekers across Ethiopia."
                  : `You have no ${FILTERS.find((f) => f.key === active)?.label.toLowerCase()} posts.`}
              </p>
              {posts.length === 0 ? (
                <a href="/employer/jobs/new" className="btn btn--primary">
                  <Plus size={18} aria-hidden="true" /> Post a job
                </a>
              ) : (
                <a href="/employer/jobs" className="em-link">
                  Show all posts <ArrowRight size={15} aria-hidden="true" />
                </a>
              )}
            </div>
          ) : (
            <ul className="em-rows">
              {shown.map((p) => {
                const s = stateLine(p);
                return (
                  <li key={p.id} className="em-post">
                    <span className="em-ref">{p.ref}</span>
                    <div className="em-post__main">
                      <a className="em-post__title" href={`/employer/jobs/${p.id}`}>
                        {p.title}
                      </a>
                      <p className="em-post__meta">
                        {p.categoryName} · {p.cityName}
                        {p.area ? `, ${p.area}` : ""}
                      </p>
                      {p.status === "rejected" && (
                        <div className="em-post__extra">
                          <p className="em-why">
                            <AlertCircle size={16} aria-hidden="true" />
                            <span>
                              <b>Righton’s note:</b> {p.rejection_reason}{" "}
                              <a href={`/employer/jobs/${p.id}/edit`}>Edit and resubmit</a>
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="em-post__state">
                      <StatusTag status={p.display} />
                      <span className={`em-post__when ${s.soon ? "is-soon" : ""}`}>{s.text}</span>
                    </div>
                    <div className="em-post__apps">
                      <span className="cell">{p.applicants}</span>
                      <small>{p.applicants === 1 ? "applicant" : "applicants"}</small>
                      {p.newApplicants > 0 && <small className="em-post__new">{p.newApplicants} new</small>}
                    </div>
                    <ChevronRight className="em-post__go" size={20} aria-hidden="true" />
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
