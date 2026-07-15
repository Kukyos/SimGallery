"use client";
import { useState } from "react";
import Link from "next/link";
import ScoreBars from "@/components/ScoreBars";
import { designation, type Entry } from "@/lib/data";

// The ceremony: winners stay sealed behind a pulsing button; clicking reveals
// them one by one, worst place first, so first place lands last with a flare.

export default function WinnersReveal({ label, winners }: { label: string; winners: Entry[] }) {
  // winners arrive sorted 1st → 3rd; we reveal in reverse.
  const [revealed, setRevealed] = useState(0); // how many are visible, counted from last place
  const [opened, setOpened] = useState(false);

  const reveal = () => {
    if (opened) return;
    setOpened(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setRevealed(winners.length);
      return;
    }
    for (let i = 1; i <= winners.length; i++) setTimeout(() => setRevealed(i), 400 + (i - 1) * 1400);
  };

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-ember">
          {label} category
        </div>
        {!opened && (
          <button
            onClick={reveal}
            className="seal-btn rounded-full border border-ember/60 bg-ember/10 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-ember transition hover:bg-ember/20"
          >
            ★ Reveal the winners
          </button>
        )}
      </div>

      {!opened ? (
        <div className="mt-4 rounded-lg border border-dashed border-ember/25 bg-panel/40 px-5 py-10 text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.35em] text-dim">
            results sealed
          </div>
          <p className="mx-auto mt-2 max-w-sm text-sm text-dim">
            {winners.length === 1 ? "The winner is" : `${winners.length} winners are`} locked in.
            Press the button when you&apos;re ready.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {winners.map((e, i) => {
            // i=0 is 1st place; it becomes visible only when everything is revealed.
            const visible = revealed >= winners.length - i;
            const isFirst = e.winner === "1";
            return (
              <Link
                key={e.slug}
                href={`/p/${e.slug}`}
                className={`group overflow-hidden rounded-lg border bg-panel transition hover:border-photon/60 ${
                  isFirst
                    ? "border-ember/50 md:-translate-y-2"
                    : "border-white/10"
                } ${!visible ? "reveal-hidden" : isFirst ? "reveal-first" : "reveal-in"}`}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
