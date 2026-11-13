"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, BadgeCheck, FileSearch, Send, Smartphone, Wallet } from "lucide-react";
import { benefits, isPlaceholder, stats } from "../data/landing";
import { contact } from "../data/contact";
import { FlapText } from "./FlapText";

const icons = [Smartphone, BadgeCheck, FileSearch, Wallet];

export function Promotion() {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  // The figures flap into place the first time they scroll into view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="promo" aria-labelledby="promo-title">
      <div className="container">
        <header className="promo__head">
          <h2 id="promo-title" className="promo__title">
            Find work. Get shortlisted. <span className="promo__accent">Start sooner.</span>
          </h2>
          <p className="promo__lede">
            Righton publishes real vacancies from the companies it recruits for, and a recruiter reads
            every application. Find a role that fits and apply in minutes.
          </p>
        </header>

        <div className="promo__grid">
          <ul className="promo__list">
            {benefits.map((b, i) => {
              const Icon = icons[i];
              return (
                <li key={b.title} className="perk">
                  <Icon size={24} strokeWidth={1.75} aria-hidden="true" className="perk__icon" />
                  <div>
                    <h3 className="perk__title">{b.title}</h3>
                    <p className="perk__body">{b.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="promo__side" ref={ref}>
            <dl className="figs">
              {stats.map((s, i) => (
                <div key={s.label} className="fig">
                  <dt className="fig__label">{s.label}</dt>
                  <dd className="fig__value">
                    {seen ? (
                      <FlapText text={String(s.value)} cells delay={i * 160} className="fig__cells" />
                    ) : (
                      <span className="flap flap--cells fig__cells">
                        <span className="sr-only">{s.value}</span>
                        <span className="flap__row" aria-hidden="true">
                          {String(s.value)
                            .split("")
                            .map((_, k) => (
                              <span key={k} className="flap__c">
                                {" "}
                              </span>
                            ))}
                        </span>
                      </span>
                    )}
                    {s.suffix && <span className="fig__suffix">{s.suffix}</span>}
                  </dd>
                </div>
              ))}
            </dl>
            {isPlaceholder && <p className="figs__note">Placeholder figures for the design preview</p>}

            <div className="cta">
              <p className="cta__title">Ready for your next role?</p>
              <p className="cta__body">New vacancies are published every week across eight sectors.</p>
              <div className="cta__actions">
                <a href="/jobs" className="btn btn--white btn--lg">
                  Start looking
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
                <a href={contact.telegramHref} className="btn btn--ghost-light btn--lg">
                  <Send size={17} aria-hidden="true" />
                  Get alerts
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
