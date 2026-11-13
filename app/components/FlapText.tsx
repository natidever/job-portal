"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Split-flap text: each character cycles through the drum and settles left to right,
 * like a flight-information display. With `cells`, every glyph sits in its own fixed
 * flap tile with a hinge line. Screen readers get the final text only; with reduced
 * motion the final text renders immediately.
 */
export function FlapText({
  text,
  delay = 0,
  className = "",
  cells = false,
}: {
  text: string;
  delay?: number;
  className?: string;
  cells?: boolean;
}) {
  const [shown, setShown] = useState(text);
  const first = useRef(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text);
      return;
    }
    let raf = 0;
    let start = 0;
    const perChar = cells ? 70 : 26; // ms between characters settling
    const spin = first.current ? 420 : 220; // drum time before the first character lands
    first.current = false;
    const tick = (t: number) => {
      if (!start) start = t;
      const elapsed = t - start - delay;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      let done = true;
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === " " || elapsed > spin + i * perChar) {
          out += ch;
        } else {
          done = false;
          out += GLYPHS[(Math.floor(elapsed / 45) + i * 7) % GLYPHS.length];
        }
      }
      setShown(out);
      if (!done) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay, cells]);

  return (
    <span className={`flap ${cells ? "flap--cells" : ""} ${className}`}>
      <span className="sr-only">{text}</span>
      {cells ? (
        <span className="flap__row" aria-hidden="true">
          {shown.split("").map((c, i) => (
            <span key={i} className="flap__c">
              {c}
            </span>
          ))}
        </span>
      ) : (
        <span aria-hidden="true">{shown}</span>
      )}
    </span>
  );
}
