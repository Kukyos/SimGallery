import Link from "next/link";
import Disk from "@/components/Disk";
import Catalog from "@/components/Catalog";
import FadeImg from "@/components/FadeImg";
import WinnersReveal from "@/components/WinnersReveal";
import { entries, CATEGORY_LABEL, awards, METRIC_LABEL, type Award } from "@/lib/data";

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
          catalogued below. Each tile in the disk is a real submission. Hover to slow time, click
          to fall in.
        </p>
        <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-photon/70">
          {entries.length} sims · 7 days · 2 categories
        </div>
      </header>

      {/* ——— Winners ——— */}
      <section className="mt-24">
        <SectionTitle k="01" title="The winners" sub="press to reveal" />
        {winners.length === 0 ? (
          <div className="mt-6 rounded-lg border border-white/10 bg-panel/60 px-5 py-8 text-center">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-ember">
              spectral analysis in progress
            </div>
            <p className="mx-auto mt-3 max-w-md text-sm text-dim">
              Every sim is being scored on scientific accuracy, design and creativity.
              Winners will be catalogued here once the review is done.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-12">
            {(["blackhole", "open"] as const).map((cat) => {
              const w = byCat(cat);
              if (!w.length) return null;
              return <WinnersReveal key={cat} label={CATEGORY_LABEL[cat]} winners={w} />;
            })}
          </div>
        )}
      </section>

      {/* ——— Per-metric top 10: brighter = bigger ——— */}
      {winners.length > 0 && (
        <section className="mt-24">
          <SectionTitle k="02" title="Brightest in band" sub="top 10 per score" />
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-dim">
            Every sim was scored in three bands — scientific accuracy, design &amp; visuals, and
            creativity. Here are the ten brightest in each band, per category. The higher the
            score, the bigger the picture.
          </p>
          <div className="mt-8 space-y-10">
            {(["blackhole", "open"] as const).map((cat) => (
              <div key={cat}>
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-ember">
                  {CATEGORY_LABEL[cat]} category
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {(["accuracy", "design", "creativity"] as const).map((m) => (
                    <BandBoard key={m} label={METRIC_LABEL[m]} list={awards[cat][m]} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ——— Full catalog ——— */}
      <section className="mt-24">
        <SectionTitle k="03" title="The full catalog" sub={`all ${entries.length} sims`} />
        <div className="mt-6">
          <Catalog entries={entries} />
        </div>
        {lateCount > 0 && (
          <p className="mt-8 font-mono text-[10px] leading-relaxed tracking-wider text-dim/80">
            * REDSHIFTED: this sim&apos;s light reached us after the submission deadline.
            Catalogued anyway.
          </p>
        )}
      </section>
    </main>
  );
}

// One band's top 10, sized by rank: #1 full-bleed shot, #2–3 half-width,
// #4–5 slim strips, #6–10 a plain list. The pyramid IS the ranking.
function BandBoard({ label, list }: { label: string; list: Award[] }) {
  const [first, second, third, ...rest] = list;
  const strips = rest.slice(0, 2); // #4–5
  const tail = rest.slice(2); // #6–10

  return (
    <div className="flex flex-col rounded-lg border border-white/10 bg-panel/60 p-4">
      <div className="flex items-baseline justify-between">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-photon/80">
          {label}
        </div>
        <div className="font-mono text-[10px] text-dim">/{first?.max}</div>
      </div>

      {/* #1 — the big plate */}
      {first && (
        <Link
          href={`/p/${first.slug}`}
          className="group relative mt-3 block overflow-hidden rounded-md border border-ember/40 shadow-[0_0_24px_rgba(255,158,61,0.1)]"
        >
          {first.shot && (
            <div className="aspect-video overflow-hidden bg-black">
              <FadeImg
                src={first.shot}
                alt={first.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
          )}
          <div className="flex items-center gap-3 bg-panel px-3 py-2.5">
            <span className="font-mono text-sm text-ember">1</span>
            <span className="min-w-0 flex-1 truncate text-sm text-ink group-hover:text-photon" title={first.title}>
              {first.title}
            </span>
            <span className="font-mono text-sm text-ember">{first.value}</span>
          </div>
        </Link>
      )}

      {/* #2–3 — half plates */}
      <div className="mt-2 grid grid-cols-2 gap-2">
        {[second, third].filter(Boolean).map((a, i) => (
          <Link
            key={a.slug}
            href={`/p/${a.slug}`}
            className="group block overflow-hidden rounded-md border border-white/10 hover:border-photon/50"
          >
            {a.shot && (
              <div className="aspect-video overflow-hidden bg-black">
                <FadeImg
                  src={a.shot}
                  alt={a.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex items-center gap-2 bg-panel px-2 py-1.5">
              <span className="font-mono text-[11px] text-dim">{i + 2}</span>
              <span className="min-w-0 flex-1 truncate text-xs text-ink group-hover:text-photon" title={a.title}>
                {a.title}
              </span>
              <span className="font-mono text-[11px] text-dim">{a.value}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* #4–5 — slim strips, picture still visible */}
      <div className="mt-2 grid grid-cols-2 gap-2">
        {strips.map((a, i) => (
          <Link
            key={a.slug}
            href={`/p/${a.slug}`}
            className="group block overflow-hidden rounded-md border border-white/10 hover:border-photon/50"
          >
            {a.shot && (
              <div className="aspect-[21/7] overflow-hidden bg-black">
                <FadeImg
                  src={a.shot}
                  alt={a.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex items-center gap-2 bg-panel px-2 py-1">
              <span className="font-mono text-[10px] text-dim">{i + 4}</span>
              <span className="min-w-0 flex-1 truncate text-[11px] text-ink group-hover:text-photon" title={a.title}>
                {a.title}
              </span>
              <span className="font-mono text-[10px] text-dim">{a.value}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* #6–10 — the readout */}
      <ol className="mt-3 space-y-1.5 border-t border-white/5 pt-3">
        {tail.map((a, i) => (
          <li key={a.slug} className="flex items-baseline gap-3">
            <span className="font-mono text-[10px] text-dim">{i + 6}</span>
            <Link
              href={`/p/${a.slug}`}
              className="min-w-0 flex-1 truncate text-xs text-ink/80 hover:text-photon"
              title={a.title}
            >
              {a.title}
            </Link>
            <span className="font-mono text-[10px] text-dim">{a.value}</span>
          </li>
        ))}
      </ol>
    </div>
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
