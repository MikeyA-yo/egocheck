export type InputType = 'resume' | 'linkedin' | 'portfolio'

export interface SectionResult {
  name: string
  score: number
  maxScore: number
  bullets: string[]
  improvement: string
}

export interface EgoCheckResult {
  score: number
  tier: string
  tierEmoji: string
  roastHeadline: string
  sections: SectionResult[]
}

export interface LeaderboardEntry {
  rank: number
  pseudonym: string
  score: number
  tier: string
  tierEmoji: string
  roastHeadline: string
  inputType: InputType
  timeAgo: string
}

export function getTierInfo(score: number) {
  if (score >= 80) return { label: 'Untouchable', emoji: '🏆', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' }
  if (score >= 60) return { label: 'Solid. Room to grow.', emoji: '✅', color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20' }
  if (score >= 40) return { label: "It's giving effort.", emoji: '⚠️', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' }
  if (score >= 20) return { label: 'Certified Delusion', emoji: '🔥', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' }
  return { label: 'Start Over.', emoji: '💀', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' }
}

export const MOCK_RESULTS: EgoCheckResult[] = [
  {
    score: 87,
    tier: 'Untouchable',
    tierEmoji: '🏆',
    roastHeadline: 'Annoyingly well-crafted. You probably already have offers.',
    sections: [
      {
        name: 'Headline / Summary',
        score: 18,
        maxScore: 20,
        bullets: [
          'Sharp and specific — no generic "results-driven professional" nonsense.',
          'Quantified impact in the first two sentences.',
          'Reads like it was written by someone who actually knows what they do.',
        ],
        improvement: 'Add the specific industry vertical you target to make it 10/10.',
      },
      {
        name: 'Experience',
        score: 17,
        maxScore: 20,
        bullets: [
          'Every bullet leads with an action verb and a measurable outcome.',
          'The scope of impact is clear at each role.',
          'Progression is evident and logical.',
        ],
        improvement: 'One role is thin on metrics — fix that and this section is perfect.',
      },
      {
        name: 'Skills',
        score: 18,
        maxScore: 20,
        bullets: [
          'No padding. Every skill listed is relevant.',
          'Organised by category — shows systems thinking.',
          'Rare: you actually listed proficiency levels.',
        ],
        improvement: 'Remove one or two skills that are table stakes at your level.',
      },
      {
        name: 'Structure & Formatting',
        score: 17,
        maxScore: 20,
        bullets: [
          'Clean, scannable layout. Passes the 6-second test.',
          'Appropriate length for career stage.',
          'Consistent formatting throughout.',
        ],
        improvement: 'Tighten the margins — you have room for more whitespace.',
      },
      {
        name: 'Overall Voice',
        score: 17,
        maxScore: 20,
        bullets: [
          'Confident without being desperate.',
          'Zero filler phrases.',
          'The person behind the resume is legible.',
        ],
        improvement: 'One section reads slightly more formal than the rest — unify the tone.',
      },
    ],
  },
  {
    score: 63,
    tier: 'Solid. Room to grow.',
    tierEmoji: '✅',
    roastHeadline: 'Above average, which is not the bar you should be aiming for.',
    sections: [
      {
        name: 'Headline / Summary',
        score: 13,
        maxScore: 20,
        bullets: [
          'Specific enough to pass a 6-second scan.',
          'Missing the thing that makes you different from 50 similar candidates.',
          'Good instinct on length — could be sharper.',
        ],
        improvement: 'Add one specific differentiator: a niche, a number, or an unusual background.',
      },
      {
        name: 'Experience',
        score: 14,
        maxScore: 20,
        bullets: [
          'Most bullets are impact-focused — the right instinct.',
          'Some metrics are vague ("improved performance significantly").',
          'The most recent role is strong; earlier roles are weaker.',
        ],
        improvement: 'Go back to earlier roles and add at least one metric per bullet.',
      },
      {
        name: 'Skills',
        score: 12,
        maxScore: 20,
        bullets: [
          'Reasonable list, well-organised.',
          "A few skills are listed that your experience section doesn't support.",
          'Missing some core tools expected at this level.',
        ],
        improvement: "Align skills with your roles. If it's not in an experience bullet, cut it.",
      },
      {
        name: 'Structure & Formatting',
        score: 13,
        maxScore: 20,
        bullets: [
          'Clean layout — easy to skim.',
          'Slightly too long for career stage.',
          'Dates are formatted inconsistently.',
        ],
        improvement: 'Trim by 20%. Every line should earn its place.',
      },
      {
        name: 'Overall Voice',
        score: 11,
        maxScore: 20,
        bullets: [
          'Professional but forgettable.',
          'No sense of what the person is like to work with.',
          "Safe choices everywhere — safe doesn't get callbacks.",
        ],
        improvement: 'Find one authentic sentence that could only be you. Lead with it.',
      },
    ],
  },
  {
    score: 54,
    tier: "It's giving effort.",
    tierEmoji: '⚠️',
    roastHeadline: "You put in the work. The resume just doesn't show it yet.",
    sections: [
      {
        name: 'Headline / Summary',
        score: 10,
        maxScore: 20,
        bullets: [
          'Opens with "passionate about" — every other resume says this.',
          'Three adjectives, zero specifics.',
          'Reads like a template that was only half-edited.',
        ],
        improvement: "Replace the adjectives with one concrete thing you've built or shipped.",
      },
      {
        name: 'Experience',
        score: 12,
        maxScore: 20,
        bullets: [
          'Some bullets show real impact, others describe job duties.',
          '"Responsible for" appears three times — swap for action verbs.',
          'Chronology is correct but growth trajectory is unclear.',
        ],
        improvement: 'Rewrite all bullets in the format: [Verb] + [What] + [Result/Scale].',
      },
      {
        name: 'Skills',
        score: 10,
        maxScore: 20,
        bullets: [
          'The list is too long — 30+ skills signals keyword stuffing.',
          'Some skills are outdated or below your experience level.',
          'No structure to the list — it reads as a dump.',
        ],
        improvement: 'Cut to 12–15 skills. Group them. Remove anything a junior could list.',
      },
      {
        name: 'Structure & Formatting',
        score: 11,
        maxScore: 20,
        bullets: [
          'Inconsistent bullet lengths — some are two lines, some are eight words.',
          'Two fonts detected — pick one.',
          'The header is doing too much.',
        ],
        improvement: 'Aim for bullets of 1–1.5 lines. Consistency signals attention to detail.',
      },
      {
        name: 'Overall Voice',
        score: 11,
        maxScore: 20,
        bullets: [
          'Oscillates between formal and casual.',
          '"Synergy" and "leverage" appear in the same paragraph.',
          'The actual person is buried under the jargon.',
        ],
        improvement: "Read it aloud. Anywhere you wouldn't say it in conversation, rewrite it.",
      },
    ],
  },
  {
    score: 22,
    tier: 'Certified Delusion',
    tierEmoji: '🔥',
    roastHeadline: 'This resume is trying to be many things and succeeding at none of them.',
    sections: [
      {
        name: 'Headline / Summary',
        score: 3,
        maxScore: 20,
        bullets: [
          '"Dynamic, results-oriented team player" — says nothing about nothing.',
          'Longer than most LinkedIn bios and half as informative.',
          'The summary contradicts the experience section.',
        ],
        improvement: 'Delete the whole thing. Write one sentence: what you do, at what scale, in what domain.',
      },
      {
        name: 'Experience',
        score: 5,
        maxScore: 20,
        bullets: [
          'Responsibilities listed, not results.',
          'The most recent role has zero metrics across five bullets.',
          '"Worked with cross-functional teams" could mean literally anything.',
        ],
        improvement: 'Pick the three proudest moments from your career and write them with numbers attached.',
      },
      {
        name: 'Skills',
        score: 4,
        maxScore: 20,
        bullets: [
          '47 skills listed. This is not a flex.',
          'Includes Microsoft Word and Google Docs.',
          '"Team player" is listed as a skill.',
        ],
        improvement: 'Cut to 10 skills. Ask: would a senior in my field consider this a skill or table stakes?',
      },
      {
        name: 'Structure & Formatting',
        score: 5,
        maxScore: 20,
        bullets: [
          'Three-column layout on a one-page resume.',
          'Font size inconsistencies across sections.',
          'Would not survive an ATS scan.',
        ],
        improvement: 'Use a single-column layout. ATS compliance matters before aesthetics.',
      },
      {
        name: 'Overall Voice',
        score: 5,
        maxScore: 20,
        bullets: [
          'Reads like it was written by a committee.',
          'No discernible human behind the document.',
          'Uses "leveraged synergies" unironically.',
        ],
        improvement: 'Imagine explaining your career to a smart friend over coffee. Write that version.',
      },
    ],
  },
  {
    score: 11,
    tier: 'Start Over.',
    tierEmoji: '💀',
    roastHeadline: 'Not a resume. A list of activities formatted as a resume.',
    sections: [
      {
        name: 'Headline / Summary',
        score: 1,
        maxScore: 20,
        bullets: [
          'No headline — the document begins with a phone number.',
          'The objective statement is from 2009.',
          '"Seeking a challenging position where I can grow" is not a value proposition.',
        ],
        improvement: 'Remove the objective. Add a 2-line headline: your title and your one-line pitch.',
      },
      {
        name: 'Experience',
        score: 2,
        maxScore: 20,
        bullets: [
          'Every bullet is a job duty, not an achievement.',
          'The last 3 years are missing.',
          'One role is listed with no dates.',
        ],
        improvement: 'Address the gap. Then, for every role, find one thing you measurably improved.',
      },
      {
        name: 'Skills',
        score: 3,
        maxScore: 20,
        bullets: [
          'Skills section is a paragraph, not a list.',
          'Contains soft skills only — no technical signal.',
          '"Fast learner" is doing heavy lifting here.',
        ],
        improvement: 'Convert to a structured list. Add specific tools, platforms, or methodologies.',
      },
      {
        name: 'Structure & Formatting',
        score: 2,
        maxScore: 20,
        bullets: [
          'Two pages for three years of experience.',
          'Section headers are bold underline italic — calm down.',
          'The dates use three different formats.',
        ],
        improvement: 'Start fresh with a clean template. Not the creative kind. The boring, scannable kind.',
      },
      {
        name: 'Overall Voice',
        score: 3,
        maxScore: 20,
        bullets: [
          'Passive voice throughout.',
          'The person behind this document is completely invisible.',
          'Nothing here differentiates you from 200 other applicants.',
        ],
        improvement: "Write in active voice. Own what you've done.",
      },
    ],
  },
]

export const HALL_OF_FAME: LeaderboardEntry[] = [
  { rank: 1, pseudonym: 'BytePhilosopher_42', score: 94, tier: 'Untouchable', tierEmoji: '🏆', roastHeadline: 'Disgustingly good. We had nothing left to say.', inputType: 'resume', timeAgo: '2 hours ago' },
  { rank: 2, pseudonym: 'NullPointerHero_77', score: 91, tier: 'Untouchable', tierEmoji: '🏆', roastHeadline: 'Crisp, specific, and backed by numbers. Insufferable.', inputType: 'linkedin', timeAgo: '5 hours ago' },
  { rank: 3, pseudonym: 'RecursiveSage_14', score: 88, tier: 'Untouchable', tierEmoji: '🏆', roastHeadline: 'Every bullet earns its space. Annoyingly so.', inputType: 'resume', timeAgo: '1 day ago' },
  { rank: 4, pseudonym: 'AsyncDrifter_09', score: 85, tier: 'Untouchable', tierEmoji: '🏆', roastHeadline: 'Rare to see someone this self-aware on paper.', inputType: 'portfolio', timeAgo: '1 day ago' },
  { rank: 5, pseudonym: 'SilentArchitect_23', score: 82, tier: 'Untouchable', tierEmoji: '🏆', roastHeadline: 'Structured, honest, and light on fluff. Well done.', inputType: 'resume', timeAgo: '2 days ago' },
  { rank: 6, pseudonym: 'CaffeineEngineer_67', score: 79, tier: 'Solid. Room to grow.', tierEmoji: '✅', roastHeadline: 'Strong foundation. Stop resting on it.', inputType: 'linkedin', timeAgo: '2 days ago' },
  { rank: 7, pseudonym: 'TerminalGhost_33', score: 76, tier: 'Solid. Room to grow.', tierEmoji: '✅', roastHeadline: 'Competent but playing it too safe.', inputType: 'resume', timeAgo: '3 days ago' },
  { rank: 8, pseudonym: 'DeepStackSage_88', score: 73, tier: 'Solid. Room to grow.', tierEmoji: '✅', roastHeadline: 'Solid work history buried under hesitant language.', inputType: 'portfolio', timeAgo: '3 days ago' },
  { rank: 9, pseudonym: 'VoidWalker_55', score: 71, tier: 'Solid. Room to grow.', tierEmoji: '✅', roastHeadline: 'Real experience, undersold. Fix the framing.', inputType: 'resume', timeAgo: '4 days ago' },
  { rank: 10, pseudonym: 'CompileOrDie_19', score: 68, tier: 'Solid. Room to grow.', tierEmoji: '✅', roastHeadline: 'More signal than most. Needs a sharper edge.', inputType: 'linkedin', timeAgo: '4 days ago' },
]

export const WALL_OF_SHAME: LeaderboardEntry[] = [
  { rank: 1, pseudonym: 'HotDeployWizard_99', score: 8, tier: 'Start Over.', tierEmoji: '💀', roastHeadline: 'This document raised more questions than it answered.', inputType: 'resume', timeAgo: '1 hour ago' },
  { rank: 2, pseudonym: 'AlgorithmDreamer_04', score: 11, tier: 'Start Over.', tierEmoji: '💀', roastHeadline: 'Not a resume. A list of activities formatted as a resume.', inputType: 'linkedin', timeAgo: '3 hours ago' },
  { rank: 3, pseudonym: 'FrontendGuru_21', score: 13, tier: 'Start Over.', tierEmoji: '💀', roastHeadline: 'The title says senior. The content says otherwise.', inputType: 'portfolio', timeAgo: '6 hours ago' },
  { rank: 4, pseudonym: 'StackOverlord_61', score: 15, tier: 'Start Over.', tierEmoji: '💀', roastHeadline: 'Years of experience, zero evidence of impact.', inputType: 'resume', timeAgo: '12 hours ago' },
  { rank: 5, pseudonym: 'GitBlameHero_37', score: 17, tier: 'Start Over.', tierEmoji: '💀', roastHeadline: 'There is a human somewhere under this template.', inputType: 'resume', timeAgo: '1 day ago' },
  { rank: 6, pseudonym: 'ProductionMystic_82', score: 19, tier: 'Certified Delusion', tierEmoji: '🔥', roastHeadline: 'Bold claims. Boldly unsubstantiated.', inputType: 'linkedin', timeAgo: '1 day ago' },
  { rank: 7, pseudonym: 'FuzzyLogician_43', score: 21, tier: 'Certified Delusion', tierEmoji: '🔥', roastHeadline: 'This resume is trying to be many things and succeeding at none.', inputType: 'resume', timeAgo: '2 days ago' },
  { rank: 8, pseudonym: 'BinaryHermit_16', score: 23, tier: 'Certified Delusion', tierEmoji: '🔥', roastHeadline: 'Jargon-dense, metric-free, and proud of it.', inputType: 'portfolio', timeAgo: '2 days ago' },
  { rank: 9, pseudonym: 'QuantumScrumLord_50', score: 25, tier: 'Certified Delusion', tierEmoji: '🔥', roastHeadline: 'The skills section is doing all the work the experience section refused to do.', inputType: 'resume', timeAgo: '3 days ago' },
  { rank: 10, pseudonym: 'LegacyCodeDemon_78', score: 27, tier: 'Certified Delusion', tierEmoji: '🔥', roastHeadline: '10 years of experience. One year repeated 10 times.', inputType: 'linkedin', timeAgo: '3 days ago' },
]

const ADJECTIVES = [
  'Recursive', 'Silent', 'Async', 'Null', 'Binary', 'Deep', 'Void',
  'Quantum', 'Legacy', 'Fuzzy', 'Caffeinated', 'Terminal', 'Compiled',
  'Deployed', 'Cached', 'Stateless', 'Lazy', 'Eager', 'Blocking', 'Mutable',
  'Immutable', 'Distributed', 'Encrypted', 'Abstracted', 'Polymorphic',
]

const NOUNS = [
  'Sage', 'Architect', 'Drifter', 'Pointer', 'Ghost', 'Philosopher',
  'Engineer', 'Wizard', 'Guru', 'Hermit', 'Overlord', 'Mystic',
  'Dreamer', 'Demon', 'Monk', 'Oracle', 'Phantom', 'Pilgrim',
  'Prophet', 'Alchemist', 'Harbinger', 'Mercenary', 'Nomad', 'Sentinel',
]

export function generatePseudonym(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  const num = String(Math.floor(Math.random() * 100)).padStart(2, '0')
  return `${adj}${noun}_${num}`
}

export const LOADING_MESSAGES = [
  'Detecting buzzword density...',
  'Counting how many times you said "passionate"...',
  'Cross-referencing with actual senior devs...',
  'Measuring the gap between self-image and reality...',
  'Assessing portfolio-to-vibes ratio...',
  'Running delusion coefficient analysis...',
  'Comparing against people who actually got hired...',
  'Auditing your use of the word "leverage"...',
]
