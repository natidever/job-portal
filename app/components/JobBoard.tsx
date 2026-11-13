"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import {
  cities,
  emptyFilters,
  filterJobs,
  jobTypes,
  location,
  postedLabel,
  sectors,
  status,
  type Filters,
  type Job,
} from "../data/jobs";
import { sectorLabel } from "./sectorMeta";
import { JobDetail } from "./JobDetail";
import { FlapText } from "./FlapText";

const WIDE = "(min-width: 1024px)";
const PAGE = 8;
const sorts: { id: Filters["sort"]; label: string }[] = [
  { id: "newest", label: "Newest" },
  { id: "closing", label: "Closing soon" },
  { id: "salary", label: "Highest salary" },
];

export function JobBoard({
  filters,
  setFilters,
  onApply,
  focus,
}: {
  filters: Filters;
  setFilters: (f: Partial<Filters>) => void;
  onApply: (job: Job) => void;
  focus: { ref: string; n: number } | null;
}) {
  const results = useMemo(() => filterJobs(filters), [filters]);
  const [selectedRef, setSelectedRef] = useState<string | null>(null);
  const [sheetJob, setSheetJob] = useState<Job | null>(null);
  const [shown, setShown] = useState(PAGE);
  const sheetRef = useRef<HTMLDialogElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);

  const selected = results.find((j) => j.ref === selectedRef) ?? results[0] ?? null;
  const active = (["city", "sector", "type", "posted", "q"] as const).filter((k) => filters[k]).length;

  useEffect(() => setShown(PAGE), [filters]);

  useEffect(() => {
    const d = sheetRef.current;
    if (!d) return;
    if (sheetJob && !d.open) d.showModal();
    if (!sheetJob && d.open) d.close();
  }, [sheetJob]);

  const open = (j: Job) => {
    setSelectedRef(j.ref);
    if (window.matchMedia(WIDE).matches) paneRef.current?.scrollTo({ top: 0 });
    else setSheetJob(j);
  };

  // A row picked on the hero's Openings board lands here.
  useEffect(() => {
    if (!focus) return;
    const j = filterJobs(emptyFilters).find((x) => x.ref === focus.ref);
    if (!j) return;
    setShown(99);
    setSelectedRef(j.ref);
    if (window.matchMedia(WIDE).matches) {
      document.getElementById("vacancies")?.scrollIntoView({ block: "start" });
      requestAnimationFrame(() =>
        document.getElementById(`row-${j.ref}`)?.focus({ preventScroll: true })
      );
    } else {
      setSheetJob(j);
    }
  }, [focus]);

  const countText = `${String(results.length).padStart(2, "0")}`;

  return (
    <section className="board" id="vacancies" aria-labelledby="board-title">
      <div className="container">
        <div className="board__head">
          <h2 id="board-title" className="h2">
            Open vacancies
          </h2>
          <p className="board__count" aria-live="polite">
            <FlapText text={countText} className="cell count" cells />
            <span>
              {results.length === 1 ? "vacancy" : "vacancies"}
              {filters.sector ? ` in ${sectorLabel[filters.sector]}` : ""}
              {filters.city ? `, ${filters.city}` : ""}
            </span>
          </p>
          <p className="board__sample">Sample listings for preview</p>
        </div>

        <div className="filters" role="group" aria-label="Filter vacancies">
          <label className="filters__search">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Search vacancies</span>
            <input
              type="search"
              placeholder="Search title, town or Ref"
              value={filters.q}
              onChange={(e) => setFilters({ q: e.target.value })}
            />
          </label>
          <Select label="City" value={filters.city} onChange={(v) => setFilters({ city: v })}>
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select
            label="Sector"
            value={filters.sector}
            onChange={(v) => setFilters({ sector: v as Filters["sector"] })}
          >
            <option value="">All sectors</option>
            {sectors.map((s) => (
              <option key={s} value={s}>
                {sectorLabel[s]}
              </option>
            ))}
          </Select>
          <Select
            label="Job type"
            value={filters.type}
            onChange={(v) => setFilters({ type: v as Filters["type"] })}
          >
            <option value="">Any job type</option>
            {jobTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
          <Select
            label="Posted"
            value={filters.posted}
            onChange={(v) => setFilters({ posted: v as Filters["posted"] })}
          >
            <option value="">Any time</option>
            <option value="3">Last 3 days</option>
            <option value="7">Last 7 days</option>
          </Select>
        </div>

        <div className="sortbar">
          <div className="sortbar__tabs" role="group" aria-label="Sort vacancies">
            {sorts.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={filters.sort === s.id}
                onClick={() => setFilters({ sort: s.id })}
              >
                {s.label}
              </button>
            ))}
          </div>
          {active > 0 && (
            <button
              type="button"
              className="sortbar__clear"
              onClick={() => setFilters({ ...emptyFilters, sort: filters.sort })}
            >
              <X size={15} aria-hidden="true" />
              Clear filters
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="empty">
            <p className="empty__title">No vacancies match those filters.</p>
            <p>Try another city or sector, or clear the filters to see every open vacancy.</p>
            <button
              type="button"
              className="btn btn--line"
              onClick={() => setFilters({ ...emptyFilters, sort: filters.sort })}
            >
              Show all vacancies
            </button>
          </div>
        ) : (
          <div className="board__split">
            <div>
              <ul className="rows" aria-label="Vacancies">
                {results.slice(0, shown).map((j) => {
                  const on = selected?.ref === j.ref;
                  const s = status(j);
                  return (
                    <li key={j.ref} className={`row ${on ? "is-on" : ""}`}>
                      <button
                        type="button"
                        id={`row-${j.ref}`}
                        className="row__hit"
                        aria-current={on ? "true" : undefined}
                        onClick={() => open(j)}
                      >
                        <span className="row__ref cell">{j.ref}</span>
                        <span className="row__main">
                          <span className="row__title">{j.title}</span>
                          <span className="row__org">
                            {j.clientType} · {location(j)}
                          </span>
                        </span>
                        <span className="row__salary">{j.salary}</span>
                        <span className="row__meta">
                          <span className={`status is-${s.tone}`}>{s.label}</span>
                          <span className="row__days">
                            <span className="cell">{j.closesInDays}</span> {j.closesInDays === 1 ? "day" : "days"} left
                          </span>
                        </span>
                        <span className="row__posted">
                          {j.type} · Posted {postedLabel(j.postedDaysAgo).toLowerCase()}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              {results.length > shown && (
                <button type="button" className="more" onClick={() => setShown((n) => n + PAGE)}>
                  Show {Math.min(PAGE, results.length - shown)} more of {results.length - shown}
                  <ChevronDown size={18} aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="pane" ref={paneRef}>
              {selected && <JobDetail job={selected} onApply={onApply} />}
            </div>
          </div>
        )}
      </div>

      <dialog
        ref={sheetRef}
        className="jsheet"
        aria-label={sheetJob ? sheetJob.title : "Vacancy"}
        onClose={() => setSheetJob(null)}
      >
        {sheetJob && (
          <>
            <div className="jsheet__bar">
              <button type="button" className="jsheet__close" onClick={() => setSheetJob(null)}>
                <X size={22} aria-hidden="true" />
                <span className="sr-only">Back to vacancies</span>
              </button>
              <span className="cell">{sheetJob.ref}</span>
            </div>
            <JobDetail job={sheetJob} onApply={onApply} compact />
            <div className="jsheet__foot">
              <button
                type="button"
                className="btn btn--primary btn--lg btn--block"
                onClick={() => {
                  const j = sheetJob;
                  setSheetJob(null);
                  onApply(j);
                }}
              >
                Apply now
              </button>
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className={`field ${value ? "is-set" : ""}`}>
      <span className="field__label">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
      <ChevronDown size={16} aria-hidden="true" />
    </label>
  );
}
