"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { designation, CATEGORY_LABEL, type Entry } from "@/lib/data";

export default function Catalog({ entries }: { entries: Entry[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"all" | "blackhole" | "open">("all");

  const hasCategories = entries.some((e) => e.category);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return entries.filter((e) => {
      if (cat !== "all" && e.category !== cat) return false;
      if (!needle) return true;
      return (
        e.title.toLowerCase().includes(needle) ||
        e.author.toLowerCase().includes(needle) ||
        designation(e.num).toLowerCase().includes(needle)
      );
    });
  }, [entries, q, cat]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, project, or designation…"
          className="w-full max-w-sm rounded-md border border-white/10 bg-panel px-3 py-2 text-sm text-ink placeholder:text-dim/70 focus:border-ember/60 focus:outline-none"
        />
        {hasCategories && (
          <div className="flex gap-1.5 font-mono text-[11px] uppercase tracking-wider">
            {(["all", "blackhole", "open"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setCat(v)}
                className={`rounded px-2.5 py-1.5 border transition ${
                  cat === v
                    ? "border-ember/60 bg-ember/10 text-ember"
                    : "border-white/10 text-dim hover:text-ink"
                }`}
              >
                {v === "all" ? "All" : CATEGORY_LABEL[v]}
              </button>
            ))}
          </div>
        )}
        <div className="ml-auto font-mono text-[11px] tracking-widest text-dim">
          {shown.length} / {entries.length} OBJECTS
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((e) => (
          <Plate key={e.slug} e={e} />
        ))}
      </div>

      {shown.length === 0 && (
        <div className="mt-10 text-center font-mono text-sm text-dim">
          Nothing in this region of the field. Clear the search to see all {entries.length} objects.
        </div>
      )}
    </div>
  );
}

// A catalog card styled like an observatory photographic plate:
// data strip on top, the exposure itself, then the object's name.
function Plate({ e }: { e: Entry }) {
  return (
    <Link
      href={`/p/${e.slug}`}
      className="group block overflow-hidden rounded-lg border border-white/10 bg-panel transition hover:border-photon/50 hover:shadow-[0_0_30px_rgba(255,158,61,0.08)]"
    >
      <div className="flex items-center justify-between border-b border-white/5 px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] text-dim">
        <span className="text-photon/80">{designation(e.num)}</span>
        <span className="flex items-center gap-2">
          {e.winner && <span className="text-ember">★ WINNER</span>}
          {e.isLate && <span className="text-redshift">REDSHIFTED*</span>}
          {e.observed && (
            <span>{new Date(e.observed).toISOString().slice(0, 10).replaceAll("-", ".")}</span>
          )}
        </span>
      </div>
      <div className="aspect-[16/10] overflow-hidden bg-black">
        {e.shot ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={e.shot}
            alt={e.title}
            loading="lazy"
            className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-[10px] tracking-widest text-dim">
            NO EXPOSURE RECORDED
          </div>
        )}
      </div>
      <div className="px-3 py-3">
        <div className="font-display text-[17px] leading-snug text-ink group-hover:text-photon">
          {e.title}
        </div>
        <div className="mt-1 flex items-baseline justify-between gap-2">
          <span className="text-[12px] text-dim">observed by {e.author}</span>
          {e.category && (
            <span className="shrink-0 font-mono text-[9px] uppercase tracking-widest text-dim">
              {CATEGORY_LABEL[e.category]}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
