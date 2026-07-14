import Link from "next/link";
import { notFound } from "next/navigation";
import ScoreBars from "@/components/ScoreBars";
import { entries, bySlug, designation, CATEGORY_LABEL } from "@/lib/data";

export function generateStaticParams() {
  return entries.map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const e = bySlug(params.slug);
  return { title: e ? `${e.title} · Simathon Deep Field` : "Simathon Deep Field" };
}

// Same embed logic the workshop gallery used — YouTube, Loom, Drive, raw files.
function toEmbed(url: string | null): { kind: "iframe" | "raw"; src: string } | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.slice(1).split("/")[0];
      if (id) return { kind: "iframe", src: `https://www.youtube.com/embed/${id}` };
    }
    if (host.endsWith("youtube.com")) {
      const id = u.searchParams.get("v") || u.pathname.split("/").pop();
      if (id) return { kind: "iframe", src: `https://www.youtube.com/embed/${id}` };
    }
    if (host.endsWith("loom.com")) {
      const id = u.pathname.split("/").pop();
      if (id) return { kind: "iframe", src: `https://www.loom.com/embed/${id}` };
    }
    if (host.endsWith("drive.google.com")) {
      const m = u.pathname.match(/\/file\/d\/([^/]+)/);
      const id = m?.[1] || u.searchParams.get("id");
      if (id) return { kind: "iframe", src: `https://drive.google.com/file/d/${id}/preview` };
    }
    if (/\.(mp4|webm|mov)$/i.test(u.pathname)) return { kind: "raw", src: url };
  } catch {
    /* unparseable link — skip embed, keep the raw link below */
  }
  return null;
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const e = bySlug(params.slug);
  if (!e) notFound();

  const embed = toEmbed(e.video_url);

  return (
    <main className="mx-auto max-w-3xl px-4 pt-10">
      <Link href="/" className="font-mono text-[11px] tracking-widest text-dim hover:text-ink">
        ← THE FIELD
      </Link>

      {/* Catalog header strip */}
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em]">
        <span className="text-photon">{designation(e.num)}</span>
        {e.category && <span className="text-dim">{CATEGORY_LABEL[e.category]} category</span>}
        {e.winner && (
          <span className="text-ember">
            ★ {e.winner === "1" ? "First place" : e.winner === "2" ? "Second place" : "Third place"}
          </span>
        )}
        {e.isLate && <span className="text-redshift">redshifted*</span>}
      </div>

      <h1 className="font-display mt-3 text-4xl leading-tight sm:text-5xl">{e.title}</h1>
      {e.tagline && <p className="mt-3 text-lg text-ink/80">{e.tagline}</p>}
      <div className="mt-3 text-sm text-dim">
        observed by <span className="text-ink">{e.author}</span>
        {e.observed && <> · first light {new Date(e.observed).toISOString().slice(0, 10)}</>}
      </div>

      {embed && (
        <div className="mt-8 aspect-video overflow-hidden rounded-lg border border-white/10 bg-black">
          {embed.kind === "raw" ? (
            <video src={embed.src} controls className="h-full w-full" />
          ) : (
            <iframe
              src={embed.src}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          )}
        </div>
      )}

      {e.shot && (
        <div className="mt-5 overflow-hidden rounded-lg border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={e.shot} alt={e.title} className="w-full" />
        </div>
      )}

      {/* Winner scores */}
      {e.scores && (
        <section className="mt-10 rounded-lg border border-ember/30 bg-ember/5 p-5">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-ember">
            instrument readout
          </h2>
          <ScoreBars scores={e.scores} className="mt-4 max-w-sm" />
        </section>
      )}

      {/* AI review — the public feedback every participant asked for */}
      <section className="mt-10">
        {e.feedback ? (
          <div
            className="rounded-2xl border-[1.5px] border-ember bg-gradient-to-b from-ember/10 to-ember/[0.03] p-6"
            style={{ boxShadow: "0 0 28px rgba(255,158,61,0.22), inset 0 0 34px rgba(255,158,61,0.05)" }}
          >
            <h2 className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-ember">
              <span aria-hidden className="text-sm">◈</span> AI review
            </h2>
            <div className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-ink/95">
              {e.feedback}
            </div>
          </div>
        ) : (
          <p className="font-mono text-sm text-dim">AI review pending. This object is still being examined.</p>
        )}
      </section>

      {/* Their own words */}
      {e.description && (
        <section className="mt-10">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-photon/80">
            in the builder&apos;s words
          </h2>
          <div className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-ink/85">
            {e.description}
          </div>
        </section>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        {e.github_url && (
          <a
            href={e.github_url}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-white/15 px-4 py-2 text-sm text-ink transition hover:border-photon/60 hover:text-photon"
          >
            view the source ↗
          </a>
        )}
        {e.video_url && !embed && (
          <a
            href={e.video_url}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-white/15 px-4 py-2 text-sm text-ink transition hover:border-photon/60 hover:text-photon"
          >
            watch the run ↗
          </a>
        )}
      </div>
    </main>
  );
}
