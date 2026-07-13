import type { Metadata } from "next";
import { Gloock, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const display = Gloock({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const mono = IBM_Plex_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-mono" });
const sans = IBM_Plex_Sans({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Simathon Deep Field",
  description:
    "83 school students, one week, one black hole. The complete catalog of every simulation built at Simathon 2026.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} ${sans.variable}`}>
      <body className="starfield font-sans antialiased min-h-screen">
        <div className="relative z-10">
          {children}
          <footer className="border-t border-white/5 mt-24 py-10 text-center">
            <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-dim">
              Simathon · IIT Madras Research Park · July 2026
            </div>
            <div className="text-sm text-dim mt-3">
              Organized by{" "}
              <a
                href="https://www.linkedin.com/in/armaansucks/"
                target="_blank"
                rel="noreferrer"
                className="text-ember hover:text-photon underline underline-offset-4 decoration-ember/40"
              >
                Armaan
              </a>{" "}
              · every simulation here was built by a school student in one week
            </div>
            <div className="mt-4">
              <Link href="/" className="font-mono text-[11px] text-dim hover:text-ink tracking-widest">
                ← RETURN TO THE FIELD
              </Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
