"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { jobs, sectors, type Sector } from "../data/jobs";
import { sectorLabel, sectorPhoto } from "./sectorMeta";

const count = (s: Sector) => jobs.filter((j) => j.sector === s).length;

export function Sectors({ onPick }: { onPick: (s: Sector) => void }) {
  const [hover, setHover] = useState<Sector>("Engineering");
  const n = count(hover);

  return (
    <section className="dir" id="sectors" aria-labelledby="dir-title">
      <div className="container dir__grid">
        <div>
          <h2 id="dir-title" className="h2">
            Browse by sector
          </h2>
          <ul className="dir__list">
            {sectors.map((s) => {
              const c = count(s);
              return (
                <li key={s}>
                  <button
                    type="button"
                    className="dir__row"
                    onMouseEnter={() => setHover(s)}
                    onFocus={() => setHover(s)}
                    onClick={() => {
                      onPick(s);
                      document.getElementById("vacancies")?.scrollIntoView({ block: "start" });
                    }}
                  >
                    <span className="dir__name">{sectorLabel[s]}</span>
                    <span className="dir__rule" aria-hidden="true" />
                    <span className="dir__count cell">{String(c).padStart(2, "0")}</span>
                    <span className="sr-only">{c === 1 ? "open vacancy" : "open vacancies"}</span>
                    <ArrowRight size={18} aria-hidden="true" className="dir__arrow" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="dir__view" aria-hidden="true">
          {(Object.entries(sectorPhoto) as [Sector, { src: string; alt: string }][]).map(([s, p]) => (
            <figure key={s} className={`dir__layer ${hover === s ? "is-on" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt="" loading="lazy" />
              <figcaption>{sectorLabel[s]}</figcaption>
            </figure>
          ))}
          <div className={`dir__layer dir__sign ${sectorPhoto[hover] ? "" : "is-on"}`}>
            <span className="dir__sign-name">{sectorLabel[hover]}</span>
            <span className="dir__sign-count">
              <span className="cell">{String(n).padStart(2, "0")}</span>
              {n === 1 ? "open vacancy" : "open vacancies"}
            </span>
            <ArrowRight size={40} strokeWidth={1.5} className="dir__sign-arrow" />
          </div>
        </div>
      </div>
    </section>
  );
}
