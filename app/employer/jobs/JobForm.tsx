"use client";

import { useRef, useState, useTransition, type ReactNode } from "react";
import { AlertCircle, Check, Loader2, Plus, Send, X } from "lucide-react";
import { saveJob, type FormResult } from "../actions";
import { EXPERIENCE_OPTIONS, JOB_TYPE_OPTIONS, WORKPLACE_OPTIONS } from "@/lib/data/employer-options";

export type JobFormValues = {
  id?: string;
  title: string;
  category_id: string;
  city_id: string;
  area: string;
  job_type: string;
  workplace_type: string;
  experience_level: string;
  positions: number;
  salary_min: number | null;
  salary_max: number | null;
  salary_note: string;
  description: string;
  qualification: string;
  experience: string;
  duties: string[];
  deadline: string;
};

type Opt = { id: string; name: string };

const LABELS: Record<string, string> = {
  company: "Company",
  contact_name: "Your name",
  phone: "Phone",
  email: "Email",
  title: "Job title",
  category_id: "Category",
  city_id: "City",
  job_type: "Job type",
  workplace_type: "Workplace",
  experience_level: "Experience level",
  positions: "Positions",
  salary_min: "Minimum salary",
  salary_max: "Maximum salary",
  description: "Description",
  qualification: "Qualification",
  duties: "Duties",
  deadline: "Deadline",
};

export function Err({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p className="em-err" id={`${id}-err`}>
      <AlertCircle size={15} aria-hidden="true" />
      {msg}
    </p>
  );
}

export function JobForm({
  initial,
  categories,
  cities,
  minDeadline,
  mode,
  lead,
  action = saveJob,
}: {
  initial: JobFormValues;
  categories: Opt[];
  cities: Opt[];
  minDeadline: string;
  /** "request": the public vacancy request. One send button, no drafts, success shown in place. */
  mode: "new" | "draft" | "rejected" | "request";
  /** Extra fields rendered above the role, e.g. the requester's contact details. */
  lead?: (errors: Record<string, string>) => ReactNode;
  action?: (fd: FormData) => Promise<FormResult>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, start] = useTransition();
  const [busy, setBusy] = useState<"draft" | "submit" | null>(null);
  const [result, setResult] = useState<FormResult | null>(null);
  const [duties, setDuties] = useState<{ key: number; text: string }[]>(() =>
    (initial.duties.length ? initial.duties : [""]).map((text, key) => ({ key, text })),
  );
  const nextKey = useRef(duties.length);
  const errors = result && !result.ok ? result.errors : {};

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const fd = new FormData(e.currentTarget, submitter);
    const intent = fd.get("intent") === "submit" ? "submit" : "draft";
    setBusy(intent);
    start(async () => {
      const res = await action(fd); // saveJob redirects on success
      setResult(res);
      setBusy(null);
      if (!res.ok) {
        requestAnimationFrame(() => {
          const first = Object.keys(res.errors)[0];
          const el = first ? formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`) : null;
          if (el) el.focus();
          else formRef.current?.querySelector<HTMLElement>(".em-errsum")?.focus();
        });
      }
    });
  }

  const isRequest = mode === "request";

  if (isRequest && result?.ok) {
    return (
      <div className="em-sec sent" role="status">
        <span className="sent__mark" aria-hidden="true">
          <Check size={26} strokeWidth={2.5} />
        </span>
        <h3>Vacancy received.</h3>
        <p>{result.message}</p>
        <a href="/" className="btn btn--line">
          Back to Righton
        </a>
      </div>
    );
  }

  const inv = (k: string) => (errors[k] ? { "aria-invalid": true, "aria-describedby": `${k}-err` } : {});

  const submitLabel = mode === "request" ? "Send vacancy to Righton" : mode === "rejected" ? "Resubmit for review" : "Submit for review";
  const draftLabel = mode === "rejected" ? "Save changes" : "Save draft";

  return (
    <form ref={formRef} className="em-form" onSubmit={onSubmit} noValidate>
      {initial.id && <input type="hidden" name="id" value={initial.id} />}

      {result && !result.ok && (
        <div className="em-errsum" role="alert" tabIndex={-1}>
          <strong>
            <AlertCircle size={18} aria-hidden="true" />
            {result.message}
          </strong>
          {Object.keys(errors).length > 0 && (
            <ul>
              {Object.entries(errors).map(([k, v]) => (
                <li key={k}>
                  <a href={`#f-${k}`}>{LABELS[k] ?? k}</a>: {v}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {lead?.(errors)}

      <section className="em-sec" aria-labelledby="s-role">
        <div className="em-sec__head">
          <h2 id="s-role" className="em-h2">
            The role
          </h2>
          <p>The basics job seekers scan first.</p>
        </div>
        <div className="em-field">
          <label htmlFor="f-title">Job title</label>
          <input
            id="f-title"
            name="title"
            className="em-input"
            defaultValue={initial.title}
            placeholder="e.g. Senior accountant"
            maxLength={120}
            autoComplete="off"
            {...inv("title")}
          />
          <Err id="title" msg={errors.title} />
        </div>
        <div className="em-cols">
          <div className="em-field">
            <label htmlFor="f-category_id">Category</label>
            <select id="f-category_id" name="category_id" className="em-input" defaultValue={initial.category_id} {...inv("category_id")}>
              <option value="">Choose a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Err id="category_id" msg={errors.category_id} />
          </div>
          <div className="em-field">
            <label htmlFor="f-positions">Positions</label>
            <input
              id="f-positions"
              name="positions"
              type="number"
              inputMode="numeric"
              min={1}
              max={500}
              className="em-input"
              defaultValue={initial.positions}
              {...inv("positions")}
            />
            <Err id="positions" msg={errors.positions} />
          </div>
        </div>
        <fieldset className="em-field" id="f-experience_level">
          <legend>Experience level</legend>
          <div className="em-seg">
            {EXPERIENCE_OPTIONS.map((o) => (
              <label key={o.value}>
                <input type="radio" name="experience_level" value={o.value} defaultChecked={initial.experience_level === o.value} />
                <span>
                  {o.label}
                  <small>{o.hint}</small>
                </span>
              </label>
            ))}
          </div>
          <Err id="experience_level" msg={errors.experience_level} />
        </fieldset>
        <fieldset className="em-field" id="f-job_type">
          <legend>Job type</legend>
          <div className="em-seg">
            {JOB_TYPE_OPTIONS.map((o) => (
              <label key={o.value}>
                <input type="radio" name="job_type" value={o.value} defaultChecked={initial.job_type === o.value} />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
          <Err id="job_type" msg={errors.job_type} />
        </fieldset>
      </section>

      <section className="em-sec" aria-labelledby="s-where">
        <div className="em-sec__head">
          <h2 id="s-where" className="em-h2">
            Where
          </h2>
        </div>
        <div className="em-cols">
          <div className="em-field">
            <label htmlFor="f-city_id">City</label>
            <select id="f-city_id" name="city_id" className="em-input" defaultValue={initial.city_id} {...inv("city_id")}>
              <option value="">Choose a city</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Err id="city_id" msg={errors.city_id} />
          </div>
          <div className="em-field">
            <label htmlFor="f-area">
              Area <span className="em-opt">optional</span>
            </label>
            <input id="f-area" name="area" className="em-input" defaultValue={initial.area} placeholder="e.g. Bole" maxLength={80} />
          </div>
        </div>
        <fieldset className="em-field" id="f-workplace_type">
          <legend>Workplace</legend>
          <div className="em-seg">
            {WORKPLACE_OPTIONS.map((o) => (
              <label key={o.value}>
                <input type="radio" name="workplace_type" value={o.value} defaultChecked={initial.workplace_type === o.value} />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
          <Err id="workplace_type" msg={errors.workplace_type} />
        </fieldset>
      </section>

      <section className="em-sec" aria-labelledby="s-pay">
        <div className="em-sec__head">
          <h2 id="s-pay" className="em-h2">
            Monthly salary <span className="em-opt">optional</span>
          </h2>
          <p>Posts that show a salary range get more serious applicants. Leave both empty to keep it private.</p>
        </div>
        <div className="em-cols">
          <div className="em-field">
            <label htmlFor="f-salary_min">From</label>
            <div className="em-affix">
              <span aria-hidden="true">ETB</span>
              <input
                id="f-salary_min"
                name="salary_min"
                inputMode="numeric"
                className="em-input"
                defaultValue={initial.salary_min ?? ""}
                placeholder="18,000"
                {...inv("salary_min")}
              />
            </div>
            <Err id="salary_min" msg={errors.salary_min} />
          </div>
          <div className="em-field">
            <label htmlFor="f-salary_max">To</label>
            <div className="em-affix">
              <span aria-hidden="true">ETB</span>
              <input
                id="f-salary_max"
                name="salary_max"
                inputMode="numeric"
                className="em-input"
                defaultValue={initial.salary_max ?? ""}
                placeholder="25,000"
                {...inv("salary_max")}
              />
            </div>
            <Err id="salary_max" msg={errors.salary_max} />
          </div>
        </div>
        <div className="em-field">
          <label htmlFor="f-salary_note">
            Salary note <span className="em-opt">optional</span>
          </label>
          <input
            id="f-salary_note"
            name="salary_note"
            className="em-input"
            defaultValue={initial.salary_note}
            placeholder="e.g. + commission, or negotiable"
            maxLength={120}
          />
        </div>
      </section>

      <section className="em-sec" aria-labelledby="s-details">
        <div className="em-sec__head">
          <h2 id="s-details" className="em-h2">
            About the job
          </h2>
          <p>Keep contact details out of the post. Applicants apply through Righton, and the team will ask you to remove them.</p>
        </div>
        <div className="em-field">
          <label htmlFor="f-description">Description</label>
          <textarea
            id="f-description"
            name="description"
            className="em-input"
            defaultValue={initial.description}
            rows={6}
            maxLength={6000}
            placeholder="What the team does, who this person works with, and why the role matters."
            {...inv("description")}
          />
          <Err id="description" msg={errors.description} />
        </div>
        <div className="em-field">
          <label htmlFor="f-qualification">Qualification</label>
          <input
            id="f-qualification"
            name="qualification"
            className="em-input"
            defaultValue={initial.qualification}
            maxLength={3000}
            placeholder="e.g. BA in Accounting or a related field"
            {...inv("qualification")}
          />
          <Err id="qualification" msg={errors.qualification} />
        </div>
        <div className="em-field">
          <label htmlFor="f-experience">
            Experience <span className="em-opt">optional</span>
          </label>
          <textarea
            id="f-experience"
            name="experience"
            className="em-input"
            defaultValue={initial.experience}
            rows={3}
            maxLength={3000}
            placeholder="e.g. 3+ years in a similar role, ideally in fintech"
          />
        </div>
        <fieldset className="em-field" id="f-duties">
          <legend>Duties</legend>
          <p className="em-hint">One responsibility per line. Start each with a verb, like “Prepare monthly reports”.</p>
          <ol className="em-duties">
            {duties.map((d, i) => (
              <li key={d.key}>
                <span className="cell" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <input
                  name="duties"
                  className="em-input"
                  aria-label={`Duty ${i + 1}`}
                  defaultValue={d.text}
                  maxLength={300}
                  placeholder={i === 0 ? "e.g. Prepare monthly financial statements" : "Another duty"}
                  {...(errors.duties && i === 0 ? { "aria-invalid": true, "aria-describedby": "duties-err" } : {})}
                />
                <button
                  type="button"
                  className="em-icon-btn"
                  aria-label={`Remove duty ${i + 1}`}
                  onClick={() => setDuties((list) => (list.length > 1 ? list.filter((x) => x.key !== d.key) : [{ key: nextKey.current++, text: "" }]))}
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ol>
          {duties.length < 20 && (
            <button
              type="button"
              className="em-add"
              onClick={() => {
                setDuties((list) => [...list, { key: nextKey.current++, text: "" }]);
                requestAnimationFrame(() => {
                  const all = formRef.current?.querySelectorAll<HTMLInputElement>('input[name="duties"]');
                  all?.[all.length - 1]?.focus();
                });
              }}
            >
              <Plus size={16} aria-hidden="true" /> Add a duty
            </button>
          )}
          <Err id="duties" msg={errors.duties} />
        </fieldset>
      </section>

      <section className="em-sec" aria-labelledby="s-deadline">
        <div className="em-sec__head">
          <h2 id="s-deadline" className="em-h2">
            Deadline
          </h2>
          <p>The last day people can apply. The post leaves the board after this date.</p>
        </div>
        <div className="em-cols">
          <div className="em-field">
            <label htmlFor="f-deadline">Apply by</label>
            <input
              id="f-deadline"
              name="deadline"
              type="date"
              min={minDeadline}
              className="em-input"
              defaultValue={initial.deadline}
              {...inv("deadline")}
            />
            <Err id="deadline" msg={errors.deadline} />
          </div>
        </div>
      </section>

      <div className="em-actionbar">
        <div className="em-actionbar__in">
          <p className="em-actionbar__note">
            {isRequest
              ? "A Righton recruiter will call you to confirm the details before the vacancy is published."
              : mode === "rejected"
                ? "Resubmitting sends it back to the Righton team and clears their note."
                : "Drafts are private. Submitting sends the post to the Righton team for review."}
          </p>
          <div className="em-actionbar__btns">
            {!isRequest && (
              <button type="submit" name="intent" value="draft" className="btn btn--line" disabled={pending}>
                {busy === "draft" && <Loader2 size={18} className="em-spin" aria-hidden="true" />}
                {busy === "draft" ? "Saving…" : draftLabel}
              </button>
            )}
            <button type="submit" name="intent" value="submit" className="btn btn--primary" disabled={pending}>
              {busy === "submit" ? <Loader2 size={18} className="em-spin" aria-hidden="true" /> : <Send size={17} aria-hidden="true" />}
              {busy === "submit" ? "Sending…" : submitLabel}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
