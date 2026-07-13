// Score breakdown, shown only for winners. Bars read like an instrument readout.
const AXES = [
  { key: "accuracy" as const, label: "Scientific accuracy", max: 40 },
  { key: "creativity" as const, label: "Creativity", max: 35 },
  { key: "design" as const, label: "Design & visuals", max: 25 },
];

export default function ScoreBars({
  scores,
  className = "",
}: {
  scores: { accuracy: number | null; design: number | null; creativity: number | null };
  className?: string;
}) {
  const total = AXES.reduce((t, a) => t + (scores[a.key] ?? 0), 0);
  return (
    <div className={className}>
      {AXES.map((a) => {
        const v = scores[a.key];
        return (
          <div key={a.key} className="mb-2">
            <div className="flex justify-between font-mono text-[9px] uppercase tracking-widest text-dim">
              <span>{a.label}</span>
              <span className="text-photon/80">
                {v ?? "—"}/{a.max}
              </span>
            </div>
            <div className="mt-1 h-[3px] rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-redshift via-ember to-photon"
                style={{ width: `${((v ?? 0) / a.max) * 100}%` }}
              />
            </div>
          </div>
        );
      })}
      <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-widest">
        <span className="text-dim">Total</span>
        <span className="text-ember">{total}/100</span>
      </div>
    </div>
  );
}
