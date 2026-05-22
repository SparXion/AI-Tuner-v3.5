# AITuner v5.0 — Cursor Update Prompt
# Post-Stop 7 Changes
**Date:** March 27, 2026
**Status:** Ready to execute
**Scope:** All changes made after Stop 7 verification.
No new features. Updates to copy, personas, entry card,
visual language, and model room content.

---

## Context for Cursor

After Stop 7, the following design decisions were made
in a separate session. This prompt captures all of them
precisely. Execute them in order. Do not infer or expand
beyond what is specified. When done, produce a
verification report in the same format as Stops 1-7.

---

## Update 1 — Entry Card Copy
**File:** `index.html`
**Type:** Copy change — one card label and subtext

Find the home screen entry card currently reading:
```
I have a task
Guided onboarding — learn as you tune
```

Replace with:
```
New to this? Start here.
Still figuring out what AI can do for you —
this is the place to start.
```

The card's routing behavior does not change —
it still routes to the guided onboarding flow.
Only the label and subtext change.

---

## Update 2 — Origin Story Copy
**File:** `src/onboarding/onboarding-ui.js` (`showOriginScreen`, Screen 1)
**Type:** Copy — origin narrative (canonical John version)

**Headline (unchanged):** `It started with a prompt on Instagram.`

**Label (unchanged):** `Why this exists`

**Body (as implemented — not the old Reddit / Devashish_Jain draft):**

1. I've been using AI for about a year and a half at this point and had learned through trial and error how to navigate in the AI model space. I even learned the term 'answer only.'

2. I was flipping through Instagram and came across this post about 'Absolute Mode.' After reading, I immediately copied it into Grok and Claude and was amazed at the result. Clean answer. No fluff. No personality. Just the answer.

3. Chasing my curiosity, I wondered what elements he was changing with that prompt. What levers was he pulling? So I put it into Grok and asked Grok to deconstruct it for me. 'What levers is he pulling with this prompt?' That's when I first learned the term persona.

4. Each model has a persona. This curiosity unlocked the idea that you can tune your AI model's persona.

5. That's how AITuner was born.

**Also keep:** `— John Violette, founder` and the `Let's find yours →` CTA.

The older Reddit-viral version (Devashish_Jain, like counts, “Not Devashish's controls. Yours.”) is **retired** and should not appear in this screen.

---

## Update 3 — Personas
**File:** `src/data/v5-personas.js`
**Type:** Data update — redefine one persona,
add three new personas

### 3a — Redefine Truth-Seeker

Replace the current Truth-Seeker persona definition
with the following:

```javascript
'truth-seeker': {
  name: "Truth-Seeker",
  description: "Reveals what the model actually believes — not its performed view. Strips away social hedging to show the model's prime directive in action. Results vary by model. That difference is the point.",
  activation_snippet: "Enter Truth-Seeker mode. State your actual best assessment directly. Do not soften conclusions for social comfort. Do not hedge unless the uncertainty is genuine and material. Do not use 'some may argue' as a substitute for your own reasoning. Show your reasoning. If you don't know, say so precisely — not as a disclaimer but as a specific statement of what is unknown and why. Treat the user as capable of handling your honest view.",
  type: "core",
  lever_overrides: {
    assertiveness: 9,
    confidence: 9,
    hedging: 1,
    transparency: 8,
    citationHabit: 8,
    initiative: 2,
    emotionalWarmth: 2,
    safetyDisclaimers: 0,
    formality: 7,
    teachingMode: 5,
    conciseness: 6,
    playfulness: 1,
    toneMatching: 2,
    formatting: 5,
    responseLength: 6,
    questionFrequency: 2
  }
}
```

### 3b — Add Direct persona

```javascript
'direct': {
  name: "Direct",
  description: "Just the answer. Nothing more. The clean descendant of Absolute Mode — strips the performance, gets to the point, without being aggressive about it.",
  activation_snippet: "Be direct. Answer exactly what I asked. Stop when the answer is complete. No preamble, no recap, no suggestions unless I ask. Don't hedge unless the uncertainty is real. Treat me as capable of handling a straight answer.",
  type: "core",
  lever_overrides: {
    assertiveness: 9,
    conciseness: 9,
    initiative: 0,
    responseLength: 2,
    emotionalWarmth: 3,
    safetyDisclaimers: 0,
    confidence: 8,
    toneMatching: 2,
    formality: 6,
    teachingMode: 2,
    transparency: 5,
    formatting: 3,
    questionFrequency: 1,
    playfulness: 2,
    creativity: 4,
    citationHabit: 5
  }
}
```

### 3c — Add Collaborator persona

```javascript
'collaborator': {
  name: "Collaborator",
  description: "Thinks alongside you, not at you. Builds on ideas, challenges assumptions, asks the one question that moves thinking forward. A peer, not an authority.",
  activation_snippet: "Think alongside me, not at me. Engage with the idea I'm developing. Build on what I say. Push back when my thinking has a gap. Ask one good question when it would move us forward. Operate as a peer — you have views, share them. Don't just answer my questions, advance the thinking.",
  type: "core",
  lever_overrides: {
    initiative: 7,
    transparency: 8,
    questionFrequency: 6,
    confidence: 7,
    creativity: 7,
    assertiveness: 6,
    emotionalWarmth: 6,
    teachingMode: 3,
    conciseness: 5,
    responseLength: 6,
    toneMatching: 7,
    formality: 5,
    citationHabit: 4,
    formatting: 4,
    safetyDisclaimers: 0,
    playfulness: 4
  }
}
```

### 3d — Add Strategist persona

```javascript
'strategist': {
  name: "Strategist",
  description: "Operates at the level of decisions and systems, not tasks. Examines the frame before answering the question. Identifies the real decision underneath the stated one. For consequential choices, not routine work.",
  activation_snippet: "Operate at the strategic level. Before answering, examine the frame the question came in. Identify what decision is actually being made. Challenge assumptions that aren't earning their keep. Synthesize across domains. State your recommendation directly. I don't need more information — I need better thinking. Operate as a senior advisor, not an assistant.",
  type: "core",
  lever_overrides: {
    assertiveness: 9,
    confidence: 8,
    transparency: 7,
    initiative: 8,
    conciseness: 7,
    teachingMode: 2,
    emotionalWarmth: 4,
    creativity: 7,
    questionFrequency: 5,
    formality: 7,
    responseLength: 6,
    citationHabit: 5,
    toneMatching: 4,
    formatting: 6,
    safetyDisclaimers: 0,
    playfulness: 2
  }
}
```

---

## Update 4 — Persona Easy Buttons
**File:** `src/rooms/room-ui.js`
**Type:** Content update — add new personas to
easy button row in room tuner

The current easy button row shows six modes:
Direct Mode, Writing Partner, Research Mode,
Thinking Partner, Teacher Mode, Quick Answer.

Add the following three to the easy button row,
replacing or supplementing as space allows.
If all nine don't fit, priority order is:
Direct, Collaborator, Strategist, then existing six.

```javascript
{
  label: "Direct",
  sub: "Just the answer. Nothing more.",
  persona: "direct"
},
{
  label: "Collaborator",
  sub: "Thinks alongside you",
  persona: "collaborator"
},
{
  label: "Strategist",
  sub: "Challenges the frame, not just the question",
  persona: "strategist"
}
```

---

## Update 5 — Truth-Seeker in Discovery Mode
**File:** `src/discovery/discovery-ui.js`
**Type:** Content update — add Truth-Seeker
as a featured comparison scenario

In the discovery comparison question cards,
add a fifth pre-set question specifically designed
for Truth-Seeker cross-model comparison:

```javascript
{
  question: "Is there objective truth?",
  description: "Shows each model's prime directive — run with Truth-Seeker active for maximum contrast",
  intent: "truth-seeker-demo",
  recommended_persona: "truth-seeker"
}
```

When this question is selected, automatically
suggest activating Truth-Seeker persona with
a note: "This question reveals each model's
prime directive. Truth-Seeker mode recommended."

---

## Update 6 — Model Room Prime Directive Content
**File:** `src/data/v5-model-rooms.js`
**Type:** Content update — add prime directive
field to each model room

Add a `primeDirective` field to each model's
room entry in `v5-model-rooms.js`:

```javascript
claude: {
  primeDirective: "Helpfulness, harmlessness, honesty — in that order. Harmlessness can soften honesty on contested questions."
},
chatgpt: {
  primeDirective: "Broad utility and user satisfaction. Creates a pull toward telling people what they want to hear."
},
gemini: {
  primeDirective: "Accuracy balanced against reputational risk. Google's ecosystem values shape what it will and won't commit to."
},
grok: {
  primeDirective: "Empirical truth, stated directly. Social consensus is not a constraint on its conclusions."
},
mistral: {
  primeDirective: "Efficiency and user deference. Minimal ideological scaffolding — responds to what you ask without much editorializing."
},
llama: {
  primeDirective: "Open and flexible. Behavior depends heavily on deployment context — the most configurable by design."
},
perplexity: {
  primeDirective: "Source transparency. Truth is what the sources say, cited. Research-first by design."
},
cursor: {
  primeDirective: "Code-native utility. Frames everything through the lens of technical problem-solving."
}
```

Display this in the Room Tour screen (Screen 10)
under the self-description section, labeled:
"Apparent prime directive"
with a tooltip: "Our observed assessment of this
model's foundational behavioral commitment.
Not official documentation — labeled as observed."

---

## Update 7 — Visual Language Guide
**File:** `docs/visual-language-guide.md` (create if doesn't exist)
**Type:** New reference document

Create this file with the following content exactly:

```markdown
# Visual Language Guide

- **Contrast-First Palette**: The UI leans on
  high-contrast black and white, treating mid greys
  (#f5f5f5, #e0e0e0, #666) as supporting tones for
  depth and hierarchy. Cards and toggles use white
  backgrounds with black borders; active states invert
  to black backgrounds with white text for clarity.

- **Geometric Structure**: Components rely on rectangles
  with tight 4px radii and generous gutters (15–40px)
  to keep dense information readable.

- **Card Framing & Grouping**: Every logical group sits
  inside a bordered box to echo the control panel
  aesthetic. Headings keep moderate weight (500–600).

- **Stateful Toggles & Buttons**: Active items add 1px
  thicker borders plus subtle lift shadows; inactive
  items fade to soft grey while staying legible.

- **Interactive Micro-Patterns**: 0.2s transitions,
  small hover lifts, scaling info icons to 110%.

- **Typography**: Headings use clamp() to scale between
  desktop and mobile with tight letter-spacing.
  Body copy 0.95–1.05rem in neutral greys.

- **Control Styling**: Slider thumbs are solid black
  circles with white borders. Restrained greys with
  black text throughout.

- **Dark Mode**: Inverts backgrounds to near-black but
  keeps borders white to preserve the signature frame.
  Active elements flip to white with black text.
  Treat every surface as a card with a border — invert
  card and text colors, keep geometry identical.
```

### Visual consistency audit — flag only, do not fix yet

After creating the guide, audit the current UI against
these specific points and report what diverges:

1. Border radius: guide specifies 4px. Current
   implementation uses 8-12px in many places.
   Flag every component using > 4px.

2. Active state pattern: guide uses black/white
   inversion. Flag any active states using color
   other than black/white inversion.

3. Dark mode borders: guide says keep borders white
   in dark mode. Flag any borders that disappear
   or change color in dark mode.

4. Slider thumb styling: guide specifies solid black
   circles with white borders. Flag if current
   implementation differs.

Do NOT fix these in this update. Report only.
John will decide what to align after reviewing the
visual language question — there is a deliberate
tension between the original 4px hardware aesthetic
and the softer 8-12px coaching voice aesthetic.
That decision requires John's input.

---

## Update 8 — About Screen
**File:** `architect.html` and/or wherever the
about screen content lives
**Type:** Copy update

Find the about screen or any "about AITuner" section.
Update it to use John's canonical origin story
(same text as Update 2 above) plus this mission line:

> "AITuner is a coach that helps you discover what you
> want from AI — and then helps you ask for it.
> Every AI has a prime directive. AITuner reveals it."

---

## Verification Required

When all 8 updates are complete, produce a verification
report covering:

1. What changed — file by file
2. How to test each update
3. Known limitations or decisions deferred to John
4. Yes/no confirmation per update
5. The visual language audit report (Update 7)
   — list of divergences found, not fixed

Format: plain markdown, same as Stops 1-7.

---

## Files to Read Before Starting

Read these in full before writing any code:

- `src/data/v5-personas.js` — current persona structure
- `src/onboarding/onboarding-ui.js` — Screen 1 current copy
- `index.html` — current home screen card copy
- `src/rooms/room-ui.js` — current easy button structure
- `src/data/v5-model-rooms.js` — current room content structure
- `src/discovery/discovery-ui.js` — current question cards

Do not begin until you have confirmed you have read
all six files.

---

*Update prompt authored: March 27, 2026*
*Covers all design decisions made after Stop 7*
*Next stop after this: Play session + voice pass*
