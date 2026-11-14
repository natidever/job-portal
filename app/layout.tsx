import type { Metadata, Viewport } from "next";
import { Red_Hat_Display, Red_Hat_Mono, Red_Hat_Text } from "next/font/google";
import "./globals.css";

const display = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const text = Red_Hat_Text({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-text",
  display: "swap",
});

const mono = Red_Hat_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const siteTitle = "Righton · AI-Powered Job Portal for Ethiopia";
const siteDescription =
  "The smarter way to hire and get hired. Righton's AI-enhanced job portal matches the right talent to the right roles across Ethiopia, faster.";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  // Link previews (Telegram, WhatsApp, LinkedIn, X) read these, not the plain description.
  openGraph: { title: siteTitle, description: siteDescription, siteName: "Righton", type: "website" },
  twitter: { card: "summary", title: siteTitle, description: siteDescription },
};

export const viewport: Viewport = {
  themeColor: "#0b2a7a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
