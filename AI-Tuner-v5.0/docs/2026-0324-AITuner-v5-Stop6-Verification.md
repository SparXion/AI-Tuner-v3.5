# AI Tuner v5 — Stop 6 verification (Close gaps / registry / elicitation / discovery / CLI)

Handoff before Stop 7.

---

## What changed (file by file)

| File | Change |
|------|--------|
| `src/ui/save-config-dialog.js` | **New.** Inline overlay: name input (placeholder `e.g. My writing Claude`), Save → / Cancel, 2s “Saved.” fade; uses `engine.saveConfig`. |
| `src/rooms/room-ui.js` | Room tuner **Save** uses `openSaveConfigDialog` (no `prompt`/`alert`). |
| `src/onboarding/onboarding-ui.js` | **Save this configuration** uses `openSaveConfigDialog`; prefills default from `#config-name` when set. |
| `architect.html` | **Save configuration** button + `save-config-dialog.js`; `saveArchitectConfig()` opens same dialog. |
| `index.html` | Loads `registry-loader.js`, `save-config-dialog.js`; `initModelRoomRegistry()` on startup; discovery comparison + notice UI styles. |
| `src/data/registry/registry-loader.js` | **New.** `fetch('src/data/registry/model-rooms.json')` → overrides in-memory map; else `MODEL_ROOMS_V5` from `v5-model-rooms.js`. Exposes `getModelRoom`, `getAllModelRooms`, `initModelRoomRegistry`. |
| `src/data/registry/registry-schema.json` | **New.** JSON Schema–style contract for one room entry + `meta`. |
| `src/data/registry/registry-version.json` | **New.** Schema version, date, lever schema id, `models_count`, `changelog`. |
| `src/data/registry/model-rooms.json` | **New.** JSON export of room entries (run `npm run sync-registry` after editing `v5-model-rooms.js`). |
| `src/data/v5-model-rooms.js` | First-person `selfDescription` refresh; `meta.selfDescriptionMethod: 'elicitation_v5'`; removed global `getModelRoom` (loader owns API). |
| `scripts/export-model-rooms-json.js` | **New.** Syncs JS fallback → `model-rooms.json`. |
| `package.json` | Script `sync-registry` → export script. |
| `src/core/radar.js` | `options.interactive: false` skips drag; `maxCanvasHeightPx` for small charts; `embedded: true` allows multiple simultaneous mounts (discovery minis) without tearing down each other; non-embedded mount clears primary + embedded. |
| `src/discovery/discovery-ui.js` | Full comparison grid (1–4 cards), samples via question→intent map + `MODEL_SAMPLES`, voice-signature fallback, mini non-interactive radars, **What did you notice?** chips → `setIntent('explore')` + `openModelRoom` entry. |
| `calibration/elicitation-prompts-v5.md` | **New.** 16-lever elicitation for all eight models + `default_persona` + `memory_personalization` (qualitative only). |
| `calibration/elicitation-prompts.md` | **New.** Pointer to v5 file (no legacy 26-lever file existed in repo). |
| `calibration/calibration-config.json` | **New.** 10-prompt behavioral battery with `levers_measured` per prompt. |
| `calibration/interview-tool.js` | **New.** Reads `elicitation-prompts-v5.md`, prints sections, writes `elicitation-responses/*-template.json`. |
| `calibration/observe-tool.js` | **New.** Prints battery; writes `last-run-template.json`. |
| `calibration/calibration-tool.js` | **New.** Requires non-template elicitation JSON with numeric `levers` + `last-run.json` with numeric `aggregate_by_lever`; prints drift; writes `src/data/v5-models.proposed.js` (observed aggregate → that model’s defaults). |

**Note:** Lever **keys** remain camelCase in JSON/engine; elicitation doc uses plain-English labels (e.g. “Show your work” ↔ `transparency`). Spec referenced `AITuner-v5-levers.js` — repo source of truth is `src/data/v5-levers.js`.

---

## How to test each task

### Task 1 — Save dialog

1. **Room:** Tune tab → **Save this configuration →** → overlay, Save/Cancel, “Saved.” fade.  
2. **Onboarding:** Screen 8 → save → same overlay.  
3. **Architect:** **Save configuration** → same overlay.

### Task 2 — Registry

1. Serve app over HTTP (fetch may fail on `file://`).  
2. `initModelRoomRegistry()` runs on load; `getModelRoom('claude')` matches `model-rooms.json` after fetch.  
3. Offline / failed fetch: content matches `MODEL_ROOMS_V5` in `v5-model-rooms.js`.  
4. After editing rooms in JS: `npm run sync-registry` then reload.

### Task 3 — Elicitation v5

1. Open `calibration/elicitation-prompts-v5.md` — 16 levers by pillar, all eight models + default persona + memory section without numeric levers.

### Task 4 — Self descriptions + `selfDescriptionMethod`

1. Open any room tour — first-person copy; `meta.selfDescriptionMethod === 'elicitation_v5'` in `v5-model-rooms.js` / JSON.

### Task 5 — Discovery comparison

1. Discovery → pick question + 1–4 models → **Compare →**.  
2. Expect cards with sample (or voice signature), 4-up mini radar (non-draggable), tune CTA, **What did you notice?** chips → room entry + `explore` intent.

### Task 6 — CLI

```bash
cd AI-Tuner-v5.0
npm run interview   # templates in calibration/elicitation-responses/
npm run observe     # prints battery + last-run-template.json
npm run calibrate   # instructions until claude.json (no *template*) + last-run.json filled
```

To exercise **write path**: copy a filled `*-template.json` to `claude.json`, add numeric `levers`, create `calibration/last-run.json` with matching `model_id` and numeric `aggregate_by_lever`, then `npm run calibrate` → check `src/data/v5-models.proposed.js`.

---

## Known limitations

- **Registry fetch** requires a local server (or CORS-served static files); `file://` falls back to JS only.  
- **Calibration** uses one elicitation file (first match, preferring `model_id` match to `last-run.json`); multi-model batch is manual.  
- **Proposed defaults** overwrite the target model’s `defaults` from `aggregate_by_lever` only (not a statistical merge of self vs observed).  
- **Discovery** question→intent mapping is fixed in code (`quit-job`/`programming-language` → `think`; `blockchain`/`product-idea` → `explore`).  
- **Architect** does not load `registry-loader` or model rooms (unchanged scope).

---

## Yes / no checklist

| Task | Done? |
|------|-------|
| 1 — Inline save dialog (room + architect; onboarding wired) | **Yes** |
| 2 — `registry/` loader + schema + version + JSON + fallback | **Yes** |
| 3 — `elicitation-prompts-v5.md` (16 levers, 8 models + default + memory) | **Yes** |
| 4 — Self-descriptions + `selfDescriptionMethod` | **Yes** |
| 5 — Discovery comparison grid + mini radars + notice → explore room | **Yes** |
| 6 — interview / observe / calibration CLIs functional | **Yes** |

---

## Anything touched outside the listed files

- **Yes:** `scripts/export-model-rooms-json.js`, `package.json`, and **generated** `calibration/elicitation-responses/*-template.json` plus `calibration/last-run-template.json` when you run `npm run interview` / `npm run observe` locally (not all template outputs are committed unless you add them).

---

*Stop 6 verification — 2026-03-24*
