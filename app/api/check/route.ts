import { NextRequest } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { EgoCheckResult, InputType } from '../../_lib/mockData'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const PROMPT = `You are EgoCheck — a brutally honest resume/portfolio evaluator. Direct, sardonic, but always useful.

Evaluate the text below and return ONLY a valid JSON object. No markdown, no explanation, just the JSON.

Required structure:
{
  "score": <integer 0-100, must equal the sum of section scores>,
  "roastHeadline": <one punchy line, max 12 words, reference something specific from the text>,
  "sections": [
    {
      "name": "Headline / Summary",
      "score": <integer 0-20>,
      "maxScore": 20,
      "bullets": [<3 specific, concrete observations referencing actual content>],
      "improvement": <one specific, actionable fix>
    },
    {
      "name": "Experience",
      "score": <integer 0-20>,
      "maxScore": 20,
      "bullets": [<3 specific observations>],
      "improvement": <one specific actionable fix>
    },
    {
      "name": "Skills",
      "score": <integer 0-20>,
      "maxScore": 20,
      "bullets": [<3 specific observations>],
      "improvement": <one specific actionable fix>
    },
    {
      "name": "Structure & Formatting",
      "score": <integer 0-20>,
      "maxScore": 20,
      "bullets": [<3 specific observations>],
      "improvement": <one specific actionable fix>
    },
    {
      "name": "Overall Voice",
      "score": <integer 0-20>,
      "maxScore": 20,
      "bullets": [<3 specific observations>],
      "improvement": <one specific actionable fix>
    }
  ]
}

Scoring guide:
- 17-20: Genuinely excellent. Rare.
- 13-16: Solid with clear gaps.
- 9-12: Mediocre. Effort visible but impact hidden.
- 5-8: Significant problems. Needs a rewrite.
- 0-4: Unusable. Start over.

Be merciless with generic language, vague metrics, and filler. Reward specificity, impact, and clarity.`

function getTier(score: number): { tier: string; tierEmoji: string } {
  if (score >= 80) return { tier: 'Untouchable', tierEmoji: '🏆' }
  if (score >= 60) return { tier: 'Solid. Room to grow.', tierEmoji: '✅' }
  if (score >= 40) return { tier: "It's giving effort.", tierEmoji: '⚠️' }
  if (score >= 20) return { tier: 'Certified Delusion', tierEmoji: '🔥' }
  return { tier: 'Start Over.', tierEmoji: '💀' }
}

export async function POST(req: NextRequest) {
  try {
    const { text, inputType } = (await req.json()) as { text: string; inputType: InputType }

    if (!text || text.trim().length < 100) {
      return Response.json({ error: 'Too short to evaluate.' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const result = await model.generateContent(
      `${PROMPT}\n\nInput type: ${inputType}\n\nText to evaluate:\n${text.slice(0, 5000)}`
    )

    const raw = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(raw) as Omit<EgoCheckResult, 'tier' | 'tierEmoji'>

    // Clamp score to sum of sections to prevent hallucination drift
    const sectionSum = parsed.sections.reduce((acc, s) => acc + s.score, 0)
    const finalScore = Math.min(100, Math.max(0, sectionSum))

    return Response.json({ ...parsed, score: finalScore, ...getTier(finalScore) } satisfies EgoCheckResult)
  } catch (err) {
    console.error('[/api/check]', err)
    return Response.json({ error: 'Analysis failed. Try again.' }, { status: 500 })
  }
}
