'use client'

import { HALL_OF_FAME, WALL_OF_SHAME, getTierInfo, type LeaderboardEntry } from '../_lib/mockData'

const ALL_ENTRIES = [...HALL_OF_FAME, ...WALL_OF_SHAME]
const ROW1 = [...ALL_ENTRIES, ...ALL_ENTRIES]
const ROW2 = [...[...ALL_ENTRIES].reverse(), ...[...ALL_ENTRIES].reverse()]

function TickerCard({ entry }: { entry: LeaderboardEntry }) {
  const tier = getTierInfo(entry.score)
  return (
    <div
      className={`shrink-0 flex items-center gap-2.5 rounded-md border px-3.5 py-2 ${tier.bg} ${tier.border}`}
    >
      <span className="font-mono text-xs font-medium text-foreground/70 tracking-tight">
        {entry.pseudonym}
      </span>
      <span className="text-muted/50 text-xs">·</span>
      <span className={`font-mono text-sm font-bold ${tier.color}`}>
        {entry.score}
      </span>
      <span className="text-sm leading-none">{tier.emoji}</span>
    </div>
  )
}

export default function ScoreTicker() {
  return (
    <div
      className="ticker-wrap relative overflow-hidden w-full py-1 select-none"
      style={{
        maskImage:
          'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)',
      }}
      aria-hidden="true"
    >
      <div className="flex gap-2.5 mb-2.5 animate-ticker w-max">
        {ROW1.map((entry, i) => (
          <TickerCard key={i} entry={entry} />
        ))}
      </div>
      <div className="flex gap-2.5 animate-ticker-reverse w-max">
        {ROW2.map((entry, i) => (
          <TickerCard key={i} entry={entry} />
        ))}
      </div>
    </div>
  )
}
