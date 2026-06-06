import Link from 'next/link';
import { aiAssistedBuildProjects, aiBuildWallStats } from '@/content/aiBuildWall';

interface AiBuildWallProps {
  compact?: boolean;
}

const AiBuildWall = ({ compact = false }: AiBuildWallProps) => {
  const visibleProjects = compact ? aiAssistedBuildProjects.slice(0, 3) : aiAssistedBuildProjects;

  return (
    <section
      id="ai-builds-section"
      className="relative overflow-hidden bg-gray-950 py-20 text-white"
      aria-labelledby="ai-build-wall-heading"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.28),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(147,51,234,0.22),transparent_30%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <span className="mb-4 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-sm font-medium text-jstar-blue backdrop-blur">
              AI-Assisted Build Wall
            </span>
            <h2 id="ai-build-wall-heading" className="text-3xl font-bold tracking-tight md:text-5xl">
              AI-accelerated websites/products shipped fast — with the stack in plain sight.
            </h2>
            <p className="mt-5 max-w-2xl text-lg text-gray-300">
              A public ledger of shipped sites where AI was used as a production partner: strategy,
              code, SVG direction, image generation, SEO, and polish. Client-friendly on the surface;
              builder-detail underneath.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
            {aiBuildWallStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-black/25 p-4 text-center">
                <div className="text-2xl font-bold text-white md:text-3xl">{stat.value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project) => (
            <article
              key={project.url}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.075]"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${project.accent}`} />
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">Live build</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">{project.name}</h3>
                </div>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold text-gray-200 transition-colors hover:border-jstar-blue/60 hover:text-white"
                  aria-label={`Open ${project.name}`}
                >
                  Visit ↗
                </a>
              </div>

              <p className="text-sm leading-6 text-gray-300">{project.description}</p>

              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-jstar-blue">AI stack used</p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((model) => (
                    <span key={model} className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-200 ring-1 ring-white/10">
                      {model}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-2 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-gray-300">
                <p><span className="font-semibold text-white">Banner:</span> {project.bannerAttribution}</p>
                {project.logoAttribution && (
                  <p><span className="font-semibold text-white">Logo/detail:</span> {project.logoAttribution}</p>
                )}
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-sm font-medium leading-6 text-white">
                  <span className="text-jstar-blue">What this proves:</span> {project.proofLine}
                </p>
              </div>
            </article>
          ))}
        </div>

        {compact && (
          <div className="mt-10 text-center">
            <Link
              href="/ai-builds"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-jstar-blue to-faith-purple px-7 py-3 font-semibold text-white shadow-lg shadow-jstar-blue/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              View the full AI build wall
              <span className="ml-2">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default AiBuildWall;
