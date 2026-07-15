import results from "@/data/results.json";
import awardsJson from "@/data/awards.json";

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

export type Award = { slug: string; title: string; author: string; value: number; max: number };
export const awards = awardsJson as Record<"blackhole" | "open", Record<"accuracy" | "design" | "creativity", Award[]>>;

export const METRIC_LABEL: Record<string, string> = {
  accuracy: "Scientific Accuracy",
  design: "Design & Visuals",
  creativity: "Creativity",
};

// Every band-award placement for one project: [category, metric, place(1-3), value, max]
export const awardsFor = (slug: string) => {
  const hits: { category: string; metric: string; place: number; value: number; max: number }[] = [];
  for (const cat of ["blackhole", "open"] as const)
    for (const m of ["accuracy", "design", "creativity"] as const)
      awards[cat][m].forEach((a, i) => {
        if (a.slug === slug) hits.push({ category: cat, metric: m, place: i + 1, value: a.value, max: a.max });
      });
  return hits;
};
