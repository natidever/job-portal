"use client";

import { useState } from "react";
import { Pause, Play, Quote } from "lucide-react";
import { employers, isPlaceholder, testimonials, type Testimonial } from "../data/landing";
import { marks } from "./TopEmployers";

/** Initials of the role a candidate was placed in, e.g. "Senior Accountant" -> "SA". */
const initials = (s: string) =>
  s
    .split(",")[0]
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

function Card({ t }: { t: Testimonial }) {
  const brand = t.kind === "client" && t.brand !== undefined ? employers[t.brand] : undefined;
  const Mark = brand ? marks[brand.mark] : null;
  return (
    <figure className={`tcard ${t.kind === "client" ? "is-client" : ""}`}>
      <Quote size={22} aria-hidden="true" className="tcard__q" />
      <blockquote className="tcard__quote">
        <p>{t.quote}</p>
      </blockquote>
      <figcaption className="tcard__who">
        {Mark ? (
          <span className="tcard__mark tcard__mark--brand" aria-hidden="true">
            <Mark size={22} strokeWidth={2} />
          </span>
        ) : (
          <span className="tcard__mark" aria-hidden="true">
            {initials(t.org)}
          </span>
        )}
        <span className="tcard__id">
          <span className="tcard__role">{t.role}</span>
          <span className="tcard__org">{t.org}</span>
        </span>
      </figcaption>
    </figure>
  );
}

function Row({ list, reverse }: { list: Testimonial[]; reverse?: boolean }) {
  return (
    <div className={`tmarquee ${reverse ? "tmarquee--rev" : ""}`}>
      <ul className="tmarquee__track">
        {list.map((t) => (
          <li key={t.quote}>
            <Card t={t} />
          </li>
        ))}
      </ul>
      {/* The duplicate makes the loop seamless; screen readers get each quote once. */}
      <ul className="tmarquee__track" aria-hidden="true">
        {list.map((t) => (
          <li key={t.quote}>
            <Card t={t} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Testimonials() {
  const [paused, setPaused] = useState(false);
  const half = Math.ceil(testimonials.length / 2);

  return (
    <section className={`voices ${paused ? "is-paused" : ""}`} id="stories" aria-labelledby="voices-title">
      <div className="container voices__head">
        <div>
          <h2 id="voices-title" className="h2">
            Hear what people are saying
          </h2>
          {isPlaceholder && <p className="voices__note">Sample testimonials for the design preview</p>}
        </div>
        <button
          type="button"
          className="brands__toggle"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
        >
          {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          {paused ? "Play" : "Pause"}
        </button>
      </div>
      <div className="voices__rows">
        <Row list={testimonials.slice(0, half)} />
        <Row list={testimonials.slice(half)} reverse />
      </div>
    </section>
  );
}
