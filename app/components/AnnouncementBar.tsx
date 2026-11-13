"use client";

import { useState } from "react";
import { Send, X } from "lucide-react";
import { contact } from "../data/contact";

export function AnnouncementBar() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="announce" role="region" aria-label="Announcement">
      <p className="announce__text">
        <Send size={15} strokeWidth={2} aria-hidden="true" />
        <span>New vacancies land on our Telegram channel first.</span>
        <a href={contact.telegramHref} className="announce__link">
          Join {contact.telegramHandle}
        </a>
      </p>
      <button
        type="button"
        className="announce__close"
        onClick={() => setOpen(false)}
        aria-label="Dismiss announcement"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
