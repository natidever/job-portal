"use client";

import { Err, JobForm, type JobFormValues } from "@/app/employer/jobs/JobForm";
import { requestVacancy } from "./actions";

type Opt = { id: string; name: string };

function Field({
  name,
  label,
  errors,
  optional,
  ...input
}: { name: string; label: string; errors: Record<string, string>; optional?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="em-field">
      <label htmlFor={`f-${name}`}>
        {label} {optional && <span className="em-opt">optional</span>}
      </label>
      <input
        id={`f-${name}`}
        name={name}
        className="em-input"
        {...input}
        {...(errors[name] ? { "aria-invalid": true, "aria-describedby": `${name}-err` } : {})}
      />
      <Err id={name} msg={errors[name]} />
    </div>
  );
}

export function VacancyForm(props: { initial: JobFormValues; categories: Opt[]; cities: Opt[]; minDeadline: string }) {
  return (
    <JobForm
      {...props}
      mode="request"
      action={requestVacancy}
      lead={(errors) => (
        <section className="em-sec" aria-labelledby="s-contact">
          <div className="em-sec__head">
            <h2 id="s-contact" className="em-h2">
              Your company
            </h2>
            <p>Who is hiring, and who we should call to confirm the vacancy.</p>
          </div>
          <Field name="company" label="Company" errors={errors} autoComplete="organization" maxLength={100} />
          <div className="em-cols">
            <Field name="contact_name" label="Your name" errors={errors} autoComplete="name" maxLength={100} />
            <Field
              name="phone"
              label="Phone"
              errors={errors}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="0911 234 567"
              maxLength={30}
            />
          </div>
          <Field name="email" label="Email" optional errors={errors} type="email" autoComplete="email" maxLength={200} />
        </section>
      )}
    />
  );
}
