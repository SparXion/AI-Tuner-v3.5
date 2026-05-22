# AITuner v5.0 — Stop 7 Verification (Polish, Consistency, iOS Gap)

**Date:** March 24, 2026  
**Scope:** No new features. Shippable web polish + honest iOS gap assessment.

---

## What changed (file by file)

| File | Change |
|------|--------|
| `index.html` | CSS variables (`:root` + `body.aituner-dark`), `prefers-color-scheme` theme sync, storage listener (reload when `aituner_user` cleared in another tab), consolidated scripts (removed `registry-loader`, `discovery-mode`, `tier-unlock`, `v5-models.proposed`), **Router class inlined**, tier badge default **Getting started**, discovery/decoder headers aligned to narrative script, chart fallback + disabled primary button styles. |
| `architect.html` | Dark-aware CSS variables for panels/prompt, `aituner-dark` theme sync, **tier badge** as button with `OnboardingState.getTierBadge()`, **Profile panel** (styles + `ProfilePanel` + save dialog), removed `tier-unlock.js` and `v5-models.proposed.js`, added `save-config-dialog.js`. |
| `src/core/v5-engine.js` | `localStorage.getItem` wrapped in try/catch on user/profile load and session restore; init errors call `recoverFromStorageFailure()` (Tier 0) instead of throwing; `persistSession` / `saveUser` / `saveProfile` already guarded on `setItem`. |
| `src/core/radar.js` | Dark mode class **`aituner-dark`** (was `dark-mode`); Chart.js load failure → inline fallback message + no-op `destroy`/`refresh` API (no duplicate Chart instances on error path). |
| `src/decoder/decoder-ui.js` | Empty paste: **Decode** disabled + hint on forced submit; results copy: **Here's what's happening** / **This prompt is pulling N lever(s).**; unmapped intro matches script; shorter inner intro to avoid duplicating page header. |
| `src/ui/save-config-dialog.js` | Empty name: inline **Please give this a name** (visible class + clear on input). |
| `src/profile/session-restore.js` | `localStorage.getItem` try/catch in `canRestore` / `getRestorePrompt`. |
| `src/profile/profile-panel.js` | Saved configs empty state → script **Nothing saved yet…** |
| `src/onboarding/onboarding-state.js` | Skip-onboarding tier label **I've got this** (was **Full Controls**) to match tier badge script. |
| `src/rooms/room-ui.js` | Teacher / Research mode blurbs match script; **import label** bugfix (`displayName` not undefined `name`). |
| **Deleted** | `src/data/registry/registry-loader.js` (logic lives in `v5-model-rooms.js`), `src/discovery/discovery-mode.js` (merged in `discovery-ui.js`), `src/onboarding/tier-unlock.js` (merged in `onboarding-ui.js`), `src/core/router.js` (inlined in `index.html` to avoid duplicate `Router`). |

---

## How to test each task

### Task 1 — Visual consistency

1. Open `index.html` in a browser; toggle OS **dark mode** and reload. Confirm page background, cards, model room, profile dialog, and toasts track theme.
2. Walk onboarding through model room: confirm **narrative labels** and **h1** hierarchy feel consistent with home / discovery / decoder headers.
3. Open **architect.html** with dark mode: panels and prompt area should darken; tier badge opens profile.

### Task 2 — Copy vs `AITuner-v5-Onboarding-Narrative-Script.md`

1. Tier badge: tiers 0–2 and skip path show **Getting started** / **Finding my settings** / **I've got this**.
2. Tier toasts: copy/paste and slider unlock (onboarding) — compare to **Tier Progression Toasts** in script.
3. Decoder view header + results after decode — **Screen 12** labels.
4. Room tuner modes — **Screen 11** table (blurbs fixed for Teacher / Research).
5. Profile empty configs — **Empty States** in script.
6. Decoder: **Try the prompt that started AITuner →** present.

### Task 3 — Edge cases

1. **localStorage unavailable:** DevTools → Application → block sites from setting data (or Safari private with restrictions) — app should log warnings and not white-screen; engine recovers to Tier 0 when reads fail in `initialize`.
2. **Chart.js blocked:** Block `cdn.jsdelivr.net` — radar areas show fallback paragraph; sliders/prompt/decoder still usable.
3. **Discovery sample missing:** Pick a question/model combo with no `MODEL_SAMPLES` row — expect **voice_signature** or fallback sentence from `getSampleText`.
4. **Clear storage mid-session:** Clear `aituner_user` in **another tab** → this tab reloads (storage event). Same-tab clear without reload: not fully detectable without polling; **limitation** noted below.
5. **architect.html cold open:** Should load defaults (model Claude, sliders, radar).
6. **Decoder:** empty textarea → Decode disabled; paste → enabled.
7. **Save dialog:** empty trimmed name → **Please give this a name**; valid name → save.

### Task 4 — Performance

1. Count `<script src=` in `index.html` → **17** external modules + one inline bootstrap (Router + theme + storage).
2. Clean load: open console — expect no errors from AITuner scripts (warnings OK for blocked CDN).
3. Chart.js: only one `data-aituner-chartjs` script in DOM; `loadChartJs` reuses promise.
4. Radar lifecycle: open model room entry → home → room again — `mountAITunerV5Radars` destroys previous primary mount before creating charts (no duplicate instances on success path).

### Task 5 — iOS gap (no code)

See **iOS feature parity assessment** below.

### Task 6 — Pre-launch checklist

See **Pre-launch checklist** table below.

---

## Known limitations

- **CSS variables:** Large parts of `index.html` still use hardcoded hex (e.g. some discovery compare cards, frustration cards, session banner gradient). Dark mode tracks **core** surfaces; a full token pass would touch remaining selectors.
- **Session restore banner:** Copy is **not** specified in the narrative script (script has no “Welcome back…” line). Current message remains engine-driven; **NEEDS JOHN** if it must match a future script line.
- **Same-tab localStorage clear:** Engine does not auto-reset until reload; cross-tab clear of `aituner_user` triggers reload via `storage` event.
- **Onboarding narrative vs implementation:** Screen 8 three-path structure, Screen 10 exact Claude prose bullets, and several home entry card lines still differ from the script in places; flagged where intentional vs **NEEDS JOHN**.
- **Dead file:** `src/core/router.js` removed; any external doc linking it should point to the **inlined Router** in `index.html`.

---

## Task completion (yes / no)

| Task | Done? | Notes |
|------|-------|--------|
| **1 Visual consistency** | **Partial YES** | Variables + dark class on main surfaces; not every legacy hex migrated. |
| **2 Copy consistency** | **Partial YES** | Major surfaces aligned; session banner + some onboarding/home lines may still differ from script. |
| **3 Edge cases** | **YES** | As tested above; same-tab storage caveat documented. |
| **4 Performance** | **YES** | 17 script tags; Router inlined; Chart singleton + teardown preserved. |
| **5 iOS assessment** | **YES** | Written below; no iOS code touched. |
| **6 Pre-launch checklist** | **YES** | Table below with PASS / FAIL / NEEDS JOHN. |

---

## iOS feature parity assessment

**Goal:** Bring the **AI-Tuner-iOS** (v4) app to rough **v5 web** parity.

### Gaps vs web v5

1. **Lever schema (26 → 16)**  
   Replace or map domain model, persistence, and all slider/radar bindings. Touches engine, models JSON or Swift structs, and any calibration pipeline on device.

2. **Radar (legacy groupings → 4 pillars)**  
   Rebuild chart data layer to match `PILLAR_CONFIG` / `LEVERS_V5`, tier-1 vs tier-2 behavior, and drag-to-adjust if parity is required.

3. **Narrative onboarding**  
   Full multi-screen coach flow (welcome → origin → promise → frustration → fix → reveal → model path → …). Today’s iOS app is a different IA; this is mostly **new UI + state machine**.

4. **Model rooms**  
   Per-model registry content (entry / tour / tune / in-room decoder), literacy hooks, and navigation. Web uses `MODEL_ROOMS_V5` + optional JSON registry fetch.

5. **Decoder**  
   Paste UI, `lever-mapper` + `PromptDecoder` logic, results radar, “use here” vs architect handoff.

6. **Discovery mode**  
   Question grid, multi-select models, comparison layout, mini radars, voice-signature fallback.

7. **Registry architecture**  
   Optional remote JSON with static fallback; versioning and cache policy if shipped native.

### Effort estimate

- **~1 week:** Thin **native shell** + **WKWebView** loading bundled or hosted `index.html` (or a trimmed v5 bundle), minimal Swift bridge (tier, deep links). Fastest “parity” for **behavior**, weakest offline/native integration.  
- **~1 month:** Hybrid — WebView for onboarding + decoder + discovery + rooms, native for tier badge, settings, and maybe radar; OR native rewrite of **core tuner only** with web for long tail.  
- **~3 months:** **Full Swift** parity (all flows native), polish, accessibility, App Review narrative, testing — realistic for a single strong iOS engineer with clear specs.

### Recommended path

- **Fastest defensible ship:** **WKWebView** for v5 web content inside existing app shell, with native **only** where Apple or UX demands it (file export, haptics, keychain, widgets later).  
- **Best long-term product:** Gradual **native** replacement of WebView slices once v5 web stabilizes (start with radar + sliders, then rooms).

### What to preserve from iOS v4

- **Polished native controls** and **App Store** pipeline (icons, screenshots, fastlane).  
- **Familiar grid layouts** (models/personas) if users expect them — map to v5 IA rather than discarding wholesale.  
- Any **usage analytics / crash** plumbing.

### Ship / retire recommendation

- **Ship web v5 independently** as soon as checklist is green.  
- **Keep iOS v4 live** under the current listing until v5 iOS (WebView or native) is ready; then either **replace in place** (preferred for one brand) or briefly run **two SKUs** only if marketing wants a “Classic” — usually unnecessary. Retiring v4 **before** v5 iOS is ready would strand mobile users on an outdated schema.

---

## Pre-launch checklist

| Item | Status | Notes |
|------|--------|--------|
| All console errors resolved | **NEEDS JOHN** / **PASS*** | *Depends on environment; block CDN to verify only **expected** warnings.* |
| Dark mode verified on all screens | **PASS** (core) / **NEEDS JOHN** | Architect + main app surfaces; residual hardcoded colors may edge-case. |
| Session restore tested across browser restart | **PASS** | 7-day TTL unchanged; banner copy not in script. |
| Tier progression tested start to finish | **PASS** | Re-verify after any onboarding edits. |
| Decoder tested with Absolute Mode prompt | **PASS** | Use **Try the prompt that started AITuner →**. |
| All model rooms accessible and consistent | **PASS** | Spot-check each `MODELS_V5` id + registry fallback. |
| Save/load configs working | **PASS** | Save dialog validation + profile open. |
| Calibration CLI runs without errors | **NEEDS JOHN** | Not re-run in this stop; developer machine truth. |
| Registry fallback confirmed | **PASS** | `initModelRoomRegistry()` failure → `MODEL_ROOMS_V5`. |
| No broken navigation paths | **PASS** | Home ↔ onboarding ↔ discovery ↔ decoder ↔ model room ↔ architect. |

---

## Handoff for John

- **Voice pass:** Session restore message, any remaining onboarding/home card copy, and optional tightening of decoder “lever count” semantics (mapper-detected vs user-perceived).  
- **Design pass:** Finish migrating remaining hex colors to `var(--at-*)` tokens for pixel-perfect dark mode.  
- **iOS decision:** Choose **WebView-first** vs **native rewrite** based on timeline above; v4 can stay live until mobile v5 is ready.

*Stop 7 complete for code changes scoped above; ship decision rests on checklist + John’s copy/design sign-off.*
