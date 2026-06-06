import { NextRequest } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { EgoCheckResult, InputType } from '../../_lib/mockData'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const PROMPT = `You are EgoCheck — a brutally honest resume/portfolio evaluator. Direct, sardonic, but always useful.

Evaluate the content and return ONLY a valid JSON object. No markdown, no explanation, just the JSON.

Required structure:
{
  "score": <integer 0-100, must equal the sum of section scores>,
  "roastHeadline": <one punchy line, max 12 words, reference something specific from the content>,
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

// Uses Jina AI Reader (r.jina.ai) which runs headless Chrome — executes JS,
// waits for animations to finish, and handles PDFs natively. No API key needed.
async function fetchUrl(url: string): Promise<string> {
  const resp = await fetch(`https://r.jina.ai/${url}`, {
    headers: { Accept: 'text/plain', 'X-No-Cache': 'true' },
    signal: AbortSignal.timeout(30000),
  })
  if (!resp.ok) throw new Error(`Could not read that URL (HTTP ${resp.status}).`)
  const text = (await resp.text()).trim()
  if (text.length < 50) throw new Error('Could not extract meaningful content from that URL.')
  return text
}

export async function POST(req: NextRequest) {
  type Payload =
    | { method: 'text'; text: string; inputType: InputType }
    | { method: 'pdf'; pdfBase64: string; inputType: InputType }
    | { method: 'url'; url: string; inputType: InputType }

  let payload: Payload
  try {
    payload = (await req.json()) as Payload
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { method, inputType } = payload

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const preamble = `${PROMPT}\n\nInput type: ${inputType}\n\n`

    // Build content parts based on method
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let contentParts: any[]

    if (method === 'text') {
      const { text } = payload
      if (!text || text.trim().length < 100) {
        return Response.json({ error: 'Too short to evaluate.' }, { status: 400 })
      }
      contentParts = [{ text: preamble + `Text to evaluate:\n${text.slice(0, 5000)}` }]

    } else if (method === 'pdf') {
      const { pdfBase64 } = payload
      if (!pdfBase64) return Response.json({ error: 'No PDF data received.' }, { status: 400 })
      contentParts = [
        { text: preamble + 'The resume/portfolio is attached as a PDF. Evaluate its full content.' },
        { inlineData: { mimeType: 'application/pdf', data: pdfBase64 } },
      ]

    } else if (method === 'url') {
      const { url } = payload
      if (!url?.match(/^https?:\/\/.+/)) {
        return Response.json({ error: 'Invalid URL.' }, { status: 400 })
      }
      let extracted: string
      try {
        extracted = await fetchUrl(url)
      } catch (e) {
        return Response.json({ error: (e as Error).message || 'Could not read that URL.' }, { status: 400 })
      }
      contentParts = [
        { text: preamble + `Content extracted from: ${url}\n\n${extracted.slice(0, 8000)}` },
      ]

    } else {
      return Response.json({ error: 'Unknown method.' }, { status: 400 })
    }

    const result = await model.generateContent(contentParts)
    const raw = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(raw) as Omit<EgoCheckResult, 'tier' | 'tierEmoji'>

    // Clamp score to actual section sum to prevent hallucination drift
    const sectionSum  = parsed.sections.reduce((acc, s) => acc + s.score, 0)
    const finalScore  = Math.min(100, Math.max(0, sectionSum))

    return Response.json({ ...parsed, score: finalScore, ...getTier(finalScore) } satisfies EgoCheckResult)
  } catch (err) {
    console.error('[/api/check]', err)
    return Response.json({ error: 'Analysis failed. Try again.' }, { status: 500 })
  }
}
