import Link from "next/link";
import Disk from "@/components/Disk";
import Catalog from "@/components/Catalog";
import ScoreBars from "@/components/ScoreBars";
import { entries, designation, CATEGORY_LABEL } from "@/lib/data";

export default function Home() {
  const winners = entries.filter((e) => e.winner);
  const byCat = (cat: string) =>
    winners.filter((e) => e.category === cat).sort((a, b) => Number(a.winner) - Number(b.winner));
  const lateCount = entries.filter((e) => e.isLate).length;

  return (
    <main className="mx-auto max-w-6xl px-4">
      {/* ——— Hero: the field itself ——— */}
      <header className="pt-12 text-center">
        <div className="font-mono text-[11px] uppercase tracking-[0.35em] text-dim">
          Simathon · July 2026 · Observation Archive
        </div>
        <Disk />
        <h1 className="font-display mx-auto -mt-2 max-w-3xl text-4xl leading-[1.15] sm:text-5xl">
          We pointed eighty-two builders at a black hole.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-dim">
          This is what fell into orbit. One workshop, one week of building, and every simulation
          catalogued below. Each tile in the disk is a real submission. Hover to stop time, click
          to fall in.
        </p>
        <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-photon/70">
          {entries.length} objects · 7 days · 2 categories
        </div>
      </header>

      {/* ——— Winners ——— */}
      <section className="mt-24">
        <SectionTitle k="01" title="Notable objects" sub="the winners" />
        {winners.length === 0 ? (
          <div className="mt-6 rounded-lg border border-white/10 bg-panel/60 px-5 py-8 text-center">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-ember">
              spectral analysis in progress
            </div>
            <p className="mx-auto mt-3 max-w-md text-sm text-dim">
              Every submission is being scored on scientific accuracy, design and creativity.
              Winners will be catalogued here once the review is done.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-12">
            {(["blackhole", "open"] as const).map((cat) => {
              const w = byCat(cat);
              if (!w.length) return null;
              return (
                <div key={cat}>
                  <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-ember">
                    {CATEGORY_LABEL[cat]} category
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {w.map((e) => (
                      <Link
                        key={e.slug}
                        href={`/p/${e.slug}`}
                        className={`group overflow-hidden rounded-lg border bg-panel transition hover:border-photon/60 ${
                          e.winner === "1"
                            ? "border-ember/50 shadow-[0_0_40px_rgba(255,158,61,0.12)] md:-translate-y-2"
                            : "border-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-white/5 px-3 py-2 font-mono text-[10px] tracking-widest">
                          <span className="text-ember">
                            {e.winner === "1" ? "★ FIRST" : e.winner === "2" ? "SECOND" : "THIRD"}
                          </span>
                          <span className="text-dim">{designation(e.num)}</span>
                        </div>
                        {e.shot && (
                          <div className="aspect-video overflow-hidden bg-black">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={e.shot} alt={e.title} className="h-full w-full object-cover" />
                          </div>
                        )}
                        <div className="p-4">
                          <div className="font-display text-xl text-ink group-hover:text-photon">
                            {e.title}
                          </div>
                          <div className="mt-1 text-xs text-dim">by {e.author}</div>
                          {e.scores && <ScoreBars scores={e.scores} className="mt-4" />}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ——— Full catalog ——— */}
      <section className="mt-24">
        <SectionTitle k="02" title="The full catalog" sub={`all ${entries.length} objects`} />
        <div className="mt-6">
          <Catalog entries={entries} />
        </div>
        {lateCount > 0 && (
          <p className="mt-8 font-mono text-[10px] leading-relaxed tracking-wider text-dim/80">
            * REDSHIFTED: this object&apos;s light reached us after the submission deadline.
            Catalogued anyway.
          </p>
        )}
      </section>
    </main>
  );
}

function SectionTitle({ k, title, sub }: { k: string; title: string; sub: string }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-white/10 pb-3">
      <span className="font-mono text-[11px] tracking-widest text-ember">{k}</span>
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-dim">{sub}</span>
    </div>
  );
}
