# AITuner v5.0 — Stop 3 Verification Report

**Scope:** Wire Prompt Decoder UI, session-restore banner, profile panel on tier badge, Discovery first screen; connect existing modules without replacing core logic.

**Audience:** Design collaborator — read before Stop 4.

---

## What changed

| File | Change |
|------|--------|
| `index.html` | Session-restore banner (Continue / Start fresh), tier badge as `<button>` + click → profile panel, wrapped `router.navigateTo` (decoder teardown + badge refresh), discovery/decoder mount roots, CSS for banner/profile/decoder/discovery, init: `UserProfile`, `SessionRestore`, `ProfilePanel`, `DecoderUI`/`DiscoveryUI` registration, `engine.copyPrompt` wrapper for `recordPromptBuilt`, script tags for `decoder-ui.js`, `discovery-ui.js`, `profile-panel.js`. |
| `src/decoder/decoder-ui.js` | **New.** Paste UI, “Decode this →”, uses `PromptDecoder.decode()` + `mapPromptToLevers()` for breakdown; four-pillar `mountAITunerV5Radars` on decoded values; plain-English lines from `LEVERS_V5`; unmapped section; model `<select>`; CTAs “Use this configuration →” / “Adjust from here →”; `teardown()` restores pre-preview `leverValues` when leaving decoder. |
| `src/profile/profile-panel.js` | **New.** Renders tier, next unlock, preferred model, saved configs (name + source tag), literacy counts, “Explore a new model →” if &lt; 4 models explored; overlay + outside click + X closes. |
| `src/discovery/discovery-ui.js` | **New.** Question cards from `DiscoveryMode.getPreSetQuestions()`, model checkboxes (max 4), “Compare →” logs `getComparisonData()` and shows placeholder; calls `recordDiscoveryRun()`; first question pre-selected. |
| `src/profile/user-profile.js` | On load, ensures `literacy_record` exists and persists if missing. |
| `src/profile/session-restore.js` | Friendlier intent labels in `getRestorePrompt()` (think/write/build/explore/compare). |
| `src/discovery/discovery-mode.js` | `recordDiscoveryRun()` always uses `UserProfile` (removed broken `engine.profile` guard). |
| `src/core/v5-engine.js` | `saveProfile()` merges `literacy_record` from existing `aituner_profile` before write, and initializes `literacy_record` when absent (keeps UserProfile counters from being wiped when the engine saves profile). |
| `docs/2026-0324-AITuner-v5-Stop3-Verification.md` | This document. |

---

## How to test

### Task 1 — Prompt Decoder

1. Serve `AI-Tuner-v5.0` over HTTP, open `index.html`.
2. Open **I found a prompt I want to understand**.
3. Paste text that matches mapper patterns (e.g. “be blunt and concise, no disclaimers”).
4. Click **Decode this →**.
5. **Expect:** Four-pillar radar, per-lever breakdown (name, value, plain-English meaning), unmapped section (usually “No unmatched instruction lines…” because `lever-mapper` does not yet populate `unmappedInstructions`), model dropdown, two CTAs.
6. **Use this configuration →** — lever state applied (after model defaults from chosen model), navigate home.
7. **Adjust from here →** — same, then `architect.html`.
8. **Back to Home** from decoder without applying — prior lever state restored (preview teardown).

### Task 2 — Session restore

1. Use the app until `aituner_session` exists and is &lt; 7 days (e.g. complete onboarding through model select so session has `model_id` + intent).
2. Reload `index.html`.
3. **Expect:** Purple banner: “Welcome back. Last time you were tuning [model] for [intent phrase].” with **Continue** and **Start fresh** (copy aligned with `SessionRestore.getRestorePrompt()` + narrative-style intent labels).
4. **Continue** — routes: skip-onboarding → `architect.html`; else if session has `model_id` → onboarding screen 3 or 4 by tier; else home.
5. **Start fresh** — removes `aituner_session`, `createNewSession('guided')`, neutral levers, banner hides, home view.

### Task 3 — Profile panel

1. Click the **tier badge** (top-right).
2. **Expect:** Panel with tier + next unlock, preferred model, saved configs with source (`guided` / `Architect` for `manual` / `decoded` when stored), literacy counts, nudge if models explored &lt; 4.
3. Click **X**, click dimmed backdrop, or click outside dialog — panel closes.
4. **Confirm:** `engine.onTierChange` is **not** reassigned (only existing `OnboardingUI` behavior); badge text refreshes when `router.navigateTo` runs.

### Task 4 — Discovery

1. From home, **I want to explore the models**.
2. **Expect:** Four preset question cards (same copy set as `DiscoveryMode` / narrative Screen 7 sample), eight model checkboxes, max four selected, first question pre-highlighted.
3. **Compare →** — console logs selection object; yellow placeholder “coming in next update”; literacy `discovery_runs` and `models_explored` update via `UserProfile`.

---

## Known limitations

- **`AITunerV5` still auto-restores session in `initialize()`** before the banner appears, so lever/model state is already live when the banner shows; **Continue** mainly controls routing; **Start fresh** resets session as specified.
- **`unmappedInstructions`** in `lever-mapper.js` is always empty (TODO in source) — UI shows an explanatory line, not extracted unmatched text.
- **`prompts_built`** increments when `engine.copyPrompt()` runs on **index.html** (wrapped); **`architect.html`** does not use that wrapper.
- **Config `source` tags:** only values the engine already stores (`guided`, `manual`, …). True **“discovery”** tag would require future saves from discovery flow.
- **Tier badge** while staying on a single onboarding screen without `navigateTo` may lag until navigation (unchanged from Stop 2; no `onTierChange` hook added).

---

## Task confirmations (yes / no)

| Task | Statement | Answer |
|------|-----------|--------|
| 1 | Decoder view instantiates decoder flow, textarea + button, decode uses mapper + shows four-pillar radar, breakdown, unmapped area, two CTAs, single shared `engine`. | **Yes** |
| 2 | On load, recent session shows banner with specified actions; Continue restores routing; Start fresh clears session and home. | **Yes** (with auto-restore caveat above) |
| 3 | Tier badge opens profile panel with required sections, closes on outside/X; `onTierChange` not reassigned. | **Yes** |
| 4 | Discovery view shows four narrative-aligned questions + model multi-select (≤4) + Compare stub + console log. | **Yes** |

---

## Anything touched outside the listed files

Stop 3 intentionally updates **`src/core/v5-engine.js`** (`saveProfile` literacy merge) so profile literacy counters survive engine profile saves.

New files: `decoder-ui.js`, `profile-panel.js`, `discovery-ui.js`, plus this **`docs/2026-0324-AITuner-v5-Stop3-Verification.md`**.

**Not modified:** `onboarding-ui.js`, `radar.js`, `prompt-decoder.js` (logic), `architect.html`.
