# AITuner v5.1 — Domain Model Spec
**Date:** April 28, 2026
**Supersedes:** AITuner-v5-Domain-Model-Spec.md (March 15, 2026)
**Visual:** AITuner-v51-Domain-Model.html

---

## What Changed from v5.0

The March model had 15 entities centered on the
behavioral tuning system. The April model has 25
entities across six domains. Ten new entities added.

**New domains:**
- Prompt Engine (redesigned with clustering)
- Project Setup (three-zone workspace configuration)
- Literacy System (educational content layer)

**New entities:**
ZONE, NATIVE_BEHAVIOR, CLUSTER,
SYNTHESIZED_INSTRUCTION, SOURCE_MAP,
PROJECT_SETUP, KNOWLEDGE_TEMPLATE,
INSTRUCTIONS_CONTENT, MEMORY_GUIDE,
LITERACY_PATH, REEL_COMPONENT

**Modified entities:**
LEVER (+ cluster_id, dead_zone),
PILLAR (+ priority_rank),
PERSONA (+ synthesized_instructions, lever_profile),
PROMPT (+ source_map_id),
MODEL (+ native_behavior_id),
SESSION (+ zone_context),
CALIBRATION_RUN (+ native_behavior_delta)

---

## The Two Systems

AITuner v5.1 has two distinct but connected systems.

### System 1: The Tuning System
Helps users configure AI behavior.
User → Session → Config → Lever Values →
Cluster → Synthesized Instruction → Prompt

### System 2: The Literacy System
Helps users understand AI systems.
User → Literacy Path → Reel Component → Zone →
Native Behavior | Project Setup

**The bridge:** The Project Setup Guide takes
understanding from System 2 and produces
artifacts for System 1. Knowledge Template +
Instructions Content + Memory Guide together
constitute a complete Zone 1 configuration.

---

## Entity Definitions

---

### ZONE
*New entity. First-class architectural concept.*

The three zones of AI control. Every feature in
AITuner maps to a zone. Every educational component
explains a zone.

| Attribute | Type | Notes |
|-----------|------|-------|
| id | int PK | 1, 2, or 3 |
| label | string | Direct / Emergent / Fixed |
| description | string | Plain English |
| user_control | string | Full / Partial / None |
| aituner_role | string | operates / educates / reveals |
| color | string | green / yellow / red |

**Zone 1 — Direct Input**
What the user explicitly writes and controls.
AITuner operates here — generating better starting conditions.

**Zone 2 — Emergent**
What develops through use — working memory,
conversational drift, project memory.
AITuner educates here — teaches users what
Zone 2 is and how to work with it deliberately.

**Zone 3 — Fixed**
Native behavior. Baked in at the weights level.
Cannot be overridden by prompts.
AITuner reveals this — makes it visible through
model rooms, Discovery Mode, Truth-Seeker persona.

**Rules:**
- Static entity — never changes at runtime
- Every feature in the app is tagged to a zone
- Every reel component declares which zones it covers

---

### NATIVE_BEHAVIOR
*New entity. Replaces "prime directive" everywhere.*

What a model does before the user changes anything.
Built by the company that trained it. Separate from
default lever values — this is the philosophical
commitment baked in at training, not a configurable
starting point.

| Attribute | Type | Notes |
|-----------|------|-------|
| model_id | string FK PK | One per model |
| description | string | One-sentence summary |
| source_method | string | elicitation_v5 / paraphrased_vendor |
| last_calibrated | timestamp | When last updated |
| self_reported | string | From elicitation prompts |
| observed | string | From calibration tool |

**Rules:**
- One NATIVE_BEHAVIOR per MODEL — always
- Two labeled sources always shown separately in UI:
  "What [model] says about itself" and
  "What we observed"
- Never combined into a single description
- Updated by calibration pipeline, human approval required
- Displayed in model room tour under "Native behavior"

---

### CLUSTER
*New entity. Core of the prompt engine redesign.*

A defined grouping of levers that point toward
the same behavioral dimension. When constituent
levers are sufficiently aligned, they synthesize
into a single instruction rather than generating
separate redundant instructions.

| Attribute | Type | Notes |
|-----------|------|-------|
| id | string PK | directness / brevity / engagement / explanation / emotional |
| name | string | Plain English name |
| lever_keys | string[] | Which levers belong |
| alignment_threshold | int | Max spread for clustering (default: 3) |
| conflict_winner | string FK | Which lever wins on conflict |

**The five clusters:**

1. **Directness** — assertiveness + confidence +
   safetyDisclaimers (when ≤ 2)

2. **Brevity** — conciseness + responseLength
   Conflict winner: responseLength (harder constraint)

3. **Engagement Scope** — initiative + questionFrequency

4. **Explanation Depth** — teachingMode + transparency

5. **Emotional Register** — playfulness + emotionalWarmth

**Five standalones** (no cluster):
formality, creativity, citationHabit,
formatting, toneMatching

**Rules:**
- Cluster fires when all levers are ≥ 7 or all ≤ 3
  AND spread between max and min ≤ 3 points
- Below threshold: cluster splits, each lever
  generates its own instruction
- Mid-range levers (4-6) in a directional cluster:
  included in synthesis
- Mid-range levers (4-6) in no cluster: no instruction

---

### SYNTHESIZED_INSTRUCTION
*New entity. Output of the clustering engine.*

A single clean instruction produced either from
a cluster of aligned levers or from a standalone
lever outside the dead zone.

| Attribute | Type | Notes |
|-----------|------|-------|
| prompt_id | uuid FK | Parent prompt |
| text | string | The actual instruction text |
| type | string | cluster / standalone |
| cluster_id | string FK | Null if standalone |
| lever_key | string FK | Null if cluster |
| sort_order | int | Display sequence |

**Rules:**
- Clusters first, standalones second in sort order
- Hierarchy declaration always last
- Plain English — no lever names, no values visible
- Target: 5-10 instructions total per prompt

---

### SOURCE_MAP
*New entity. The transparency layer.*

Records exactly which levers produced which
instructions and why. Powers the "How this
was built" expandable UI section.

| Attribute | Type | Notes |
|-----------|------|-------|
| prompt_id | uuid FK PK | One per prompt |
| instructions | json | Array of instruction records |
| neutral_levers | json | Levers in dead zone |
| hierarchy | string | Declared priority order |
| word_count | int | Total prompt word count |

**Instruction record structure:**
```json
{
  "instruction": "State your assessment directly...",
  "type": "cluster",
  "cluster_name": "Directness",
  "levers": [
    {"key": "assertiveness", "value": 9},
    {"key": "confidence", "value": 8},
    {"key": "safetyDisclaimers", "value": 0}
  ]
}
```

**Rules:**
- Always generated with the prompt — never separately
- A prompt without a source map is invalid
- Neutral levers always listed (shows user what
  generated no instruction and why)
- Collapsed by default in UI — expandable on click

---

### PROJECT_SETUP
*New entity. Container for three-zone configuration.*

The output of the Project Setup Guide feature.
Holds the three artifacts that configure a
complete project workspace.

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid PK | |
| user_id | string FK | Owner |
| model_id | string FK | Target platform |
| name | string | User-given project name |
| created_at | timestamp | |

**Rules:**
- Always has exactly three outputs:
  KNOWLEDGE_TEMPLATE + INSTRUCTIONS_CONTENT
  + MEMORY_GUIDE
- model_id determines platform-specific formatting
  of all three outputs
- A PROJECT_SETUP without all three outputs
  is considered incomplete

---

### KNOWLEDGE_TEMPLATE
*New entity. Zone 1 knowledge layer.*

A structured markdown document capturing
who the user is and what they're working on.
Uploaded to the project's files/sources section.
Never mixed with behavioral instructions.

| Attribute | Type | Notes |
|-----------|------|-------|
| setup_id | uuid FK | Parent setup |
| project_name | string | |
| about_me | string | User's self-description |
| project_context | string | Current work context |
| named_entities | string | Key people, orgs, products |
| frameworks | string | Mental models used |
| historical_context | string | Relevant background |
| terminology | string | Project-specific terms |
| generated_markdown | string | Ready-to-upload file |

**Rules:**
- Content is user-authored, structured by the template
- Output is a markdown file — ready to upload
- Never includes behavioral rules
- Separation from INSTRUCTIONS_CONTENT is mandatory

---

### INSTRUCTIONS_CONTENT
*New entity. Zone 1 behavioral layer.*

The behavioral configuration formatted for
the Instructions field of a project workspace.
Different from PROMPT — this is persistent,
not task-specific.

| Attribute | Type | Notes |
|-----------|------|-------|
| setup_id | uuid FK | Parent setup |
| config_id | uuid FK | Source lever config |
| platform | string | claude / grok / chatgpt / gemini |
| generated_text | string | Formatted for Instructions field |
| format_notes | string | Platform-specific guidance |

**The critical distinction:**

Instructions field = standing orders.
Set once. Always active. Every conversation
starts with these rules already running.

Prompt box = what you say in the moment.
Task-specific. Resets each exchange.

**Rules:**
- Generated from CONFIG lever values
- Uses same clustering/synthesis engine as PROMPT
  but formatted for persistent behavioral rules,
  not one-time task direction
- Platform-specific formatting applied:
  Claude: markdown supported
  Grok: plain text preferred
  ChatGPT: maps to two Custom Instructions fields
  Gemini: system instructions field

---

### MEMORY_GUIDE
*New entity. Zone 2 education output.*

Platform-specific guidance on how memory works,
how to view and edit it, and how to seed it
deliberately at project start.

| Attribute | Type | Notes |
|-----------|------|-------|
| setup_id | uuid FK | Parent setup |
| platform | string | Target platform |
| how_it_works | string | Plain English explanation |
| prompt_commands | string[] | Commands for memory management |
| starter_seeds | string[] | Suggested initial memory entries |
| hygiene_schedule | string | Recommended review frequency |

**Rules:**
- Educational content — not a data artifact
- Platform-specific prompt commands included
- "Memory builds through use — check back
  in 2-4 weeks" reminder always included
- Never implies the user can control Zone 2
  the way they control Zone 1

---

### LITERACY_PATH
*New entity. The educational dimension.*

A named sequence of reel components that guides
a user from zero knowledge to a specific level
of AI understanding.

| Attribute | Type | Notes |
|-----------|------|-------|
| id | string PK | |
| name | string | |
| description | string | |
| target_user | string | beginner / intermediate / all |
| sequence | string[] | Ordered reel component IDs |

**Three paths:**

1. **LLM Basics** — What is an LLM? 10 slides.
   For absolute beginners.

2. **Three Zones** — How AI systems are structured.
   11 slides. For anyone wanting to understand
   what they can and can't control.

3. **Project Setup** — How to configure a workspace.
   Linked to the Project Setup Guide feature.

---

### REEL_COMPONENT
*New entity. Individual educational content unit.*

A single swipeable reel — a standalone
educational artifact in mobile-first format.

| Attribute | Type | Notes |
|-----------|------|-------|
| id | string PK | |
| path_id | string FK | Parent literacy path |
| title | string | |
| slide_count | int | |
| target_user | string | just-show-me / how-it-works / both |
| zone_coverage | int[] | Which zones this reel explains |
| has_branch_point | bool | Does it offer two paths? |

**Existing reels:**
- LLM Explainer (10 slides, both user types,
  branch point at slide 5)
- Three Zones (11 slides, both user types)
- Onboarding Storyboard (11 screens,
  4 entry paths, annotated)

**Rules:**
- Each reel is standalone — complete without context
- Reels with branch points accommodate both
  "just show me" and "how it works" users
- zone_coverage determines which zone-colored
  UI elements appear in the reel

---

## What This Model Reveals About the Product

Looking at all 25 entities together, AITuner
is clearly two products sharing one engine:

**Product 1: The Tuning Tool**
USER → SESSION → CONFIG → LEVER_VALUES →
CLUSTER → SYNTHESIZED_INSTRUCTION →
SOURCE_MAP → PROMPT

This is what the app has always been.
It got significantly smarter in v5.1 —
clustering, synthesis, conflict resolution,
transparency. But the core chain is the same.

**Product 2: The Literacy Platform**
USER → LITERACY_PATH → REEL_COMPONENT →
ZONE → NATIVE_BEHAVIOR
USER → PROJECT_SETUP → KNOWLEDGE_TEMPLATE
                     + INSTRUCTIONS_CONTENT
                     + MEMORY_GUIDE

This is what the app is becoming.
Teaching users what AI systems are,
how they're structured, and what they
can actually control.

**The bridge between them:**
PROJECT_SETUP takes literacy (understanding
the three zones) and produces tuning
artifacts (knowledge template + instructions).
Understanding → capability.

That's the full product vision in one sentence:
*AITuner takes the mystery out of AI —
completely — and gives users as much
mastery as the system allows.*

---

## Entities by Zone

Every entity in the domain maps to a zone.

**Zone 1 entities (user controls directly):**
CONFIG, LEVER_VALUES, LEVER, PERSONA,
CLUSTER, SYNTHESIZED_INSTRUCTION, SOURCE_MAP,
PROMPT, KNOWLEDGE_TEMPLATE, INSTRUCTIONS_CONTENT

**Zone 2 entities (develops through use):**
MEMORY_GUIDE, SESSION, PROFILE
(session accumulation and profile memory
both represent Zone 2 dynamics)

**Zone 3 entities (fixed, revealed not controlled):**
NATIVE_BEHAVIOR, MODEL, CALIBRATION_RUN
(these reveal what's fixed, not configure it)

**Cross-zone entities (framework/literacy):**
ZONE, LITERACY_PATH, REEL_COMPONENT,
DECODED_PROMPT, DECODED_LEVER_VALUE,
PROJECT_SETUP, USER, INTENT, PILLAR

---

*Domain Model Version: 5.1*
*Date: April 28, 2026*
*25 entities across 6 domains*
*Supersedes: AITuner-v5-Domain-Model-Spec.md*
