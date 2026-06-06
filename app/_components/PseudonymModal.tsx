'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { generatePseudonym, type InputType } from '../_lib/mockData'

interface Props {
  score: number
  tier: string
  tierEmoji: string
  roastHeadline: string
  inputType: InputType
  onClose: () => void
}

export default function PseudonymModal({ score, tier, tierEmoji, roastHeadline, inputType, onClose }: Props) {
  const [pseudonym, setPseudonym] = useState(() => generatePseudonym())
  const [regeneratesLeft, setRegeneratesLeft] = useState(3)
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)
  const [aliasError, setAliasError] = useState('')

  const handleRegenerate = () => {
    if (regeneratesLeft <= 0) return
    setPseudonym(generatePseudonym())
    setRegeneratesLeft((r) => r - 1)
    setAliasError('')
  }

  const handleAliasChange = (val: string) => {
    setPseudonym(val)
    if (aliasError) setAliasError('')
  }

  const validateAlias = () => {
    const trimmed = pseudonym.trim()
    if (trimmed.length < 3) return 'Alias must be at least 3 characters.'
    if (trimmed.length > 30) return 'Alias must be 30 characters or fewer.'
    if (!/^[\w\s\-_.]+$/.test(trimmed)) return 'Only letters, numbers, spaces, _ - and . allowed.'
    return ''
  }

  const handlePublish = async () => {
    const err = validateAlias()
    if (err) { setAliasError(err); return }
    const trimmedAlias = pseudonym.trim()
    setPseudonym(trimmedAlias)
    setPublishing(true)
    try {
      await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pseudonym: trimmedAlias, score, tier, tierEmoji, roastHeadline, inputType }),
      })
    } catch {
      // Fail silently — still show published state
    }
    setPublishing(false)
    setPublished(true)
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
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-muted uppercase tracking-widest">Your alias</p>
                  <span className={`text-xs font-mono transition-colors ${pseudonym.length > 30 ? 'text-red-400' : 'text-muted/50'}`}>
                    {pseudonym.length}/30
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={pseudonym}
                    onChange={(e) => handleAliasChange(e.target.value)}
                    maxLength={35}
                    spellCheck={false}
                    className={`w-full bg-surface border rounded p-4 pr-20 font-mono text-sm text-foreground focus:outline-none transition-colors ${
                      aliasError ? 'border-red-500/50 focus:border-red-500' : 'border-border focus:border-foreground/20'
                    }`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted pointer-events-none">
                    {tierEmoji} {score}/100
                  </span>
                </div>
                <AnimatePresence>
                  {aliasError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-red-400 text-xs mt-2"
                    >
                      {aliasError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleRegenerate}
                  disabled={regeneratesLeft === 0 || publishing}
                  className="w-full py-2.5 border border-border rounded text-sm text-muted hover:text-foreground hover:border-foreground/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Give me another
                  {regeneratesLeft > 0 && (
                    <span className="ml-2 text-xs opacity-50">({regeneratesLeft} left)</span>
                  )}
                </button>
                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="w-full py-3 bg-accent hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed rounded text-white font-medium text-sm transition-colors"
                >
                  {publishing ? 'Publishing...' : 'Publish Anonymously'}
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
