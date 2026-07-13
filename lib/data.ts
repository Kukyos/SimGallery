import results from "@/data/results.json";

export type Entry = {
  slug: string;
  num: number;
  title: string;
  author: string;
  tagline: string;
  description: string;
  github_url: string | null;
  video_url: string | null;
  shot: string | null;
  observed: string | null;
  isLate: boolean;
  category: "blackhole" | "open" | null;
  winner: "1" | "2" | "3" | null;
  feedback: string | null;
  scores?: { accuracy: number | null; design: number | null; creativity: number | null };
};

export const entries = results as Entry[];
export const bySlug = (slug: string) => entries.find((e) => e.slug === slug);
export const designation = (num: number) => `SMT-${String(num).padStart(3, "0")}`;

export const CATEGORY_LABEL: Record<string, string> = {
  blackhole: "Black Hole",
  open: "Open Innovation",
};
