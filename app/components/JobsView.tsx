"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Bookmark, ChevronDown, Search, Send, SlidersHorizontal, X } from "lucide-react";
import {
  cities,
  isSample,
  jobs,
  jobTypes,
  level,
  location,
  monogram,
  status,
  postedLabel,
  sectors,
  skills,
  type Job,
  type JobType,
  type Sector,
} from "../data/jobs";
import { sectorLabel } from "./sectorMeta";
import { JobDetail } from "./JobDetail";
import { ApplyDialog } from "./ApplyDialog";
import { useSaved } from "./useSaved";

type Sort = "newest" | "closing" | "salary";
type State = {
  q: string;
  sector: Sector | "";
  types: JobType[];
  cities: string[];
  posted: "" | "3" | "7";
  sort: Sort;
  tab: "all" | "saved";
};
const initial: State = { q: "", sector: "", types: [], cities: [], posted: "", sort: "newest", tab: "all" };
const PAGE = 6;

const share = (j: Job) => {
  const url = `${window.location.origin}/jobs?ref=${j.ref}`;
  const text = `${j.title} (Ref ${j.ref}), ${location(j)}. Apply through Righton:`;
  window.open(
    `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    "_blank",
    "noopener"
  );
};

export function JobsView() {
  const [f, setF] = useState<State>(initial);
  const [shown, setShown] = useState(PAGE);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [detail, setDetail] = useState<Job | null>(null);
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { saved, toggle } = useSaved();
  const drawer = useRef<HTMLDialogElement>(null);
  const sheet = useRef<HTMLDialogElement>(null);

  const set = (p: Partial<State>) => {
    setF((s) => ({ ...s, ...p }));
    setShown(PAGE);
  };

  // Arrivals from the home page: /jobs?q=…&city=…&sector=…&ref=…
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const sector = p.get("sector") as Sector | null;
    const city = p.get("city");
    setF((s) => ({
      ...s,
      q: p.get("q") ?? "",
      sector: sector && sectors.includes(sector) ? sector : "",
      cities: city && cities.includes(city) ? [city] : [],
      sort: (["newest", "closing", "salary"] as const).find((v) => v === p.get("sort")) ?? s.sort,
    }));
    const ref = p.get("ref");
    const j = ref ? jobs.find((x) => x.ref === ref) : undefined;
    if (j) setDetail(j);
  }, []);

  useEffect(() => {
    const d = drawer.current;
    if (!d) return;
    if (detail && !d.open) d.showModal();
    if (!detail && d.open) d.close();
  }, [detail]);

  useEffect(() => {
    const d = sheet.current;
    if (!d) return;
    if (filtersOpen && !d.open) d.showModal();
    if (!filtersOpen && d.open) d.close();
  }, [filtersOpen]);

  const results = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const list = jobs.filter((j) => {
      if (f.tab === "saved" && !saved.has(j.ref)) return false;
      if (f.sector && j.sector !== f.sector) return false;
      if (f.types.length && !f.types.includes(j.type)) return false;
      if (f.cities.length && !f.cities.includes(j.city)) return false;
      if (f.posted && j.postedDaysAgo > Number(f.posted)) return false;
      if (!q) return true;
      return [j.title, j.ref, j.city, j.area ?? "", j.clientType, j.sector, ...(skills[j.ref] ?? [])].some((x) =>
        x.toLowerCase().includes(q)
      );
    });
    const by = {
      newest: (a: Job, b: Job) => a.postedDaysAgo - b.postedDaysAgo,
      closing: (a: Job, b: Job) => a.closesInDays - b.closesInDays,
      salary: (a: Job, b: Job) => b.salaryMin - a.salaryMin,
    }[f.sort];
    return list.sort(by);
  }, [f, saved]);

  const active = (f.sector ? 1 : 0) + f.types.length + f.cities.length + (f.posted ? 1 : 0);
  const clear = () => set({ sector: "", types: [], cities: [], posted: "" });

  const filters = (
    <FilterPanel f={f} set={set} active={active} clear={clear} />
  );

  return (
    <main id="main" className="jobs">
      <div className="container">
        <div className="jobs__head">
          <h1 className="jobs__title">Discover jobs</h1>
          {isSample && <p className="jobs__note">Sample listings for the design preview</p>}
        </div>

        <label className="jobs__search">
          <Search size={20} aria-hidden="true" />
          <span className="sr-only">Search jobs</span>
          <input
            type="search"
            placeholder="Search by job title, skill, town or Ref"
            value={f.q}
            onChange={(e) => set({ q: e.target.value })}
            enterKeyHint="search"
          />
        </label>

        <div className="jobs__grid">
          <section className="jlist" aria-label="Job results">
            <div className="jlist__bar">
              <div className="jlist__tabs" role="tablist" aria-label="Which jobs">
                <button
                  type="button"
                  role="tab"
                  aria-selected={f.tab === "all"}
                  onClick={() => set({ tab: "all" })}
                >
                  All jobs <span className="cell">{jobs.length}</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={f.tab === "saved"}
                  onClick={() => set({ tab: "saved" })}
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
              Showing <strong>{Math.min(shown, results.length)}</strong> of <strong>{results.length}</strong>{" "}
              {results.length === 1 ? "job" : "jobs"}
              {f.sector ? ` in ${sectorLabel[f.sector]}` : ""}
            </p>

            {results.length === 0 ? (
              <div className="jlist__empty">
                <p className="jlist__empty-title">
                  {f.tab === "saved" ? "You have not saved any jobs yet." : "No jobs match these filters."}
                </p>
                <p>
                  {f.tab === "saved"
                    ? "Tap the bookmark on any job to keep it here."
                    : "Try another sector or city, or clear the filters."}
                </p>
                <button
                  type="button"
                  className="btn btn--line"
                  onClick={() => (f.tab === "saved" ? set({ tab: "all" }) : clear())}
                >
                  {f.tab === "saved" ? "Browse all jobs" : "Clear filters"}
                </button>
              </div>
            ) : (
              <ul className="jlist__items">
                {results.slice(0, shown).map((j) => {
                  const more = open.has(j.ref);
                  const isSaved = saved.has(j.ref);
                  return (
                    <li key={j.ref} className="jrow">
                      <div className="jrow__top">
                        <span className="jrow__mono" aria-hidden="true">
                          {monogram(j)}
                        </span>
                        <div className="jrow__id">
                          <h2 className="jrow__title">
                            <button type="button" onClick={() => setDetail(j)}>
                              {j.title}
                            </button>
                          </h2>
                          <p className="jrow__org">
                            <span>{j.clientType}</span>
                            <span>{location(j)}, Ethiopia</span>
                          </p>
                        </div>
                        <div className="jrow__acts">
                          {status(j).tone !== "open" && (
                            <span className={`status is-${status(j).tone}`}>{status(j).label}</span>
                          )}
                          <span className="jrow__posted">Posted {postedLabel(j.postedDaysAgo).toLowerCase()}</span>
                          <button type="button" className="jrow__icon" onClick={() => share(j)} aria-label={`Share ${j.title} on Telegram`}>
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
                          A {j.clientType.toLowerCase()} is hiring {j.positions > 1 ? `${j.positions} people` : "one person"} as{" "}
                          {j.title} in {j.city}. {j.duties.join(". ")}.
                        </p>
                        <p>
                          <strong>Qualification:</strong> {j.qualification}. <strong>Experience:</strong> {j.experience}.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="jrow__more"
                        aria-expanded={more}
                        aria-controls={`body-${j.ref}`}
                        onClick={() =>
                          setOpen((s) => {
                            const n = new Set(s);
                            if (n.has(j.ref)) n.delete(j.ref);
                            else n.add(j.ref);
                            return n;
                          })
                        }
                      >
                        {more ? "Show less" : "Show more"}
                      </button>

                      <ul className="jrow__skills" aria-label="Skills">
                        {(skills[j.ref] ?? []).map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>

                      <div className="jrow__foot">
                        <dl className="jrow__facts">
                          <div>
                            <dd className="jrow__money">{j.salary}</dd>
                            <dt>Monthly</dt>
                          </div>
                          <div>
                            <dd>{level(j)}</dd>
                            <dt>Experience level</dt>
                          </div>
                          <div>
                            <dd>{j.type}</dd>
                            <dt>Job type</dt>
                          </div>
                          <div>
                            <dd className={j.closesInDays <= 5 ? "is-soon" : ""}>
                              In <span className="cell">{j.closesInDays}</span> days
                            </dd>
                            <dt>Deadline</dt>
                          </div>
                        </dl>
                        <button type="button" className="btn btn--primary jrow__view" onClick={() => setDetail(j)}>
                          View details
                          <ArrowRight size={17} aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {results.length > shown && (
              <button type="button" className="jlist__more" onClick={() => setShown((n) => n + PAGE)}>
                Show {Math.min(PAGE, results.length - shown)} more jobs
                <ChevronDown size={18} aria-hidden="true" />
              </button>
            )}
          </section>

          <aside className="fpanel fpanel--side" aria-label="Filter jobs">
            {filters}
          </aside>
        </div>
      </div>

      <dialog ref={drawer} className="drawer" aria-label={detail ? detail.title : "Job details"} onClose={() => setDetail(null)}>
        {detail && (
          <>
            <div className="drawer__bar">
              <span className="cell">{detail.ref}</span>
              <button type="button" className="drawer__close" onClick={() => setDetail(null)}>
                <X size={20} aria-hidden="true" />
                <span className="sr-only">Close job details</span>
              </button>
            </div>
            <JobDetail
              job={detail}
              onApply={(j) => {
                setDetail(null);
                setApplyJob(j);
              }}
            />
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
        <div className="fsheet__body">{filters}</div>
        <div className="fsheet__foot">
          <button type="button" className="btn btn--primary btn--block btn--lg" onClick={() => setFiltersOpen(false)}>
            Show {results.length} {results.length === 1 ? "job" : "jobs"}
          </button>
        </div>
      </dialog>

      <ApplyDialog job={applyJob} onClose={() => setApplyJob(null)} />
    </main>
  );
}

function FilterPanel({
  f,
  set,
  active,
  clear,
}: {
  f: State;
  set: (p: Partial<State>) => void;
  active: number;
  clear: () => void;
}) {
  const flip = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
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
          <select value={f.sector} onChange={(e) => set({ sector: e.target.value as Sector | "" })}>
            <option value="">All sectors</option>
            {sectors.map((s) => (
              <option key={s} value={s}>
                {sectorLabel[s]}
              </option>
            ))}
          </select>
          <ChevronDown size={16} aria-hidden="true" />
        </label>
      </Group>

      <Group title="Job type">
        {jobTypes.map((t) => (
          <label key={t} className="fcheck">
            <input type="checkbox" checked={f.types.includes(t)} onChange={() => set({ types: flip(f.types, t) })} />
            <span>{t}</span>
            <span className="fcheck__n cell">{jobs.filter((j) => j.type === t).length}</span>
          </label>
        ))}
      </Group>

      <Group title="City">
        {cities.map((c) => (
          <label key={c} className="fcheck">
            <input type="checkbox" checked={f.cities.includes(c)} onChange={() => set({ cities: flip(f.cities, c) })} />
            <span>{c}</span>
            <span className="fcheck__n cell">{jobs.filter((j) => j.city === c).length}</span>
          </label>
        ))}
      </Group>

      <Group title="Date posted">
        {[
          ["", "Any time"],
          ["3", "Last 3 days"],
          ["7", "Last 7 days"],
        ].map(([v, l]) => (
          <label key={v} className="fcheck">
            <input
              type="radio"
              name={`posted-${f.tab}`}
              checked={f.posted === v}
              onChange={() => set({ posted: v as State["posted"] })}
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
