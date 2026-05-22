# AITuner v5.0 — Stop 4 Verification Report

**Scope:** Carryover fixes (unmapped lines, architect `copyPrompt`), narrative onboarding (script copy, new screens, frustration flow, reveal radar, tier toasts, Act 5 overlay, decoder example).

**Source of truth for user-facing strings:** `AITuner-v5-Onboarding-Narrative-Script.md` (and spec text for Absolute Mode example).

---

## What changed

| File | Change |
|------|--------|
| `src/decoder/lever-mapper.js` | `splitInstructionLines()` + `lineMatchesAnyLeverPattern()`; after pattern scan, segments with **no** pattern match append to `unmappedInstructions`. |
| `architect.html` | Loads `user-profile.js`; wraps `engine.copyPrompt` with `UserProfile.recordPromptBuilt()`; Act 5 graduation overlay (Screen 13 copy); tier badge uses narrative labels; `localStorage` key `aituner_act5_graduation_seen`. |
| `src/onboarding/onboarding-ui.js` | Rebuilt flow: screens 0–8 (welcome, origin, promise, frustration, fix, reveal, model, tuner, preview); `ONBOARDING_FRUSTRATIONS` → lever mapping; fix/reveal/model navigation with `skippedRevealAfterFix` for back from model; narrative HTML for each step. |
| `src/onboarding/tier-unlock.js` | Tier 0→1 and 1→2 use narrative **toast** copy only; removed Tier 2 modal; toast class `aituner-toast`; badge helper text aligned with script. |
| `src/onboarding/onboarding-state.js` | `getTierName()` uses script badge strings (Getting started / Finding my settings / I've got this). |
| `src/core/radar.js` | `highlightLeverKey` option: renders **one** pillar chart, highlights matching axis, dims others, disables drag. |
| `index.html` | Narrative + toast + frustration + reveal CSS; session restore routes to onboarding screens **7** / **8**; tier toast styles. |
| `src/decoder/decoder-ui.js` | `ABSOLUTE_MODE_EXAMPLE_PROMPT` + “Try the prompt that started AITuner →”; unmapped results prefer `mapping.unmappedInstructions` as a list. |
| `docs/2026-0324-AITuner-v5-Stop4-Verification.md` | This handoff document. |

---

## How to test

### Task 1a — Unmapped lines

1. Open Decoder, paste text mixing matched phrases and arbitrary sentences (e.g. “be blunt. This is a totally unique line xyz123.”).
2. Decode.
3. **Expect:** Unmapped section lists segments that matched **no** `LEVER_MAP` pattern (split by newline, `•`, or `. `).

### Task 1b — Architect `prompts_built`

1. Open `architect.html` with profile that has `literacy_record`.
2. Copy prompt.
3. **Expect:** `prompts_built` increments in `aituner_profile` (same pattern as `index.html`).

### Task 2 — Welcome

1. Guided onboarding from home.
2. **Expect:** Exact welcome headline, sub, “Show me →”, quiet skip link per script.

### Task 3 — Origin

1. Next from welcome.
2. **Expect:** “Why this exists”, “It started with a prompt on Instagram.”, full body paragraphs, “— John Violette, founder”, “Let's find yours →”.

### Task 4 — Promise

1. Next again.
2. **Expect:** Label, two-line headline, three beats with CSS icons (no emoji), subhead, “I'm ready →”.

### Task 5 — Frustration

1. Next; select a card (highlight); Continue enabled only with selection.
2. **Expect:** Six cards + subtexts per script; quiet link routes to Discovery (`router.navigateTo('discovery')`).

### Task 6 — Fix

1. Continue from frustration.
2. **Expect:** Label “Here's your fix”, two-line headline, engine-generated prompt, Copy + secondary “What does this actually do?”, footnote about models; Copy → Tier 1 unlock → model screen (screen 6).

### Task 7 — Reveal

1. From Fix, use secondary CTA (without copying first if you want tier 0 on reveal path).
2. **Expect:** “You just pulled a lever.” Initiative body **exact** script text when frustration mapped to `initiative`; other frustrations use script structure + `LEVERS_V5` name/description; single-pillar radar with one axis emphasized; caption + CTAs per script; quiet link → `router.showHome()`.

### Task 8 — Tier unlocks & Act 5

1. Complete copy on Fix (tier 0→1): toast with Tier 0→1 script line.
2. On tuner, move a slider (tier 1→2): toast with Tier 1→2 script line.
3. Open `architect.html` as tier ≥2 with **cleared** `localStorage` key `aituner_act5_graduation_seen`: full Screen 13 overlay once; dismiss sets flag and hides forever.

### Task 9 — Decoder example

1. Decoder view → “Try the prompt that started AITuner →”.
2. **Expect:** Textarea fills with specified Absolute Mode system instruction string.

---

## Known limitations

- **Reveal body** for non-`initiative` levers uses the script’s closing paragraphs plus `LEVERS_V5` name/description (Initiative uses the script verbatim).
- **Act 5 overlay** keys off `engine.user.tier >= 2` only (not `skip_onboarding`); first-time tier-2 users who never ran guided onboarding still see it once if the flag is unset.
- **“Return to guided mode from settings”** is script copy only — settings entry not implemented.
- **Sentence splitting** uses `. `; edge cases (abbreviations, decimals) may split oddly.
- **Tier toasts** use new `aituner-toast` styles on pages that load `tier-unlock.js` (`index.html`); other hosts would need the same CSS if reused.

---

## Task confirmations (yes / no)

| # | Statement | Answer |
|---|-----------|--------|
| 1a | `unmappedInstructions` lists instruction segments with zero pattern matches. | **Yes** |
| 1b | `architect.html` wraps copy like `index.html` for `recordPromptBuilt`. | **Yes** |
| 2 | Welcome matches script. | **Yes** |
| 3 | Origin screen inserted with full script copy + CTA + attribution. | **Yes** |
| 4 | Promise screen with three non-emoji icons + script copy. | **Yes** |
| 5 | Frustration cards, mapping to levers, selection + Continue + explore link. | **Yes** |
| 6 | Fix screen copy + engine prompt + CTAs + note; Copy unlocks Tier 1. | **Yes** |
| 7 | Reveal optional path; Initiative script body; highlighted radar axis. | **Yes** |
| 8 | Tier toasts = script; Act 5 overlay on first tier-2 architect visit. | **Yes** |
| 9 | Decoder example link + Absolute Mode text. | **Yes** |

---

## Anything touched outside the listed files

Beyond the files named in the task list, Stop 4 also changed:

- `src/core/radar.js` (highlight option for reveal)
- `src/onboarding/onboarding-state.js` (tier badge labels)
- `index.html` (CSS, session-restore screen indices)

`prompt-decoder.js` was **not** modified (still joins `unmappedInstructions` into stored string; UI uses mapper array when present).
