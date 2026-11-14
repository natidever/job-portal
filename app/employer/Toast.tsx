"use client";

import { useEffect, useRef } from "react";
import type { FormResult } from "./actions";

/** A short status message at the bottom of the screen, announced politely. */
export function Toast({
  result,
  onDone,
  action,
}: {
  result: FormResult;
  onDone: () => void;
  action?: { label: string; run: () => void };
}) {
  const done = useRef(onDone);
  done.current = onDone;
  const hasAction = Boolean(action);
  useEffect(() => {
    const t = setTimeout(() => done.current(), hasAction ? 6000 : 4500);
    return () => clearTimeout(t);
  }, [result, hasAction]);

  return (
    <div className={`em-toast ${result.ok ? "" : "is-error"}`} role="status" aria-live="polite">
      <span>{result.message}</span>
      {action && (
        <button
          type="button"
          onClick={() => {
            action.run();
            onDone();
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
