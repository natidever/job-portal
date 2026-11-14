const TZ = "Africa/Addis_Ababa";

/** "Sat 14 Nov 2026" */
export function formatDate(iso: string | Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

/** "14 Nov, 13:04" */
export function formatDateTime(iso: string | Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(iso));
}

/** "Saturday 14 November" */
export function formatLongDay(now = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: TZ, weekday: "long", day: "numeric", month: "long" }).format(now);
}

/** Compact age for board cells: "now", "12m", "3h", "4d", "6w". */
export function age(iso: string | Date, now = new Date()): string {
  const s = Math.max(0, (now.getTime() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 86400 * 14) return `${Math.floor(s / 86400)}d`;
  return `${Math.floor(s / (86400 * 7))}w`;
}

/** "3 hours ago", "yesterday", "5 days ago". */
export function timeAgo(iso: string | Date, now = new Date()): string {
  const s = Math.max(0, (now.getTime() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (s < 3600) return rtf.format(-Math.floor(s / 60), "minute");
  if (s < 86400) return rtf.format(-Math.floor(s / 3600), "hour");
  if (s < 86400 * 30) return rtf.format(-Math.floor(s / 86400), "day");
  return formatDate(iso);
}

/** "ETB 18,000 – 25,000" */
export function formatSalary(min: number | null, max: number | null): string {
  const n = (v: number) => v.toLocaleString("en-US");
  if (min != null && max != null) return min === max ? `ETB ${n(min)}` : `ETB ${n(min)} – ${n(max)}`;
  if (min != null) return `From ETB ${n(min)}`;
  if (max != null) return `Up to ETB ${n(max)}`;
  return "Not stated";
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

/** Morning / afternoon / evening, in Addis Ababa time. */
export function greeting(now = new Date()): string {
  const h = Number(new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", hourCycle: "h23" }).format(now));
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}
