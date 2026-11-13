import type { Sector } from "../data/jobs";

export const sectorLabel: Record<Sector, string> = {
  Finance: "Finance & Accounting",
  Sales: "Sales & Marketing",
  Engineering: "Engineering & Construction",
  Logistics: "Logistics & Supply Chain",
  Hospitality: "Hotels & Hospitality",
  Health: "Health & Pharmacy",
  IT: "IT & Software",
  Admin: "Admin & Office",
};

/** Only sectors with a photograph of their own get one; the rest show a signage panel. */
export const sectorPhoto: Partial<Record<Sector, { src: string; alt: string }>> = {
  Engineering: { src: "/images/hero/engineering.jpg", alt: "A row of new yellow hard hats on a construction site" },
  Logistics: { src: "/images/hero/logistics.jpg", alt: "A long warehouse aisle between tall racks of stock" },
  Hospitality: { src: "/images/hero/hospitality.jpg", alt: "A marble reception desk in a bright hotel lobby" },
};
