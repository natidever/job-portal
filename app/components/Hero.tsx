"use client";

import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import type { Lookup } from "../data/jobs";
import { isPlaceholder, stats } from "../data/landing";
import { FlapText } from "./FlapText";

const [placed, clients, shortlist] = stats;

const toJobs = (f: { q?: string; city?: string; category?: string }) => {
  const p = new URLSearchParams(Object.entries(f).filter(([, v]) => v) as [string, string][]);
  const qs = p.toString();
  return `/jobs${qs ? `?${qs}` : ""}`;
};

export function Hero({ cities, categories }: { cities: Lookup[]; categories: Lookup[] }) {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__grid">
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__title">
            The right people,
            <br />
            in the right roles.
          </h1>
          <p className="hero__lede">
            Righton is a recruitment agency placing professionals with companies across Ethiopia.
            Find a vacancy and apply with your CV in minutes, or tell us who you need to hire.
          </p>
          <div className="hero__actions">
            <a href="/jobs" className="btn btn--primary btn--lg">
              Find work
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href="#employers" className="btn btn--line btn--lg">
              Hire through Righton
            </a>
          </div>
        </div>

        <div className="stage" role="group" aria-label="Righton at a glance">
          <span className="stage__disc" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="stage__obj stage__obj--case" src="/images/3d/suitcase.webp" alt="" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="stage__obj stage__obj--pin" src="/images/3d/pin.webp" alt="" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="stage__obj stage__obj--cv" src="/images/3d/cv.webp" alt="" aria-hidden="true" />

          <div className="chip chip--new">
            <span className="chip__dot" aria-hidden="true" />
            <span className="chip__text">
              <span className="chip__lead chip__lead--row">
                <FlapText text={String(placed.value)} cells className="chip__cells" />
                <span>
                  {placed.suffix}&nbsp;{placed.label.toLowerCase()}
                </span>
              </span>
              <span className="chip__sub">{placed.note}</span>
            </span>
          </div>

          <div className="chip chip--closing">
            <span className="chip__dot chip__dot--amber" aria-hidden="true" />
            <span className="chip__text">
              <span className="chip__lead chip__lead--row">
                First shortlist in
                <FlapText text={String(shortlist.value)} cells className="chip__cells" />
                hours
              </span>
              <span className="chip__sub">{shortlist.note}</span>
            </span>
          </div>

          <div className="chip chip--count">
            <span className="chip__dot" aria-hidden="true" />
            <span className="chip__text">
              <span className="chip__lead chip__lead--row">
                <FlapText text={String(clients.value)} cells className="chip__cells" />
                <span>{clients.suffix}&nbsp;client companies</span>
              </span>
              <span className="chip__sub">{isPlaceholder ? "Placeholder figures" : clients.note}</span>
            </span>
          </div>
        </div>
      </div>

      <form
        className="kiosk"
        role="search"
        aria-label="Search vacancies"
        onSubmit={(e) => {
          e.preventDefault();
          window.location.assign(toJobs({ q, city, category }));
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
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="kiosk__field">
          <span className="kiosk__label">Sector</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All sectors</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
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
