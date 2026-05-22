# AITuner Onboarding Redesign — Cursor Implementation Prompt

**Project:** AITuner v3.5 (Web) + v4.0 (iOS)  
**Task:** Implement a progressive onboarding system with three skill tiers  
**Date:** March 15, 2026

---

## Context

AITuner is a prompt engineering tool that lets users tune AI model behavior through 26 levers, 8-model selection, 11 personas, and 4 radar chart "Web Tuners." The existing interface presents everything simultaneously, which overwhelms new users. The goal is a layered onboarding experience that progressively reveals complexity — modeled on video game skill progression (zero → novice → expert) — without removing any existing functionality.

---

## Architecture Overview

### Three Tiers

| Tier | Name | What's Visible | Unlock Trigger |
|------|------|----------------|----------------|
| 0 | Starter | Intent selector + Model selector (with samples) + Copy prompt | Default on first launch |
| 1 | Tuner | + 3 core sliders + 3-axis radar (live) | Completes Tier 0 (copies first prompt) |
| 2 | Architect | + All 26 levers + Full 8-axis radar + Personas + Export | Engages with Tier 1 sliders |

### Progression State

Store tier progression in `localStorage` (web) / `UserDefaults` (iOS):

```json
{
  "onboarding_tier": 0,
  "has_copied_prompt": false,
  "has_adjusted_slider": false,
  "show_full_interface": false
}
```

Add a "Skip to full interface" escape hatch accessible at all times for returning/expert users.

---

## Tier 0: Starter

### Screen 1 — Intent Selection

**Purpose:** Anchor the user's goal before showing any controls.

**UI:**
- Headline: "What do you want this AI to do?"
- Subhead: "Pick the mode that fits the work. You can change this later."
- 4 intent cards in a 2×2 grid:
  - **Help me think** — "Sounding board, analysis, decisions"
  - **Help me write** — "Drafts, editing, tone, documents"
  - **Help me build** — "Code, debugging, architecture"
  - **Help me explore** — "Research, learning, brainstorming"
- Selected card gets `border: 1.5px solid` highlight
- Continue button disabled until selection made
- Footer: "Already know what you're doing? → Skip to full controls"

**Data:** Store selected intent. Use it to:
1. Pre-filter model sample responses (show writing samples for "write" intent, etc.)
2. Pre-set lever defaults appropriate to that intent
3. Label the generated prompt with intent context

---

### Screen 2 — Model Selection with Sample Responses

**Purpose:** Demystify the model landscape. Show, don't tell.

**This is the key new feature in Tier 0.**

**UI:**
- Headline: "Which AI are you tuning for?"
- Subhead: "Each model has a distinct voice. Here's what that sounds like."
- 8 model cards, each containing:
  - Model name + provider
  - One-line personality descriptor (e.g., "Nuanced, reflective" / "Direct, edgy")
  - **Sample response preview** — 2–3 sentence excerpt showing the model's voice
  - A **mini radar thumbnail** (3-axis, static, grayed out) showing the model's default lever profile
  - "This model's defaults →" expand link (optional, advanced)

**Sample Responses:**
- Each model has a fixed sample response to a standardized prompt
- The sample prompt varies by intent selected in Screen 1:
  - think → "What's the best way to make a hard decision?"
  - write → "How do I open a cold email?"
  - build → "How should I structure a new project?"
  - explore → "What's the most interesting thing about black holes?"
- Responses should be pre-written (not live API calls) to keep this fast and controlled
- Each response should authentically reflect that model's real voice/defaults

**Mini Radar Thumbnail:**
- 3-axis only: Verbosity, Confidence, Tone
- Static SVG, not interactive at this tier
- Grayed/muted — signals "there's more here" without demanding attention
- Label beneath: "Unlock visual tuning in the next step →"

**Data:** Store selected model. Use its 26 default lever values as the baseline for prompt generation.

---

### Screen 3 — Prompt Result (Tier 0 version)

**UI:**
- Headline: "Your prompt is ready"
- Monospace prompt preview box showing generated prompt
- Large "Copy prompt" CTA
- Subhead below button: "Paste this at the start of your conversation, or into the system prompt field."
- **Unlock teaser:** A grayed-out radar visual below the fold with label: "Want to fine-tune this? Unlock visual controls →" (clicking this copies the prompt AND advances to Tier 1)

**Unlock Trigger:**
When user clicks "Copy prompt" → set `has_copied_prompt: true` → show Tier 1 unlock animation

**Unlock Animation:**
- Brief celebration moment (subtle, not annoying)
- "You've unlocked Tuner mode — now you can shape the personality visually"
- Transition to Tier 1 automatically or on click

---

## Tier 1: Tuner

### Screen 3 (upgraded) — Three Sliders + Live Radar

**Purpose:** Introduce the radar as a live mirror of slider choices. The user understands sliders first, then discovers the radar reflects them.

**UI Layout:**
- Left column (60%): Three core sliders
- Right column (40%): Live 3-axis radar

**Three Core Sliders:**

| Slider | Human Label | Technical Lever | Low End | High End |
|--------|-------------|-----------------|---------|----------|
| 1 | How much does it explain? | Answer Completeness / Verbosity | Bottom line only | Full reasoning shown |
| 2 | How confident does it sound? | Hedging Intensity | Tentative, lots of caveats | Decisive, assertive |
| 3 | Tone | Affect / Formality | Formal, professional | Casual, conversational |

**Live 3-Axis Radar:**
- Renders using Chart.js (existing dependency)
- 3 axes only: maps directly to the 3 sliders above
- Updates in real time as sliders move — this is the core interaction
- Visual style: clean, minimal, matches existing Web Tuner aesthetic
- Below radar: "These are 3 of 26 controls. Unlock all →" (grayed out remaining axes visible as ghost lines)

**Interaction design note:** The slider → radar connection should feel immediate and satisfying. When a slider moves, the corresponding radar axis animates to match. This is the moment the radar concept clicks for the user.

**Unlock Trigger:**
When user adjusts any slider → set `has_adjusted_slider: true` → show Tier 2 unlock prompt

---

## Tier 2: Architect

### Full Interface

This is the existing AITuner advanced interface, but reached through earned progression rather than cold drop-in.

**What changes from current:**
- Entry is earned, not default
- User arrives with intent + model + 3 lever values already set
- Onboarding tooltip overlay on first Tier 2 visit explains the 4 Web Tuner sections
- The radar charts are now familiar (user has already used a 3-axis version)
- Personas introduced here as "personality presets" with plain-language descriptions

**First-time Tier 2 tooltip sequence (4 steps, dismissable):**
1. "These are the 4 Web Tuners — each controls a different dimension of behavior"
2. "Persona Spine = identity and attitude"
3. "Engagement Surface = how it communicates with you"
4. "Truth Discipline + Delivery System = reasoning and formatting"

---

## Persistent UI Elements (All Tiers)

### Tier Indicator
- Subtle badge in top-right: "Starter" / "Tuner" / "Architect"
- Clicking it shows tier progression overview
- Always shows what's unlocked next

### Escape Hatches
- "Skip to full controls" available on every screen
- Setting to permanently default to full interface (for returning expert users)
- Both web and iOS should respect a `show_full_interface` flag that bypasses onboarding entirely

### Progress Persistence
- On return visit: resume at highest unlocked tier
- Don't re-run onboarding if already completed
- Presets saved in Tier 2 load correctly regardless of current tier

---

## Web vs iOS Implementation Notes

### Web (v3.5)
- Implement as a state machine layered over existing interface
- Tier 0–1: new onboarding component renders in place of current full layout
- Tier 2: existing layout with tooltip overlay on first visit
- Use `localStorage` for tier state
- Onboarding component is separate from core engine — don't modify `v6-engine.js` core logic

### iOS (v4.0)
- Tier 0–1 replaces current Simple Mode tab
- Tier 2 maps to current Advanced Mode tab
- Use `UserDefaults` for tier state
- Welcome popup and 8-step tutorial can be retired — replaced by tier progression
- Floating radar button in nav bar: show only in Tier 1+ 
- Haptic feedback on tier unlock moments

---

## File Structure (Web)

```
/v3.5/
  /js/
    /onboarding/
      onboarding-state.js       ← tier state management
      onboarding-ui.js          ← screen rendering logic
      model-samples.js          ← pre-written sample responses per model/intent
      tier-unlock.js            ← unlock detection and animation
    /core/
      v6-engine.js              ← unchanged
    /data/
      v6-models.js              ← unchanged
      v6-levers.js              ← unchanged
      v6-personas.js            ← unchanged
    radar.js                    ← unchanged, but called by onboarding-ui.js for 3-axis version
  index.html                    ← entry point, loads onboarding state first
```

---

## Sample Response Content Guidelines

Each model's sample responses should be hand-authored to authentically reflect that model's real default behavior. Do not generate these with AI and homogenize them — the whole point is that the differences are real and legible.

**Voice signatures to capture:**

- **Claude:** Considers multiple angles before landing. Acknowledges nuance. May reframe the question.
- **ChatGPT:** Structured, helpful, organized. Often uses a numbered list. Friendly and capable.
- **Grok:** Shorter. More direct. May include a dry observation or mild irreverence.
- **Gemini:** Expansive. Connects to related ideas. May reference real-world context.
- **Mistral:** Precise. Efficient. Low hedging. Gets to the answer quickly.
- **Llama:** Variable. Tends toward thoroughness. Open-ended feel.
- **Perplexity:** Research-oriented. May cite or reference sources even in casual answers.
- **Cursor:** Technical by default. Code-adjacent framing even for non-code questions.

---

## Success Metrics

A successful implementation means:
1. A new user completes Tier 0 in under 90 seconds
2. The radar chart is understood (not just seen) before Tier 2
3. No new user hits the full 26-lever interface without context
4. Expert users are never slowed down (escape hatch always available)
5. The "model selection" screen creates genuine differentiation — users pick based on voice, not brand recognition

---

*End of implementation spec*
