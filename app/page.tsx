import Link from 'next/link'
import ScoreTicker from './_components/ScoreTicker'
import SampleResultCard from './_components/SampleResultCard'
import RecentVictims from './_components/RecentVictims'

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-6 py-16 sm:py-24">

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
        <div className="max-w-2xl mb-12">
          <h1 className="text-4xl sm:text-5xl font-semibold text-foreground leading-tight tracking-tight mb-5">
            Your resume is probably worse than you think.
          </h1>
          <p className="text-muted text-lg leading-relaxed">
            Paste it in. Get a blunt, section-by-section teardown from a hiring manager
            with no patience for filler. Your EgoCheck Score awaits.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start gap-4 mb-12">
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

        {/* Score ticker */}
        <div className="mb-12 -mx-6">
          <ScoreTicker />
        </div>

        {/* Sample result + live feed */}
        <div className="grid lg:grid-cols-2 gap-6">
          <SampleResultCard />
          <RecentVictims />
        </div>

      </main>

      <footer className="border-t border-border py-6 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
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
