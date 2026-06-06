import { NextRequest } from 'next/server'
import clientPromise from '../../_lib/mongodb'
import type { InputType } from '../../_lib/mockData'

const DB = 'egocheck'
const COL = 'leaderboard'

interface DbEntry {
  pseudonym: string
  score: number
  tier: string
  tierEmoji: string
  roastHeadline: string
  inputType: InputType
  createdAt: Date
}

function timeAgo(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`
  const days = Math.floor(hrs / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

export async function GET() {
  try {
    const col = (await clientPromise).db(DB).collection<DbEntry>(COL)

    const [fame, shame] = await Promise.all([
      col.find({ score: { $gte: 60 } }).sort({ score: -1 }).limit(10).toArray(),
      col.find({ score: { $lt: 40 } }).sort({ score: 1 }).limit(10).toArray(),
    ])

    const serialize = (entries: (DbEntry & { _id?: unknown })[], idx: number) => ({
      rank: idx + 1,
      pseudonym: entries[idx].pseudonym,
      score: entries[idx].score,
      tier: entries[idx].tier,
      tierEmoji: entries[idx].tierEmoji,
      roastHeadline: entries[idx].roastHeadline,
      inputType: entries[idx].inputType,
      timeAgo: timeAgo(new Date(entries[idx].createdAt)),
    })

    return Response.json({
      hallOfFame: fame.map((_, i) => serialize(fame as (DbEntry & { _id?: unknown })[], i)),
      wallOfShame: shame.map((_, i) => serialize(shame as (DbEntry & { _id?: unknown })[], i)),
    })
  } catch (err) {
    console.error('[/api/leaderboard GET]', err)
    return Response.json({ error: 'Failed to fetch leaderboard.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<DbEntry>
    const { pseudonym, score, tier, tierEmoji, roastHeadline, inputType } = body

    if (!pseudonym || typeof score !== 'number' || !tier || !roastHeadline || !inputType) {
      return Response.json({ error: 'Invalid payload.' }, { status: 400 })
    }

    const col = (await clientPromise).db(DB).collection<DbEntry>(COL)
    await col.insertOne({ pseudonym, score, tier, tierEmoji: tierEmoji ?? '', roastHeadline, inputType, createdAt: new Date() })

    return Response.json({ ok: true })
  } catch (err) {
    console.error('[/api/leaderboard POST]', err)
    return Response.json({ error: 'Failed to publish.' }, { status: 500 })
  }
}
