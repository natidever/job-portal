"use client";

import { useState } from "react";
import { ArrowRight, Check, Mail, Phone, Send } from "lucide-react";
import Image from "next/image";
import { contact } from "../data/contact";
import employersImg from "../../public/images/employers.jpg";

type Errors = Partial<Record<"company" | "name" | "phone" | "roles", string>>;

const ET_PHONE = /^(?:\+?251|0)?[79]\d{8}$/;

export function Employers() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Errors = {};
    if (!String(data.get("company") || "").trim()) next.company = "Enter your company's name.";
    if (!String(data.get("name") || "").trim()) next.name = "Enter the name of the person we should call.";
    const phone = String(data.get("phone") || "").replace(/[\s-]/g, "");
    if (!ET_PHONE.test(phone)) next.phone = "Enter an Ethiopian number, e.g. 0911 234 567.";
    if (!String(data.get("roles") || "").trim()) next.roles = "Tell us which role or roles you are hiring for.";
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setState("sending");
    // TODO: send to Righton's backend (API route + email/Telegram notification).
    window.setTimeout(() => setState("sent"), 900);
  };

  const field = (key: keyof Errors) => ({
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `emp-${key}-err` : undefined,
  });

  return (
    <section className="employers" id="employers" aria-labelledby="employers-title">
      <div className="container employers__grid">
        <div className="employers__copy">
          <h2 id="employers-title" className="h2 h2--light">
            Hiring? Send us the vacancy.
          </h2>
          <p className="employers__lede">
            Tell Righton who you need. We publish the vacancy, screen the applicants and bring you
            a shortlist to interview, so your team only meets people worth meeting.
          </p>
          <div className="employers__photo">
            <Image src={employersImg} alt="Hiring team meeting around a white table" placeholder="blur" sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
          <ul className="channels" id="contact">
            <li>
              <a href={contact.phoneHref}>
                <Phone size={20} aria-hidden="true" />
                <span>
                  <span className="channels__label">Call us</span>
                  <span className="channels__value num">{contact.phoneDisplay}</span>
                </span>
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`}>
                <Mail size={20} aria-hidden="true" />
                <span>
                  <span className="channels__label">Email the role</span>
                  <span className="channels__value">{contact.email}</span>
                </span>
              </a>
            </li>
            <li>
              <a href={contact.telegramHref}>
                <Send size={20} aria-hidden="true" />
                <span>
                  <span className="channels__label">Message on Telegram</span>
                  <span className="channels__value">{contact.telegramHandle}</span>
                </span>
              </a>
            </li>
          </ul>
        </div>

        <div className="panel">
          {state === "sent" ? (
            <div className="sent" role="status">
              <span className="sent__mark" aria-hidden="true">
                <Check size={26} strokeWidth={2.5} />
              </span>
              <h3>Vacancy received.</h3>
              <p>
                Thank you. A Righton recruiter will contact you to confirm the details before the
                vacancy is published.
              </p>
              <button type="button" className="btn btn--line" onClick={() => setState("idle")}>
                Send another vacancy
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="form">
              <h3 className="panel__title">Vacancy request</h3>
              <div className="form__row">
                <div className="fieldset">
                  <label htmlFor="emp-company">Company</label>
                  <input id="emp-company" name="company" autoComplete="organization" {...field("company")} />
                  {errors.company && <p id="emp-company-err" className="field-error">{errors.company}</p>}
                </div>
                <div className="fieldset">
                  <label htmlFor="emp-name">Your name</label>
                  <input id="emp-name" name="name" autoComplete="name" {...field("name")} />
                  {errors.name && <p id="emp-name-err" className="field-error">{errors.name}</p>}
                </div>
              </div>
              <div className="fieldset">
                <label htmlFor="emp-phone">Phone</label>
                <input
                  id="emp-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0911 234 567"
                  {...field("phone")}
                />
                {errors.phone && <p id="emp-phone-err" className="field-error">{errors.phone}</p>}
              </div>
              <div className="fieldset">
                <label htmlFor="emp-roles">Role or roles you are hiring for</label>
                <textarea
                  id="emp-roles"
                  name="roles"
                  rows={3}
                  placeholder="e.g. 2 sales supervisors, Addis Ababa, start in January"
                  {...field("roles")}
                />
                {errors.roles && <p id="emp-roles-err" className="field-error">{errors.roles}</p>}
              </div>
              <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : "Send vacancy to Righton"}
                {state !== "sending" && <ArrowRight size={18} aria-hidden="true" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
