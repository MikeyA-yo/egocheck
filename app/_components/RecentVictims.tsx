'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ACTIVITIES, type ActivityItem } from '../_lib/mockData'

const VISIBLE = 5

interface SlottedItem extends ActivityItem {
  key: number
}

export default function RecentVictims() {
  const [items, setItems] = useState<SlottedItem[]>(() =>
    ACTIVITIES.slice(0, VISIBLE).map((item, i) => ({ ...item, key: i }))
  )
  const cursor = useRef(VISIBLE)

  useEffect(() => {
    const interval = setInterval(() => {
      const c = cursor.current
      const next = ACTIVITIES[c % ACTIVITIES.length]
      setItems((prev) => [...prev.slice(1), { ...next, key: c }])
      cursor.current = c + 1
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="border border-border rounded-lg p-6 bg-surface flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs text-muted uppercase tracking-widest">Live feed</p>
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-end">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.key}
              layout
              initial={{ opacity: 0, y: 12, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(2px)', transition: { duration: 0.25 } }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex items-start gap-2 py-2 border-b border-border/50 last:border-b-0"
            >
              <span className="text-muted/30 mt-1 shrink-0 text-xs">›</span>
              <p className="text-xs text-muted leading-relaxed flex-1">{item.text}</p>
              <span className="text-xs text-muted/30 shrink-0 ml-2 whitespace-nowrap">{item.timeAgo}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
