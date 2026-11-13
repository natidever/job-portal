"use client";

import { useState } from "react";
import {
  Building2,
  Coffee,
  Factory,
  Globe2,
  Grape,
  Landmark,
  Leaf,
  Mountain,
  Package,
  Pause,
  Play,
  Plane,
  ShieldPlus,
  Waves,
  Zap,
  type LucideProps,
} from "lucide-react";
import { employers, isPlaceholder, type Employer } from "../data/landing";

export const marks: Record<Employer["mark"], React.ComponentType<LucideProps>> = {
  bank: Landmark,
  box: Package,
  plane: Plane,
  leaf: Leaf,
  bolt: Zap,
  cup: Coffee,
  globe: Globe2,
  mountain: Mountain,
  wave: Waves,
  shield: ShieldPlus,
  factory: Factory,
  grape: Grape,
};

function Logo({ e }: { e: Employer }) {
  if (e.logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="brand__img" src={e.logo} alt={e.name} />;
  }
  const Mark = marks[e.mark] ?? Building2;
  return (
    <span className={`brand brand--${e.style}`}>
      <Mark className="brand__mark" strokeWidth={e.style === "light" ? 1.5 : 2.25} aria-hidden="true" />
      <span className="brand__name">{e.name}</span>
    </span>
  );
}

function Row({ list, reverse }: { list: Employer[]; reverse?: boolean }) {
  return (
    <div className={`marquee ${reverse ? "marquee--rev" : ""}`}>
      <ul className="marquee__track">
        {list.map((e) => (
          <li key={e.name}>
            <Logo e={e} />
          </li>
        ))}
      </ul>
      {/* The duplicate makes the loop seamless; screen readers get the list once. */}
      <ul className="marquee__track" aria-hidden="true">
        {list.map((e) => (
          <li key={e.name}>
            <Logo e={e} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TopEmployers() {
  const [paused, setPaused] = useState(false);
  const half = Math.ceil(employers.length / 2);

  return (
    <section className={`brands ${paused ? "is-paused" : ""}`} aria-labelledby="brands-title">
      <div className="container brands__head">
        <h2 id="brands-title" className="brands__title">
          Top employers hiring through Righton
        </h2>
        <div className="brands__meta">
          {isPlaceholder && <p className="brands__note">Placeholder logos for the design preview</p>}
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
      </div>
      <div className="brands__rows">
        <Row list={employers.slice(0, half)} />
        <Row list={employers.slice(half)} reverse />
      </div>
    </section>
  );
}
