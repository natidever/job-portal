"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Bookmark, ChevronDown, Search, Send, SlidersHorizontal, X } from "lucide-react";
import {
  JOB_TYPE_LABEL,
  LEVEL_LABEL,
  PAGE_SIZE,
  WORKPLACE_LABEL,
  filtersToQuery,
  jobTypeIds,
  listingsAreSample,
  location,
  monogram,
  postedLabel,
  shortCategory,
  status,
  deadlineLabel,
  type Filters,
  type Job,
  type JobTypeId,
  type Lookup,
  type Posted,
  type Sort,
} from "../data/jobs";
import type { Facets, RefLookup } from "@/lib/data/public";
import { fetchSavedJobs } from "@/lib/data/public-actions";
import { JobDetail } from "./JobDetail";
import { ApplyDialog } from "./ApplyDialog";
import { useSaved } from "./useSaved";

type Tab = "all" | "saved";
type Missing = Exclude<RefLookup, { state: "open" }>;

const share = (j: Job) => {
  const url = `${window.location.origin}/jobs?ref=${j.ref}`;
  const text = `${j.title} (Ref ${j.ref}), ${location(j)}. Apply through Righton:`;
  window.open(
    `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    "_blank",
    "noopener"
  );
};

/** Keep the address bar in step with the open drawer without a server round trip. */
const setRefInUrl = (ref: string | null) => {
  const url = new URL(window.location.href);
  if (ref) url.searchParams.set("ref", ref);
  else url.searchParams.delete("ref");
  window.history.replaceState(window.history.state, "", url.pathname + url.search);
};

export function JobsView({
  filters,
  page,
  jobs,
  total,
  lookups,
  facets,
  opened,
}: {
  filters: Filters;
  page: number;
  jobs: Job[];
  total: number;
  lookups: { categories: Lookup[]; cities: Lookup[] };
  facets: Facets;
  opened: RefLookup | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [f, setF] = useState<Filters>(filters);
  const [q, setQ] = useState(filters.q);
  const [tab, setTab] = useState<Tab>("all");
  const [savedJobs, setSavedJobs] = useState<Job[] | null>(null);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [detail, setDetail] = useState<Job | null>(opened?.state === "open" ? opened.job : null);
  const [missing, setMissing] = useState<Missing | null>(opened && opened.state !== "open" ? opened : null);
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { saved, toggle } = useSaved();
  const drawer = useRef<HTMLDialogElement>(null);
  const sheet = useRef<HTMLDialogElement>(null);
  const filtersKey = filtersToQuery(filters);

  // Server props are the source of truth after each navigation (back/forward included).
  useEffect(() => {
    setF(filters);
    setQ(filters.q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  const go = (next: Filters, nextPage = 1) => {
    setF(next);
    startTransition(() => {
      router.replace(`/jobs${filtersToQuery(next, { page: nextPage })}`, { scroll: false });
    });
  };
  const set = (p: Partial<Filters>) => go({ ...f, ...p });

  // Search as you type, debounced so each keystroke doesn't hit the server.
  useEffect(() => {
    if (q.trim() === f.q.trim()) return;
    const t = window.setTimeout(() => go({ ...f, q }), 350);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // Saved jobs are refs in this browser; fetch the ones still open, under the same filters.
  const savedKey = [...saved].sort().join(",");
  useEffect(() => {
    if (tab !== "saved") return;
    let live = true;
    fetchSavedJobs([...saved], f)
      .then((list) => live && setSavedJobs(list))
      .catch(() => live && setSavedJobs([]));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, savedKey, filtersKey]);

  useEffect(() => {
    const d = drawer.current;
    if (!d) return;
    const want = Boolean(detail || missing);
    if (want && !d.open) d.showModal();
    if (!want && d.open) d.close();
  }, [detail, missing]);

  useEffect(() => {
    const d = sheet.current;
    if (!d) return;
    if (filtersOpen && !d.open) d.showModal();
    if (!filtersOpen && d.open) d.close();
  }, [filtersOpen]);

  const openDetail = (j: Job) => {
    setMissing(null);
    setDetail(j);
    setRefInUrl(j.ref);
  };
  const closeDrawer = () => {
    setDetail(null);
    setMissing(null);
    setRefInUrl(null);
  };

  const results = tab === "saved" ? (savedJobs ?? []) : jobs;
  const count = tab === "saved" ? results.length : total;
  const loading = tab === "saved" && savedJobs === null;
  const active = (f.category ? 1 : 0) + f.types.length + f.cities.length + (f.posted ? 1 : 0);
  const clear = () => go({ ...f, category: "", types: [], cities: [], posted: "" });
  const categoryName = lookups.categories.find((c) => c.id === f.category)?.name;
  const filtered = active > 0 || f.q.trim() !== "";

  const filterPanel = (scope: string) => (
    <FilterPanel scope={scope} f={f} set={set} active={active} clear={clear} lookups={lookups} facets={facets} />
  );

  return (
    <main id="main" className="jobs">
      <div className="container">
        <div className="jobs__head">
          <h1 className="jobs__title">Discover jobs</h1>
          {listingsAreSample && <p className="jobs__note">Sample listings in a demo database</p>}
        </div>

        <form
          className="jobs__search"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            go({ ...f, q });
          }}
        >
          <Search size={20} aria-hidden="true" />
          <label htmlFor="jobs-q" className="sr-only">
            Search jobs
          </label>
          <input
            id="jobs-q"
            type="search"
            placeholder="Job title, keyword, town or Ref"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            enterKeyHint="search"
            autoComplete="off"
          />
        </form>

        <div className="jobs__grid">
          <section className={`jlist ${pending ? "is-pending" : ""}`} aria-label="Job results" aria-busy={pending || loading}>
            <div className="jlist__bar">
              <div className="jlist__tabs" role="tablist" aria-label="Which jobs">
                <button type="button" role="tab" aria-selected={tab === "all"} onClick={() => setTab("all")}>
                  All jobs <span className="cell">{facets.total}</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "saved"}
                  onClick={() => {
                    setSavedJobs(null);
                    setTab("saved");
                  }}
                >
                  Saved <span className="cell">{saved.size}</span>
                </button>
              </div>
              <div className="jlist__tools">
                <button type="button" className="jlist__filters" onClick={() => setFiltersOpen(true)}>
                  <SlidersHorizontal size={16} aria-hidden="true" />
                  Filters{active ? ` (${active})` : ""}
                </button>
                <label className="jlist__sort">
                  <span className="sr-only">Sort by</span>
                  <select value={f.sort} onChange={(e) => set({ sort: e.target.value as Sort })}>
                    <option value="newest">Newest first</option>
                    <option value="closing">Closing soon</option>
                    <option value="salary">Highest salary</option>
                  </select>
                  <ChevronDown size={16} aria-hidden="true" />
                </label>
              </div>
            </div>

            <p className="jlist__count" aria-live="polite">
              {loading ? (
                "Loading your saved jobs…"
              ) : (
                <>
                  Showing <strong>{results.length}</strong> of <strong>{count}</strong> {count === 1 ? "job" : "jobs"}
                  {categoryName ? ` in ${categoryName}` : ""}
                  {f.q.trim() ? <> for &ldquo;{f.q.trim()}&rdquo;</> : null}
                </>
              )}
            </p>

            {loading ? null : results.length === 0 ? (
              <div className="jlist__empty">
                <p className="jlist__empty-title">
                  {tab === "saved"
                    ? saved.size
                      ? "None of your saved jobs match."
                      : "You have not saved any jobs yet."
                    : filtered
                      ? "No open jobs match this search."
                      : "No open vacancies right now."}
                </p>
                <p>
                  {tab === "saved"
                    ? saved.size
                      ? "Saved jobs that have closed drop off this list. Clear the filters to see the rest."
                      : "Tap the bookmark on any job to keep it here."
                    : filtered
                      ? "Try a broader keyword, another sector or city, or clear the filters."
                      : "New vacancies are published every week. Check back soon."}
                </p>
                {(tab === "saved" || filtered) && (
                  <button
                    type="button"
                    className="btn btn--line"
                    onClick={() => {
                      if (tab === "saved" && !saved.size) return setTab("all");
                      setQ("");
                      go({ ...f, q: "", category: "", types: [], cities: [], posted: "" });
                    }}
                  >
                    {tab === "saved" && !saved.size ? "Browse all jobs" : "Clear search and filters"}
                  </button>
                )}
              </div>
            ) : (
              <ul className="jlist__items">
                {results.map((j) => {
                  const more = open.has(j.ref);
                  const isSaved = saved.has(j.ref);
                  const s = status(j);
                  return (
                    <li key={j.ref} className="jrow">
                      <div className="jrow__top">
                        <span className="jrow__mono" aria-hidden="true">
                          {monogram(j)}
                        </span>
                        <div className="jrow__id">
                          <h2 className="jrow__title">
                            <a
                              href={`/jobs?ref=${j.ref}`}
                              onClick={(e) => {
                                if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                                e.preventDefault();
                                openDetail(j);
                              }}
                            >
                              {j.title}
                            </a>
                          </h2>
                          <p className="jrow__org">
                            <span>{j.company}</span>
                            <span>{location(j)}, Ethiopia</span>
                          </p>
                        </div>
                        <div className="jrow__acts">
                          {s.tone !== "open" && <span className={`status is-${s.tone}`}>{s.label}</span>}
                          <span className="jrow__posted">Posted {postedLabel(j.postedDaysAgo).toLowerCase()}</span>
                          <button
                            type="button"
                            className="jrow__icon"
                            onClick={() => share(j)}
                            aria-label={`Share ${j.title} on Telegram`}
                          >
                            <Send size={18} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            className={`jrow__icon ${isSaved ? "is-on" : ""}`}
                            aria-pressed={isSaved}
                            aria-label={isSaved ? `Remove ${j.title} from saved` : `Save ${j.title}`}
                            onClick={() => toggle(j.ref)}
                          >
                            <Bookmark size={19} aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className={`jrow__body ${more ? "is-open" : ""}`} id={`body-${j.ref}`}>
                        <h3 className="jrow__label">Job details</h3>
                        <p>
                          {j.description ||
                            `${j.company} is hiring ${j.positions > 1 ? `${j.positions} people` : "one person"} as ${j.title} in ${j.city}.`}{" "}
                          {j.duties.length ? `${j.duties.join(". ")}.` : ""}
                        </p>
                        {(j.qualification || j.experience) && (
                          <p>
                            {j.qualification && (
                              <>
                                <strong>Qualification:</strong> {j.qualification}.{" "}
                              </>
                            )}
                            {j.experience && (
                              <>
                                <strong>Experience:</strong> {j.experience}.
                              </>
                            )}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        className="jrow__more"
                        aria-expanded={more}
                        aria-controls={`body-${j.ref}`}
                        onClick={() =>
                          setOpen((prev) => {
                            const n = new Set(prev);
                            if (n.has(j.ref)) n.delete(j.ref);
                            else n.add(j.ref);
                            return n;
                          })
                        }
                      >
                        {more ? "Show less" : "Show more"}
                      </button>

                      <ul className="jrow__skills" aria-label="Highlights">
                        <li>{shortCategory(j.category)}</li>
                        <li>{WORKPLACE_LABEL[j.workplace]}</li>
                        <li>
                          {j.positions} {j.positions === 1 ? "position" : "positions"}
                        </li>
                      </ul>

                      <div className="jrow__foot">
                        <dl className="jrow__facts">
                          <div>
                            <dd className="jrow__money">{j.salary}</dd>
                            <dt>Monthly</dt>
                          </div>
                          <div>
                            <dd>{LEVEL_LABEL[j.level]}</dd>
                            <dt>Experience level</dt>
                          </div>
                          <div>
                            <dd>{JOB_TYPE_LABEL[j.type]}</dd>
                            <dt>Job type</dt>
                          </div>
                          <div>
                            <dd className={j.closesInDays <= 5 ? "is-soon" : ""} title={`Apply by ${deadlineLabel(j.deadline)}`}>
                              {j.closesInDays === 0 ? (
                                "Closes today"
                              ) : j.closesInDays === 1 ? (
                                "Tomorrow"
                              ) : (
                                <>
                                  In <span className="cell">{j.closesInDays}</span> days
                                </>
                              )}
                            </dd>
                            <dt>Deadline</dt>
                          </div>
                        </dl>
                        <a
                          href={`/jobs?ref=${j.ref}`}
                          className="btn btn--primary jrow__view"
                          onClick={(e) => {
                            if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                            e.preventDefault();
                            openDetail(j);
                          }}
                        >
                          View details
                          <ArrowRight size={17} aria-hidden="true" />
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {tab === "all" && total > jobs.length && (
              <button
                type="button"
                className="jlist__more"
                disabled={pending}
                onClick={() => go(f, page + 1)}
              >
                {pending ? "Loading…" : `Show ${Math.min(PAGE_SIZE, total - jobs.length)} more jobs`}
                <ChevronDown size={18} aria-hidden="true" />
              </button>
            )}
          </section>

          <aside className="fpanel fpanel--side" aria-label="Filter jobs">
            {filterPanel("side")}
          </aside>
        </div>
      </div>

      <dialog
        ref={drawer}
        className="drawer"
        aria-label={detail ? detail.title : missing ? "Vacancy no longer open" : "Job details"}
        onClose={closeDrawer}
      >
        {(detail || missing) && (
          <>
            <div className="drawer__bar">
              <span className="cell">{detail?.ref ?? missing?.ref}</span>
              <button type="button" className="drawer__close" onClick={closeDrawer}>
                <X size={20} aria-hidden="true" />
                <span className="sr-only">Close job details</span>
              </button>
            </div>
            {detail ? (
              <JobDetail
                job={detail}
                onApply={(j) => {
                  setDetail(null);
                  setApplyJob(j);
                }}
              />
            ) : missing ? (
              <Gone missing={missing} onBrowse={closeDrawer} />
            ) : null}
          </>
        )}
      </dialog>

      <dialog ref={sheet} className="fsheet" aria-label="Filter jobs" onClose={() => setFiltersOpen(false)}>
        <div className="drawer__bar">
          <span>Filter jobs</span>
          <button type="button" className="drawer__close" onClick={() => setFiltersOpen(false)}>
            <X size={20} aria-hidden="true" />
            <span className="sr-only">Close filters</span>
          </button>
        </div>
        <div className="fsheet__body">{filterPanel("sheet")}</div>
        <div className="fsheet__foot">
          <button type="button" className="btn btn--primary btn--block btn--lg" onClick={() => setFiltersOpen(false)}>
            {pending ? "Updating…" : `Show ${count} ${count === 1 ? "job" : "jobs"}`}
          </button>
        </div>
      </dialog>

      <ApplyDialog
        job={applyJob}
        onClose={() => {
          setApplyJob(null);
          setRefInUrl(null);
        }}
      />
    </main>
  );
}

/** A shared link to a vacancy that has closed, expired, or never existed. */
function Gone({ missing, onBrowse }: { missing: Missing; onBrowse: () => void }) {
  return (
    <article className="jd" aria-labelledby="jd-gone">
      <header className="jd__head">
        <span className="status status--dark is-final">Closed</span>
        <h3 id="jd-gone" className="jd__title">
          {missing.state === "closed" ? missing.title : "This vacancy is no longer open"}
        </h3>
        <p className="jd__org">
          {missing.state === "closed"
            ? "Applications for this vacancy have closed."
            : `We couldn't find an open vacancy with Ref ${missing.ref}. It may have closed or been taken down.`}
        </p>
        <div className="jd__actions">
          <button type="button" className="btn btn--white btn--lg" onClick={onBrowse}>
            Browse open jobs
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </header>
      <div className="jd__body">
        <section className="jd__sec">
          <h4>What to do next</h4>
          <p>
            Every vacancy on Righton stays up until its deadline. Similar roles open often: search the board, or save
            jobs you like so you can come back before they close.
          </p>
        </section>
      </div>
    </article>
  );
}

function FilterPanel({
  scope,
  f,
  set,
  active,
  clear,
  lookups,
  facets,
}: {
  scope: string;
  f: Filters;
  set: (p: Partial<Filters>) => void;
  active: number;
  clear: () => void;
  lookups: { categories: Lookup[]; cities: Lookup[] };
  facets: Facets;
}) {
  const flip = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const cities = lookups.cities.filter((c) => (facets.byCity[c.id] ?? 0) > 0 || f.cities.includes(c.id));
  const types = jobTypeIds.filter((t) => (facets.byType[t] ?? 0) > 0 || f.types.includes(t));
  return (
    <div className="fpanel">
      <div className="fpanel__head">
        <h2 className="fpanel__title">Filter jobs</h2>
        {active > 0 && (
          <button type="button" className="fpanel__clear" onClick={clear}>
            Clear all
          </button>
        )}
      </div>

      <Group title="Sector">
        <label className="fselect">
          <span className="sr-only">Sector</span>
          <select value={f.category} onChange={(e) => set({ category: e.target.value })}>
            <option value="">All sectors</option>
            {lookups.categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {facets.byCategory[c.id] ? ` (${facets.byCategory[c.id]})` : ""}
              </option>
            ))}
          </select>
          <ChevronDown size={16} aria-hidden="true" />
        </label>
      </Group>

      <Group title="Job type">
        {types.map((t) => (
          <label key={t} className="fcheck">
            <input
              type="checkbox"
              checked={f.types.includes(t)}
              onChange={() => set({ types: flip<JobTypeId>(f.types, t) })}
            />
            <span>{JOB_TYPE_LABEL[t]}</span>
            <span className="fcheck__n cell">{facets.byType[t] ?? 0}</span>
          </label>
        ))}
      </Group>

      <Group title="City">
        {cities.map((c) => (
          <label key={c.id} className="fcheck">
            <input
              type="checkbox"
              checked={f.cities.includes(c.id)}
              onChange={() => set({ cities: flip(f.cities, c.id) })}
            />
            <span>{c.name}</span>
            <span className="fcheck__n cell">{facets.byCity[c.id] ?? 0}</span>
          </label>
        ))}
      </Group>

      <Group title="Date posted">
        {(
          [
            ["", "Any time"],
            ["3", "Last 3 days"],
            ["7", "Last 7 days"],
          ] as const
        ).map(([v, l]) => (
          <label key={v} className="fcheck">
            <input
              type="radio"
              name={`posted-${scope}`}
              checked={f.posted === v}
              onChange={() => set({ posted: v as Posted })}
            />
            <span>{l}</span>
          </label>
        ))}
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="fgroup">
      <button type="button" className="fgroup__head" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {title}
        <ChevronDown size={18} aria-hidden="true" />
      </button>
      {open && <div className="fgroup__body">{children}</div>}
    </div>
  );
}
