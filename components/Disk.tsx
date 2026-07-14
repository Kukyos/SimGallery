import Link from "next/link";
import FadeImg from "@/components/FadeImg";
import { entries, designation } from "@/lib/data";

// The signature: an accretion disk built from every submission's screenshot.
// Three rings, Keplerian periods (inner faster), tiles stay upright via
// counter-rotation. Pure CSS animation — no JS, respects reduced motion.

const RINGS = [
  { radius: 168, share: 0.24, size: 38 },
  { radius: 238, share: 0.33, size: 42 },
  { radius: 314, share: 0.43, size: 47 },
];

// Deterministic jitter so the disk looks organic but never shifts between builds.
const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 997, 7);

export default function Disk() {
  const withShots = entries.filter((e) => e.shot);
  const counts = RINGS.map((r) => Math.round(withShots.length * r.share));
  counts[2] = withShots.length - counts[0] - counts[1];

  let cursor = 0;
  const ringTiles = RINGS.map((ring, ri) => {
    const tiles = withShots.slice(cursor, cursor + counts[ri]);
    cursor += counts[ri];
    return tiles.map((e, i) => {
      const angle = (360 / tiles.length) * i + (hash(e.slug) % 14) - 7;
      const r = ring.radius + ((hash(e.slug) % 11) - 5);
      return { e, angle, r, size: ring.size };
    });
  });

  return (
    <div className="disk relative mx-auto h-[560px] w-full max-w-[1080px] select-none max-sm:h-[330px]">
      {/* Tilted orbital plane */}
      <div
        className="absolute left-1/2 top-1/2 h-0 w-0 max-sm:scale-[0.48]"
        style={{ transform: "translate(-50%, -50%) perspective(1100px) rotateX(64deg)" }}
      >
        {ringTiles.map((tiles, ri) => (
          <div key={ri} className={`ring ring-${ri} absolute left-0 top-0`}>
            {tiles.map(({ e, angle, r, size }) => {
              const x = Math.cos((angle * Math.PI) / 180) * r;
              const y = Math.sin((angle * Math.PI) / 180) * r;
              return (
                <Link
                  key={e.slug}
                  href={`/p/${e.slug}`}
                  title={`${designation(e.num)} · ${e.title} — ${e.author}`}
                  className="absolute block overflow-hidden rounded-[3px] border border-photon/25 opacity-80 transition hover:z-20 hover:scale-150 hover:opacity-100 hover:border-photon"
                  style={{ left: x - size / 2, top: y - size / 2, width: size, height: size }}
                >
                  <FadeImg src={e.shot!} alt="" className="h-full w-full object-cover" loading="eager" decoding="async" />
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Far-side dimming: whatever orbits past the top fades into the dark */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
        style={{ background: "linear-gradient(to bottom, rgba(6,5,8,0.92) 12%, transparent 82%)" }}
      />

      {/* The hole itself: circular shadow + photon ring, screen-space like a real BH */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full max-sm:h-[84px] max-sm:w-[84px]"
        style={{
          background: "radial-gradient(circle, #000 62%, rgba(6,5,8,0.85) 74%, transparent 100%)",
          boxShadow:
            "0 0 0 1.5px rgba(255,217,160,0.65), 0 0 22px 4px rgba(255,158,61,0.35), 0 0 90px 20px rgba(255,158,61,0.12), inset 0 0 18px 6px rgba(255,158,61,0.18)",
        }}
      />
    </div>
  );
}
