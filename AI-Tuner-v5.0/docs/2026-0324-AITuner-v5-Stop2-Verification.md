# AITuner v5.0 — Stop 2 Wiring Verification Report

**Scope:** Wire `mountAITunerV5Radars` into Architect and onboarding Tier 1, re-mount on Tier 2 unlock mid-session, preload Stop 3 scripts in `index.html`, fix `navigateToArchitect()`.

**Audience:** Design collaborator — read before Stop 3.

---

## What changed

| File | Change |
|------|--------|
| `AI-Tuner-v5.0/architect.html` | After `PromptDisplay` init, calls `mountAITunerV5Radars(engine, 'radar-container', { tier: 2 })` so all four radars are active with drag regardless of stored onboarding tier. |
| `AI-Tuner-v5.0/index.html` | Inserts five script tags after core (`persona-selector.js`), before onboarding: `lever-mapper.js`, `prompt-decoder.js`, `discovery-mode.js`, `user-profile.js`, `session-restore.js`. |
| `AI-Tuner-v5.0/src/onboarding/onboarding-ui.js` | Tracks `radarApi`; `initializeRadar()` destroys prior mount and calls `mountAITunerV5Radars` with `{ tier: 1 }` or `{ tier: 2 }` from `getTierBadge().tier`; `engine.onTierChange` re-calls `initializeRadar()` when `tier >= 2` and `currentScreen === 3`; `navigateToArchitect()` sets `setEntryPoint('manual')` and `location.href = 'architect.html'`. |
| `AI-Tuner-v5.0/docs/2026-0324-AITuner-v5-Stop2-Verification.md` | This handoff document (runtime-optional). |

**Unchanged for Stop 2:** `src/core/radar.js` (Stop 1 implementation is sufficient).

---

## How to test (five tasks)

### Task 1 — Architect radar (Tier 2)

1. `cd` to `AI-Tuner-v5.0`, run `python3 -m http.server 8765`.
2. Open `http://localhost:8765/architect.html`.
3. **Expect:** Four radar charts in the right panel without opening the console.
4. Move any slider — vertices update immediately; drag a radar point — slider and prompt update.

### Task 2 — Onboarding Tier 1 screen

1. Open `http://localhost:8765/index.html`.
2. Choose **I have a task** → progress through intent → model → reach the prompt screen (Tier 0).
3. Use **Copy prompt** or **Unlock visual tuning** so you reach the Tier 1 layout (sliders + radar column).
4. **Expect:** Four radars; Character and Voice in pillar colors; Thinking and Output titled “(locked)” and grayed; **no** radar dragging on any chart; moving a Tier 1 slider updates the matching vertices live.

### Task 3 — Tier 2 re-mount without reload (same session)

1. Stay on the Tier 1 prompt screen (screen 3) from Task 2.
2. Move **any** Tier 1 slider (first adjustment triggers engine Tier 2 unlock).
3. **Expect:** Unlock animation from `tier-unlock.js` if present; immediately after, radars **re-mount**: Thinking and Output show full pillar colors (not gray), titles no longer “(locked)”, and **drag** works on all four charts. No page reload.

### Task 4 — Preload five scripts on `index.html`

1. Open `index.html` in the editor and confirm the five `<script src="src/...">` lines appear after `persona-selector.js` and before onboarding scripts.
2. In the browser on `index.html`, DevTools → **Network** (disable cache) → reload.
3. **Expect:** `lever-mapper.js`, `prompt-decoder.js`, `discovery-mode.js`, `user-profile.js`, and `session-restore.js` load with **200** and no console errors from those files.

### Task 5 — `navigateToArchitect()`

1. From `index.html`, start guided onboarding and reach **Ready to go** (screen 4), or use **Skip to full controls** from the welcome screen.
2. Use **Unlock all 16 controls →** or the skip path that calls `navigateToArchitect()`.
3. **Expect:** Browser navigates to `architect.html` (same as the home card “I know what I'm doing”), not only a console message.

---

## Known limitations

- **Chart.js** still loads from CDN on first radar mount (offline / strict CSP).
- **Global tier badge** on `index.html` is not refreshed when tier changes mid-onboarding (pre-existing; not part of Stop 2).
- **`engine.onTierChange`** is a single slot; only `OnboardingUI` should assign it while onboarding is active.
- **Screen 4 “Unlock all 16 controls”** still navigates away to Architect; it does not re-mount radars on that screen (radars are on screen 3). Tier 2 re-mount is implemented for **screen 3** when the user hits Tier 2 via the **first slider move** (`engine.checkTierUnlock`).

---

## Task confirmations (yes / no)

| # | Statement | Answer |
|---|-----------|--------|
| 1 | Architect wires `mountAITunerV5Radars` after engine init with Tier 2 (all four active, drag on). | **Yes** — explicit `{ tier: 2 }`. |
| 2 | Onboarding Tier 1 replaces the radar placeholder with a real mount; four radars; Character/Voice active; Thinking/Output grayed/locked; no drag at Tier 1. | **Yes** — uses `{ tier: 1 }` until tier ≥ 2. |
| 3 | Advancing to Tier 2 on the Tier 1 prompt screen destroys and re-mounts the radar for Tier 2 without reload. | **Yes** — `onTierChange` → `initializeRadar()` when `currentScreen === 3` and `tier >= 2`. |
| 4 | `index.html` loads the five listed scripts after core, without wiring their UI. | **Yes** — scripts only added to load order. |
| 5 | `navigateToArchitect()` goes to `architect.html` like the home “full controls” path. | **Yes** — `setEntryPoint('manual')` + `window.location.href = 'architect.html'`. |

---

## Anything touched outside the listed files

**No.** Stop 2 edits are limited to:

- `architect.html`
- `index.html`
- `src/onboarding/onboarding-ui.js`
- this verification doc under `docs/`

`src/core/radar.js` was not modified for Stop 2.
