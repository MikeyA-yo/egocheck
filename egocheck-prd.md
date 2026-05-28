# EgoCheck — Product Requirements Document
> Version: 0.1 (Demo/UI Phase)
> Status: Pre-AI wiring — UI and concept validation only

---

## 1. What Is EgoCheck?

EgoCheck is a brutally honest resume and portfolio evaluation tool. Users paste their resume, LinkedIn summary, or portfolio description, and receive a blunt, section-by-section teardown with an **EgoCheck Score** (0–100). The experience is designed to feel like a roast from a senior hiring manager who has no patience for fluff.

The product lives or dies on two things:
- The **drama of the score reveal** — it must feel like a verdict, not a rating
- The **global leaderboard** — which turns individual results into a social, competitive experience

---

## 2. Core User Flow

```
Landing page
    ↓
Paste resume / LinkedIn / portfolio text
    ↓
"Analyzing your delusion..." (loading state)
    ↓
Score reveal screen (animated, dramatic)
    ↓
Section-by-section breakdown
    ↓
Option to publish to leaderboard (with pseudonym)
    ↓
Leaderboard page (Hall of Fame + Wall of Shame)
```

---

## 3. Pages & Screens

### 3.1 Landing Page

**Purpose:** Communicate the product's energy immediately. Visitors should feel slightly intimidated and very curious.

**Must include:**
- A sharp headline — e.g. *"Your resume is probably worse than you think."*
- Single CTA button — *"Check My Ego"*
- A sample score reveal teaser (static, to show what the output looks like)
- Brief social proof line — e.g. *"Join X people who've had their egos checked"* (hardcoded for demo)
- Link to the leaderboard

**Tone:** Dark, dry, a little menacing. Think Black Mirror meets LinkedIn.

**Do not include (demo phase):** Auth, signup walls, pricing.

---

### 3.2 Input Screen

**Purpose:** Get the user's content.

**Elements:**
- Large textarea — label: *"Paste your resume, LinkedIn bio, or portfolio description"*
- Character counter (min: 100 chars to proceed, max: 5000)
- Input format selector (optional toggle): Resume / LinkedIn Bio / Portfolio
- Submit button — label: *"Check My Ego"*
- Disclaimer text (small): *"We do not store your content. Results are anonymous unless you choose to publish."*

**Validation:**
- Block submission under 100 characters with inline error: *"Give us something to work with."*
- No backend needed in demo — mock a random or pre-seeded response

---

### 3.3 Loading / Analysis Screen

**Purpose:** Build anticipation. This screen sets the emotional tone for the reveal.

**Elements:**
- Animated progress indicator (not a boring spinner — something with personality)
- Rotating snarky loading messages, e.g.:
  - *"Detecting buzzword density..."*
  - *"Counting how many times you said 'passionate'..."*
  - *"Cross-referencing with actual senior devs..."*
  - *"Measuring the gap between self-image and reality..."*
  - *"Assessing portfolio-to-vibes ratio..."*
- Duration: 3–5 seconds (artificial delay to build drama, even in demo)

---

### 3.4 Score Reveal Screen

**Purpose:** The money shot. The moment users screenshot and share.

**Elements:**
- Animated score counter — counts up (or down) to the final score
- Score displayed large and central — e.g. **47 / 100**
- Score tier label beneath the number with distinct styling per tier:
  - 80–100: 🏆 *"Untouchable"*
  - 60–79: ✅ *"Solid. Room to grow."*
  - 40–59: ⚠️ *"It's giving effort."*
  - 20–39: 🔥 *"Certified Delusion"*
  - 0–19: 💀 *"Start Over."*
- One-line roast headline — a sharp, specific line summarising the overall verdict
- Two CTAs:
  - Primary: *"See Full Breakdown"*
  - Secondary: *"Publish to Leaderboard"* (triggers pseudonym selection modal)

**Design note:** This screen should feel like a verdict being read aloud. Dark background, big typography, single dramatic animation.

---

### 3.5 Breakdown Screen

**Purpose:** Give the user actionable, section-by-section feedback.

**Sections evaluated (for demo, use mock data):**

| Section | What's Evaluated |
|---------|-----------------|
| Headline / Summary | Clarity, specificity, buzzword count |
| Experience | Impact language, quantification, relevance |
| Skills | Padding vs genuine signal |
| Structure & Formatting | Scannability, length, organisation |
| Overall Voice | Confidence vs delusion, authenticity |

**Per section:**
- Section score (e.g. 6/20)
- 2–3 bullet points of specific critique
- One suggested improvement

**Bottom of breakdown:**
- Overall EgoCheck Score (repeated)
- CTA: *"Publish to Leaderboard"*
- CTA: *"Start Over"*

---

### 3.6 Leaderboard Page

**Purpose:** The viral engine. Public, competitive, and designed to be shared.

**Two boards, displayed side by side (desktop) or tabbed (mobile):**

#### 🏆 Hall of Fame — Top 10 Highest Scores
*"The untouchables. Study these."*

#### 💀 Wall of Shame — Bottom 10 Lowest Scores
*"The certified delusions. Learn from them."*

**Per entry (both boards):**
- Rank (#1, #2, etc.)
- Pseudonym (auto-generated, never real names — see Section 5)
- Score
- Score tier badge
- One-line roast headline (the same one from their reveal screen)
- Input type badge: Resume / LinkedIn / Portfolio
- Relative timestamp — e.g. *"3 hours ago"*

**Board mechanics (demo phase):**
- Pre-seeded with 10 mock entries per board so it never looks empty
- Weekly reset indicator in the header — e.g. *"Resets in 4 days"*
- No actual persistence needed for demo — all data hardcoded or stored in localStorage

---

### 3.7 Pseudonym Selection Modal

**Purpose:** Let users publish anonymously. Protects real identity while keeping the leaderboard alive and competitive.

**Flow:**
1. User clicks *"Publish to Leaderboard"*
2. Modal appears with an auto-generated pseudonym — e.g. *"SilentArchitect_42"*, *"CaffeineEngineer_91"*, *"TerminalGhost_07"*
3. User can regenerate (button: *"Give me another"*) up to 3 times
4. User confirms with *"Publish Anonymously"*
5. Confirmation screen: *"You're on the board. Share your shame (or glory)."* + share button

**Pseudonym format:** `[Adjective][TechNoun]_[2-digit number]`
- Examples: `RecursiveSage_14`, `SilentArchitect_42`, `AsyncDrifter_09`, `NullPointerHero_77`
- Pre-generate a pool of ~100 combinations for the demo

**Important:** No email, no account, no real name — ever. The pseudonym is the only public identifier.

---

## 4. Design Direction

### Aesthetic
- **Dark theme by default** — near-black background (#0d0d0d or similar), not pitch black
- **Typography-led** — the score and verdicts are the visual centerpiece, not decorative graphics
- **Accent color:** A single strong accent — either a sharp red or a harsh amber — used for scores, highlights, and CTAs. Nothing soft or pastel.
- **Monospace touches** for score numbers and code-like elements — feels technical and precise

### Motion
- Score counter animation on reveal (count up from 0)
- Loading screen text cycling (fade transitions)
- Leaderboard entries stagger in on load
- Keep it sharp — animations should feel like a machine delivering a verdict, not a friendly app

### Copy Tone
- Dry, precise, a little brutal — but never mean-spirited
- The product punches at the *resume*, not the *person*
- Avoid exclamation marks. Avoid filler. Everything should land like a statement of fact.

---

## 5. Anonymity & Safety Rules

These are non-negotiable for the leaderboard:

1. **No real names ever appear** on any public-facing screen
2. **No identifiable information** (company names, school names, email fragments) from submitted content appears on the leaderboard
3. Only the **pseudonym, score, tier badge, roast headline, and input type** are published
4. The one-line roast on the leaderboard must be **generic enough** that it could apply to multiple people — never specific enough to identify a person's background
5. A **"Remove my entry"** option must be present on the leaderboard (demo: UI only, no backend)

---

## 6. Demo Phase Scope (What to Build Now)

### In Scope
- [ ] Landing page (static, with sample score teaser)
- [ ] Input screen (textarea + validation)
- [ ] Loading screen (animated, rotating messages)
- [ ] Score reveal screen (animated counter, tier label, roast headline)
- [ ] Breakdown screen (mock section scores + feedback)
- [ ] Leaderboard page (pre-seeded mock data, Hall of Fame + Wall of Shame)
- [ ] Pseudonym modal (generator + confirm flow)
- [ ] Mobile responsive layout across all screens

### Out of Scope (AI Wiring Phase — Later)
- Real AI evaluation logic
- Backend / database
- Real leaderboard persistence
- User accounts or auth
- Sharing / social integrations
- Analytics

---

## 7. Mock Data Spec

For the demo, responses should be seeded from a fixed pool so the product feels real.

**Mock score pool:** Prepare at least 5 pre-built responses at different score tiers:
- One Untouchable (85+)
- Two mid-range (45–65)
- Two Wall of Shame candidates (10–25)

Each mock response needs:
- Overall score
- Tier label
- One-line roast headline
- 5 section scores + 2–3 bullets of critique per section

The AI wiring phase will replace these with live model output — the mock data just needs to make the UI feel real.

---

## 8. Tech Stack Recommendation

Since this is a demo-first build and you're working solo:

| Layer | Recommendation | Why |
|-------|---------------|-----|
| Framework | Next.js (App Router) or plain React | Fast to scaffold, easy to extend later |
| Styling | Tailwind CSS | Rapid dark theme UI, no fighting with CSS |
| State | useState / localStorage | No backend needed for demo |
| Animations | Framer Motion or CSS keyframes | Score counter, stagger effects |
| Hosting | Vercel | Free tier, instant deploy |

---

## 9. Success Criteria for Demo

The demo is successful if a person can:
1. Paste text and reach the score reveal screen
2. Feel something when the score animates in (surprise, amusement, mild offence)
3. Want to immediately share the score or check the leaderboard
4. Understand what the product does within 10 seconds of landing

If the demo achieves that, it's ready for AI wiring.
