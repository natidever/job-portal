"use client";

import { usePathname } from "next/navigation";

const TABS = [
  { href: "/employer", label: "Overview", match: (p: string) => p === "/employer" },
  {
    href: "/employer/jobs",
    label: "My posts",
    match: (p: string) => p.startsWith("/employer/jobs") && p !== "/employer/jobs/new",
  },
  { href: "/employer/company", label: "Company", match: (p: string) => p.startsWith("/employer/company") },
];

export function Tabs() {
  const path = usePathname();
  return (
    <nav aria-label="Employer" className="em-tabs__list">
      {TABS.map((t) => (
        <a key={t.href} href={t.href} className="em-tab" aria-current={t.match(path) ? "page" : undefined}>
          {t.label}
        </a>
      ))}
    </nav>
  );
}
