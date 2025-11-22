import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { heritageMetadata } from "@/lib/heritage-data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const meta = heritageMetadata();

export const metadata: Metadata = {
  title: "Éire Heritage Directory",
  description:
    "Explore Ireland's heritage sites with dynamic listings, categories, and visitor insights sourced from the /sites dataset.",
  keywords: meta.totalSites ? [`${meta.totalSites} sites`, "Ireland heritage", "castles", "natural wonders"] : undefined
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
