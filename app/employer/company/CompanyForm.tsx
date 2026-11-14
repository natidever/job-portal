"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { AlertCircle, Globe, ImageUp, Loader2, Trash2 } from "lucide-react";
import { updateCompany, type FormResult } from "../actions";
import { Toast } from "../Toast";

type Initial = { name: string; description: string; website: string; logoUrl: string | null };

const DESC_MAX = 1500;

function initialsOf(name: string) {
  return (
    name
      .replace(/\(.*?\)/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]!.toUpperCase())
      .join("") || "?"
  );
}

export function CompanyForm({ initial }: { initial: Initial }) {
  const [name, setName] = useState(initial.name);
  const [website, setWebsite] = useState(initial.website);
  const [description, setDescription] = useState(initial.description);
  const [preview, setPreview] = useState<string | null>(initial.logoUrl);
  const [removeLogo, setRemoveLogo] = useState(false);
  const [clientErr, setClientErr] = useState<string | null>(null);
  const [result, setResult] = useState<FormResult | null>(null);
  const [toast, setToast] = useState<FormResult | null>(null);
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const errors = result && !result.ok ? result.errors : {};

  useEffect(() => {
    // After a save, the server sends the stored logo back; show that instead of the local preview.
    setPreview(initial.logoUrl);
    setRemoveLogo(false);
  }, [initial.logoUrl]);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setClientErr(null);
    if (!f) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(f.type)) {
      setClientErr("Use a PNG, JPG or WebP image.");
      e.target.value = "";
      return;
    }
    if (f.size > 1024 * 1024) {
      setClientErr("The logo must be 1 MB or smaller.");
      e.target.value = "";
      return;
    }
    setRemoveLogo(false);
    setPreview(URL.createObjectURL(f));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const res = await updateCompany(fd);
      setResult(res);
      if (res.ok) {
        setToast(res);
        if (fileRef.current) fileRef.current.value = "";
      }
    });
  }

  const logoErr = clientErr ?? errors.logo;
  const host = website.replace(/^https?:\/\//i, "").replace(/\/$/, "");

  return (
    <form className="em-form-grid" onSubmit={onSubmit} noValidate>
      <div className="em-form">
        {result && !result.ok && (
          <div className="em-errsum" role="alert">
            <strong>
              <AlertCircle size={18} aria-hidden="true" />
              {result.message}
            </strong>
          </div>
        )}
        <section className="em-sec" aria-labelledby="c-id">
          <div className="em-sec__head">
            <h2 id="c-id" className="em-h2">
              Identity
            </h2>
          </div>
          <div className="em-field">
            <span className="em-label">
              Logo <span className="em-opt">optional</span>
            </span>
            <div className="em-logo">
              <span className="em-mono em-mono--lg" aria-hidden="true">
                {preview && !removeLogo ? <img src={preview} alt="" /> : initialsOf(name)}
              </span>
              <div className="em-logo__btns">
                <div className="em-logo__row">
                  <label className="btn btn--line btn--sm em-file">
                    <ImageUp size={16} aria-hidden="true" />
                    {preview && !removeLogo ? "Replace logo" : "Upload logo"}
                    <input ref={fileRef} type="file" name="logo" accept="image/png,image/jpeg,image/webp" onChange={onFile} />
                  </label>
                  {preview && !removeLogo && (
                    <button
                      type="button"
                      className="em-quiet em-quiet--danger"
                      onClick={() => {
                        setRemoveLogo(true);
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                    >
                      <Trash2 size={15} aria-hidden="true" /> Remove
                    </button>
                  )}
                </div>
                <span className="em-hint">Square PNG, JPG or WebP, up to 1 MB.</span>
              </div>
            </div>
            <input type="hidden" name="remove_logo" value={removeLogo ? "1" : ""} />
            {logoErr && (
              <p className="em-err">
                <AlertCircle size={15} aria-hidden="true" />
                {logoErr}
              </p>
            )}
          </div>
          <div className="em-field">
            <label htmlFor="c-name">Company name</label>
            <input
              id="c-name"
              name="name"
              className="em-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "c-name-err" : undefined}
            />
            {errors.name && (
              <p className="em-err" id="c-name-err">
                <AlertCircle size={15} aria-hidden="true" />
                {errors.name}
              </p>
            )}
          </div>
          <div className="em-field">
            <label htmlFor="c-website">
              Website <span className="em-opt">optional</span>
            </label>
            <input
              id="c-website"
              name="website"
              className="em-input"
              inputMode="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="abaydigital.com"
              maxLength={200}
              aria-invalid={errors.website ? true : undefined}
              aria-describedby={errors.website ? "c-website-err" : undefined}
            />
            {errors.website && (
              <p className="em-err" id="c-website-err">
                <AlertCircle size={15} aria-hidden="true" />
                {errors.website}
              </p>
            )}
          </div>
        </section>

        <section className="em-sec" aria-labelledby="c-about">
          <div className="em-sec__head">
            <h2 id="c-about" className="em-h2">
              About the company
            </h2>
            <p>A few lines on what you do and what it’s like to work there.</p>
          </div>
          <div className="em-field">
            <label htmlFor="c-desc">
              Description <span className="em-opt">optional</span>
            </label>
            <textarea
              id="c-desc"
              name="description"
              className="em-input"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, DESC_MAX))}
              placeholder="We build payment software for Ethiopian retailers. Our team of 40 works from Bole…"
            />
            <span className="em-counter" aria-live="polite">
              {description.length} / {DESC_MAX}
            </span>
          </div>
        </section>

        <div className="em-actionbar">
          <div className="em-actionbar__in">
            <p className="em-actionbar__note">Changes show on all your posts straight away.</p>
            <div className="em-actionbar__btns">
              <button type="submit" className="btn btn--primary" disabled={pending}>
                {pending && <Loader2 size={18} className="em-spin" aria-hidden="true" />}
                {pending ? "Saving…" : "Save profile"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <aside className="em-aside" aria-label="Preview">
        <div className="em-guide">
          <div className="em-guide__head">
            <h2 className="em-h2">How applicants see you</h2>
          </div>
          <div className="em-preview">
            <div className="em-preview__co">
              <span className="em-mono" aria-hidden="true" style={{ ["--s" as string]: "52px" }}>
                {preview && !removeLogo ? <img src={preview} alt="" /> : initialsOf(name)}
              </span>
              <div style={{ minWidth: 0 }}>
                <b>{name || "Your company"}</b>
                {host && (
                  <small style={{ display: "inline-flex", gap: 5, alignItems: "center" }}>
                    <Globe size={13} aria-hidden="true" />
                    {host}
                  </small>
                )}
              </div>
            </div>
            <p>{description || "Add a short description so applicants know who they’re applying to."}</p>
          </div>
        </div>
      </aside>
      {toast && <Toast result={toast} onDone={() => setToast(null)} />}
    </form>
  );
}
