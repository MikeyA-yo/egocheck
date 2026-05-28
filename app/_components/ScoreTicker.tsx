'use client'

import { HALL_OF_FAME, WALL_OF_SHAME, getTierInfo, type LeaderboardEntry } from '../_lib/mockData'

const FAME_ROW  = [...HALL_OF_FAME,  ...HALL_OF_FAME]
const SHAME_ROW = [...WALL_OF_SHAME, ...WALL_OF_SHAME]

const MASK = 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'

function TickerCard({ entry }: { entry: LeaderboardEntry }) {
  const tier = getTierInfo(entry.score)
  return (
    <div className={`shrink-0 flex items-center gap-2.5 rounded-md border px-3.5 py-2 ${tier.bg} ${tier.border}`}>
      <span className="font-mono text-xs font-medium text-foreground/70 tracking-tight">
        {entry.pseudonym}
      </span>
      <span className="text-muted/40 text-xs">·</span>
      <span className={`font-mono text-sm font-bold ${tier.color}`}>{entry.score}</span>
      <span className="text-sm leading-none">{tier.emoji}</span>
    </div>
  )
}

function TickerRow({
  items,
  direction,
  label,
}: {
  items: LeaderboardEntry[]
  direction: 'left' | 'right'
  label: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-base shrink-0 select-none" title={label}>{label}</span>
      <div
        className="flex-1 overflow-hidden"
        style={{ maskImage: MASK, WebkitMaskImage: MASK }}
        aria-hidden="true"
      >
        <div className={`flex gap-2.5 w-max ${direction === 'left' ? 'animate-ticker' : 'animate-ticker-reverse'}`}>
          {items.map((entry, i) => (
            <TickerCard key={i} entry={entry} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ScoreTicker() {
  return (
    <div className="ticker-wrap space-y-2.5 select-none">
      <TickerRow items={FAME_ROW}  direction="left"  label="🏆" />
      <TickerRow items={SHAME_ROW} direction="right" label="💀" />
    </div>
  )
}
