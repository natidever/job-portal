// PLACEHOLDER CONTENT: every figure and quote below is illustrative, written for the design
// preview. None of it is a real Righton result or a real person's words. Replace each value
// with verified figures and approved testimonials before launch, then set isPlaceholder to false.

export const isPlaceholder = true;

export type Stat = { value: number; suffix?: string; label: string; note: string };

export const stats: Stat[] = [
  { value: 1250, suffix: "+", label: "Candidates placed", note: "In roles across Ethiopia" },
  { value: 140, suffix: "+", label: "Client companies", note: "Hiring through Righton" },
  { value: 72, suffix: "h", label: "To a first shortlist", note: "Typical, after a vacancy is received" },
  { value: 8, label: "Sectors", note: "From finance to hospitality" },
];

export type Testimonial = {
  quote: string;
  role: string;
  org: string;
  kind: "candidate" | "client";
  /** For client quotes: index into `employers` (placeholder brand mark). */
  brand?: number;
};

export const testimonials: Testimonial[] = [
  {
    quote: "I applied from my phone on a Sunday night. By Wednesday a Righton recruiter had called, and two weeks later I started.",
    role: "Placed candidate",
    org: "Senior Accountant, Addis Ababa",
    kind: "candidate",
  },
  {
    quote: "We sent one email describing the role. Righton came back with five screened candidates, and we hired from the first three interviews.",
    role: "HR manager",
    org: "Fabrikam",
    kind: "client",
    brand: 1,
  },
  {
    quote: "Every vacancy showed the salary and the closing date, so I only applied where it made sense.",
    role: "Placed candidate",
    org: "Front Office Supervisor, Addis Ababa",
    kind: "candidate",
  },
  {
    quote: "They understood the site-engineering brief better than the agencies we used before. The shortlist was short, and right.",
    role: "Project director",
    org: "Northwind",
    kind: "client",
    brand: 2,
  },
  {
    quote: "A real person called me back and explained the next steps. That alone made the whole search feel different.",
    role: "Placed candidate",
    org: "Logistics Officer, Adama",
    kind: "candidate",
  },
  {
    quote: "Hiring for three branches at once used to take months. With Righton we had people in post within the quarter.",
    role: "Operations manager",
    org: "Woodgrove Bank",
    kind: "client",
    brand: 3,
  },
  {
    quote: "The application took five minutes. No account, no long forms, just my CV and my phone number.",
    role: "Placed candidate",
    org: "Junior Software Developer, Addis Ababa",
    kind: "candidate",
  },
  {
    quote: "Righton handled the screening and the scheduling. Our team only met people worth meeting.",
    role: "Country manager",
    org: "Contoso",
    kind: "client",
    brand: 0,
  },
  {
    quote: "I was moving back to Hawassa and wanted hospital work there. Righton found the role before it was advertised anywhere else.",
    role: "Placed candidate",
    org: "Clinical Pharmacist, Hawassa",
    kind: "candidate",
  },
  {
    quote: "Clear salary bands and honest feedback on every candidate. We will keep sending our vacancies their way.",
    role: "General manager",
    org: "Fourth Coffee",
    kind: "client",
    brand: 6,
  },
];

// Featured vacancies come from the database: published posts staff flag with is_featured.

export const benefits = [
  {
    title: "Apply from your phone",
    body: "Search and send your CV in a few minutes. No account to create, no long forms.",
  },
  {
    title: "Only real, published vacancies",
    body: "Every listing comes from a client company and is published by the Righton team.",
  },
  {
    title: "A recruiter reads every CV",
    body: "Applications are reviewed against the client's brief, and shortlisted candidates get a call.",
  },
  {
    title: "Salary and deadline upfront",
    body: "Each vacancy shows the pay, the closing date and a Ref number before you apply.",
  },
] as const;

/**
 * PLACEHOLDER LOGOS: well-known fictional companies (Contoso, Fabrikam, Northwind…) stand in
 * for Righton's real clients. Never put a real brand here without that company's permission;
 * replace each entry with an actual client and its logo file (logo: "/images/clients/x.svg").
 */
export type Employer = {
  name: string;
  mark: "bank" | "box" | "plane" | "leaf" | "bolt" | "cup" | "globe" | "mountain" | "wave" | "shield" | "factory" | "grape";
  style: "sans" | "wide" | "serif" | "mono" | "caps" | "light";
  logo?: string;
};

export const employers: Employer[] = [
  { name: "Contoso", mark: "globe", style: "sans" },
  { name: "Fabrikam", mark: "factory", style: "caps" },
  { name: "Northwind", mark: "wave", style: "serif" },
  { name: "Woodgrove Bank", mark: "bank", style: "wide" },
  { name: "Tailspin", mark: "plane", style: "light" },
  { name: "Litware", mark: "bolt", style: "mono" },
  { name: "Fourth Coffee", mark: "cup", style: "serif" },
  { name: "Proseware", mark: "box", style: "caps" },
  { name: "Alpine House", mark: "mountain", style: "sans" },
  { name: "Wide World", mark: "leaf", style: "wide" },
  { name: "Coho Vineyard", mark: "grape", style: "light" },
  { name: "Lamna Health", mark: "shield", style: "sans" },
];
