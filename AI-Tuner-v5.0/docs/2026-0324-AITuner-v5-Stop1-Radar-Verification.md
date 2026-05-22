# AITuner v5.0 — Stop 1 Radar Verification Report

**Scope:** Rewrite of `src/core/radar.js` for the v5 pillar schema (Chart.js, `PILLAR_CONFIG`, live sync with `AITunerV5`).

**Audience:** Design collaborator — read before Stop 2 (wiring mount into pages).

---

## What changed

| File | Change |
|------|--------|
| `AI-Tuner-v5.0/src/core/radar.js` | Replaced v6 / `WEB_TUNER_CONFIG` implementation with v5 pillar radars: `mountAITunerV5Radars()`, Tier 1 vs Tier ≥2 behavior, Chart.js loaded from CDN on first mount, chained `engine.onLeverChange` for live updates. |
| `AI-Tuner-v5.0/docs/2026-0324-AITuner-v5-Stop1-Radar-Verification.md` | This verification report (created for design handoff; not required for the app to run). |

No application code outside `radar.js` was modified for Stop 1.

---

## How to test

1. From the `AI-Tuner-v5.0` directory, serve over HTTP (avoids `file://` blocking the Chart.js CDN):

   ```bash
   cd /path/to/AI-Tuner-v5.0
   python3 -m http.server 8765
   ```

2. Open `http://localhost:8765/architect.html` in the browser.

3. The page does not call the radar yet. Temporarily expose the engine for the console (one line after `const engine = new AITunerV5();`):

   ```javascript
   window.engine = engine;
   ```

   Stop 2 should replace this with a proper in-page `mountAITunerV5Radars(...)` call.

4. Open DevTools → **Console** and run:

   ```javascript
   mountAITunerV5Radars(window.engine, 'radar-container').then(() => console.log('radars mounted'));
   ```

**What you should see**

- A 2×2 grid of four radar charts inside the right-hand “Behavior Dimensions” panel.
- Titles: Character, Voice, Thinking, Output (pillar labels from `PILLAR_CONFIG`).
- Each chart has **four** axes, matching the four lever names in that pillar (from `LEVERS_V5`).

**What should happen when you move a slider**

- The vertex for that lever on the matching radar should move **immediately** (same frame as the slider `input` event, via `adjustLever` → `onLeverChange` → chart `update('none')`).
- With default Tier 2 behavior, dragging a **point** on a radar should update the corresponding slider value display and call `adjustLever` (prompt regenerates as usual).

**Tier 1 preview (optional)**

```javascript
mountAITunerV5Radars(window.engine, 'radar-container', { tier: 1 }).then(() => console.log('tier 1'));
```

- Character and Voice charts use full pillar colors; Thinking and Output use **muted gray** styling, titles append “(locked)”, and radar **drag is disabled** on all charts at Tier 1.
- Axis labels for levers **not** in `TIER1_LEVERS` are drawn in a softer color on Character and Voice only.

---

## Known limitations

- **Mount is not wired** in `architect.html` or onboarding yet — radars only appear after calling `mountAITunerV5Radars` (or equivalent in Stop 2).
- **Chart.js** is injected from jsDelivr on first mount; offline or strict CSP may block it.
- **Tier changes** while mounted do not auto-remount; if tier advances in-session and lock/drag behavior must change, call `destroy` and `mount` again (Stop 2 can own that flow).
- **Legacy helpers** from the old `radar.js` (`WEB_TUNER_CONFIG`, `blendPresets`, `drawRadar` preset chart, v6 drag → `aiTuner`) were **removed**; only `drawRadarV6` remains as a thin shim that refreshes the v5 mount if present.
- **Tier 1** shows **four** radars; Thinking and Output are grayed/locked rather than hidden. If the product intent is literally **two** charts only at Tier 1, that is a spec gap vs current implementation.

---

## Confirmations

**Does the radar update live when a slider moves?**  
**Yes** — after mount, `engine.onLeverChange` is chained to refresh all pillar datasets from `engine.leverValues`.

**Does Tier 1 show only CHARACTER and VOICE radars, with THINKING and OUTPUT grayed?**  
**No** — all **four** pillar radars are shown. THINKING and OUTPUT are **grayed and locked** (no drag, muted colors). CHARACTER and VOICE are the “active” pair visually; axis label emphasis follows `TIER1_LEVERS` on those two charts only. If “only two charts” is required, Stop 2 or a small radar.js follow-up should hide the Thinking/Output cards when `tier === 1`.

**Anything touched outside `radar.js`?**  
**No application code.** Stop 1 code changes are only `src/core/radar.js`. This handoff markdown file was added under `docs/` for sharing; it does not affect runtime behavior.

---

## Stop 2 preview (not in scope here)

Wire `mountAITunerV5Radars(engine, 'radar-container')` into `architect.html` after engine init; replace onboarding `initializeRadar()` placeholder; add `window.engine` only if you still want console debugging.
