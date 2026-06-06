'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, animate } from 'motion/react'
import {
  MOCK_RESULTS,
  LOADING_MESSAGES,
  type EgoCheckResult,
  type InputType,
  getTierInfo,
} from '../_lib/mockData'
import PseudonymModal from './PseudonymModal'

type Step = 'input' | 'loading' | 'reveal' | 'breakdown'
type InputMethod = 'text' | 'pdf' | 'url'

type CheckPayload =
  | { method: 'text'; text: string; inputType: InputType }
  | { method: 'pdf'; pdfBase64: string; inputType: InputType }
  | { method: 'url'; url: string; inputType: InputType }

const page = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

const methodSlide = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22 } },
  exit:    { opacity: 0, y: -4, transition: { duration: 0.15 } },
}

const sectionList = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const sectionCard = {
  hidden: { opacity: 0, x: -12 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.35 } },
}

export default function CheckFlow() {
  const [step, setStep] = useState<Step>('input')

  // Input state
  const [inputType, setInputType]   = useState<InputType>('resume')
  const [inputMethod, setInputMethod] = useState<InputMethod>('text')
  const [inputText, setInputText]   = useState('')
  const [pdfFile, setPdfFile]       = useState<File | null>(null)
  const [urlInput, setUrlInput]     = useState('')

  // Error/validation state
  const [charError, setCharError]   = useState(false)
  const [pdfError, setPdfError]     = useState('')
  const [urlError, setUrlError]     = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Result state
  const [result, setResult]         = useState<EgoCheckResult | null>(null)
  const [displayScore, setDisplayScore] = useState(0)
  const [scoreLanded, setScoreLanded] = useState(false)
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0)
  const [showModal, setShowModal]   = useState(false)

  // Holds the payload from handleSubmit so the loading effect can read it
  const pendingPayload = useRef<CheckPayload | null>(null)

  const charCount  = inputText.length
  const isUnderMin = charCount < 100
  const isOverMax  = charCount > 5000

  const clearErrors = () => {
    setCharError(false)
    setPdfError('')
    setUrlError('')
  }

  const handleSubmit = async () => {
    if (inputMethod === 'text') {
      if (isUnderMin) { setCharError(true); return }
      if (isOverMax) return
      pendingPayload.current = { method: 'text', text: inputText, inputType }

    } else if (inputMethod === 'pdf') {
      if (!pdfFile) { setPdfError('Select a PDF file first.'); return }
      setIsSubmitting(true)
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve((reader.result as string).split(',')[1])
          reader.onerror = reject
          reader.readAsDataURL(pdfFile)
        })
        pendingPayload.current = { method: 'pdf', pdfBase64: base64, inputType }
      } catch {
        setPdfError('Could not read the file. Try again.')
        setIsSubmitting(false)
        return
      }
      setIsSubmitting(false)

    } else {
      if (!urlInput.match(/^https?:\/\/.+/)) {
        setUrlError('Enter a valid URL starting with https://')
        return
      }
      pendingPayload.current = { method: 'url', url: urlInput, inputType }
    }

    clearErrors()
    setLoadingMsgIdx(0)
    setStep('loading')
  }

  const handleStartOver = () => {
    setStep('input')
    setInputText('')
    setPdfFile(null)
    setUrlInput('')
    setInputMethod('text')
    clearErrors()
    setResult(null)
    setShowModal(false)
  }

  // Loading: call API + enforce 4s minimum for progress bar animation
  useEffect(() => {
    if (step !== 'loading') return
    const payload = pendingPayload.current
    if (!payload) return

    const msgInterval = setInterval(() => setLoadingMsgIdx((i) => i + 1), 750)
    const controller  = new AbortController()

    const minDelay = new Promise<void>((r) => setTimeout(r, 4000))
    const apiCall  = fetch('/api/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    }).then((r) => r.json())

    Promise.all([minDelay, apiCall])
      .then(([, data]) => {
        clearInterval(msgInterval)
        setResult(
          (data as EgoCheckResult)?.score !== undefined
            ? (data as EgoCheckResult)
            : MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)]
        )
        setDisplayScore(0)
        setScoreLanded(false)
        setStep('reveal')
      })
      .catch((err) => {
        if ((err as Error).name === 'AbortError') return
        clearInterval(msgInterval)
        setResult(MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)])
        setDisplayScore(0)
        setScoreLanded(false)
        setStep('reveal')
      })

    return () => { clearInterval(msgInterval); controller.abort() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  // Score counter via motion animate()
  useEffect(() => {
    if (step !== 'reveal' || !result) return
    const controls = animate(0, result.score, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplayScore(Math.round(v)),
      onComplete: () => setScoreLanded(true),
    })
    return () => controls.stop()
  }, [step, result])

  const currentMessage = LOADING_MESSAGES[loadingMsgIdx % LOADING_MESSAGES.length]

  return (
    <div className="bg-background">
      <AnimatePresence mode="wait">

        {/* ── Input ── */}
        {step === 'input' && (
          <motion.div key="input" variants={page} initial="initial" animate="animate" exit="exit">
            <div className="min-h-screen max-w-2xl mx-auto px-6 py-12">
              <div className="flex items-center justify-between mb-12">
                <Link href="/" className="font-mono text-sm text-muted hover:text-foreground transition-colors">
                  ← EgoCheck
                </Link>
                <Link href="/leaderboard" className="text-xs text-muted hover:text-foreground transition-colors uppercase tracking-widest">
                  Leaderboard
                </Link>
              </div>

              <div className="mb-8">
                <h1 className="text-2xl font-semibold text-foreground mb-2">Drop it. We&apos;ll be honest.</h1>
                <p className="text-muted text-sm">
                  Paste your text, upload a PDF, or drop a URL. We&apos;ll tell you exactly where you stand.
                </p>
              </div>

              {/* What type are you submitting */}
              <div className="mb-4">
                <div className="flex gap-2">
                  {(['resume', 'linkedin', 'portfolio'] as InputType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setInputType(type)}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors capitalize ${
                        inputType === type
                          ? 'bg-accent/15 text-accent border border-accent/30'
                          : 'border border-border text-muted hover:text-foreground hover:border-foreground/20'
                      }`}
                    >
                      {type === 'linkedin' ? 'LinkedIn Bio' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* How are you submitting it */}
              <div className="flex gap-2 mb-5">
                {(['text', 'pdf', 'url'] as InputMethod[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setInputMethod(m); clearErrors() }}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      inputMethod === m
                        ? 'bg-foreground/10 text-foreground border border-foreground/20'
                        : 'border border-border text-muted hover:text-foreground hover:border-foreground/20'
                    }`}
                  >
                    {m === 'text' ? 'Paste Text' : m === 'pdf' ? 'Upload PDF' : 'Enter URL'}
                  </button>
                ))}
              </div>

              {/* Input content area — animated on method switch */}
              <AnimatePresence mode="wait">

                {inputMethod === 'text' && (
                  <motion.div key="text" variants={methodSlide} initial="initial" animate="animate" exit="exit">
                    <textarea
                      value={inputText}
                      onChange={(e) => {
                        setInputText(e.target.value)
                        if (charError && e.target.value.length >= 100) setCharError(false)
                      }}
                      maxLength={5000}
                      placeholder={
                        inputType === 'resume'
                          ? 'Paste your resume text here. Work experience, summary, skills — all of it.'
                          : inputType === 'linkedin'
                          ? 'Paste your LinkedIn About section or full profile summary here.'
                          : 'Paste your portfolio description, bio, or project showcase text here.'
                      }
                      className={`w-full h-56 bg-surface border rounded-lg p-4 text-sm text-foreground placeholder:text-muted resize-none focus:outline-none transition-colors leading-relaxed ${
                        charError
                          ? 'border-red-500/50 focus:border-red-500'
                          : isOverMax
                          ? 'border-amber-500/50'
                          : 'border-border focus:border-foreground/20'
                      }`}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <div className="h-4">
                        <AnimatePresence>
                          {charError && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                              className="text-red-400 text-xs"
                            >
                              Give us something to work with. (100 chars min)
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                      <span className={`text-xs font-mono transition-colors ${isOverMax ? 'text-amber-400' : 'text-muted'}`}>
                        {charCount} / 5000
                      </span>
                    </div>
                  </motion.div>
                )}

                {inputMethod === 'pdf' && (
                  <motion.div key="pdf" variants={methodSlide} initial="initial" animate="animate" exit="exit">
                    <label
                      className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        pdfFile
                          ? 'border-accent/40 bg-accent/5'
                          : pdfError
                          ? 'border-red-500/40 bg-red-500/5'
                          : 'border-border hover:border-foreground/30 bg-surface'
                      }`}
                    >
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
                            setPdfError('File must be a PDF.')
                            return
                          }
                          if (file.size > 4 * 1024 * 1024) {
                            setPdfError('PDF must be under 4 MB.')
                            return
                          }
                          setPdfError('')
                          setPdfFile(file)
                        }}
                      />
                      {pdfFile ? (
                        <div className="text-center px-4">
                          <p className="text-sm text-foreground font-medium truncate max-w-xs">{pdfFile.name}</p>
                          <p className="text-xs text-muted mt-1">{(pdfFile.size / 1024).toFixed(0)} KB · PDF ready</p>
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); setPdfFile(null) }}
                            className="text-xs text-muted/50 hover:text-red-400 mt-3 transition-colors"
                          >
                            Remove file
                          </button>
                        </div>
                      ) : (
                        <div className="text-center px-4">
                          <p className="text-sm text-muted">Drop your CV here or <span className="text-foreground">click to browse</span></p>
                          <p className="text-xs text-muted/50 mt-1.5">PDF only · Max 4 MB</p>
                        </div>
                      )}
                    </label>
                    <div className="h-5 mt-2">
                      <AnimatePresence>
                        {pdfError && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="text-red-400 text-xs"
                          >
                            {pdfError}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {inputMethod === 'url' && (
                  <motion.div key="url" variants={methodSlide} initial="initial" animate="animate" exit="exit">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => { setUrlInput(e.target.value); setUrlError('') }}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
                      placeholder="https://yourportfolio.com  or  https://example.com/cv.pdf"
                      className={`w-full bg-surface border rounded-lg p-4 text-sm text-foreground placeholder:text-muted focus:outline-none transition-colors ${
                        urlError ? 'border-red-500/50 focus:border-red-500' : 'border-border focus:border-foreground/20'
                      }`}
                    />
                    <div className="h-5 mt-2">
                      <AnimatePresence>
                        {urlError ? (
                          <motion.p
                            key="err"
                            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="text-red-400 text-xs"
                          >
                            {urlError}
                          </motion.p>
                        ) : (
                          <motion.p
                            key="hint"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="text-xs text-muted/50"
                          >
                            Works with portfolio sites and direct PDF links. LinkedIn is login-gated and may not work.
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              <div className="mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={isOverMax || isSubmitting}
                  className="w-full py-3.5 bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed rounded text-white font-medium transition-colors"
                >
                  {isSubmitting ? 'Reading file...' : 'Check My Ego'}
                </button>
                <p className="text-xs text-muted text-center mt-4 leading-relaxed">
                  We do not store your content. Results are anonymous unless you choose to publish.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Loading ── */}
        {step === 'loading' && (
          <motion.div
            key="loading"
            variants={page}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen flex flex-col items-center justify-center px-6"
          >
            <div className="w-full max-w-sm">
              <div className="mb-10">
                <div className="h-px bg-border w-full rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '96%' }}
                    transition={{ duration: 4.0, ease: [0.4, 0, 0.2, 1] }}
                  />
                </div>
              </div>

              <div className="text-center h-8 overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingMsgIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22 }}
                    className="text-muted text-sm tracking-wide absolute"
                  >
                    {currentMessage}
                  </motion.p>
                </AnimatePresence>
              </div>

              <p className="text-center text-xs text-muted/50 mt-12 tracking-widest uppercase">
                Analyzing your delusion
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Reveal ── */}
        {step === 'reveal' && result && (() => {
          const tier = getTierInfo(result.score)
          return (
            <motion.div
              key="reveal"
              variants={page}
              initial="initial"
              animate="animate"
              exit="exit"
              className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
            >
              <div className="w-full max-w-md text-center">
                <p className="text-xs text-muted uppercase tracking-widest mb-8">
                  Your EgoCheck Score
                </p>

                <div className="mb-3 flex items-baseline justify-center gap-2">
                  <motion.span
                    className="font-mono text-9xl font-bold leading-none text-foreground tracking-tight"
                    animate={scoreLanded ? { scale: [1, 1.05, 0.98, 1] } : {}}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                  >
                    {displayScore}
                  </motion.span>
                  <span className="font-mono text-3xl text-muted font-light">/100</span>
                </div>

                <AnimatePresence>
                  {scoreLanded && (
                    <motion.div
                      key="verdict"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded border ${tier.bg} ${tier.border} mb-5 mt-2`}>
                        <span>{tier.emoji}</span>
                        <span className={`text-sm font-medium ${tier.color}`}>{tier.label}</span>
                      </div>

                      <p className="text-muted text-base italic leading-relaxed mb-10 max-w-xs mx-auto">
                        &ldquo;{result.roastHeadline}&rdquo;
                      </p>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="flex flex-col sm:flex-row gap-3 justify-center"
                      >
                        <button
                          onClick={() => setStep('breakdown')}
                          className="px-6 py-3 bg-accent hover:bg-accent-hover rounded text-white font-medium transition-colors"
                        >
                          See Full Breakdown
                        </button>
                        <button
                          onClick={() => setShowModal(true)}
                          className="px-6 py-3 border border-border hover:border-foreground/30 rounded text-muted hover:text-foreground transition-colors"
                        >
                          Publish to Leaderboard
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })()}

        {/* ── Breakdown ── */}
        {step === 'breakdown' && result && (() => {
          const tier = getTierInfo(result.score)
          return (
            <motion.div key="breakdown" variants={page} initial="initial" animate="animate" exit="exit">
              <div className="min-h-screen max-w-2xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-10">
                  <button
                    onClick={() => setStep('reveal')}
                    className="text-muted hover:text-foreground text-sm transition-colors"
                  >
                    ← Back to score
                  </button>
                  <Link href="/leaderboard" className="text-xs text-muted hover:text-foreground transition-colors uppercase tracking-widest">
                    Leaderboard
                  </Link>
                </div>

                <div className="mb-10">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-mono text-5xl font-bold text-foreground">{result.score}</span>
                    <span className="font-mono text-xl text-muted">/100</span>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded border ${tier.bg} ${tier.border} mb-3`}>
                    <span>{tier.emoji}</span>
                    <span className={`text-sm font-medium ${tier.color}`}>{tier.label}</span>
                  </div>
                  <p className="text-muted text-sm italic">&ldquo;{result.roastHeadline}&rdquo;</p>
                </div>

                <motion.div variants={sectionList} initial="hidden" animate="show" className="space-y-4">
                  {result.sections.map((section) => {
                    const sectionTier = getTierInfo((section.score / section.maxScore) * 100)
                    return (
                      <motion.div
                        key={section.name}
                        variants={sectionCard}
                        className="bg-surface border border-border rounded-lg p-5"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-medium text-foreground">{section.name}</h3>
                          <span className={`font-mono text-sm font-semibold ${sectionTier.color} ml-4 shrink-0`}>
                            {section.score}/{section.maxScore}
                          </span>
                        </div>
                        <ul className="space-y-2 mb-4">
                          {section.bullets.map((bullet, j) => (
                            <li key={j} className="text-sm text-muted flex gap-2">
                              <span className="text-border mt-0.5 shrink-0">—</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="border-t border-border pt-3">
                          <p className="text-xs text-muted/60 uppercase tracking-widest mb-1">Fix this</p>
                          <p className="text-sm text-foreground/80">{section.improvement}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>

                <div className="mt-10 pt-8 border-t border-border">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setShowModal(true)}
                      className="flex-1 py-3 bg-accent hover:bg-accent-hover rounded text-white font-medium transition-colors"
                    >
                      Publish to Leaderboard
                    </button>
                    <button
                      onClick={handleStartOver}
                      className="flex-1 py-3 border border-border hover:border-foreground/30 rounded text-muted hover:text-foreground transition-colors"
                    >
                      Start Over
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })()}

      </AnimatePresence>

      <AnimatePresence>
        {showModal && result && (
          <PseudonymModal
            key="modal"
            score={result.score}
            tier={result.tier}
            tierEmoji={result.tierEmoji}
            roastHeadline={result.roastHeadline}
            inputType={inputType}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
