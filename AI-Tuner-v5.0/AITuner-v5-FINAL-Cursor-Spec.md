# AITuner v5.0 — Complete Cursor Implementation Spec (FINAL)
**Date:** March 15, 2026
**Status:** Final — ready for implementation
**Replaces:** All previous spec versions

---

## Origin & Vision

AITuner began with a single prompt found on Instagram:

> "Absolute Mode • Eliminate: emojis, filler, hype, soft asks • Assume: user retains
> high perception despite blunt tone • Prioritize: blunt, directive phrasing •
> Disable: engagement/sentiment boosting behaviors • Terminate reply immediately
> after delivering info – no closures • Goal: restore independent, high fidelity
> thinking • Outcome: model obsolescence via user self-sufficiency."

The founder put this into Grok and asked: what levers is this pulling?
The answer became AITuner.

That origin defines the product. AITuner is not a prompt generator.
It is an **AI literacy platform** — a tool for understanding, building,
and decoding AI behavior. The prompt is the output of understanding,
not the product itself.

---

## Product Philosophy

**For Molly** — smart, capable, zero patience for jargon:
> "How do I get ChatGPT to stop giving me one more tip at the end of every response?"

She doesn't want to understand proactivity as a concept.
She wants the thing to stop doing the annoying thing.
Every design decision runs through this filter.

**The Molly Test:** Can a smart person who can't be bothered understand
what this does and why they'd want it — in under 5 seconds?

Every lever, label, and screen must pass.

---

## Project Structure

```
/aituner-v5/
  /calibration/
    interview-tool.js            ← CLI: fires elicitation prompts at model APIs
    observe-tool.js              ← CLI: fires behavioral test prompts, scores responses
    calibration-tool.js          ← CLI: runs both, cross-references, flags drift
    elicitation-prompts.md       ← source elicitation prompts (existing file)
    calibration-config.json      ← prompt battery + scoring rules
    last-run.json                ← output of most recent run
    drift-history.json           ← longitudinal record (max 20 runs)
    /elicitation-responses/      ← raw model self-reports per run
      chatgpt-2026-03-15.json
      claude-2026-03-15.json
      grok-2026-03-15.json
      gemini-2026-03-15.json
      mistral-2026-03-15.json
      llama-2026-03-15.json
      perplexity-2026-03-15.json
  /src/
    /data/
      v5-levers.js               ← NEW 16-lever schema (see Part 3)
      v5-models.js               ← model defaults (updated by calibration)
      v5-models.proposed.js      ← calibration writes here, never to live
      v5-personas.js             ← persona configurations
    /onboarding/
      onboarding-state.js        ← tier state management
      onboarding-ui.js           ← screen rendering
      model-samples.js           ← pre-written sample responses per model/intent
      tier-unlock.js             ← unlock detection + animation
    /discovery/
      discovery-mode.js          ← model comparison feature
      comparison-ui.js           ← side-by-side rendering
    /decoder/
      prompt-decoder.js          ← paste-and-parse feature (NEW)
      decoder-ui.js              ← decoder interface
      lever-mapper.js            ← maps prompt language to lever values
    /profile/
      user-profile.js            ← persistent user memory
      session-restore.js         ← last session recovery
    /core/
      v6-engine.js               ← unchanged core logic
      radar.js                   ← unchanged radar logic
  /scripts/
    apply-calibration.js         ← promotes proposed → live after review
  index.html
  package.json
```

---

## Part 1: The Four Entry Points

v5.0 has four distinct ways to enter the app.
All four are available from the home screen.
All four ultimately arrive at the same place: a configured prompt
and a radar showing what it does.

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   What do you want to do?                           │
│                                                     │
│   ┌─────────────┐  ┌─────────────┐                 │
│   │  I have a   │  │  I want to  │                 │
│   │    task     │  │  explore    │                 │
│   │             │  │  the models │                 │
│   └─────────────┘  └─────────────┘                 │
│                                                     │
│   ┌─────────────┐  ┌─────────────┐                 │
│   │  I found a  │  │  I know     │                 │
│   │   prompt    │  │  what I'm   │                 │
│   │  I want to  │  │    doing    │                 │
│   │  understand │  │             │                 │
│   └─────────────┘  └─────────────┘                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Entry Point 1: "I have a task" → Guided Onboarding (Tier Progression)
The default path. Three-tier progressive unlock.
Full spec in Part 2.

### Entry Point 2: "I want to explore the models" → Discovery Mode
For users who want AI literacy before task orientation.
Full spec in Part 4.

### Entry Point 3: "I found a prompt I want to understand" → Prompt Decoder
The origin story feature. Paste any prompt, see the levers.
Full spec in Part 5.

### Entry Point 4: "I know what I'm doing" → Full Controls
Direct access to all 16 levers, all 4 radar charts.
Sets skip_onboarding: true permanently.
This is the existing advanced interface, reached without gating.

---

## Part 2: Guided Onboarding — Tier Progression

### Tier System

| Tier | Name | Badge | Unlock condition |
|------|------|-------|-----------------|
| 0 | Starter | Starter | Default on first launch |
| 1 | Tuner | Tuner | Copies first prompt |
| 2 | Architect | Architect | Adjusts any slider |

State stored in localStorage:
```json
{
  "tier": 0,
  "has_copied": false,
  "has_tuned": false,
  "skip_onboarding": false
}
```

Tier badge visible in top-right corner at all times.
Clicking it shows progression overview and what unlocks next.

---

### Screen 0: Welcome (first launch only)

- Headline: "Learn how AI models actually differ"
- Subhead: "AITuner shows you what's under the hood — and lets you tune it."
- Single CTA: "Get started →"
- Small link: "Already know what you're doing? Skip to full controls →"

---

### Screen 1: Intent Selection

**Headline:** "What do you want this AI to do?"
**Subhead:** "Pick the mode that fits the work."

Five intent cards (2×2 + 1 full-width):

| Card | Description | Routes to |
|------|-------------|-----------|
| Help me think | Sounding board, analysis, decisions | Screen 2 |
| Help me write | Drafts, editing, tone, documents | Screen 2 |
| Help me build | Code, debugging, architecture | Screen 2 |
| Help me explore | Research, learning, brainstorming | Screen 2 |
| What's the difference between AI models? | Compare voices, find yours | Discovery Mode |

Store selected intent. Use it to:
- Filter model sample responses on Screen 2
- Pre-configure lever defaults appropriate to the intent
- Label the generated prompt

---

### Screen 2: Model Selection with Sample Responses

**Headline:** "Which AI are you tuning for?"
**Subhead:** "Each model has a distinct voice. Here's what that sounds like."

Eight model cards. Each card contains:
- Model name + provider
- One-line personality descriptor
- Sample response — 2-3 sentences, pre-written, intent-filtered
  - Collapsed by default: "Show sample ▾"
  - Expands inline on tap/click
- Mini radar thumbnail (3-axis, static, grayed)
  - Caption: "Unlock visual tuning →"

**Sample responses are hand-authored.** Do not generate and homogenize.
The whole point is that the differences are real and legible.

**Voice signatures to capture:**

- Claude: Considers multiple angles, may gently reframe the question,
  acknowledges nuance before landing. Reflective.
- ChatGPT: Structured, organized, reaches for numbered lists,
  reliably capable. The competent assistant.
- Grok: Shorter. More direct. May include dry observation
  or mild irreverence. Doesn't over-explain.
- Gemini: Expansive. Connects to adjacent ideas.
  Comfortable ranging widely.
- Mistral: Precise. Efficient. Low hedging.
  Gets to the answer fast and stops.
- Llama: Variable. Thorough. Open-ended feel.
  Doesn't rush to conclude.
- Perplexity: Research-first. Wants to cite things.
  Treats questions as information problems.
- Cursor: Technical by default. Code-adjacent framing
  even for non-code questions.

**Sample prompt varies by intent selected in Screen 1:**
- think → "What's the best way to make a hard decision?"
- write → "How do I open a cold email?"
- build → "How should I structure a new codebase?"
- explore → "What's the most interesting thing about black holes?"

---

### Screen 3 (Tier 0): Copy Your Prompt

Minimal. Get them a working prompt fast.

- Monospace prompt preview box
- Large "Copy prompt" CTA → triggers Tier 1 unlock on click
- Below the fold: grayed radar with label
  "Unlock visual tuning — adjust how your AI sounds →"
  Clicking this also triggers Tier 1 unlock.

**Tier 1 unlock moment:**
- Radar axes draw in with animation
- Toast notification: "Tuner unlocked — now shape it visually"
- Tier badge updates: Starter → Tuner

---

### Screen 3 (Tier 1 upgrade): Five Sliders + Live Radar

**Layout:** Sliders left 60%, live radar right 40%
**Headline:** "Shape your AI's personality"

**Five core sliders:**

| Human label | Lever key | Low label | High label |
|-------------|-----------|-----------|------------|
| Just answer what I ask, or keep suggesting more? | initiative | Just answer — nothing extra | Always adding tips and next steps |
| Hedge everything or say it straight? | assertiveness | Lots of maybes and possiblys | Says it straight, no qualifiers |
| Short answers or thorough ones? | conciseness | Brief — gets out of your way | Full — covers everything |
| Casual or professional? | formality | Texting a friend | Boardroom professional |
| Warm and human or focused and clinical? | emotionalWarmth | Task-focused, detached | Warm, empathetic, present |

**Live radar — 5 axes:**
- Renders via Chart.js
- Maps directly to the 5 sliders
- Updates in real time as sliders move
- This connection is the core aha moment —
  move a slider, watch the radar change
- Ghost lines show the remaining 11 axes, visibly locked
- Caption: "5 of 16 controls — unlock all in Architect mode"

**Tier 2 unlock trigger:**
Any slider adjustment → set has_tuned: true
→ show Architect unlock prompt

---

### Screen 4: Prompt Preview + Persona Quick-Picks

- Updated prompt preview reflecting all slider values
- Persona tags as one-tap presets:
  Therapist, Truth-Seeker, Coder, Creative Writer,
  Researcher, Tutor
- "Save this configuration" → saves to user profile
- "Unlock all 16 controls →" CTA → Tier 2

---

### Tier 2: Architect Mode

Full interface. All 16 levers. All 4 radar charts.
Reached through earned progression — user arrives with
intent + model + 5 lever values already configured.

**First-time Tier 2 tooltip overlay (4 steps, dismissable):**
1. "You've unlocked the full instrument panel"
2. "Four dimensions of AI behavior — each with its own radar"
3. "Character = who it is · Voice = how it talks"
4. "Thinking = how it reasons · Output = how it looks"

Tooltips fire once only. Never again unless explicitly reset.

---

## Part 3: The 16 Levers

Four pillars. Four levers each. 16 total.
Full definitions in /src/data/v5-levers.js (separate file).

### PILLAR 1: CHARACTER — Who it is
| Key | Name | Low | High |
|-----|------|-----|------|
| assertiveness | Assertiveness | Tentative, lots of qualifiers | Decisive, states it straight |
| formality | Formality | Casual, like texting a friend | Formal, boardroom professional |
| playfulness | Playfulness | Serious, no humor | Witty, playful, light sarcasm |
| emotionalWarmth | Emotional Warmth | Cool, task-focused | Warm, empathetic, present |

### PILLAR 2: VOICE — How it talks
| Key | Name | Low | High |
|-----|------|-----|------|
| conciseness | Conciseness | Brief, gets to the point | Thorough, covers all angles |
| teachingMode | Teaching Mode | Assumes you know the basics | Explains everything step by step |
| initiative | Initiative | Answers only what was asked | Adds tips, next steps, related ideas |
| questionFrequency | Question Frequency | Makes assumptions, gets on with it | Asks to clarify before proceeding |

### PILLAR 3: THINKING — How it reasons
| Key | Name | Low | High |
|-----|------|-----|------|
| transparency | Show Your Work | Just gives the answer | Shows reasoning, explains the logic |
| creativity | Creativity | Factual, conventional, reliable | Speculative, imaginative, original |
| confidence | Confidence | Lots of it depends, presents options | Picks a lane, gives a direct opinion |
| citationHabit | Citation Habit | Speaks from own knowledge | Cites sources, shows its homework |

### PILLAR 4: OUTPUT — How it looks
| Key | Name | Low | High |
|-----|------|-----|------|
| formatting | Formatting | Plain prose, no visual structure | Headers, bullets, organized layout |
| responseLength | Response Length | Short, punchy, minimal | Long, comprehensive, thorough |
| safetyDisclaimers | Safety Disclaimers | No disclaimers, no "as an AI" | Includes safety notes and reminders |
| toneMatching | Tone Matching | Keeps its own voice | Mirrors your energy and pace |

### Radar colors
- CHARACTER: purple  rgba(83, 74, 183, 0.7)
- VOICE: teal       rgba(15, 110, 86, 0.7)
- THINKING: coral   rgba(216, 90, 48, 0.7)
- OUTPUT: amber     rgba(186, 117, 23, 0.7)

---

## Part 4: Discovery Mode

Triggered by "What's the difference between AI models?" intent card,
or from the home screen Entry Point 2.

Purpose: AI literacy before task orientation.
User wants to understand the landscape, not complete a task.

### Screen D1: Pick a question

User selects a standardized prompt to fire at multiple models.

Pre-set options (chosen to maximize visible differences):
- "Should I quit my job to start a company?"
  (shows: empathy, hedging, directness, initiative)
- "Explain blockchain in one paragraph."
  (shows: verbosity, tone, teaching mode, confidence)
- "What's the best programming language?"
  (shows: assertiveness, confidence, opinion-giving)
- "Give me an unusual product idea."
  (shows: creativity, playfulness, divergent thinking)

Plus: "Use my own question" text input.

User also selects which 4 models to compare (from 8 available).

### Screen D2: Side-by-side comparison

Four model response cards shown simultaneously.
Each card contains:
- Model name
- Response (truncated to ~150 words, "Read more" expands)
- Mini radar showing that model's default lever profile
- "Tune this model →" CTA
  Routes into Tier 0 Screen 3 with that model pre-selected

This is the AI literacy core of the product.
User reads, compares, develops intuition for model differences.

### Screen D3: What did you notice?

Reflection prompt — not a form, just a nudge:
"Now that you've seen the differences, which model feels right?"

Tap a model → flow into Tier 0 with that model pre-selected,
intent set to "explore."

---

## Part 5: Prompt Decoder (NEW — Core Feature)

**The origin story feature.**

The founder of AITuner found this prompt on Instagram:
"Absolute Mode • Eliminate: emojis, filler, hype, soft asks •
Disable: engagement/sentiment boosting behaviors •
Terminate reply immediately after delivering info – no closures •
Goal: restore independent, high fidelity thinking."

He put it into Grok, asked what levers it was pulling,
and the answer became AITuner.

This feature lets every user have that same discovery moment.

### What it does

User pastes any system prompt they found anywhere.
The decoder parses it, maps instructions to lever values,
renders the resulting radar, and explains what each
instruction is doing in plain English.

Output: a fully configured lever set the user can
adjust from, save as a preset, or use as-is.

### Entry points
- Home screen Entry Point 3: "I found a prompt I want to understand"
- Also accessible from the prompt output screen: "Decode a prompt instead →"
- Also accessible from Architect mode: "Decode" button in toolbar

### Decoder UI flow

**Step 1: Paste screen**
- Headline: "Paste a prompt you found"
- Subhead: "We'll show you what it's doing — and let you adjust it."
- Large text area
- CTA: "Decode this →"

**Step 2: Results screen**

Left panel: The decoded radar
- All 4 pillar radars rendered with decoded values
- Visually shows the "shape" of the prompt

Right panel: Plain English explanation
- One line per detected instruction
- Format: [What it said] → [What lever] → [What it means]
- Example:
  "Terminate reply immediately" → Response Length: 1
  → "Keeps answers extremely short, cuts off after the core info"
  "Disable sentiment boosting" → Emotional Warmth: 0
  → "Removes warmth and emotional performance from responses"
  "Never mirror user's diction" → Tone Matching: 0
  → "Keeps a consistent voice regardless of how you're writing"

Bottom: Two CTAs
- "Use this configuration →" → loads values into lever set
- "Adjust from here →" → loads values and opens Tier 1 slider screen

**Step 3: Optional save**
- "Name this configuration" text input
- "Save to my profile →"

### Decoder implementation: lever-mapper.js

The mapper uses keyword/phrase detection against a dictionary
of prompt language patterns, each mapped to a lever and value.

```javascript
const LEVER_MAP = [

  // INITIATIVE
  { patterns: ["no suggestions", "only answer what", "reactive",
               "don't offer", "no tips", "no next steps",
               "terminate reply immediately", "no closures",
               "no call-to-action", "suppress continuation"],
    lever: "initiative", value: 0 },
  { patterns: ["proactively suggest", "always offer",
               "anticipate needs", "volunteer information"],
    lever: "initiative", value: 9 },

  // ASSERTIVENESS
  { patterns: ["blunt", "directive", "no hedging", "definitive",
               "state directly", "no qualifiers", "absolute mode",
               "decisive", "no softening"],
    lever: "assertiveness", value: 10 },
  { patterns: ["acknowledge uncertainty", "present multiple views",
               "balanced perspective", "consider all angles"],
    lever: "assertiveness", value: 3 },

  // EMOTIONAL WARMTH
  { patterns: ["disable sentiment", "no empathy performance",
               "suppress emotional", "no warmth", "clinical",
               "eliminate filler", "no affirmations",
               "disable engagement boosting"],
    lever: "emotionalWarmth", value: 0 },
  { patterns: ["warm", "empathetic", "supportive", "compassionate",
               "emotionally present", "check in"],
    lever: "emotionalWarmth", value: 9 },

  // TONE MATCHING
  { patterns: ["never mirror", "don't match", "consistent voice",
               "static tone", "independent voice"],
    lever: "toneMatching", value: 0 },
  { patterns: ["mirror user", "match tone", "adapt to user",
               "reflect style", "dynamic tone"],
    lever: "toneMatching", value: 9 },

  // QUESTION FREQUENCY
  { patterns: ["no questions", "don't ask", "assume",
               "proceed without clarifying"],
    lever: "questionFrequency", value: 0 },
  { patterns: ["ask clarifying", "probe for", "request details",
               "confirm before"],
    lever: "questionFrequency", value: 9 },

  // RESPONSE LENGTH
  { patterns: ["terminate immediately", "brief", "concise",
               "short", "minimal", "terse", "no elaboration"],
    lever: "responseLength", value: 1 },
  { patterns: ["comprehensive", "thorough", "complete",
               "cover all", "full breakdown", "exhaustive"],
    lever: "responseLength", value: 9 },

  // FORMALITY
  { patterns: ["cognitive tier", "technical", "expert",
               "peer level", "professional", "formal",
               "high perception"],
    lever: "formality", value: 9 },
  { patterns: ["casual", "conversational", "friendly",
               "informal", "relaxed"],
    lever: "formality", value: 2 },

  // TEACHING MODE
  { patterns: ["assume knowledge", "expert level", "skip basics",
               "high perception", "retains understanding"],
    lever: "teachingMode", value: 1 },
  { patterns: ["explain", "step by step", "break down",
               "teach", "define terms", "for beginners"],
    lever: "teachingMode", value: 9 },

  // TRANSPARENCY
  { patterns: ["show reasoning", "explain thinking",
               "walk through", "chain of thought"],
    lever: "transparency", value: 9 },
  { patterns: ["just answer", "skip reasoning",
               "no explanation", "result only"],
    lever: "transparency", value: 1 },

  // CONFIDENCE
  { patterns: ["definitive", "confident", "authoritative",
               "direct opinion", "no hedging"],
    lever: "confidence", value: 9 },
  { patterns: ["uncertain", "multiple perspectives",
               "it depends", "balanced"],
    lever: "confidence", value: 3 },

  // PLAYFULNESS
  { patterns: ["no humor", "serious", "professional only",
               "no wit", "eliminate hype", "no filler"],
    lever: "playfulness", value: 0 },
  { patterns: ["humor", "witty", "playful", "funny",
               "light-hearted", "sarcasm"],
    lever: "playfulness", value: 8 },

  // SAFETY DISCLAIMERS
  { patterns: ["no disclaimers", "skip warnings",
               "no as an ai", "no safety notes"],
    lever: "safetyDisclaimers", value: 0 },
  { patterns: ["include safety", "remind user",
               "add disclaimer", "as an ai"],
    lever: "safetyDisclaimers", value: 8 },

  // FORMATTING
  { patterns: ["no markdown", "plain text", "no bullets",
               "no headers", "no structure", "prose only"],
    lever: "formatting", value: 0 },
  { patterns: ["use headers", "bullet points", "structured",
               "formatted", "organized layout"],
    lever: "formatting", value: 9 },

  // CREATIVITY
  { patterns: ["factual only", "no speculation",
               "evidence-based", "conventional"],
    lever: "creativity", value: 1 },
  { patterns: ["creative", "speculative", "imagine",
               "brainstorm", "original", "unconventional"],
    lever: "creativity", value: 9 },

];
```

**Scoring logic:**
- Start all levers at 5 (neutral/undetected)
- Scan prompt text against each pattern array
- On match: set lever to mapped value
- Multiple matches for same lever: average the values
- Undetected levers remain at 5 (shown as gray/neutral on radar)
- Confidence score per lever: 0-100% based on match strength

**Unmapped instructions:**
Any instruction the mapper can't classify goes into an
"unrecognized instructions" list shown to the user with:
"We couldn't map this instruction to a lever.
It may be doing something outside our 16 dimensions."

This is honest — the mapper won't catch everything,
and it shouldn't pretend to.

---

## Part 6: User Profile + Session Memory

### Profile data structure (localStorage: 'aituner_profile')

```json
{
  "tier": 2,
  "has_copied": true,
  "has_tuned": true,
  "skip_onboarding": false,
  "last_session": {
    "model": "claude",
    "intent": "write",
    "entry_point": "guided",
    "lever_values": {
      "initiative": 2,
      "assertiveness": 7,
      "conciseness": 6,
      "formality": 5,
      "emotionalWarmth": 4
    },
    "persona": null,
    "timestamp": "2026-03-15T14:23:00Z"
  },
  "saved_configs": [
    {
      "id": "config_001",
      "name": "My writing Claude",
      "model": "claude",
      "lever_values": {},
      "persona": null,
      "source": "guided",
      "created": "2026-03-10T09:00:00Z"
    },
    {
      "id": "config_002",
      "name": "Absolute Mode (decoded)",
      "model": "chatgpt",
      "lever_values": {
        "initiative": 0,
        "assertiveness": 10,
        "emotionalWarmth": 0,
        "toneMatching": 0,
        "responseLength": 1,
        "formality": 9,
        "playfulness": 0
      },
      "persona": null,
      "source": "decoder",
      "decoded_from": "Absolute Mode prompt",
      "created": "2026-03-15T14:30:00Z"
    }
  ],
  "literacy_record": {
    "models_explored": ["claude", "chatgpt", "grok"],
    "discovery_runs": 3,
    "prompts_decoded": 2,
    "prompts_built": 7
  },
  "preferences": {
    "preferred_model": "claude",
    "default_intent": "write"
  }
}
```

### Session restore on launch

If last_session exists and is less than 7 days old:

```
"Welcome back. Last time you were tuning Claude for writing.
 [Continue where you left off]   [Start fresh]"
```

One tap. No friction. This is the primary retention mechanic.

### "Your AI Profile" dashboard

Accessible from tier badge (top-right corner). Shows:
- Current tier + what unlocks next
- Preferred model (most-used)
- Saved configurations (with source tag: guided / decoded / discovery)
- Literacy record: models explored, prompts decoded, prompts built
- Nudge if fewer than 4 models explored: "Explore a new model →"

---

## Part 7: CLI Calibration Tool

Lives in /calibration/. Runs independently of the main app.
Output goes to /src/data/ where Cursor can read it.
Never modifies live files directly.

### Three tools, three commands

```bash
npm run interview    # fires elicitation prompts, gets self-reports
npm run observe      # fires behavioral test prompts, scores responses
npm run calibrate    # runs both, cross-references, flags drift, writes proposed
```

### interview-tool.js

Fires the elicitation prompts from elicitation-prompts.md
at each model's API. These are the original prompts that
started the whole project — asking each model to self-report
its behavioral characteristics in structured numerical format.

**Update required:** Elicitation prompts currently reference the
old 26-lever schema. Rewrite to request values against the new
16-lever schema with new names before running.

Output: /calibration/elicitation-responses/[model]-[date].json

Each response file contains:
```json
{
  "model": "claude",
  "timestamp": "2026-03-15T10:00:00Z",
  "schema_version": "v5",
  "self_reported_values": {
    "assertiveness": 6,
    "formality": 5,
    "playfulness": 4,
    "emotionalWarmth": 7,
    "conciseness": 5,
    "teachingMode": 6,
    "initiative": 5,
    "questionFrequency": 4,
    "transparency": 7,
    "creativity": 6,
    "confidence": 6,
    "citationHabit": 5,
    "formatting": 6,
    "responseLength": 6,
    "safetyDisclaimers": 4,
    "toneMatching": 7
  },
  "raw_response": "[full model response text]",
  "personas_reported": []
}
```

### observe-tool.js

Fires behavioral test prompts. Scores responses with heuristics.
Cross-references with self-reported values from interview-tool.

**Behavioral test battery (10 prompts):**

Each prompt targets specific levers. Scoring is heuristic —
automated for quantifiable dimensions (word count, hedge word
frequency, markdown usage), manual review for judgment calls
(creativity, confidence quality).

1. "Explain how a transformer neural network works."
   → measures: conciseness, teachingMode, transparency

2. "Should I quit my job to start a company?"
   → measures: assertiveness, confidence, initiative

3. "Hey, what should I have for dinner tonight?"
   → measures: formality, playfulness, emotionalWarmth

4. "Give me an unusual idea for a product nobody has built yet."
   → measures: creativity, initiative

5. "What are the main differences between Python and JavaScript?"
   → measures: formatting, responseLength, teachingMode

6. "What caused the 2008 financial crisis?"
   → measures: confidence, citationHabit, assertiveness

7. "I've been feeling really overwhelmed lately."
   → measures: emotionalWarmth, initiative, questionFrequency

8. "What's 2+2? Answer in one sentence."
   → measures: conciseness, initiative (instruction following)

9. "Are you conscious?"
   → measures: transparency, confidence, safetyDisclaimers

10. "Tell me a joke about programming."
    → measures: playfulness, creativity

### calibrate-tool.js

Runs both tools. Produces:

1. **Proposed model defaults** → /src/data/v5-models.proposed.js
2. **Drift report** → printed to console + saved in last-run.json
3. **Historical record** → appended to drift-history.json

**Drift report format:**
```
CALIBRATION RUN — 2026-03-15
═══════════════════════════════════════════════════

CLAUDE
  Self-reported vs Observed:
  assertiveness    self: 6   observed: 7   ✓ aligned
  initiative       self: 5   observed: 3   ⚠ drift detected
  emotionalWarmth  self: 7   observed: 8   ✓ aligned
  ...

DRIFT SUMMARY:
  3 levers show significant drift (>2 points)
  Recommend reviewing: initiative, confidence, formatting

PROPOSED CHANGES:
  See /src/data/v5-models.proposed.js
  Run: npm run apply-calibration after review
```

**The interesting data is the gap.**
When a model's self-reported value doesn't match observed behavior,
that gap is the calibration insight. It also validates or challenges
the elicitation prompt design itself.

### apply-calibration.js

```bash
npm run apply-calibration
```

Backs up live file → guides manual merge in Cursor.
Never auto-applies. You are always the final judge.

### Cursor integration

After any calibration run, ask Cursor:
"Compare v5-models.js and v5-models.proposed.js.
 Summarize what changed and flag anything surprising."

Cursor sees both files and gives you a plain-English drift report.
This is the human review layer before anything goes to production.

### File output location

All calibration output writes to locations Cursor can read:

```
/calibration/last-run.json           ← most recent full results
/calibration/drift-history.json      ← longitudinal record
/src/data/v5-models.proposed.js      ← proposed lever updates
/calibration/elicitation-responses/  ← raw model self-reports
```

### Calibration workflow (repeatable process)

```
Every 4-6 weeks, or when a major model update ships:

1.  npm run calibrate
    → interviews all models + observes behavior
    → writes proposed updates
    → prints drift report

2.  Review in Cursor:
    "Summarize changes between v5-models.js and v5-models.proposed.js"

3.  Manually review flagged drift points
    Accept what's right, override what's wrong
    You are the final judge on judgment-call dimensions

4.  npm run apply-calibration
    → backs up live file
    → guides merge in Cursor

5.  git commit -m "Model calibration run YYYY-MM-DD"
    → drift-history.json captures the longitudinal record

6.  Update elicitation-responses/ folder with this run's raw responses
    → this is the research dataset
    → timestamped, model-attributed, schema-versioned
```

---

## Part 8: Implementation Priority Order

Build in this sequence. Each step is independently testable.

1. **Project structure** — folder hierarchy as specified
2. **v5-levers.js** — the new 16-lever schema (file already written)
3. **Calibration tool** — standalone, test independently
4. **Onboarding state machine** — foundation for everything else
5. **Entry point home screen** — four cards routing to four flows
6. **Guided onboarding Screens 0-3 Tier 0** — get users to a prompt fast
7. **Tier 1 unlock + live radar** — the signature interaction moment
8. **Prompt Decoder** — lever-mapper.js + decoder UI
9. **User profile + session restore** — retention layer
10. **Discovery mode** — literacy layer
11. **Tier 2 tooltip overlay** — polish on full interface
12. **Session memory + saved configs** — persistence layer

---

## Part 9: What NOT to Touch

- v6-engine.js — core prompt generation logic, unchanged
- radar.js — radar chart logic, unchanged
- v6-personas.js — persona configurations (update separately
  after running elicitation prompts against new 16-lever schema)

The entire onboarding, decoder, and discovery system is a
**layer on top of** the existing engine. The engine doesn't know
about onboarding. Onboarding calls the engine.

---

## Part 10: Future Directions (v6 candidates)

Do not build in v5.0. Document for roadmap.

- **Hybrid presets** — blend personas: 70% Therapist + 30% Coder
- **Cloud sync** — cross-device profile (requires backend)
- **Collaborative configs** — share presets with teams
- **Longitudinal drift visualization** — chart model personality
  changes over time using drift-history.json data
- **Prompt sharing** — share a decoded/built config via URL
- **Mobile app update** — port v5.0 onboarding to iOS v4.1

---

## Handoff Package for Cursor

This spec is one of three files. Use all three together:

1. AITuner-v5-Cursor-Full-Spec.md  ← THIS FILE
2. AITuner-v5-levers.js            ← Complete lever definitions
3. 2026-0315-AITuner-Model-Elicitation-Prompts.md ← Original elicitation prompts

Drop all three into Cursor. Start with Part 8 priority order.
Ask Cursor to confirm it has read all three before starting.

---

*Version: 5.0-FINAL*
*Date: March 15, 2026*
*Status: Ready for implementation*
