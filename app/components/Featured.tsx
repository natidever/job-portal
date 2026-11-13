"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Clock,
  Send,
  TrendingUp,
  Users,
} from "lucide-react";
import { experienceShort, isSample, jobs, monogram, postedLabel, type Job } from "../data/jobs";
import { featuredRefs } from "../data/landing";
import { contact } from "../data/contact";
import { sectorLabel } from "./sectorMeta";
import { useSaved } from "./useSaved";

const featured = featuredRefs
  .map((r) => jobs.find((j) => j.ref === r))
  .filter((j): j is Job => Boolean(j));

export function Featured() {
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const { saved, toggle } = useSaved();
  const count = featured.length + 1; // + the "Browse more" slot

  // The dot follows whichever card sits nearest the start of the track.
  const onScroll = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const items = Array.from(el.children) as HTMLElement[];
    const left = el.scrollLeft;
    let best = 0;
    let dist = Infinity;
    items.forEach((it, i) => {
      const d = Math.abs(it.offsetLeft - el.offsetLeft - left);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const go = (i: number) => {
    const el = track.current;
    const item = el?.children[Math.max(0, Math.min(count - 1, i))] as HTMLElement | undefined;
    if (!el || !item) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: item.offsetLeft - el.offsetLeft, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section className="feat" id="featured" aria-labelledby="feat-title">
      <div className="container">
        <div className="feat__head">
          <div>
            <h2 id="feat-title" className="h2">
              Featured jobs
            </h2>
            {isSample && <p className="feat__note">Sample listings for the design preview</p>}
          </div>
          <div className="feat__nav">
            <a href="/jobs" className="feat__all">
              All vacancies
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <button
              type="button"
              className="feat__arrow"
              onClick={() => go(active - 1)}
              disabled={active === 0}
              aria-label="Previous jobs"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="feat__arrow"
              onClick={() => go(active + 1)}
              disabled={active >= count - 1}
              aria-label="Next jobs"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <ul className="feat__track" ref={track} aria-label="Featured vacancies">
        {featured.map((j, i) => {
          const exp = experienceShort(j);
          const isSaved = saved.has(j.ref);
          return (
            <li key={j.ref} className="fcard" aria-label={`${i + 1} of ${count}`}>
              <div className="fcard__top">
                <span className="fcard__flag">Featured</span>
                <button
                  type="button"
                  className={`fcard__save ${isSaved ? "is-on" : ""}`}
                  aria-pressed={isSaved}
                  aria-label={isSaved ? `Remove ${j.title} from saved` : `Save ${j.title}`}
                  onClick={() => toggle(j.ref)}
                >
                  <Bookmark size={20} aria-hidden="true" />
                </button>
              </div>

              <div className="fcard__id">
                <span className="fcard__mono" aria-hidden="true">
                  {monogram(j)}
                </span>
                <div className="fcard__who">
                  <h3 className="fcard__title">
                    <a href={`/jobs?ref=${j.ref}`}>{j.title}</a>
                  </h3>
                  <p className="fcard__org">
                    {j.clientType} · {j.city}
                  </p>
                </div>
              </div>

              <p className="fcard__time">
                <span className={j.closesInDays <= 5 ? "is-soon" : ""}>
                  <span className="cell">{j.closesInDays}</span> days left
                </span>
                <span aria-hidden="true" className="fcard__sep" />
                <span>Posted {postedLabel(j.postedDaysAgo).toLowerCase()}</span>
              </p>

              <ul className="fcard__tags" aria-label="Job details">
                <li>
                  <BriefcaseBusiness size={14} aria-hidden="true" />
                  {sectorLabel[j.sector].split(" & ")[0]}
                </li>
                <li>
                  <Clock size={14} aria-hidden="true" />
                  {j.type}
                </li>
                {exp && (
                  <li>
                    <TrendingUp size={14} aria-hidden="true" />
                    {exp}
                  </li>
                )}
                <li>
                  <Users size={14} aria-hidden="true" />
                  {j.positions} {j.positions === 1 ? "position" : "positions"}
                </li>
              </ul>

              <p className="fcard__desc">
                {j.qualification}. {j.duties[0]}.
              </p>

              <div className="fcard__foot">
                <span className="fcard__salary">{j.salary}</span>
                <a href={`/jobs?ref=${j.ref}`} className="fcard__go" aria-label={`View and apply: ${j.title}`}>
                  View &amp; apply
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </div>
            </li>
          );
        })}

        <li className="fcard fcard--more" aria-label={`${count} of ${count}`}>
          <h3 className="fcard__more-title">Discover more</h3>
          <ul className="fcard__links">
            <li>
              <a href="/jobs">
                All vacancies
                <ChevronRight size={18} aria-hidden="true" />
              </a>
            </li>
            <li>
              <a href="/jobs?sort=closing">
                Closing soon
                <ChevronRight size={18} aria-hidden="true" />
              </a>
            </li>
            <li>
              <a href={contact.telegramHref}>
                <span>
                  <Send size={16} aria-hidden="true" /> Job alerts on Telegram
                </span>
                <ChevronRight size={18} aria-hidden="true" />
              </a>
            </li>
          </ul>
        </li>
      </ul>

      <div className="feat__dots" role="group" aria-label="Choose a featured job">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            className={i === active ? "is-on" : ""}
            aria-label={`Go to card ${i + 1}`}
            aria-current={i === active ? "true" : undefined}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </section>
  );
}
