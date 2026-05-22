# AITuner v5.0 — Prompt Generator Redesign
## Clustering, Synthesis & Conflict Resolution Spec
**Date:** April 28, 2026
**Status:** Design spec — ready for Cursor implementation
**Affects:** `src/core/v5-engine.js` (prompt generation logic)
**UI addition:** Expandable "How this was built" section
  in prompt display

---

## The Problem This Solves

The current prompt generator produces one instruction
per lever that has a non-default value. When multiple
levers point in the same direction, the model receives
redundant instructions and treats them as noise rather
than stacking them.

Example — current output when assertiveness:9,
confidence:9, safetyDisclaimers:0:

```
- Be decisive. State conclusions directly.
- Pick a lane. Give a direct opinion.
- Skip the disclaimers and AI qualifications.
```

Three instructions saying the same thing.
The model pattern-matches around the redundancy.
Effect degrades rather than compounds.

Example — synthesized output for the same values:

```
State your assessment directly. No qualifiers,
no disclaimers, no 'it depends' unless the
uncertainty is genuine and material.
```

One instruction. Clean. More effective.

---

## The Clustering Map

Five clusters + five standalones.

Clusters fire when constituent levers are
sufficiently aligned (within 2 points of each
other on the 0-10 scale, both above or below 5).

When levers in a cluster diverge (one above 5,
one below 5, or spread > 3 points), the cluster
splits and each lever generates its own instruction.

---

### CLUSTER 1: Directness

**Levers:** `assertiveness` + `confidence` +
`safetyDisclaimers` (when ≤ 2)

**When to cluster:** All three pointing toward
directness (assertiveness ≥ 7, confidence ≥ 7,
safetyDisclaimers ≤ 2)

**Synthesized instruction (high directness):**
> "State your assessment directly. No qualifiers,
> no disclaimers, no 'it depends' unless the
> uncertainty is genuine and material. Pick a
> position and hold it."

**Synthesized instruction (high tentativeness):**
> "Acknowledge uncertainty freely. Present multiple
> perspectives. Use qualifying language where
> appropriate. Include relevant caveats."

**When split:** Generate separate instructions
for assertiveness (delivery style) and confidence
(epistemic commitment). safetyDisclaimers only
generates an instruction when ≤ 2 (off) or ≥ 8
(explicitly on). Default range generates nothing.

**Source map label:** "Directness — from
Assertiveness, Confidence, Safety Disclaimers"

---

### CLUSTER 2: Brevity

**Levers:** `conciseness` + `responseLength`

**When to cluster:** Both pointing same direction
(both ≤ 4 or both ≥ 7, spread ≤ 3 points)

**Synthesized instruction (brief):**
> "Answer briefly. Get to the point and stop.
> No padding, no recap, no elaboration beyond
> what was asked."

**Synthesized instruction (thorough):**
> "Be thorough. Cover the full scope. Don't
> truncate for brevity — complete answers
> serve better than short ones here."

**When split:** Generate separate instructions.

**Conflict resolution rule:**
`responseLength` wins over `conciseness` when
they conflict. responseLength is the harder
constraint — it controls target size.
conciseness controls language efficiency
within that size.

Conflict instruction pattern:
> "[responseLength instruction]. Within that
> length, [conciseness instruction]."

**Source map label:** "Brevity — from
Conciseness, Response Length"

---

### CLUSTER 3: Engagement Scope

**Levers:** `initiative` + `questionFrequency`

**When to cluster:** Both low (≤ 3) or both high
(≥ 7), spread ≤ 3 points

**Synthesized instruction (contained):**
> "Answer only what was asked. Don't add
> suggestions, next steps, or tips unless
> requested. Don't ask clarifying questions
> — make reasonable assumptions and proceed."

**Synthesized instruction (expansive):**
> "Proactively add relevant context, next
> steps, and related ideas. Ask clarifying
> questions when the request is ambiguous
> before proceeding."

**When split:**

initiative low + questionFrequency high:
> "Answer only what was asked — no extra
> suggestions. But ask one clarifying question
> if the request is genuinely ambiguous."

initiative high + questionFrequency low:
> "Proactively add relevant context and next
> steps. Make reasonable assumptions rather
> than asking — proceed and offer to adjust."

**Source map label:** "Engagement — from
Initiative, Question Frequency"

---

### CLUSTER 4: Explanation Depth

**Levers:** `teachingMode` + `transparency`
(Show Your Work)

**When to cluster:** Both pointing same direction,
spread ≤ 3 points

**Synthesized instruction (deep explanation):**
> "Explain your reasoning as you go. Define
> terms the user may not know. Walk through
> the thinking, not just the conclusion."

**Synthesized instruction (answer only):**
> "Skip the explanation. Deliver the answer
> directly. Assume competence — don't define
> terms or show reasoning unless asked."

**When split:**

teachingMode high + transparency low:
> "Explain concepts and define terms for
> clarity. But deliver conclusions directly
> without narrating your reasoning process."

teachingMode low + transparency high:
> "Show your reasoning process — how you
> got to the answer. But assume the user
> already knows the underlying concepts."

**Source map label:** "Explanation — from
Teaching Mode, Show Your Work"

---

### CLUSTER 5: Emotional Register

**Levers:** `playfulness` + `emotionalWarmth`

**When to cluster:** Within 2 points of each other

**Synthesized instruction (warm + playful):**
> "Be warm and human. Wit is welcome.
> Emotional presence matters here."

**Synthesized instruction (cool + serious):**
> "Keep it professional and task-focused.
> No humor. Emotional performance not needed."

**When split:**

warmth high + playfulness low (Therapist):
> "Be emotionally present and warm.
> Serious tone — this isn't the place for wit."

playfulness high + warmth low (Edgy/Direct):
> "Wit and lightness are welcome. But keep
> it task-focused — no emotional performance."

**Source map label:** "Tone — from Emotional
Warmth, Playfulness"

---

### STANDALONES

These always generate their own instruction
regardless of other lever settings.
No clustering. No conflict with each other.

**`formality`**

Low (≤ 3):
> "Write conversationally. Like a smart
> colleague, not a formal document."

Mid (4-6): No instruction generated
(default behavior, no override needed)

High (≥ 7):
> "Maintain a professional, formal register.
> Appropriate for reports and formal contexts."

---

**`creativity`**

Low (≤ 3):
> "Stay grounded. Factual, conventional,
> reliable. No speculation."

Mid (4-6): No instruction generated

High (≥ 7):
> "Think beyond the obvious. Speculative,
> imaginative, unexpected angles welcome."

---

**`citationHabit`**

Low (≤ 3):
> "Speak from your own knowledge. No need
> to cite sources or qualify every claim."

Mid (4-6): No instruction generated

High (≥ 7):
> "Back claims with sources where you have
> them. Distinguish what you know confidently
> from what you're inferring."

---

**`formatting`**

Low (≤ 3):
> "Plain prose. No headers, no bullets,
> no markdown structure."

Mid (4-6): No instruction generated

High (≥ 7):
> "Use structure. Headers, bullets, numbered
> lists where they aid clarity."

---

**`toneMatching`**

Low (≤ 3):
> "Maintain a consistent voice regardless
> of how the user writes."

Mid (4-6): No instruction generated

High (≥ 7):
> "Mirror the user's register, energy,
> and pace. Adapt to how they write."

---

## Conflict Resolution Hierarchy

When clusters or standalones produce conflicting
behavioral directions, this hierarchy determines
which wins. Declare explicitly at the end of
every generated prompt.

**Priority order (highest to lowest):**

1. **OUTPUT** — formatting and length constraints
   are the hardest limits. The model must fit
   within them.

2. **CHARACTER** — who the AI is overrides how
   it talks. Tone and register are fundamental.

3. **VOICE** — how it communicates, within the
   character it's been given.

4. **THINKING** — reasoning style adapts to
   serve the above.

**Hierarchy declaration — appended to every prompt:**

> "When these instructions conflict:
> output constraints take precedence,
> then character, then voice, then thinking."

**This line is always included.**
It prevents the model from resolving conflicts
inconsistently on its own.

---

## Mid-Range Dead Zones

Levers set between 4-6 are in the "neutral zone"
— close enough to default behavior that generating
an instruction adds noise without changing behavior.

**Rule:** Only generate instructions for levers
set ≤ 3 or ≥ 7. Levers 4-6 generate no instruction.

**Exception:** When a lever is part of a cluster
and the cluster as a whole is directional,
include it in the synthesis even if the individual
value is mid-range.

This dramatically reduces prompt length for
users who've only adjusted a few levers — the
majority of new users.

---

## Prompt Structure

Generated prompts follow this structure:

```
[PERSONA ACTIVATION — if persona selected]
One sentence establishing the behavioral mode.

[SYNTHESIZED INSTRUCTIONS]
Clusters first, standalones second.
Each on its own line.
Plain English. No bullet points.
No lever names visible in the output.

[CONFLICT RESOLUTION DECLARATION]
"When these instructions conflict: output
constraints take precedence, then character,
then voice, then thinking."

[KNOWLEDGE CONTEXT — if knowledge profile set]
"Context: [structured user profile data]"
```

Total target length: 50-150 words.
Longer than this and the model treats it as noise.

---

## UI: "How This Was Built" — Expandable Section

Below every generated prompt, a collapsed section:

```
▾ How this was built

DIRECTNESS CLUSTER
  Assertiveness: 9 · Confidence: 8 · Disclaimers: off
  → "State your assessment directly..."

BREVITY CLUSTER  
  Conciseness: 7 · Response Length: 6
  → "Answer briefly. Get to the point..."

STANDALONE: Formality (8)
  → "Maintain a professional, formal register."

STANDALONE: Creativity (3)
  → "Stay grounded. Factual, conventional."

CONFLICT RESOLUTION
  Priority: Output → Character → Voice → Thinking

LEVERS IN NEUTRAL ZONE (no instruction generated)
  Teaching Mode: 5 · Question Frequency: 4 ·
  Tone Matching: 5 · Citation Habit: 5
```

**Design principles for this section:**
- Collapsed by default — doesn't interrupt the main flow
- Shows every lever, including neutral ones
- Shows which cluster each instruction came from
- Shows the conflict resolution hierarchy
- Uses plain English throughout — no code, no jargon
- Label: "How this was built" not "Technical details"

This section is the transparency layer.
It shows the user exactly what happened and why.
Nothing is hidden. The synthesis is labeled.

---

## Implementation Notes for Cursor

### Files to modify

**`src/core/v5-engine.js`**
- Replace `generatePrompt()` with new synthesis engine
- Add `detectClusters()` — identifies which levers
  are in cluster range
- Add `synthesizeCluster()` — produces single instruction
  from cluster
- Add `resolveConflicts()` — applies hierarchy when
  clusters oppose each other
- Add `buildSourceMap()` — records which levers
  produced which instruction (for UI display)
- Add `applyDeadZone()` — filters out mid-range levers

**`src/core/prompt-display.js`**
- Add expandable "How this was built" section
- Render source map from engine output
- Show neutral zone levers as a separate list
- Collapsed by default, toggle on click

### Data structure — engine output

```javascript
{
  prompt: "Full synthesized prompt text",
  sourceMap: [
    {
      instruction: "State your assessment directly...",
      type: "cluster",
      clusterName: "Directness",
      levers: [
        { key: "assertiveness", value: 9 },
        { key: "confidence", value: 8 },
        { key: "safetyDisclaimers", value: 0 }
      ]
    },
    {
      instruction: "Answer briefly...",
      type: "cluster",
      clusterName: "Brevity",
      levers: [
        { key: "conciseness", value: 7 },
        { key: "responseLength", value: 6 }
      ]
    },
    {
      instruction: "Maintain a professional register.",
      type: "standalone",
      lever: { key: "formality", value: 8 }
    }
  ],
  neutralLevers: [
    { key: "teachingMode", value: 5 },
    { key: "questionFrequency", value: 4 },
    { key: "toneMatching", value: 5 },
    { key: "citationHabit", value: 5 }
  ],
  hierarchy: "Output → Character → Voice → Thinking",
  wordCount: 87
}
```

### Persona integration

Personas bypass the clustering engine.
They provide pre-synthesized instructions
written by hand for maximum precision.

The source map for a persona shows:
```
PERSONA: Direct
  Pre-synthesized behavioral profile
  Lever values this persona represents:
  assertiveness:9 · conciseness:9 · initiative:0 ...
```

This preserves transparency while using the
cleaner persona output.

### Testing the engine

Before shipping, test these specific cases:

1. **All neutral** — no levers adjusted from default.
   Expected: only hierarchy declaration in output.

2. **Single cluster, fully aligned** — all Directness
   cluster levers at 9. Expected: one instruction.

3. **Cluster conflict** — conciseness:8, responseLength:3.
   Expected: conflict resolved, responseLength wins,
   one compound instruction.

4. **All 16 at extremes** — maximum configuration.
   Expected: 8-10 instructions, all non-redundant,
   hierarchy declared.

5. **Persona applied** — Direct persona.
   Expected: persona instructions + source map
   showing lever values.

---

## What This Changes About AITuner

Before: prompt generator = lever value translator.
One lever, one instruction, naive.

After: prompt generator = behavioral synthesizer.
Cluster-aware, conflict-resolving, source-mapped,
transparent.

The output is shorter, cleaner, and more effective.
The transparency section shows more, not less —
because it explains the synthesis rather than
hiding it.

This is the most important technical change
in the v5.0 → v5.1 transition.

---

*Spec: April 28, 2026*
*Implement after Cursor update PostStop7 is complete*
*This is a new stop: Stop 8*
