"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "righton:saved";

/** Saved vacancies, remembered in this browser only (a per-visitor convenience). */
export function useSaved() {
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setSaved(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* storage unavailable: start empty */
    }
  }, []);

  const toggle = useCallback((ref: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(ref)) next.delete(ref);
      else next.add(ref);
      try {
        window.localStorage.setItem(KEY, JSON.stringify([...next]));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return { saved, toggle };
}
