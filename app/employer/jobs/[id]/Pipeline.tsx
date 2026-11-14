"use client";

import { Fragment, useOptimistic, useState, useTransition } from "react";
import { ArrowRight, FileText, Mail, Phone, RotateCcw, Undo2, X } from "lucide-react";
import { moveApplicant, type FormResult } from "../../actions";
import { NEXT_ACTION, nextStage, prevStage } from "@/lib/data/employer-rules";
import { STAGE_LABEL, STAGE_ORDER, type ApplicationStage } from "@/lib/status";
import { Toast } from "../../Toast";

export type PipelineApplicant = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  stage: ApplicationStage;
  isSeeker: boolean;
  applied: string; // preformatted on the server
  initials: string;
};

type Filter = "all" | ApplicationStage;

export function Pipeline({ applicants }: { applicants: PipelineApplicant[] }) {
  const [filter, setFilter] = useState<Filter>(() => (applicants.some((a) => a.stage === "new") ? "new" : "all"));
  const [list, applyMove] = useOptimistic(applicants, (cur, m: { id: string; to: ApplicationStage }) =>
    cur.map((a) => (a.id === m.id ? { ...a, stage: m.to } : a)),
  );
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, start] = useTransition();
  const [toast, setToast] = useState<{ result: FormResult; undo?: () => void } | null>(null);

  function move(a: PipelineApplicant, to: ApplicationStage, withUndo = true) {
    const from = a.stage;
    setBusyId(a.id);
    start(async () => {
      applyMove({ id: a.id, to });
      const res = await moveApplicant(a.id, to);
      setBusyId(null);
      setToast(
        res.ok
          ? {
              result: { ok: true, message: `${a.full_name} → ${STAGE_LABEL[to]}` },
              undo: withUndo ? () => move({ ...a, stage: to }, from, false) : undefined,
            }
          : { result: res },
      );
    });
  }

  const counts = Object.fromEntries(STAGE_ORDER.map((s) => [s, list.filter((a) => a.stage === s).length])) as Record<
    ApplicationStage,
    number
  >;
  const shown = filter === "all" ? list : list.filter((a) => a.stage === filter);
  const tabs: { key: Filter; label: string; n: number }[] = [
    { key: "all", label: "All", n: list.length },
    ...STAGE_ORDER.map((s) => ({ key: s as Filter, label: STAGE_LABEL[s], n: counts[s] })),
  ];

  return (
    <section className="em-panel" aria-labelledby="pipe-title">
      <div className="em-panel__head">
        <h2 id="pipe-title" className="em-h2">
          Applicants
        </h2>
        <span className="em-hint">CV links open for 60 seconds</span>
      </div>
      <div className="em-pipe" role="tablist" aria-label="Pipeline stages">
        {tabs.map((t, i) => (
          <Fragment key={t.key}>
            {(i === 1 || t.key === "rejected") && <span className="em-pipe__sep" aria-hidden="true" />}
            <button
              type="button"
              role="tab"
              aria-selected={filter === t.key}
              aria-controls="pipe-list"
              onClick={() => setFilter(t.key)}
            >
              <span className={`em-pipe__n ${t.n ? "" : "is-zero"}`}>{t.n}</span>
              <span className="em-pipe__l">{t.label}</span>
            </button>
          </Fragment>
        ))}
      </div>
      <div id="pipe-list" role="tabpanel">
        {shown.length === 0 ? (
          <div className="em-empty">
            <strong>{filter === "all" ? "No applicants yet" : `Nobody in ${STAGE_LABEL[filter as ApplicationStage]}`}</strong>
            <p>
              {filter === "all"
                ? "People who apply to this post will appear here, newest first."
                : "Move applicants forward from the previous stage and they’ll show up here."}
            </p>
          </div>
        ) : (
          <ul className="em-rows">
            {shown.map((a) => {
              const next = nextStage(a.stage);
              const prev = prevStage(a.stage);
              const busy = busyId === a.id;
              return (
                <li key={a.id} className={`em-app ${busy ? "is-busy" : ""} ${a.stage === "rejected" ? "is-rejected" : ""}`}>
                  <span className="em-mono" aria-hidden="true">
                    {a.initials}
                  </span>
                  <div>
                    <p className="em-app__name">
                      {a.full_name}
                      <span className={`em-st em-st--${a.stage}`}>{STAGE_LABEL[a.stage]}</span>
                    </p>
                    <p className="em-app__sub">
                      {a.isSeeker ? "Righton member" : "Guest applicant"} · applied {a.applied}
                    </p>
                  </div>
                  <div className="em-app__contact">
                    <a href={`mailto:${a.email}`}>
                      <Mail size={15} aria-hidden="true" />
                      <span>{a.email}</span>
                    </a>
                    <a href={`tel:${a.phone.replace(/\s/g, "")}`}>
                      <Phone size={15} aria-hidden="true" />
                      <span className="num">{a.phone}</span>
                    </a>
                  </div>
                  <div className="em-app__actions">
                    <a
                      className="btn btn--line btn--sm"
                      href={`/employer/cv/${a.id}`}
                      target="_blank"
                      rel="noopener"
                      aria-label={`View CV of ${a.full_name} (opens in a new tab)`}
                    >
                      <FileText size={16} aria-hidden="true" /> View CV
                    </a>
                    {next && (
                      <button type="button" className="btn btn--primary btn--sm" disabled={busy} onClick={() => move(a, next)}>
                        {NEXT_ACTION[a.stage]} <ArrowRight size={16} aria-hidden="true" />
                      </button>
                    )}
                    {a.stage === "rejected" && (
                      <button type="button" className="btn btn--line btn--sm" disabled={busy} onClick={() => move(a, "new")}>
                        <RotateCcw size={15} aria-hidden="true" /> Reconsider
                      </button>
                    )}
                    {prev && (
                      <button
                        type="button"
                        className="em-quiet"
                        disabled={busy}
                        onClick={() => move(a, prev)}
                        title={`Move back to ${STAGE_LABEL[prev]}`}
                      >
                        <Undo2 size={15} aria-hidden="true" /> Back
                      </button>
                    )}
                    {a.stage !== "rejected" && a.stage !== "hired" && (
                      <button type="button" className="em-quiet em-quiet--danger" disabled={busy} onClick={() => move(a, "rejected")}>
                        <X size={15} aria-hidden="true" /> Reject
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {toast && (
        <Toast
          result={toast.result}
          onDone={() => setToast(null)}
          action={toast.undo ? { label: "Undo", run: toast.undo } : undefined}
        />
      )}
    </section>
  );
}
