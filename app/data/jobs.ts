// SAMPLE DATA: illustrative vacancies for design preview only. Set isSample to false once
// real vacancies published by Righton staff replace them.
export const isSample = true;

// These are not real openings. Replace with vacancies published by Righton staff.
export type Sector =
  | "Finance"
  | "Sales"
  | "Engineering"
  | "Logistics"
  | "Hospitality"
  | "Health"
  | "IT"
  | "Admin";

export type JobType = "Full-time" | "Part-time" | "Contract";

export interface Job {
  ref: string;
  title: string;
  sector: Sector;
  clientType: string;
  city: string;
  area?: string;
  type: JobType;
  salary: string;
  salaryMin: number;
  postedDaysAgo: number;
  closesInDays: number;
  positions: number;
  qualification: string;
  experience: string;
  duties: string[];
}

export const jobs: Job[] = [
  {
    ref: "RT-0148",
    title: "Junior Software Developer",
    sector: "IT",
    clientType: "Fintech company",
    city: "Addis Ababa",
    area: "Bole",
    type: "Full-time",
    salary: "ETB 35,000–45,000",
    salaryMin: 35000,
    postedDaysAgo: 0,
    closesInDays: 14,
    positions: 2,
    qualification: "BSc in Computer Science, Software Engineering or related field",
    experience: "1+ year with JavaScript or Python; a portfolio or GitHub profile",
    duties: [
      "Build and maintain features for a mobile payments web dashboard",
      "Write tests and review pull requests with senior engineers",
      "Fix production issues reported by the support team",
    ],
  },
  {
    ref: "RT-0146",
    title: "Office Administrator",
    sector: "Admin",
    clientType: "Law firm",
    city: "Addis Ababa",
    area: "Kazanchis",
    type: "Full-time",
    salary: "ETB 18,000–22,000",
    salaryMin: 18000,
    postedDaysAgo: 1,
    closesInDays: 10,
    positions: 1,
    qualification: "Diploma or BA in Office Management, Secretarial Science or related field",
    experience: "2+ years running an office; fluent in Amharic and English",
    duties: [
      "Manage the partners' calendars, filing and correspondence",
      "Order supplies and keep the office running smoothly",
      "Greet clients and handle incoming calls",
    ],
  },
  {
    ref: "RT-0145",
    title: "Medical Sales Representative",
    sector: "Sales",
    clientType: "Pharmaceutical importer",
    city: "Bahir Dar",
    type: "Full-time",
    salary: "ETB 25,000 + commission",
    salaryMin: 25000,
    postedDaysAgo: 1,
    closesInDays: 5,
    positions: 3,
    qualification: "BPharm, Nursing or a health science degree",
    experience: "1+ year in medical or pharmaceutical sales",
    duties: [
      "Visit hospitals, clinics and pharmacies across the Amhara region",
      "Present products to doctors and pharmacists",
      "Report weekly on visits, orders and competitor activity",
    ],
  },
  {
    ref: "RT-0142",
    title: "Senior Accountant",
    sector: "Finance",
    clientType: "Manufacturing company",
    city: "Addis Ababa",
    area: "Bole",
    type: "Full-time",
    salary: "ETB 45,000–60,000",
    salaryMin: 45000,
    postedDaysAgo: 2,
    closesInDays: 12,
    positions: 1,
    qualification: "BA in Accounting or Finance; CPA/ACCA a plus",
    experience: "5+ years, including IFRS reporting",
    duties: [
      "Prepare monthly and annual IFRS financial statements",
      "Own payroll, tax filings and reconciliations",
      "Work with external auditors on year-end close",
    ],
  },
  {
    ref: "RT-0141",
    title: "Head Chef",
    sector: "Hospitality",
    clientType: "Resort hotel",
    city: "Hawassa",
    type: "Full-time",
    salary: "ETB 40,000 + service charge",
    salaryMin: 40000,
    postedDaysAgo: 3,
    closesInDays: 11,
    positions: 1,
    qualification: "Diploma in Culinary Arts or equivalent",
    experience: "6+ years, including 2 as sous or head chef",
    duties: [
      "Lead a kitchen team of twelve across three outlets",
      "Plan menus, food costs and supplier orders",
      "Keep hygiene and food-safety standards inspection-ready",
    ],
  },
  {
    ref: "RT-0139",
    title: "Sales Supervisor",
    sector: "Sales",
    clientType: "Beverage distributor",
    city: "Addis Ababa",
    area: "Kality",
    type: "Full-time",
    salary: "ETB 28,000 + commission",
    salaryMin: 28000,
    postedDaysAgo: 4,
    closesInDays: 9,
    positions: 2,
    qualification: "BA in Marketing, Management or related field",
    experience: "3+ years in FMCG sales, 1 year leading a team",
    duties: [
      "Lead a route team of eight sales representatives",
      "Hit monthly volume and distribution targets",
      "Report weekly on outlet coverage and stock levels",
    ],
  },
  {
    ref: "RT-0137",
    title: "Site Civil Engineer",
    sector: "Engineering",
    clientType: "Construction contractor",
    city: "Adama",
    type: "Contract",
    salary: "ETB 52,000",
    salaryMin: 52000,
    postedDaysAgo: 5,
    closesInDays: 6,
    positions: 1,
    qualification: "BSc in Civil Engineering",
    experience: "4+ years on building sites; ERA licence",
    duties: [
      "Supervise daily works on a G+8 mixed-use building",
      "Check quantities, quality and safety against drawings",
      "Coordinate subcontractors and site reporting",
    ],
  },
  {
    ref: "RT-0136",
    title: "IT Support Technician",
    sector: "IT",
    clientType: "Private bank",
    city: "Dire Dawa",
    type: "Full-time",
    salary: "ETB 24,000–28,000",
    salaryMin: 24000,
    postedDaysAgo: 5,
    closesInDays: 3,
    positions: 1,
    qualification: "Diploma or BSc in IT, Networking or related field",
    experience: "2+ years in desktop and network support",
    duties: [
      "Support branch staff with hardware, software and printers",
      "Maintain the branch network and core-banking terminals",
      "Log and escalate incidents to head office",
    ],
  },
  {
    ref: "RT-0135",
    title: "Logistics Officer",
    sector: "Logistics",
    clientType: "Import & trading company",
    city: "Addis Ababa",
    area: "Megenagna",
    type: "Full-time",
    salary: "ETB 32,000–38,000",
    salaryMin: 32000,
    postedDaysAgo: 6,
    closesInDays: 15,
    positions: 1,
    qualification: "BA in Logistics, Supply Chain or related field",
    experience: "2+ years in import clearance via the Djibouti corridor",
    duties: [
      "Track shipments from Djibouti to the Modjo dry port",
      "Prepare customs and transit documentation",
      "Coordinate warehouse receiving and dispatch",
    ],
  },
  {
    ref: "RT-0133",
    title: "Electrical Engineer",
    sector: "Engineering",
    clientType: "Industrial park tenant",
    city: "Hawassa",
    type: "Full-time",
    salary: "ETB 48,000–55,000",
    salaryMin: 48000,
    postedDaysAgo: 7,
    closesInDays: 13,
    positions: 1,
    qualification: "BSc in Electrical or Electromechanical Engineering",
    experience: "3+ years maintaining factory power systems",
    duties: [
      "Run preventive maintenance on generators, panels and motors",
      "Lead the shift electricians and keep downtime low",
      "Keep electrical safety records up to date",
    ],
  },
  {
    ref: "RT-0131",
    title: "Front Office Supervisor",
    sector: "Hospitality",
    clientType: "Four-star hotel",
    city: "Addis Ababa",
    area: "Kazanchis",
    type: "Full-time",
    salary: "ETB 22,000 + service charge",
    salaryMin: 22000,
    postedDaysAgo: 8,
    closesInDays: 4,
    positions: 1,
    qualification: "Diploma or degree in Hotel Management",
    experience: "3+ years in front office, Opera PMS",
    duties: [
      "Run the front desk across morning and evening shifts",
      "Train and schedule receptionists",
      "Handle VIP arrivals and guest escalations",
    ],
  },
  {
    ref: "RT-0130",
    title: "Warehouse Supervisor",
    sector: "Logistics",
    clientType: "Consumer goods distributor",
    city: "Adama",
    type: "Contract",
    salary: "ETB 26,000",
    salaryMin: 26000,
    postedDaysAgo: 9,
    closesInDays: 8,
    positions: 1,
    qualification: "Diploma or BA in Logistics, Management or related field",
    experience: "3+ years in warehouse operations; stock software",
    duties: [
      "Manage receiving, storage and dispatch for a 4,000 m² warehouse",
      "Run monthly stock counts and reconcile variances",
      "Supervise loaders and forklift operators",
    ],
  },
  {
    ref: "RT-0128",
    title: "Clinical Pharmacist",
    sector: "Health",
    clientType: "Private hospital",
    city: "Hawassa",
    type: "Full-time",
    salary: "ETB 30,000–36,000",
    salaryMin: 30000,
    postedDaysAgo: 10,
    closesInDays: 18,
    positions: 2,
    qualification: "BPharm with a valid professional licence",
    experience: "2+ years in a hospital pharmacy",
    duties: [
      "Review prescriptions and advise on dosing",
      "Manage inpatient and outpatient dispensing",
      "Keep controlled-drug records audit-ready",
    ],
  },
  {
    ref: "RT-0126",
    title: "Staff Nurse (Night Shift)",
    sector: "Health",
    clientType: "Specialty clinic",
    city: "Addis Ababa",
    area: "Sarbet",
    type: "Part-time",
    salary: "ETB 16,000–19,000",
    salaryMin: 16000,
    postedDaysAgo: 12,
    closesInDays: 7,
    positions: 2,
    qualification: "BSc in Nursing with a valid licence",
    experience: "1+ year in a hospital or clinic ward",
    duties: [
      "Provide patient care on three night shifts a week",
      "Record observations and hand over to the day team",
      "Prepare patients for morning procedures",
    ],
  },
];

export const sectors: Sector[] = [
  "Finance",
  "Sales",
  "Engineering",
  "Logistics",
  "Hospitality",
  "Health",
  "IT",
  "Admin",
];

export const jobTypes: JobType[] = ["Full-time", "Part-time", "Contract"];

export const cities = Array.from(new Set(jobs.map((j) => j.city))).sort((a, b) =>
  a === "Addis Ababa" ? -1 : b === "Addis Ababa" ? 1 : a.localeCompare(b)
);

export const location = (j: Job) => (j.area ? `${j.city} · ${j.area}` : j.city);

export const postedLabel = (d: number) =>
  d === 0 ? "Today" : d === 1 ? "Yesterday" : `${d} days ago`;

export type Filters = {
  q: string;
  city: string;
  sector: Sector | "";
  type: JobType | "";
  posted: "" | "3" | "7";
  sort: "newest" | "closing" | "salary";
};

export const emptyFilters: Filters = { q: "", city: "", sector: "", type: "", posted: "", sort: "newest" };

export function filterJobs(f: Filters) {
  const q = f.q.trim().toLowerCase();
  const out = jobs.filter((j) => {
    if (f.city && j.city !== f.city) return false;
    if (f.sector && j.sector !== f.sector) return false;
    if (f.type && j.type !== f.type) return false;
    if (f.posted && j.postedDaysAgo > Number(f.posted)) return false;
    if (!q) return true;
    return [j.title, j.ref, j.city, j.area ?? "", j.clientType, j.sector].some((x) =>
      x.toLowerCase().includes(q)
    );
  });
  const by = {
    newest: (a: Job, b: Job) => a.postedDaysAgo - b.postedDaysAgo,
    closing: (a: Job, b: Job) => a.closesInDays - b.closesInDays,
    salary: (a: Job, b: Job) => b.salaryMin - a.salaryMin,
  }[f.sort];
  return out.sort(by);
}

export type Status = { label: "New" | "Open" | "Closing" | "Final call"; tone: "new" | "open" | "closing" | "final" };

/** Board status, read like a departures display. */
export function status(j: Job): Status {
  if (j.closesInDays <= 3) return { label: "Final call", tone: "final" };
  if (j.closesInDays <= 5) return { label: "Closing", tone: "closing" };
  if (j.postedDaysAgo <= 1) return { label: "New", tone: "new" };
  return { label: "Open", tone: "open" };
}

export const latest = (n: number) => [...jobs].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo).slice(0, n);

/** "5+ years, including IFRS reporting" -> "5+ yrs". */
export const experienceShort = (j: Job) => {
  const m = j.experience.match(/(\d+)\+?\s*years?/i);
  return m ? `${m[1]}+ yrs` : null;
};

/** Two-letter monogram standing in for a client logo (client names are not published). */
export const monogram = (j: Job) =>
  j.clientType
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

/** Skill tags shown on each listing (sample data). */
export const skills: Record<string, string[]> = {
  "RT-0148": ["JavaScript", "React", "Testing"],
  "RT-0146": ["Scheduling", "Filing", "Client service"],
  "RT-0145": ["Medical sales", "Negotiation", "Field visits"],
  "RT-0142": ["IFRS", "Payroll", "Tax filing"],
  "RT-0141": ["Menu planning", "Food costing", "Team leadership"],
  "RT-0139": ["FMCG", "Route sales", "Team leadership"],
  "RT-0137": ["Site supervision", "Quantity checks", "AutoCAD"],
  "RT-0136": ["Networking", "Hardware support", "Helpdesk"],
  "RT-0135": ["Customs clearance", "Shipping documents", "Warehousing"],
  "RT-0133": ["Power systems", "Preventive maintenance", "Safety"],
  "RT-0131": ["Opera PMS", "Guest relations", "Shift planning"],
  "RT-0130": ["Inventory control", "Stock counts", "Forklift ops"],
  "RT-0128": ["Dispensing", "Prescription review", "Records"],
  "RT-0126": ["Patient care", "Night shifts", "Observations"],
};

/** Entry (under 2 years), Intermediate (2-4), Senior (5+), from the experience line. */
export const level = (j: Job) => {
  const m = j.experience.match(/(\d+)\+?\s*years?/i);
  const y = m ? Number(m[1]) : 0;
  return y >= 5 ? "Senior" : y >= 2 ? "Intermediate" : "Entry level";
};
