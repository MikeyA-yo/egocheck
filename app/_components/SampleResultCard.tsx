'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, animate, useInView } from 'motion/react'
import { getTierInfo } from '../_lib/mockData'

const SCORE = 47
const TIER  = getTierInfo(SCORE)

const SECTIONS = [
  { label: 'Headline / Summary', score: 10, max: 20 },
  { label: 'Experience',         score: 12, max: 20 },
  { label: 'Skills',             score: 10, max: 20 },
  { label: 'Structure',          score: 11, max: 20 },
  { label: 'Overall Voice',      score:  4, max: 20 },
]

export default function SampleResultCard() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const t = setTimeout(() => {
      const controls = animate(0, SCORE, {
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => setDisplayScore(Math.round(v)),
      })
      return () => controls.stop()
    }, 150)
    return () => clearTimeout(t)
  }, [isInView])

  return (
    <div ref={ref} className="border border-border rounded-lg p-6 bg-surface">
      <p className="text-xs text-muted uppercase tracking-widest mb-5">Sample result</p>

      <div className="flex items-start gap-6 mb-5">
        <div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="font-mono text-5xl font-bold text-foreground leading-none tabular-nums">
              {displayScore}
            </span>
            <span className="font-mono text-lg text-muted">/100</span>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border ${TIER.bg} ${TIER.border} mt-2`}>
            <span className="text-xs">{TIER.emoji}</span>
            <span className={`text-xs font-medium ${TIER.color}`}>{TIER.label}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted italic leading-relaxed">
            &ldquo;This resume says &lsquo;I watched tutorials&rsquo; more than &lsquo;I built things.&rsquo;&rdquo;
          </p>
        </div>
      </div>

      <div className="space-y-2.5 border-t border-border pt-4">
        {SECTIONS.map((s, i) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="text-xs text-muted w-36 shrink-0">{s.label}</span>
            <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-accent/50 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: isInView ? `${(s.score / s.max) * 100}%` : '0%' }}
                transition={{ duration: 0.7, delay: 0.9 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className="font-mono text-xs text-muted w-10 text-right">{s.score}/{s.max}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
