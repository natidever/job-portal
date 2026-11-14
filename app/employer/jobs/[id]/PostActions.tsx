"use client";

import { useState, useTransition } from "react";
import { Loader2, Lock, PencilLine, Send, XCircle } from "lucide-react";
import { closePost, submitPost, type FormResult } from "../../actions";
import { Toast } from "../../Toast";

type Props = {
  id: string;
  status: "draft" | "pending" | "published" | "rejected" | "closed" | "expired";
  title: string;
  applicants: number;
  contactEmail: string;
};

export function PostActions({ id, status, title, applicants, contactEmail }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();
  const [toast, setToast] = useState<FormResult | null>(null);

  const run = (fn: () => Promise<FormResult>) =>
    start(async () => {
      const res = await fn();
      setToast(res);
      setConfirming(false);
    });

  return (
    <div className="em-board__actions">
      {status === "draft" && (
        <>
          <a href={`/employer/jobs/${id}/edit`} className="btn btn--white">
            <PencilLine size={17} aria-hidden="true" />
            Edit draft
          </a>
          <button type="button" className="btn btn--ghost-light" disabled={pending} onClick={() => run(() => submitPost(id))}>
            {pending ? <Loader2 size={17} className="em-spin" aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
            Submit for review
          </button>
        </>
      )}

      {(status === "published" || status === "expired") && !confirming && (
        <>
          <p className="em-lock">
            <Lock size={15} aria-hidden="true" />
            <span>
              {status === "expired" ? "The deadline has passed, so it’s off the board." : "Live posts are locked."}{" "}
              <a href={`mailto:${contactEmail}?subject=${encodeURIComponent(`Change to: ${title}`)}`}>Contact Righton</a> to
              change it.
            </span>
          </p>
          <button type="button" className="btn btn--ghost-light btn--sm" onClick={() => setConfirming(true)}>
            <XCircle size={16} aria-hidden="true" />
            Close early
          </button>
        </>
      )}

      {confirming && (
        <div className="em-confirm" role="group" aria-label="Confirm closing this post">
          <p>
            <b>Close this post now?</b> It leaves the board and stops taking applications.{" "}
            {applicants > 0 && `Your ${applicants} applicants stay here.`} This can’t be undone.
          </p>
          <button
            type="button"
            className="btn btn--white btn--sm"
            disabled={pending}
            onClick={() => run(() => closePost(id))}
            autoFocus
          >
            {pending && <Loader2 size={16} className="em-spin" aria-hidden="true" />}
            Yes, close it
          </button>
          <button type="button" className="btn btn--ghost-light btn--sm" disabled={pending} onClick={() => setConfirming(false)}>
            Keep it live
          </button>
        </div>
      )}

      {status === "pending" && (
        <p className="em-lock">
          <Lock size={15} aria-hidden="true" />
          <span>The Righton team is reviewing this post. It’s locked until they decide.</span>
        </p>
      )}

      {toast && <Toast result={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
