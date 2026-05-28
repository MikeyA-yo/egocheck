'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { HALL_OF_FAME, WALL_OF_SHAME, type LeaderboardEntry, getTierInfo } from '../_lib/mockData'

type Board = 'fame' | 'shame'

const INPUT_TYPE_LABEL: Record<string, string> = {
  resume: 'Resume',
  linkedin: 'LinkedIn',
  portfolio: 'Portfolio',
}

const entryList = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } },
}

const entryItem = {
  hidden: { opacity: 0, x: -10 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

function EntryCard({ entry }: { entry: LeaderboardEntry }) {
  const tier = getTierInfo(entry.score)
  return (
    <motion.div
      variants={entryItem}
      className="flex items-start gap-4 py-4 border-b border-border last:border-b-0"
    >
      <span className="font-mono text-xs text-muted w-5 shrink-0 pt-0.5">#{entry.rank}</span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="font-mono text-sm font-semibold text-foreground">{entry.pseudonym}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded border ${tier.bg} ${tier.border} ${tier.color}`}>
            {entry.tierEmoji} {entry.tier}
          </span>
          <span className="text-xs text-muted/50 border border-border rounded px-1.5 py-0.5">
            {INPUT_TYPE_LABEL[entry.inputType]}
          </span>
        </div>
        <p className="text-xs text-muted italic leading-snug mb-1">
          &ldquo;{entry.roastHeadline}&rdquo;
        </p>
        <p className="text-xs text-muted/40">{entry.timeAgo}</p>
      </div>

      <div className="shrink-0 text-right">
        <span className={`font-mono text-lg font-bold ${tier.color}`}>{entry.score}</span>
        <p className="text-xs text-muted/40">/100</p>
      </div>
    </motion.div>
  )
}

function BoardPanel({
  title,
  subtitle,
  entries,
}: {
  title: string
  subtitle: string
  entries: LeaderboardEntry[]
}) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <div className="mb-5">
        <h2 className="font-semibold text-foreground">{title}</h2>
        <p className="text-xs text-muted mt-0.5">{subtitle}</p>
      </div>
      <motion.div variants={entryList} initial="hidden" animate="show">
        {entries.map((entry) => (
          <EntryCard key={entry.pseudonym} entry={entry} />
        ))}
      </motion.div>
    </div>
  )
}

export default function Leaderboard() {
  const [activeBoard, setActiveBoard] = useState<Board>('fame')

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-start justify-between mb-10">
          <div>
            <Link
              href="/"
              className="text-xs text-muted hover:text-foreground transition-colors uppercase tracking-widest block mb-4"
            >
              ← EgoCheck
            </Link>
            <h1 className="text-2xl font-semibold text-foreground">Leaderboard</h1>
            <p className="text-muted text-sm mt-1">
              Resets in <span className="text-foreground font-mono">4 days</span>
            </p>
          </div>
          <Link
            href="/check"
            className="shrink-0 px-4 py-2 bg-accent hover:bg-accent-hover rounded text-white text-sm font-medium transition-colors"
          >
            Check My Ego
          </Link>
        </div>

        {/* Mobile tabs */}
        <div className="flex lg:hidden gap-2 mb-6">
          {(['fame', 'shame'] as Board[]).map((board) => (
            <button
              key={board}
              onClick={() => setActiveBoard(board)}
              className={`flex-1 py-2.5 rounded text-sm font-medium transition-colors ${
                activeBoard === board
                  ? board === 'fame'
                    ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                    : 'bg-red-400/10 text-red-400 border border-red-400/20'
                  : 'border border-border text-muted hover:text-foreground'
              }`}
            >
              {board === 'fame' ? '🏆 Hall of Fame' : '💀 Wall of Shame'}
            </button>
          ))}
        </div>

        {/* Desktop: side by side */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6">
          <BoardPanel title="🏆 Hall of Fame" subtitle="The untouchables. Study these." entries={HALL_OF_FAME} />
          <BoardPanel title="💀 Wall of Shame" subtitle="The certified delusions. Learn from them." entries={WALL_OF_SHAME} />
        </div>

        {/* Mobile: tabbed with AnimatePresence */}
        <div className="lg:hidden">
          <AnimatePresence mode="wait">
            {activeBoard === 'fame' ? (
              <motion.div
                key="fame"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.22 }}
              >
                <BoardPanel title="🏆 Hall of Fame" subtitle="The untouchables. Study these." entries={HALL_OF_FAME} />
              </motion.div>
            ) : (
              <motion.div
                key="shame"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.22 }}
              >
                <BoardPanel title="💀 Wall of Shame" subtitle="The certified delusions. Learn from them." entries={WALL_OF_SHAME} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-xs text-muted/40 text-center mt-10">
          All entries are anonymous. No real names or identifiable information are ever published.{' '}
          <button className="underline underline-offset-2 hover:text-muted transition-colors">
            Remove my entry
          </button>
        </p>
      </div>
    </div>
  )
}
