"use client";

import { useEffect, useRef, useState } from "react";
import { CircleAlert, FileText, Upload, X } from "lucide-react";
import { deadlineLabel, location, type Job } from "../data/jobs";
import { applyToJob } from "../actions/apply";

type Field = "name" | "phone" | "email" | "cv";
type Errors = Partial<Record<Field, string>>;

// Mirrors the checks in app/actions/apply.ts, which validates again on the server.
const ET_PHONE = /^(?:\+?251|0)?[79]\d{8}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CV_TYPES = [".pdf", ".doc", ".docx"];
const MAX_MB = 5;

export function ApplyDialog({ job, onClose }: { job: Job | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [phone, setPhone] = useState("");
  const [notice, setNotice] = useState<{ tone: "duplicate" | "error"; text: string } | null>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (job && !d.open) {
      setState("idle");
      setErrors({});
      setFile(null);
      setPhone("");
      setNotice(null);
      formRef.current?.reset();
      d.showModal();
      document.documentElement.classList.add("is-locked");
    } else if (!job && d.open) {
      d.close();
    }
  }, [job]);

  const close = () => {
    document.documentElement.classList.remove("is-locked");
    onClose();
  };

  const pickFile = (f: File | undefined | null) => {
    if (!f) return;
    const ext = f.name.slice(f.name.lastIndexOf(".")).toLowerCase();
    if (!CV_TYPES.includes(ext)) {
      setFile(null);
      setErrors((e) => ({ ...e, cv: "Upload your CV as a PDF or Word file (.pdf, .doc, .docx)." }));
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setFile(null);
      setErrors((e) => ({ ...e, cv: `That file is over ${MAX_MB} MB. Save a smaller PDF and try again.` }));
      return;
    }
    setFile(f);
    setErrors((e) => ({ ...e, cv: undefined }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!job || state === "sending") return;
    setNotice(null);
    const data = new FormData(e.currentTarget);
    const next: Errors = {};
    if (!String(data.get("name") || "").trim()) next.name = "Enter your full name.";
    if (!ET_PHONE.test(phone.replace(/[\s-]/g, "")))
      next.phone = "Enter an Ethiopian mobile number, e.g. 0911 234 567.";
    if (!EMAIL.test(String(data.get("email") || "").trim()))
      next.email = "Enter an email address like name@example.com.";
    if (!file) next.cv = errors.cv ?? "Attach your CV so Righton can review your application.";
    setErrors(next);
    const first = (Object.keys(next) as Field[])[0];
    if (first) {
      const target = first === "cv" ? "cv-input" : `apply-${first}`;
      document.getElementById(target)?.focus();
      return;
    }
    setState("sending");
    data.set("jobId", job.id);
    data.set("phone", phone);
    data.set("cv", file!);
    try {
      const res = await applyToJob(data);
      if (res.ok) return setState("sent");
      setState("idle");
      if (res.reason === "invalid") {
        setErrors(res.errors);
        const firstErr = (Object.keys(res.errors) as Field[])[0];
        if (firstErr) document.getElementById(firstErr === "cv" ? "cv-input" : `apply-${firstErr}`)?.focus();
      } else {
        setNotice({ tone: res.reason === "duplicate" ? "duplicate" : "error", text: res.message });
      }
    } catch {
      setState("idle");
      setNotice({ tone: "error", text: "We couldn't reach Righton. Check your connection and try again." });
    }
  };

  const err = (key: Field) => ({
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `apply-${key}-err` : undefined,
  });

  return (
    <dialog
      ref={dialogRef}
      className="apply"
      aria-labelledby="apply-title"
      onClose={close}
      onClick={(e) => {
        if (e.target === dialogRef.current) dialogRef.current?.close();
      }}
    >
      {job && (
        <div className="apply__inner">
          <header className="apply__head">
            <div>
              <p className="apply__ref">
                <span className="cell">{job.ref}</span>
                <span>
                  {location(job)} · Apply by {deadlineLabel(job.deadline)}
                </span>
              </p>
              <h2 id="apply-title" className="apply__title">
                {state === "sent" ? "Application received." : `Apply: ${job.title}`}
              </h2>
            </div>
            <button
              type="button"
              className="apply__close"
              aria-label="Close application"
              onClick={() => dialogRef.current?.close()}
            >
              <X size={20} aria-hidden="true" />
            </button>
          </header>

          <ol className="apply__rail" aria-label="Your progress">
            {["Apply", "Shortlist", "Interview"].map((n, i) => {
              const done = state === "sent" && i === 0;
              const current = i === (state === "sent" ? 1 : 0);
              return (
                <li key={n} className={done ? "is-done" : current ? "is-current" : ""}>
                  <span className="apply__gate cell" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span>{n}</span>
                  {current && <span className="sr-only"> (current step)</span>}
                  {done && <span className="sr-only"> (done)</span>}
                </li>
              );
            })}
          </ol>

          {state === "sent" ? (
            <div className="apply__sent" role="status">
              <p>
                Your application for <strong>{job.title}</strong> (Ref {job.ref}) has reached Righton.
              </p>
              <p>
                Our recruiters review applications against the client&rsquo;s requirements. If you
                are shortlisted, we will call you on <strong className="num">{phone}</strong>.
              </p>
              <button type="button" className="btn btn--primary" onClick={() => dialogRef.current?.close()}>
                Back to vacancies
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={onSubmit} noValidate className="form">
              <div className="fieldset">
                <label htmlFor="apply-name">Full name</label>
                <input id="apply-name" name="name" autoComplete="name" {...err("name")} />
                {errors.name && <p id="apply-name-err" className="field-error">{errors.name}</p>}
              </div>
              <div className="form__row">
                <div className="fieldset">
                  <label htmlFor="apply-phone">Phone</label>
                  <input
                    id="apply-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="0911 234 567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    {...err("phone")}
                  />
                  {errors.phone && <p id="apply-phone-err" className="field-error">{errors.phone}</p>}
                </div>
                <div className="fieldset">
                  <label htmlFor="apply-email">Email</label>
                  <input
                    id="apply-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    {...err("email")}
                  />
                  {errors.email && <p id="apply-email-err" className="field-error">{errors.email}</p>}
                </div>
              </div>

              <div className="fieldset">
                <span className="label" id="cv-label">CV</span>
                <label
                  className={`drop ${dragging ? "is-drag" : ""} ${file ? "has-file" : ""} ${errors.cv ? "has-error" : ""}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    pickFile(e.dataTransfer.files?.[0]);
                  }}
                >
                  <input
                    id="cv-input"
                    type="file"
                    name="cv"
                    accept={CV_TYPES.join(",")}
                    className="sr-only"
                    aria-labelledby="cv-label"
                    aria-describedby={errors.cv ? "apply-cv-err" : "cv-hint"}
                    aria-invalid={!!errors.cv}
                    onChange={(e) => pickFile(e.target.files?.[0])}
                  />
                  {file ? (
                    <>
                      <FileText size={22} aria-hidden="true" />
                      <span className="drop__main">{file.name}</span>
                      <span className="drop__hint num">
                        {file.size < 100 * 1024 ? `${Math.max(1, Math.round(file.size / 1024))} KB` : `${(file.size / 1024 / 1024).toFixed(1)} MB`} · tap to replace
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload size={22} aria-hidden="true" />
                      <span className="drop__main">Choose your CV or drop it here</span>
                      <span className="drop__hint" id="cv-hint">
                        PDF or Word, up to {MAX_MB} MB
                      </span>
                    </>
                  )}
                </label>
                {errors.cv && <p id="apply-cv-err" className="field-error">{errors.cv}</p>}
              </div>

              {notice && (
                <div className={`apply__alert is-${notice.tone}`} role="alert">
                  <CircleAlert size={18} aria-hidden="true" />
                  <p>{notice.text}</p>
                </div>
              )}

              <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={state === "sending"}>
                {state === "sending" ? "Sending application…" : "Send application"}
              </button>
            </form>
          )}
        </div>
      )}
    </dialog>
  );
}
