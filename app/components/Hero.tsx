"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { cities, isSample, jobs, latest, sectors, status, type Filters, type Sector } from "../data/jobs";
import { sectorLabel } from "./sectorMeta";
import { FlapText } from "./FlapText";

const rows = latest(5);

function useAddisClock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Addis_Ababa",
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function Hero({
  filters,
  onSearch,
  onOpen,
}: {
  filters: Filters;
  onSearch: (f: Partial<Filters>) => void;
  onOpen: (ref: string) => void;
}) {
  const clock = useAddisClock();
  const [q, setQ] = useState(filters.q);
  const [city, setCity] = useState(filters.city);
  const [sector, setSector] = useState<Sector | "">(filters.sector);

  useEffect(() => {
    setQ(filters.q);
    setCity(filters.city);
    setSector(filters.sector);
  }, [filters.q, filters.city, filters.sector]);

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__grid">
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__title">
            Real vacancies,
            <br />
            open now.
          </h1>
          <p className="hero__lede">
            Righton publishes every opening its client companies send, across Ethiopia. Read the
            full brief, see the salary and deadline, and apply with your CV in minutes. No account
            needed.
          </p>
          <div className="hero__actions">
            <a href="#vacancies" className="btn btn--primary btn--lg">
              Find work
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href="#employers" className="btn btn--line btn--lg">
              Hire through Righton
            </a>
          </div>
        </div>

        <div className="hero__stage">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hero__photo"
            src="/images/hero/logistics.jpg"
            alt="A long, brightly lit warehouse aisle between tall racks of stock"
            fetchPriority="high"
          />

          <div className="fids" role="region" aria-labelledby="fids-title">
            <div className="fids__head">
              <h2 id="fids-title" className="fids__title">
                Openings
              </h2>
              <p className="fids__meta">
                {isSample && <span className="fids__sample">Sample listings</span>}
                <span>Addis Ababa</span>
                <span className="fids__clock" aria-label={clock ? `Local time ${clock}` : undefined}>
                  {clock ?? "--:--"}
                </span>
              </p>
            </div>
            <table className="fids__table">
              <thead>
                <tr>
                  <th scope="col">Ref</th>
                  <th scope="col">Position</th>
                  <th scope="col" className="fids__city">City</th>
                  <th scope="col">Closes</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((j, i) => {
                  const s = status(j);
                  return (
                    <tr key={j.ref}>
                      <td className="fids__ref">
                        <FlapText text={j.ref.replace("RT-", "")} delay={i * 110} cells />
                      </td>
                      <td className="fids__pos">
                        <button type="button" onClick={() => onOpen(j.ref)}>
                          <FlapText text={j.title.toUpperCase()} delay={i * 110 + 60} />
                        </button>
                      </td>
                      <td className="fids__city">
                        <FlapText text={j.city.toUpperCase()} delay={i * 110 + 120} />
                      </td>
                      <td className="fids__closes">
                        <FlapText text={String(j.closesInDays).padStart(2, "0")} delay={i * 110 + 160} cells />
                        <span className="fids__unit">days</span>
                      </td>
                      <td>
                        <span className={`fids__status is-${s.tone}`}>
                          <FlapText text={s.label.toUpperCase()} delay={i * 110 + 200} />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <a href="#vacancies" className="fids__all">
              All {jobs.length} {isSample ? "sample " : ""}vacancies
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <form
        className="kiosk"
        role="search"
        aria-label="Search vacancies"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch({ q, city, sector });
          document.getElementById("vacancies")?.scrollIntoView({ block: "start" });
        }}
      >
        <label className="kiosk__field kiosk__field--q">
          <span className="kiosk__label">What</span>
          <input
            type="search"
            placeholder="Job title, skill or Ref"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            enterKeyHint="search"
          />
        </label>
        <label className="kiosk__field">
          <span className="kiosk__label">Where</span>
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="kiosk__field">
          <span className="kiosk__label">Sector</span>
          <select value={sector} onChange={(e) => setSector(e.target.value as Sector | "")}>
            <option value="">All sectors</option>
            {sectors.map((s) => (
              <option key={s} value={s}>
                {sectorLabel[s]}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="kiosk__go">
          <Search size={20} aria-hidden="true" />
          Search
        </button>
      </form>
    </section>
  );
}
