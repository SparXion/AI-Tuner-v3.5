# AITuner v5.0 — Domain Model Spec
**Date:** March 15, 2026
**Companion to:** AITuner-v5-FINAL-Cursor-Spec.md
**Visual:** See domain model ERD diagram

---

## Overview

15 entities. Every object in the system is defined here —
what it knows, what it connects to, and what rules govern it.

Read this before writing any data structures or state management.
The rules section at the bottom is where implementation decisions live.

---

## Entities

---

### USER
The person using the app. Minimal — just progression state.

| Attribute | Type | Notes |
|-----------|------|-------|
| id | string | Generated UUID on first launch |
| tier | int | 0, 1, or 2 — current unlock level |
| has_copied | bool | Has ever copied a prompt |
| has_tuned | bool | Has ever adjusted a slider |
| skip_onboarding | bool | Permanently bypasses all onboarding |

**Rules:**
- Created automatically on first app launch
- `tier` only ever increases, never decreases
- `skip_onboarding: true` overrides tier checks everywhere
- One USER per device (localStorage-based, no auth)

---

### PROFILE
Extended user preferences and literacy record.
Separated from USER to keep the core progression state lean.

| Attribute | Type | Notes |
|-----------|------|-------|
| user_id | string FK | One-to-one with USER |
| preferred_model | string | Most-used model id |
| default_intent | string | Last selected intent |
| last_active | timestamp | For session restore logic |

**Rules:**
- Created alongside USER on first launch
- `preferred_model` updates automatically based on usage frequency
- `last_active` updates on every session start

---

### SESSION
Ephemeral. Represents one working session — from entry to prompt copy.
Not explicitly saved by the user. Becomes a CONFIG when saved.

| Attribute | Type | Notes |
|-----------|------|-------|
| id | string PK | UUID |
| user_id | string FK | Owner |
| model_id | string FK | Selected model |
| intent | string | Selected intent (or null if skipped) |
| entry_point | string | guided / discovery / decoder / full |
| created_at | timestamp | Session start time |

**Rules:**
- One active session at a time
- Stores current lever values in memory (not persisted until saved)
- On app close: persisted as `last_session` in PROFILE for restore
- On "Save this configuration": SESSION → CONFIG
- `entry_point` is set at the home screen and never changes mid-session
- A SESSION can exist without an INTENT (entry points 3 and 4)

---

### CONFIG
A named, saved configuration. The primary user artifact.
Everything the user has built gets stored here.

| Attribute | Type | Notes |
|-----------|------|-------|
| id | string PK | UUID |
| user_id | string FK | Owner |
| model_id | string FK | Target model |
| name | string | User-given name |
| source | string | guided / decoded / discovery / manual |
| persona_id | string FK | Optional — null if no persona applied |
| created_at | timestamp | Creation timestamp |

**Rules:**
- A CONFIG always has a MODEL — you can't save a config without targeting a model
- A CONFIG can exist without a PERSONA (persona_id nullable)
- `source` is set at creation and never changes — preserves origin story
- Decoded configs get `source: "decoded"` and store the original raw input
  in the DECODED_PROMPT entity
- Multiple CONFIGs can target the same MODEL
- A CONFIG contains its lever values via the LEVER_VALUES join entity

---

### LEVER_VALUES
Join entity. Maps a CONFIG (or MODEL default, or PERSONA preset)
to specific lever values. The actual numbers live here.

| Attribute | Type | Notes |
|-----------|------|-------|
| config_id | string FK | Parent config |
| lever_key | string FK | Which lever |
| value | int | 0–10 |

**Rules:**
- A CONFIG has exactly 16 LEVER_VALUES — one per lever
- Values are integers 0–10
- When a PERSONA is applied to a CONFIG, its preset values
  overwrite the CONFIG's LEVER_VALUES for the levers it specifies
- When a MODEL is selected, its default values populate
  the CONFIG's LEVER_VALUES as a starting point
- LEVER_VALUES are copied from MODEL defaults, then Persona overrides,
  then manual user adjustments — in that order (last write wins)

---

### MODEL
One of the 8 supported AI platforms.
Each model has a default personality expressed as lever values.

| Attribute | Type | Notes |
|-----------|------|-------|
| id | string PK | claude / chatgpt / gemini / grok / mistral / llama / perplexity / cursor |
| name | string | Display name |
| provider | string | Anthropic / OpenAI / Google / xAI / Mistral / Meta / Perplexity / Cursor |
| voice_signature | string | One-line personality descriptor for model selection screen |

**Rules:**
- 8 models total — fixed set for v5.0
- Each MODEL has default LEVER_VALUES (stored via LEVER_VALUES join,
  with model_id instead of config_id)
- Model defaults are updated via the calibration tool pipeline
  (writes to v5-models.proposed.js, never directly to live data)
- `voice_signature` is hand-authored — not generated
- Sample responses per model per intent are stored in model-samples.js,
  not in this entity (they're static content, not data)

---

### LEVER
One of the 16 tunable dimensions. Definitions are static —
they don't change at runtime.

| Attribute | Type | Notes |
|-----------|------|-------|
| key | string PK | camelCase identifier (e.g. initiative, assertiveness) |
| name | string | Human display name |
| pillar | string FK | CHARACTER / VOICE / THINKING / OUTPUT |
| description | string | Plain English — passes the Molly test |
| low_label | string | What low (0) means in plain language |
| high_label | string | What high (10) means in plain language |
| default_value | int | Neutral starting value before model selection (always 5) |

**Rules:**
- 16 levers total — fixed set for v5.0
- `default_value` is always 5 until a MODEL is selected
- Lever definitions never change at runtime
- Low/high labels are conversational, not technical
- All 16 appear in Architect (Tier 2)
- Only TIER1_LEVERS (5 of 16) appear in Tuner (Tier 1)

**The 16 keys:**
Character: assertiveness, formality, playfulness, emotionalWarmth
Voice: conciseness, teachingMode, initiative, questionFrequency
Thinking: transparency, creativity, confidence, citationHabit
Output: formatting, responseLength, safetyDisclaimers, toneMatching

---

### PILLAR
One of the 4 organizational groupings. Each pillar owns 4 levers
and renders as one radar chart.

| Attribute | Type | Notes |
|-----------|------|-------|
| id | string PK | CHARACTER / VOICE / THINKING / OUTPUT |
| label | string | Display name |
| description | string | "Who it is" / "How it talks" / "How it reasons" / "How it looks" |
| radar_color | string | RGBA value for chart rendering |

**Pillar → lever mapping:**
- CHARACTER: assertiveness, formality, playfulness, emotionalWarmth
- VOICE: conciseness, teachingMode, initiative, questionFrequency
- THINKING: transparency, creativity, confidence, citationHabit
- OUTPUT: formatting, responseLength, safetyDisclaimers, toneMatching

**Rules:**
- 4 pillars, exactly 4 levers each — never changes
- Each pillar renders as one 4-axis radar chart
- In Tier 1 (Tuner), only the CHARACTER and VOICE radars
  show active axes — THINKING and OUTPUT axes are grayed/locked
- All 4 radars fully active in Tier 2 (Architect)

---

### PERSONA
A named preset configuration. Presets specific lever values
and adds an activation snippet to the generated prompt.

| Attribute | Type | Notes |
|-----------|------|-------|
| id | string PK | therapist / truth-seeker / coder / creative-writer / researcher / tutor |
| name | string | Display name |
| description | string | Plain English description |
| activation_snippet | string | Text injected into generated prompt |
| type | string | core / advanced |

**Rules:**
- A PERSONA only presets the levers relevant to it —
  not all 16. Unspecified levers retain their current values.
- Applying a PERSONA overwrites only its specified LEVER_VALUES
  in the active CONFIG — it does not replace the whole config
- A PERSONA can be removed — doing so restores the pre-persona
  lever values (keep a pre-persona snapshot)
- `activation_snippet` is always appended to the generated PROMPT
  when a persona is active
- 6 core personas in v5.0: Therapist, Truth-Seeker, Coder,
  Creative Writer, Researcher, Tutor

---

### PROMPT
The generated system prompt text. Output artifact.
Derived from MODEL defaults + PERSONA overrides + manual LEVER_VALUES.

| Attribute | Type | Notes |
|-----------|------|-------|
| id | string PK | UUID |
| config_id | string FK | Parent config |
| model_id | string FK | Target model |
| generated_text | string | The actual prompt text |
| created_at | timestamp | Generation timestamp |

**Rules:**
- Regenerated every time any lever value changes — never cached stale
- Generation order: MODEL defaults → PERSONA overrides → manual adjustments
- PERSONA activation_snippet appended at end if persona active
- A CONFIG can have multiple PROMPTs over time (as levers are adjusted)
- The "current" prompt is always the most recently generated one
- Copying a PROMPT triggers the Tier 1 unlock if tier === 0

---

### INTENT
The user's stated goal. Selected on Screen 1 of guided onboarding.
Influences model sample responses and default lever values.

| Attribute | Type | Notes |
|-----------|------|-------|
| id | string PK | think / write / build / explore / compare |
| label | string | Display label on intent card |
| description | string | Sub-label on intent card |
| routes_to | string | guided / discovery |

**The 5 intents:**
- think → "Help me think" → routes to guided
- write → "Help me write" → routes to guided
- build → "Help me build" → routes to guided
- explore → "Help me explore" → routes to guided
- compare → "What's the difference between AI models?" → routes to discovery

**Rules:**
- `compare` is the only intent that routes to Discovery Mode
- INTENT selection filters which MODEL sample responses are shown
- INTENT influences initial lever defaults (e.g. "build" pre-sets
  formatting higher, teachingMode lower)
- A SESSION can exist without an INTENT (entry points 3 and 4)

---

### DECODED_PROMPT
A raw prompt the user pasted into the decoder.
The Prompt Decoder's primary input object.

| Attribute | Type | Notes |
|-----------|------|-------|
| id | string PK | UUID |
| user_id | string FK | Owner |
| raw_input | string | The full pasted prompt text |
| unmapped_instructions | string | Instructions the mapper couldn't classify |
| created_at | timestamp | Decode timestamp |

**Rules:**
- Created when user clicks "Decode this →"
- `unmapped_instructions` is always shown to user — never silently dropped
- A DECODED_PROMPT can convert to a CONFIG ("Use this configuration →")
- When converted, source is set to "decoded" on the resulting CONFIG
- A DECODED_PROMPT that hasn't been converted to a CONFIG is ephemeral —
  not saved to the user's profile unless explicitly saved

---

### DECODED_LEVER_VALUE
Join entity for decoded prompts. Maps decoded instructions
to lever values with a confidence score.

| Attribute | Type | Notes |
|-----------|------|-------|
| decoded_id | string FK | Parent decoded prompt |
| lever_key | string FK | Which lever was detected |
| value | int | 0–10 mapped value |
| confidence | int | 0–100 match confidence percentage |

**Rules:**
- Only levers that were detected get a DECODED_LEVER_VALUE
- Undetected levers are shown as neutral (5) on the radar,
  visually distinguished from detected values (gray vs colored)
- `confidence` is shown in the decoder results UI
- Low confidence values (< 50) shown with a "?" indicator
- Multiple pattern matches for same lever: values are averaged

---

### CALIBRATION_RUN
A single run of the CLI calibration tool.
Lives in /calibration/ folder, not in the app's runtime data.

| Attribute | Type | Notes |
|-----------|------|-------|
| id | string PK | Timestamp-based ID |
| model_id | string FK | Which model was calibrated |
| run_at | timestamp | When the run happened |
| schema_version | string | Which lever schema was used (v5) |

**Rules:**
- Created by the CLI tool, not the app UI
- One CALIBRATION_RUN per model per execution
- Results stored in drift-history.json (last 20 runs max)
- Never modifies v5-models.js directly
- Always writes to v5-models.proposed.js for human review

---

### ELICITATION_RESPONSE
The raw self-report from a model during calibration.
Captured for research purposes — the longitudinal dataset.

| Attribute | Type | Notes |
|-----------|------|-------|
| run_id | string FK | Parent calibration run |
| model_id | string FK | Which model responded |
| raw_response | string | Full model response text |
| created_at | timestamp | Response timestamp |

**Rules:**
- Stored in /calibration/elicitation-responses/[model]-[date].json
- Never modified after capture — immutable record
- Used as the self-report data source for cross-referencing
  against observed behavioral scores

---

## Relationships Summary

| From | Relationship | To | Notes |
|------|-------------|-----|-------|
| USER | has one | PROFILE | Created together |
| USER | starts many | SESSION | One active at a time |
| USER | saves many | CONFIG | Explicit save action |
| USER | decodes many | DECODED_PROMPT | Decoder feature |
| SESSION | becomes one | CONFIG | On save |
| SESSION | uses one | MODEL | Required |
| SESSION | guided by one | INTENT | Optional |
| CONFIG | contains many | LEVER_VALUES | Exactly 16 |
| CONFIG | targets one | MODEL | Required |
| CONFIG | applies one | PERSONA | Optional |
| CONFIG | generates many | PROMPT | One current, history kept |
| LEVER_VALUES | references one | LEVER | FK relationship |
| LEVER | belongs to one | PILLAR | Fixed assignment |
| PERSONA | presets many | LEVER_VALUES | Partial — not all 16 |
| MODEL | defaults many | LEVER_VALUES | All 16 |
| DECODED_PROMPT | maps to many | DECODED_LEVER_VALUE | Only detected levers |
| DECODED_LEVER_VALUE | references one | LEVER | FK relationship |
| DECODED_PROMPT | converts to one | CONFIG | On "Use this" action |
| CALIBRATION_RUN | calibrates one | MODEL | Per-model runs |
| CALIBRATION_RUN | produces many | ELICITATION_RESPONSE | One per model |

---

## Business Rules

These are the edge cases that will bite you in implementation.
Decide these now, not mid-build.

**Rule 1: Config without a model**
A DECODED_PROMPT can generate DECODED_LEVER_VALUES before a model
is selected. The resulting CONFIG requires a model. Enforcement:
when converting a decoded prompt to a config, if no model is
selected, prompt the user to select one first. The decoder radar
renders with a "Select a model to save →" CTA.

**Rule 2: Persona partial override**
A PERSONA only overrides the levers it specifies. Before applying
a persona, snapshot the current LEVER_VALUES. When the persona is
removed, restore the snapshot. This means the app must maintain
a pre-persona snapshot for the duration of the session.

**Rule 3: Lever value precedence**
When a MODEL is selected: load model defaults into SESSION lever state.
When a PERSONA is applied: overlay persona's specified values.
When user adjusts a slider: overwrite that specific value.
Order: model defaults < persona overrides < manual adjustments.
Manual adjustments survive persona changes (persona only sets
its own levers, doesn't reset manual changes to other levers).

**Rule 4: Session → Config promotion**
A SESSION becomes a CONFIG when the user explicitly saves it.
The SESSION itself is not deleted — it remains as the active
working state. The CONFIG is a snapshot at the moment of saving.
Continued changes in the SESSION do not retroactively update
the saved CONFIG.

**Rule 5: Tier unlock is one-way**
Tier only increases. Clearing localStorage resets to Tier 0.
No in-app way to downgrade tier. `skip_onboarding: true` bypasses
tier checks entirely — it is NOT the same as being Tier 2.

**Rule 6: Decoded prompts and confidence**
Lever values detected with confidence < 50% are displayed
differently on the radar (muted/gray axis) to signal uncertainty.
They still populate into the CONFIG if the user chooses to use
the decoded configuration — the user decides, not the app.

**Rule 7: Unmapped instructions**
Any instruction the lever-mapper cannot classify goes into
`unmapped_instructions` on DECODED_PROMPT. This is always
shown to the user in the decoder results UI. It is never
silently dropped. The message: "We couldn't map these instructions
to a lever — they may be doing something outside our 16 dimensions."

**Rule 8: Prompt generation is always live**
PROMPT text is never cached across lever changes. Every slider
movement regenerates the prompt. The "current prompt" is always
derived fresh from the current SESSION lever state. Historical
prompts (from saved CONFIGs) are stored but the active prompt
is always live.

**Rule 9: Calibration never auto-applies**
The CLI calibration tool writes to v5-models.proposed.js only.
It never writes to v5-models.js. The human (you) reviews and
manually promotes proposed changes via `npm run apply-calibration`.
This rule protects against calibration errors corrupting live
model defaults.

**Rule 10: Entry point is immutable per session**
`entry_point` is set when the user selects an entry point on
the home screen and never changes mid-session. If a user starts
via the decoder, navigates to the full controls, and saves —
the CONFIG records `source: "decoder"` not `source: "manual"`.
The origin story of every config is preserved.

---

## State Machine: Tier Progression

```
TIER 0 (Starter)
  → User copies a prompt
  → set has_copied: true
  → set tier: 1
  → show Tier 1 unlock animation

TIER 1 (Tuner)
  → User adjusts any slider
  → set has_tuned: true
  → set tier: 2
  → show Tier 2 unlock prompt

TIER 2 (Architect)
  → Full interface, no further progression
  → show first-time tooltip overlay (once only)

AT ANY POINT:
  → User clicks "Skip to full controls"
  → set skip_onboarding: true
  → bypass all tier checks
  → go directly to full interface
  → skip_onboarding does NOT set tier: 2
    (tier badge still shows Starter/Tuner if applicable)
```

---

## Data Flow: Prompt Generation

```
USER selects MODEL
  → load MODEL.default_lever_values into SESSION

USER selects PERSONA (optional)
  → snapshot current SESSION lever values
  → overlay PERSONA.lever_values onto SESSION
  → append PERSONA.activation_snippet to prompt

USER adjusts slider
  → update SESSION lever value for that LEVER
  → regenerate PROMPT from SESSION lever state

USER copies PROMPT
  → PROMPT text copied to clipboard
  → if tier === 0: trigger Tier 1 unlock

USER saves CONFIG
  → create CONFIG from current SESSION state
  → create 16 LEVER_VALUES from SESSION lever state
  → store CONFIG in USER's saved_configs
```

---

## Data Flow: Prompt Decoder

```
USER pastes raw prompt text
  → create DECODED_PROMPT with raw_input

lever-mapper.js scans raw_input
  → for each pattern match: create DECODED_LEVER_VALUE
    with lever_key, value, confidence
  → collect unmatched instructions → unmapped_instructions

Render decoder results
  → show 4-pillar radar with decoded values
  → detected levers: colored axes
  → undetected levers: gray axes (neutral at 5)
  → show plain-English explanation per detected lever
  → show unmapped_instructions list

USER clicks "Use this configuration"
  → prompt USER to select a MODEL (if not already selected)
  → create CONFIG from DECODED_LEVER_VALUES
  → set CONFIG.source = "decoded"
  → link CONFIG to DECODED_PROMPT
  → load CONFIG into active SESSION

USER clicks "Adjust from here"
  → same as above, then open Tier 1 slider screen
  → pre-populated with decoded values
```

---

## localStorage Schema

Everything persists to localStorage under these keys:

```javascript
'aituner_user'      // USER object
'aituner_profile'   // PROFILE object
'aituner_configs'   // Array of CONFIG objects with LEVER_VALUES
'aituner_session'   // Last SESSION (for restore on relaunch)
'aituner_decoded'   // Last DECODED_PROMPT (ephemeral, cleared after 24h)
```

No other localStorage keys. Keep it flat and minimal.

---

## What Lives Where

| Data | Location | Mutability |
|------|----------|------------|
| Lever definitions | v5-levers.js | Static — never changes at runtime |
| Pillar definitions | v5-levers.js | Static |
| Model defaults | v5-models.js | Updated by calibration pipeline |
| Persona definitions | v5-personas.js | Updated by elicitation pipeline |
| Sample responses | model-samples.js | Static per version |
| User/Profile/Config | localStorage | Mutable — user's data |
| Session state | localStorage + memory | Mutable — ephemeral |
| Calibration results | /calibration/*.json | Append-only — research record |
| Proposed model updates | v5-models.proposed.js | Written by CLI, promoted manually |

---

*Domain Model Version: 1.0*
*Date: March 15, 2026*
*Part of AITuner v5.0 Cursor handoff package*
