import Link from 'next/link'
import { getTierInfo } from './_lib/mockData'
import ScoreTicker from './_components/ScoreTicker'

export default function Home() {
  const teaserTier = getTierInfo(47)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-6 py-16 sm:py-24">

        {/* Nav */}
        <nav className="flex items-center justify-between mb-20">
          <span className="font-mono text-sm text-foreground font-semibold tracking-tight">EgoCheck</span>
          <Link
            href="/leaderboard"
            className="text-xs text-muted hover:text-foreground transition-colors uppercase tracking-widest"
          >
            Leaderboard
          </Link>
        </nav>

        {/* Hero */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-semibold text-foreground leading-tight tracking-tight mb-5">
              Your resume is probably worse than you think.
            </h1>
            <p className="text-muted text-lg leading-relaxed max-w-lg">
              Paste it in. Get a blunt, section-by-section teardown from a hiring manager
              with no patience for filler. Your EgoCheck Score awaits.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
            <Link
              href="/check"
              className="inline-flex items-center justify-center px-7 py-3.5 bg-accent hover:bg-accent-hover rounded text-white font-medium transition-colors text-base"
            >
              Check My Ego
            </Link>
            <p className="text-muted text-sm self-center">
              Join <span className="text-foreground font-mono">2,847</span> people who&apos;ve had their egos checked.
            </p>
          </div>

          {/* Live score ticker */}
          <div className="mb-10 -mx-6">
            <ScoreTicker />
          </div>

          {/* Sample score teaser */}
          <div className="border border-border rounded-lg p-6 bg-surface">
            <p className="text-xs text-muted uppercase tracking-widest mb-5">Sample result</p>

            <div className="flex items-start gap-6 mb-5">
              <div>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="font-mono text-5xl font-bold text-foreground leading-none">47</span>
                  <span className="font-mono text-lg text-muted">/100</span>
                </div>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border ${teaserTier.bg} ${teaserTier.border} mt-2`}>
                  <span className="text-xs">{teaserTier.emoji}</span>
                  <span className={`text-xs font-medium ${teaserTier.color}`}>{teaserTier.label}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted italic leading-relaxed">
                  &ldquo;You put in the work. The resume just doesn&apos;t show it yet.&rdquo;
                </p>
              </div>
            </div>

            <div className="space-y-2 border-t border-border pt-4">
              {[
                { label: 'Headline / Summary', score: 10, max: 20 },
                { label: 'Experience', score: 12, max: 20 },
                { label: 'Skills', score: 10, max: 20 },
                { label: 'Structure', score: 11, max: 20 },
                { label: 'Overall Voice', score: 4, max: 20 },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="text-xs text-muted w-36 shrink-0">{s.label}</span>
                  <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent/50 rounded-full"
                      style={{ width: `${(s.score / s.max) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-muted w-10 text-right">{s.score}/{s.max}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="font-mono text-xs text-muted">EgoCheck v0.1</span>
          <div className="flex gap-6">
            <Link href="/leaderboard" className="text-xs text-muted hover:text-foreground transition-colors">
              Leaderboard
            </Link>
            <Link href="/check" className="text-xs text-muted hover:text-foreground transition-colors">
              Check Mine
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
