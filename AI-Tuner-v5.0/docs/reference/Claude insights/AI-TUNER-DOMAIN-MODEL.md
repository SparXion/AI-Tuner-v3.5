# AI Tuner: Comprehensive Domain Model

**Purpose:** A domain model of AI Tuner—entities, attributes, relationships, and key behaviors. Use this when designing features, integrating with external systems, or aligning implementation (web, iOS, Cursor) with a single conceptual map.

---

## 1. Domain Overview

AI Tuner lets users **configure AI personality** by choosing a **model**, optionally a **persona**, and tuning **levers**. The system **generates a prompt** from that configuration. Configurations can be **saved as presets** or **exported/imported** (JSON, Markdown). The **radar** visualizes lever state; **tuners** group levers into thematic radar charts.

---

## 2. Entity Glossary

| Entity | Description |
|--------|-------------|
| **Lever** | A universal tuning axis (e.g. Hedging Intensity, Empathy). Defined once; referenced by models, personas, and runtime state. |
| **LeverState** | The current value (0–10) of a lever in a tuning session. |
| **Model** | A target AI (Claude, Grok, etc.). Provides base context and default lever values. |
| **Persona** | A pre-built “mode” (Therapist, Coder, etc.): activation snippet + lever presets. |
| **Tuner** | A named radar chart (e.g. Persona Spine, Truth Discipline) that displays a subset of levers. |
| **Config** | Runtime configuration: selected model + persona + lever state. Input to prompt generation. |
| **GeneratedPrompt** | The output text (model blurb + persona snippet + optional rules + lever instructions) to copy/apply. |
| **Preset** | A saved configuration (name + model + persona + levers; iOS also stores generated prompt). Web presets vary: lever-only vs. full config. |
| **TuningSession** | The live session: current config, mode (beginner/advanced), UI state (e.g. emoji shutoff, dark mode). |

---

## 3. Core Entities

### 3.1 Lever (definition)

A **Lever** is a universal dimension of AI behavior. It is defined globally and reused across models, personas, and tuners.

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | string | Unique key (e.g. `hedgingIntensity`, `empathyExpressiveness`). |
| `name` | string | Display name (e.g. "Hedging Intensity"). |
| `description` | string | What the lever controls. |
| `low` | string | Label for low end (0) (e.g. "Direct - No hedging"). |
| `high` | string | Label for high end (10) (e.g. "Qualify everything"). |
| `defaultRange` | `{ min, max }` | Optional default min/max for initialization. |
| `category` | string | Thematic bucket (see **LeverCategory**). |
| `locked` | string[]? | Optional list of model IDs for which this lever is locked (e.g. `identitySourceLock` for Grok). |

**Lever categories (representative):**  
Truth & Epistemology, Behavioral Controls, Empathy & Expressiveness, Affect & Tone, Formatting & Output, Knowledge & Tool Use, Interface & Flow, Goal Orientation, Humor & Meta, Cognition & Logic, Adaptivity & Technicality, Personality & Approach.

**Relationships:**
- Many **models** specify a default value per lever.
- Many **personas** specify a value per lever.
- Many **tuners** reference a subset of levers (`leverKeys`).

---

### 3.2 LeverState (runtime)

**LeverState** is the current value of a lever in a tuning session.

| Attribute | Type | Description |
|-----------|------|-------------|
| `leverId` | string | References `Lever.id`. |
| `value` | int | 0–10. |

Often represented as a map: `Record<leverId, value>` (e.g. `levers` in the engine).

**Invariants:** `0 ≤ value ≤ 10`. If a lever is locked for the selected model, the effective value may be overridden (e.g. fixed at 10).

---

### 3.3 Model

A **Model** represents a target AI (Claude, Grok, Gemini, etc.).

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | string | Unique key (e.g. `claude`, `grok`). |
| `name` | string | Display name (e.g. "Claude (Anthropic)"). |
| `description` | string | Short summary of default personality. |
| `defaults` | `Record<leverId, number>` | Default lever values. Not all levers need be present. |

**Relationships:**
- **GeneratedPrompt** includes model context (name + description) when a model is selected.
- **Personas** may declare `bestModels` (model IDs) for UX guidance only.
- **Lever** `locked` references model IDs.

---

### 3.4 Persona

A **Persona** is a pre-built configuration: an activation snippet plus lever presets.

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | string | Unique key (e.g. `therapist`, `truth-seeker`). |
| `name` | string | Display name (e.g. "Therapist"). |
| `type` | enum | `core` \| `hidden`. Affects visibility in UI. |
| `description` | string | Purpose and behavior. |
| `bestModels` | string[] | Model IDs recommended for this persona (advisory). |
| `activationSnippet` | string | Instructional text prepended to the prompt (e.g. "Enter Therapist Mode: …"). |
| `levers` | `Record<leverId, number>` | Lever presets (0–10). |

**Relationships:**
- Selecting a persona **applies** its `levers` to **LeverState** and adds `activationSnippet` to **GeneratedPrompt**.
- **Presets** may store `personaId`.

---

### 3.5 Tuner

A **Tuner** is a named radar chart that groups a subset of levers for visualization and drag-to-adjust.

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | string | Unique key (e.g. `persona`, `engagement`, `truth`, `delivery`). |
| `title` | string | Display title (e.g. "Persona Spine"). |
| `subtitle` | string | Short description (e.g. "Identity & attitude tuning"). |
| `leverKeys` | string[] | Lever IDs included in this radar. |
| `labels` | string[]? | Optional display labels per axis (often derived from lever names). |
| `canvasId` | string? | DOM canvas id (web). |
| `applyButtonId` | string? | DOM apply-button id (web). |
| `indicatorId` | string? | DOM pending-indicator id (web). |

**Relationships:**
- Each tuner **references** a subset of **Levers** via `leverKeys`.
- **LeverState** is shared; changing a lever in one tuner updates the global state and the generated prompt.

**Example tuners (v3.5 web):** Persona Spine, Engagement Surface, Truth Discipline, Delivery System.

---

### 3.6 Config

**Config** is the runtime configuration used to generate the prompt. It is the “live” combination of model, persona, and lever state.

| Attribute | Type | Description |
|-----------|------|-------------|
| `model` | string? | Selected model ID, or null. |
| `persona` | string? | Selected persona ID, or null. |
| `levers` | `Record<leverId, number>` | Current lever values. |

**Relationships:**
- **GeneratedPrompt** is derived from **Config** (and optional rules like emoji shutoff).
- **Preset** and **export/import** serialize **Config** (or a subset).

**Invariants:**
- Lever values must be 0–10.
- If a lever is locked for the selected model, the stored value may be ignored for prompt generation.

---

### 3.7 GeneratedPrompt

**GeneratedPrompt** is the output text produced from the current **Config** (and any global toggles).

**Structure (logical):**
1. **Model context** (if model selected): `"You are {name}. {description}."`
2. **Persona snippet** (if persona selected): `activationSnippet`
3. **Optional overrides** (e.g. emoji shutoff): critical instructions block.
4. **Tuning parameters**: for each lever, a line `"- {name}: {low|moderate|high} ({value}/10)"`.

**Relationships:**
- **Config** → **GeneratedPrompt** (deterministic mapping).
- **Preset** (iOS) may store the generated prompt as `personality` for display or reuse.

---

### 3.8 Preset

A **Preset** is a saved configuration. Storage and shape differ by platform.

**Common attributes:**

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | string / UUID | Unique identifier. |
| `name` | string | User-facing name. |
| `modelId` | string? | Model ID, or null. |
| `personaId` | string? | Persona ID, or null. |
| `levers` | `Record<leverId, number>` | Lever state. |
| `createdAt` | datetime? | When saved (iOS). |

**Platform-specific:**
- **Web (v3.5):** Presets in `localStorage` keyed by slug; **levers only** (no model/persona). `{ [presetKey]: { name, settings: { levers } } }`.
- **iOS:** Full **Preset** with `modelId`, `personaId`, `personality` (generated prompt text), `levers`, `createdAt`. Stored via `PresetManager` (e.g. UserDefaults).
- **Export/import (web):** JSON **Config** `{ model?, persona?, levers }`; can include model and persona.

---

### 3.9 TuningSession

**TuningSession** represents the live state of the app during a tuning use.

| Attribute | Type | Description |
|-----------|------|-------------|
| `config` | Config | Current model, persona, levers. |
| `mode` | enum | `beginner` \| `advanced`. Affects which levers are shown (e.g. beginner subset). |
| `emojiShutoff` | bool | If true, add “no emojis/filler/hype” block to prompt. |
| `darkMode` | bool? | UI preference (web). |
| `pendingRadarLevers` | `Record<tunerId, Record<leverId, number>>?` | Web: unapplied radar drags per tuner before “Apply”. |

**Relationships:**
- **TuningSession** holds the current **Config** and feeds **GeneratedPrompt**.
- **Preset** save creates a snapshot of **Config** (or partial state, depending on platform).

---

## 4. Relationships Summary

```
Lever ◄──── referenced by ────► Model (defaults)
    ▲                              │
    │                              │
    ├── referenced by ────────────► Persona (levers)
    │
    └── referenced by ────────────► Tuner (leverKeys)

Config = model? + persona? + levers (LeverState)
    │
    └──► GeneratedPrompt

Preset ── stores ──► Config (or subset) [+ personality in iOS]

TuningSession ── holds ──► Config, mode, UI toggles
```

---

## 5. Key Behaviors

### 5.1 Selecting a model
- Set `config.model`.
- Optionally initialize `config.levers` from `Model.defaults` (where specified).
- Locked levers for that model are enforced (e.g. fixed value or no UI edit).

### 5.2 Selecting a persona
- Set `config.persona`.
- Overwrite `config.levers` with `Persona.levers` (for levers the persona defines).
- **GeneratedPrompt** includes `Persona.activationSnippet`.

### 5.3 Adjusting a lever
- Update `config.levers[leverId]` (0–10).
- **GeneratedPrompt** is recomputed.
- **Radar** and **sliders** reflect **LeverState**.

### 5.4 Building the prompt
1. If `config.model` set → append model context.
2. If `config.persona` set → append `activationSnippet`.
3. If emoji shutoff (or similar) → append override block.
4. Append “Tuning Parameters” from `config.levers` using **Lever** definitions (low/high labels, thresholds).

### 5.5 Saving a preset
- Persist `config` (or `config.levers` only on web) plus `name`, `id`, etc.
- iOS may also persist `personality` (generated prompt).

### 5.6 Loading a preset / importing config
- Restore `config.model`, `config.persona`, `config.levers` from stored data.
- Re-run prompt generation and refresh UI.

### 5.7 Tuner “Apply” (web)
- **Pending** radar edits for that tuner are applied to `config.levers`.
- **GeneratedPrompt** and radar are updated; pending state cleared.

---

## 6. Value Objects / Enums

- **LeverCategory:** Truth & Epistemology, Behavioral Controls, Empathy & Expressiveness, Affect & Tone, Formatting & Output, Knowledge & Tool Use, Interface & Flow, Goal Orientation, Humor & Meta, Cognition & Logic, Adaptivity & Technicality, Personality & Approach.
- **PersonaType:** `core`, `hidden`.
- **TuningMode:** `beginner`, `advanced`.

---

## 7. Platform Mapping

| Concept | Web (v3.5) | iOS (AITuner4) | Cursor extension |
|---------|------------|----------------|------------------|
| **Lever** | `LEVERS_V6` | `Lever.allLevers` | Shared |
| **Model** | `MODELS_V6` | `AIModel.allModels` | Shared |
| **Persona** | `PERSONAS_V6` | `Persona.allPersonas` | Shared |
| **Tuner** | `WEB_TUNER_CONFIG` | Radar(s) / lever UIs | N/A or shared |
| **Config** | `getCurrentSettings()` | Engine state | Shared |
| **Preset** | `localStorage`, levers-only | `Preset` + `PresetManager` | Varies |
| **GeneratedPrompt** | `buildPrompt()` | Engine | Apply to Cursor |

---

## 8. Extensions and Future Concepts

- **Custom personas:** User-defined personas (activation snippet + lever presets) stored locally or synced.
- **Extracted persona (e.g. Trusted Integration Partner):** External JSON/config that could be turned into a **Persona** (and optionally new **Lever** definitions or tuner groupings).
- **Lever versioning:** Different lever sets per “schema” version (e.g. v6 vs. v7).
- **Platform-specific levers:** Levers that exist only on certain platforms (e.g. Cursor-specific tool use).

---

## 9. How to Use This With Claude

- **Design:** *“Here’s the AI Tuner domain model. We want to add X.”* → Paste this doc (or relevant sections).
- **Integration:** *“We’re importing an extracted persona. Map it onto the domain model.”* → Use **Persona**, **Config**, and **Lever** sections.
- **Alignment:** *“Web vs. iOS preset format differs; here’s the canonical model.”* → Use **Preset** and **Config** sections.

This document is the **single source of truth** for the AI Tuner domain model.
