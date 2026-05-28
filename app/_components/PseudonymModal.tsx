'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { generatePseudonym } from '../_lib/mockData'

interface Props {
  score: number
  tier: string
  tierEmoji: string
  onClose: () => void
}

export default function PseudonymModal({ score, tierEmoji, onClose }: Props) {
  const [pseudonym, setPseudonym] = useState(() => generatePseudonym())
  const [regeneratesLeft, setRegeneratesLeft] = useState(3)
  const [published, setPublished] = useState(false)

  const handleRegenerate = () => {
    if (regeneratesLeft <= 0) return
    setPseudonym(generatePseudonym())
    setRegeneratesLeft((r) => r - 1)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="relative w-full max-w-md bg-surface-raised border border-border rounded-lg p-6 sm:p-8 z-10"
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.98 }}
        transition={{ type: 'spring', damping: 28, stiffness: 380, mass: 0.8 }}
      >
        <AnimatePresence mode="wait">
          {published ? (
            <motion.div
              key="published"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-4"
            >
              <div className="text-4xl mb-4">{score >= 60 ? '🏆' : '💀'}</div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {score >= 60 ? "You're on the board." : 'Your shame is now public.'}
              </h2>
              <p className="text-muted text-sm mb-1">Published as</p>
              <p className="font-mono text-accent text-lg font-semibold mb-1">{pseudonym}</p>
              <p className="text-muted text-sm mb-6">Share your shame (or glory).</p>
              <button
                onClick={onClose}
                className="w-full py-3 border border-border rounded text-muted hover:text-foreground hover:border-foreground/30 transition-colors text-sm"
              >
                Back to results
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Publish anonymously</h2>
                  <p className="text-muted text-sm mt-1">No real name. No email. Just the verdict.</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-muted hover:text-foreground transition-colors ml-4 mt-0.5 text-xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <p className="text-xs text-muted uppercase tracking-widest mb-3">Your alias</p>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pseudonym}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.18 }}
                    className="bg-surface border border-border rounded p-4 flex items-center justify-between"
                  >
                    <span className="font-mono text-foreground font-semibold">{pseudonym}</span>
                    <span className="text-xs text-muted ml-4">
                      {tierEmoji} {score}/100
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleRegenerate}
                  disabled={regeneratesLeft === 0}
                  className="w-full py-2.5 border border-border rounded text-sm text-muted hover:text-foreground hover:border-foreground/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Give me another
                  {regeneratesLeft > 0 && (
                    <span className="ml-2 text-xs opacity-50">({regeneratesLeft} left)</span>
                  )}
                </button>
                <button
                  onClick={() => setPublished(true)}
                  className="w-full py-3 bg-accent hover:bg-accent-hover rounded text-white font-medium text-sm transition-colors"
                >
                  Publish Anonymously
                </button>
              </div>

              <p className="text-xs text-muted text-center mt-4 leading-relaxed">
                Only your alias, score, and a generic verdict appear on the leaderboard.
                No identifying information is ever published.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
