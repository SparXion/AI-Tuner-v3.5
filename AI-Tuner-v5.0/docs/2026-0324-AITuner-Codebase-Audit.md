# AI Tuner — Codebase audit (current state)

**Date:** March 24, 2026  
**Scope:** This describes what exists in the repository *today*: `AI-Tuner-v5.0/` (v5 web app), `v3.5/` (legacy web), and `AI-Tuner-iOS/AITuner4/` (iOS). It is not a product roadmap.

---

## 1. File inventory (lines + role)

Line counts are `wc -l` as of the audit. System files (`.DS_Store`) omitted.

### 1.1 AI-Tuner v5.0 (`AI-Tuner-v5.0/`)

Excludes `archive/` (large offline copies of older versions; not required to run v5).

| Lines | Path | Role |
|------:|------|------|
| 381 | `index.html` | SPA shell: home, onboarding, discovery, decoder placeholders; loads scripts; initializes `AITunerV5`, `OnboardingState`, `Router` |
| 210 | `architect.html` | Separate page: full slider grid + prompt; loads same data + engine |
| 371 | `AITuner-v5-levers.js` | Duplicate of `src/data/v5-levers.js` (handoff / spec bundle) |
| 371 | `src/data/v5-levers.js` | 16-lever schema, `PILLAR_CONFIG`, `TIER1_LEVERS`; exposes `window` + `module.exports` |
| 240 | `src/data/v5-models.js` | Eight models with v5 lever defaults; sets `window.MODELS_V5` |
| 18 | `src/data/v5-models.proposed.js` | Empty proposed calibration output shell; `window.MODELS_V5_PROPOSED` |
| 167 | `src/data/v5-personas.js` | Six personas; `window.PERSONAS_V5` |
| 643 | `src/core/v5-engine.js` | `AITunerV5` class: user/profile/session, model/persona selection, lever values, prompt generation, localStorage |
| 683 | `src/core/radar.js` | **v3.5-era** radar config and canvas helpers (`WEB_TUNER_CONFIG` uses **old v6 lever IDs**, not v5) |
| 112 | `src/core/slider-controls.js` | Renders sliders from `LEVERS_V5` + engine state |
| 97 | `src/core/prompt-display.js` | Prompt display helper |
| 100 | `src/core/persona-selector.js` | Persona picker UI |
| 59 | `src/core/router.js` | Show/hide view containers |
| 179 | `src/onboarding/onboarding-state.js` | Tier 0–2 flags; reads/writes tier via `engine.user` |
| 437 | `src/onboarding/onboarding-ui.js` | Welcome → intent → model → prompt screens; Tier 0/1 UI; **radar placeholder text** |
| 140 | `src/onboarding/tier-unlock.js` | Tier unlock messaging hooks |
| 63 | `src/onboarding/model-samples.js` | `MODEL_SAMPLES` + `window.MODEL_SAMPLES` for onboarding model cards |
| 205 | `src/decoder/lever-mapper.js` | `LEVER_MAP`, `mapPromptToLevers()` for v5 keys |
| 122 | `src/decoder/prompt-decoder.js` | `PromptDecoder` class; **not loaded by `index.html`** |
| 113 | `src/discovery/discovery-mode.js` | `DiscoveryMode` class; **not loaded by `index.html`** |
| 134 | `src/profile/user-profile.js` | Profile helpers |
| 111 | `src/profile/session-restore.js` | Session restore helpers |
| 21 | `package.json` | npm scripts for calibration CLI only; **no dependencies** |
| 46 | `scripts/apply-calibration.js` | Copies/merges proposed model file (manual workflow) |
| 20 | `calibration/interview-tool.js` | Node stub; `require`s v5 levers; prints status |
| 23 | `calibration/observe-tool.js` | Node stub |
| 25 | `calibration/calibration-tool.js` | Node stub; `require`s v5 levers |
| 98 | `calibration/calibration-config.json` | Config placeholder for future scoring |
| 266 | `calibration/elicitation-prompts.md` | Elicitation prompt text (reference) |
| 1283 | `docs/reference/v3.5-engine/v6-engine.js` | Frozen reference copy |
| 683 | `docs/reference/v3.5-engine/radar.js` | Frozen reference copy |
| 265 | `docs/reference/v3.5-engine/v6-levers.js` | Frozen reference copy |
| *varies* | `docs/reference/Claude insights/*.md` | Research notes |
| 107 | `docs/CONTEXT-BRIDGE.md` | v3.5 ↔ v5 mapping doc |
| 963 | `AITuner-v5-FINAL-Cursor-Spec.md` | v5 product/implementation spec (documentation) |
| *other* | `*.md`, `*.html` at repo root | Specs, domain model notes, onboarding narrative, adaptive UI parking lot, README, SETUP-COMPLETE |

**Notable:** `v5.0` includes additional markdown/HTML assets (e.g. `AITuner-v5-Onboarding-Narrative-Script.md`, `AdaptiveUI-Concept-ParkingLot.md`) not listed exhaustively here; they are documentation, not runtime code.

### 1.2 Web v3.5 (`v3.5/`)

Single-page app; **8** primary source files:

| Lines | Path | Role |
|------:|------|------|
| 454 | `index.html` | Full UI: models, personas, sliders, radars, prompt; loads Lucide from CDN |
| 1283 | `js/core/v6-engine.js` | Legacy engine |
| 683 | `js/radar.js` | Radar + `WEB_TUNER_CONFIG` for **26** v6 levers |
| 265 | `js/data/v6-levers.js` | 26 lever definitions |
| 240 | `js/data/v6-models.js` | Model defaults (v6 keys) |
| 364 | `js/data/v6-personas.js` | Personas (v6 keys) |
| 1587 | `css/style-v6.css` | v6 styles |
| 1007 | `css/style.css` | Base styles |

No `package.json` in `v3.5/`; no bundled npm dependencies for the static site beyond the **Lucide** UMD script in `index.html`.

### 1.3 iOS — AITuner4 (`AI-Tuner-iOS/AITuner4/`)

**26** Swift sources (including UI tests). Approximate **~5,300** lines total under `AITuner4/` app + tests (`wc -l` on `**/*.swift`).

| Area | Files (representative) | Role |
|------|------------------------|------|
| App | `AITuner4App.swift` | SwiftUI entry |
| Engine | `Engine/AITunerEngine.swift` | Observable engine: models, personas, **v6** lever map, prompt generation |
| Models | `AIModel.swift`, `Lever.swift`, `Persona.swift`, `Preset.swift` | Static definitions for models, **26 v6 levers**, personas |
| Views | `ContentView.swift`, `ModelGridView.swift`, `PersonaGridView.swift`, `LeverControlsView.swift`, `RadarChartView.swift`, `WebTunerSectionView.swift`, tutorials, popups, etc. | Full mobile UI |
| Utils | `AnalyticsManager.swift`, `ErrorHandler.swift` | Analytics, errors |
| Project | `AITuner4.xcodeproj/project.pbxproj` | Xcode project |
| Plists | `Info.plist`, `GoogleService-Info.plist` | App / Firebase config |
| UITests | `AITuner4UITests.swift`, `SnapshotHelper.swift` | UI tests / snapshots |

---

## 2. Spec (`AITuner-v5-FINAL-Cursor-Spec.md`) vs code

Compared to the v5 spec’s **folder diagram** and **Part 8** list:

| Spec item | In code? | Notes |
|-----------|----------|--------|
| `calibration/interview-tool.js`, `observe-tool.js`, `calibration-tool.js` | Yes | Stubs; no API calls, no written outputs beyond console |
| `calibration-config.json` | Yes | Present |
| `elicitation-prompts.md` | Yes | |
| `last-run.json`, `drift-history.json` | **No committed files** | Listed in `.gitignore`; expected as generated artifacts |
| `elicitation-responses/*.json` | **Ignored** | Folder exists; outputs not in repo |
| `src/data/v5-levers.js` | Yes | |
| `src/core/v6-engine.js` | **No** | Spec name; actual file is **`v5-engine.js`** (`AITunerV5`) |
| `src/core/radar.js` | Yes | **Behavior still v6-key-oriented** (see §5) |
| `src/decoder/decoder-ui.js` | **No** | Spec mentions; not implemented (decoder is placeholder HTML only) |
| `src/discovery/comparison-ui.js` | **No** | Not implemented |
| `index.html`, `package.json` | Yes | |
| `scripts/apply-calibration.js` | Yes | |

**Part 8 implementation order:** Structure and v5 lever data exist; onboarding UI exists in code but **radar in onboarding is not implemented**; discovery/decoder **views** are placeholders; calibration is **not** a working pipeline.

---

## 3. Current user flow — v5 web (`index.html`)

What actually runs in the browser when opening `index.html` (e.g. via static server):

1. **Scripts load** in order: `v5-levers`, `v5-models`, `v5-personas`, `v5-models.proposed`, `v5-engine`, `radar`, `slider-controls`, `prompt-display`, `persona-selector`, onboarding modules, `router`.
2. **`new AITunerV5()`** runs: creates/loads `aituner_user`, `aituner_profile`, initializes **16** lever keys from `LEVERS_V5` at 5, restores `aituner_session` if fresh enough.
3. **`new OnboardingState(engine)`** reads tier from `engine.user`.
4. **`new Router()`** registers `home`, `onboarding`, `discovery`, `decoder` views.
5. **Tier badge** updates from onboarding state.
6. **Home** shows four cards. Clicks:
   - **Guided** → `router.navigateTo('onboarding')` → `OnboardingUI.initialize('onboarding-container')` → **`showScreen(0)`** welcome.
   - **Discovery** → discovery view with static “coming soon” + back button.
   - **Decoder** → decoder view with static “coming soon” + back button.
   - **Full / “I know what I’m doing”** → `skipToFullControls()`, `engine.setEntryPoint('manual')`, **full navigation to `architect.html`** (new page load).

**Onboarding sequence (if user stays in guided):** `nextScreen()` advances 0 → 1 → 2 → 3 → 4. Screen 3 shows Tier 0 or Tier 1 prompt UI depending on tier. Screen 3 Tier 1 injects sliders via `SliderControls`; **radar container is filled with placeholder text**, not charts. Screen 4 has persona selector + save. **`navigateToArchitect()` in onboarding is largely a stub** (`console.log` / no `architect.html` navigation in that path).

**Important:** `src/decoder/prompt-decoder.js`, `lever-mapper.js`, `discovery-mode.js`, `user-profile.js`, `session-restore.js` are **not** included in `index.html` — those modules are unused unless another page loads them.

### `architect.html` flow

Separate load: same data + engine + sliders + `PromptDisplay`; default model `claude`; **all** keys from `Object.keys(window.LEVERS_V5)` passed to `SliderControls` at tier 2; tier badge text forced to “Architect”.

### v3.5 web flow

Single `index.html`: model selection, persona, personality, sliders, radars, generated prompt — **fully wired** to `v6-engine.js` and v6 data files.

### iOS flow

Cold launch → SwiftUI `ContentView` → user picks model/persona, adjusts **v6** levers, sees generated prompt and radars; **no shared codebase** with v5 web.

---

## 4. Data structures in use (as in code today)

### 4.1 v5 lever keys (`LEVERS_V5` — 16 keys)

`assertiveness`, `formality`, `playfulness`, `emotionalWarmth`, `conciseness`, `teachingMode`, `initiative`, `questionFrequency`, `transparency`, `creativity`, `confidence`, `citationHabit`, `formatting`, `responseLength`, `safetyDisclaimers`, `toneMatching`.

**Pillars** (`PILLAR_CONFIG`): CHARACTER, VOICE, THINKING, OUTPUT — four groups of four levers each.

**Tier 1 list** (`TIER1_LEVERS` in data file): `initiative`, `assertiveness`, `conciseness`, `formality`, `emotionalWarmth`.  
(`SliderControls` duplicates a `tier1Levers` array in code — should match.)

### 4.2 v5 model IDs (`MODELS_V5`)

`claude`, `chatgpt`, `gemini`, `grok`, `mistral`, `llama`, `perplexity`, `cursor` — each with `defaults` for all **16** v5 keys.

### 4.3 v5 persona IDs (`PERSONAS_V5`)

`therapist`, `truth-seeker`, `coder`, `creative-writer`, `researcher`, `tutor`.

### 4.4 v3.5 / iOS — v6 lever universe

**~26** distinct lever IDs in `v3.5/js/data/v6-levers.js` and `Lever.allLevers` on iOS (e.g. `hedgingIntensity`, `proactivityLevel`, `empathyExpressiveness`, `structuralDensity`, `identitySourceLock`, …). **Not the same set or names as v5.**

### 4.5 localStorage keys (v5 web engine)

| Key | Used for |
|-----|----------|
| `aituner_user` | User id, tier, `has_copied`, `has_tuned`, `skip_onboarding`, timestamps |
| `aituner_profile` | Profile metadata |
| `aituner_session` | Session + lever snapshot |
| `aituner_configs` | Saved named configs |
| `aituner_decoded` | `PromptDecoder` only if that class is used (not wired in `index.html`) |

---

## 5. Broken, incomplete, or inconsistent

### 5.1 v5 web

- **Radar stack:** `src/core/radar.js` is aligned with **v6 lever names** and old four-chart “web tuner” groupings. It does **not** match `LEVERS_V5` or `PILLAR_CONFIG`. Onboarding explicitly placeholders radar instead of calling this file.
- **Decoder / discovery:** UI is “coming soon”; JS classes exist but are **not loaded** on the home app.
- **Onboarding → Architect:** “Skip” and “Unlock full controls” paths call **`navigateToArchitect()`** which does **not** navigate to `architect.html` (unlike the home card’s **full** entry, which does).
- **Spec file names:** `decoder-ui.js`, `comparison-ui.js`, `v6-engine.js` — not present as named; functionality partially replaced by other files or missing.
- **`SliderControls` vs `TIER1_LEVERS`:** Two sources of truth for Tier 1; should stay in sync manually.

### 5.2 v3.5 web

- **Self-contained and coherent** for v6; **Lucide** loaded from CDN (network required for icons).

### 5.3 iOS vs v5 web

- **Different lever schemas** (v6 vs v5), **different radar groupings**, **different engine** (Swift `AITunerEngine` vs JS `AITunerV5`).
- **Persona IDs** overlap (e.g. `therapist`, `truth-seeker`) but **lever keys inside personas** differ (v6 keys on iOS).
- **Model list** overlaps by id (`grok`, `gemini`, …) but **default vectors** are independent implementations.
- **WebTunerSectionView** (iOS) still references **v6** lever key arrays for four radar sections — same conceptual split as v3.5 web, not v5 pillars.

---

## 6. Dependencies

| Surface | Runtime dependencies |
|---------|----------------------|
| **v5 web** | **None** in `package.json`. Browser-only JS. |
| **v3.5 web** | **Lucide** (`unpkg.com/lucide@latest`) from `index.html`. No npm lockfile in tree. |
| **v5 calibration CLI** | Node built-ins only (`fs`, `path` where used). |
| **iOS** | SwiftUI / Foundation / Combine; **Firebase** via `GoogleService-Info.plist` and `AnalyticsManager`; no CocoaPods/Podfile in this path — Xcode **SPM or manual** frameworks assumed from project settings (not re-audited here). |

---

## 7. Web vs iOS — divergence summary

| Topic | v5 web (`AI-Tuner-v5.0`) | iOS (AITuner4) |
|-------|------------------------|----------------|
| **Lever count & IDs** | 16 (v5) | 26 (v6) |
| **Engine** | `AITunerV5` (JS) | `AITunerEngine` (Swift) |
| **Shipping UX** | Split `index.html` + `architect.html`; onboarding partial | Single native app; tutorials + web-style sections |
| **Radar** | v6-key `radar.js` + placeholder in onboarding | Native `RadarChartView` + v6 key lists |
| **Prompt decoder** | Code exists, not wired in main entry | **Not present** |
| **Discovery mode** | Stub + class not loaded | **Not present** as v5 feature |
| **Parity** | **None** — treat as **separate products** sharing a brand until schemas are unified |

---

## 8. Honest bottom line

- **v3.5 web** is the **fully integrated** tuning experience for the **legacy 26-lever** model.
- **v5 web** is a **work in progress**: data layer and engine for **16 levers** are real; **onboarding** and **architect** pages work at a basic level; **radar**, **decoder**, and **discovery** are **not** product-complete relative to the v5 spec.
- **iOS** is a **mature, native** app on the **v6** model; it does **not** implement v5’s 16-lever schema or the v5 web flows.

---

*Generated from repository inspection; no runtime tests were executed for this audit.*
