# AI Tuner v5 — Stop 5 verification (Model Rooms)

Plain handoff for design review before Stop 6.

---

## What changed (file by file)

| File | Change |
|------|--------|
| `src/data/v5-model-rooms.js` | **New.** Registry for all eight `MODELS_V5` ids: `roomTitle`, `tagline`, `selfDescription`, `observedStrengths` / `observedWeaknesses`, `bestFor` / `notGreatFor`, `voiceSignature`, plus `meta.selfDescriptionSource` and `meta.observedSource` (labeled sources). |
| `src/rooms/room-ui.js` | **New.** `ModelRoomUI`: room entry (Screen 9 copy + sequential radar reveal ~300–500 ms), tour (Screen 10), tuner (Screen 11: six mode presets, collapsible 16-lever / 4-pillar sliders + live radar, style import, Copy/Save), in-room Decode tab, bottom nav, `openModelRoom(opts)`. |
| `src/core/radar.js` | `mountAITunerV5Radars` return value now includes optional `getChartsByPillar()` (for future use; entry animation uses `refresh()` + lever stepping). |
| `index.html` | Scripts: `v5-model-rooms.js`, `room-ui.js`. New `#model-room-view`, router view `model-room`, `navigateTo` teardown for model room, home “I already use…” chip row, `ModelRoomUI` + `ProfilePanel` saved-config callback, CSS for room + discovery tune cards + profile rows. |
| `src/onboarding/onboarding-ui.js` | After model pick (screen 6): sets `sessionStorage` resume key to screen `7`, calls `openModelRoom({ modelId, initialTab: 'entry' })` instead of jumping straight to the tuner. |
| `src/discovery/discovery-ui.js` | After Compare: per-model cards with **Tune this model →** (`openModelRoom` → `initialTab: 'tune'`). Reads `aituner_discovery_preselect` on mount to pre-check a model when coming from the room tour link. |
| `src/profile/profile-panel.js` | Optional 4th argument `options.onOpenSavedConfig(configId)`. Saved-config rows are keyboard-focusable buttons; click opens `openModelRoom({ configId, initialTab: 'tune' })`. |

**Note:** `calibration/elicitation-prompts.md` is not in the repo. Self-descriptions are paraphrased vendor-style positioning with `meta.selfDescriptionSource` stating they are not live API elicitation. Observed lists reference the audit doc in `meta.observedSource`.

**Model IDs:** Room registry matches `v5-models.js` (`mistral`, `cursor`), not older “copilot/deepseek” naming.

---

## How to test each task

### Task 1 — Model room data layer

1. Open `index.html` in a browser (local server if needed).
2. In DevTools console: `Object.keys(MODEL_ROOMS_V5).length === 8` and `getModelRoom('claude').meta.selfDescriptionSource` is a non-empty string.

### Task 2 — Room entry screen

1. Home → any chip under **I already use…**, or complete onboarding through screen 6 and pick a model.
2. Expect: full-screen room view, “Welcome to”, room title + tagline, body copy aligned with Screen 9, radar draws axis-by-axis from zero to defaults over ~300–500 ms, **Show me around →**.

### Task 3 — Room tour screen

1. From entry, primary CTA or **About** nav.
2. Expect: three sections (self / observed with source lines / best vs not great), **Now let's tune it to you →**, secondary **Compare [model] to another model →** → Discovery with that model pre-checked.

### Task 4 — Room tuner screen

1. **Tune** tab (or tour CTA).
2. Expect: six mode tiles applying preset overlays on model defaults; fingerprint radar always visible; **Fine-tune →** expands four pillar blocks with 16 sliders and live radar; **Make … behave more like another model →** expands picker and import line; **Copy my prompt →** / **Save this configuration →**.

### Task 5 — Wire room entry from all entry points

| Entry | Test |
|--------|------|
| Onboarding screen 6 | Pick a model → room entry (not immediate screen 7). |
| Home Path A | Chip under **I already use…** → room entry. |
| Discovery | Compare with ≥1 model → **Tune this model →** → room **Tune** tab. |
| Profile | Tier badge → profile → click a saved config → room **Tune** with that config’s levers. |

### Task 6 — Room navigation

1. Bottom nav: **About** (tour or entry), **Tune**, **Decode**, **Home**.
2. On **Tune**, confirm radar stays visible above the collapsed fine-tune block.
3. **Decode** mounts the standard decoder UI with a scoped line naming the current model.
4. **Home** from onboarding-driven room: resumes onboarding at screen **7** (tuner) via `aituner_room_resume_onboarding`.

---

## Known limitations

- Full side-by-side discovery comparison UI is still a lightweight card grid + tune CTAs, not a rich diff view.
- In-room **Decode** reuses the global `DecoderUI`; after a decode, result UI may still offer “apply using model defaults” like the standalone decoder (baseline remains the room’s model).
- **Save** uses `window.prompt` / `alert` for minimal wiring.
- Sequential entry animation steps `generatePrompt` once at start and once at end of the axis loop (not every step), to limit work; radar `refresh` runs each step.

---

## Yes / no checklist (per task)

| Task | Done? |
|------|-------|
| 1 — `v5-model-rooms.js`, eight models, two labeled sources | **Yes** |
| 2 — Entry: title, tagline, Tier-2 radar, sequential draw, Screen 9 body, CTA | **Yes** |
| 3 — Tour: three sections, CTAs, compare → discovery with preselect | **Yes** |
| 4 — Tuner: six modes, collapsible fine-tune + radar, style import, Copy/Save | **Yes** |
| 5 — Entry from onboarding 6, home chips, discovery tune, profile config | **Yes** |
| 6 — Bottom nav About / Tune / Decode / Home; radar visible on Tune | **Yes** |

---

## Anything touched outside the listed files

- **No** other source files were modified beyond those in the table and this doc. `architect.html` was not changed for Stop 5.

---

*Stop 5 verification — 2026-03-24*
