# Context Bridge: v3.5 → v5.0

**Purpose:** Links and references to v3.5 documentation and code for context preservation.

## Quick Links

### Original v3.5 Project
- **Location:** `/Users/johnviolette/AI-Tuner-v3.5` (preserved, accessible)
- **Git Remote:** `v3.5-source` (all branches preserved)

### Key Documentation

#### Architecture & Structure
- [Current Structure Analysis](../docs/reference/2026-0315-AITuner-Current-Structure.md)
- [Academic Paper (Original)](../../2025-1104-AI-TUNER-ACADEMIC-PAPER.md)
- [Academic Paper (Updated)](../../2026-0315-AITuner-Academic-Paper-Updated.md)

#### Engine Reference
- [v3.5 Engine (v6-engine.js)](reference/v3.5-engine/v6-engine.js)
- [v3.5 Radar Chart](reference/v3.5-engine/radar.js)
- [v3.5 Levers (26-lever schema)](reference/v3.5-engine/v6-levers.js)
- [v6 Engine + Levers Combined Doc](../../2026-0315-AITuner-v6-Engine-and-Levers.md)

#### Research & Insights
- [Claude Insights](reference/Claude\ insights/)
- [Missing Lever Dimensions Analysis](../../Claude\ insights/MISSING-LEVER-DIMENSIONS-ANALYSIS.md)

#### Elicitation Prompts
- [Model Elicitation Prompts](../calibration/elicitation-prompts.md)

### Archived Versions
- **v2.0:** `archive/v2.0/`
- **v3.0:** `archive/v3.0/`
- **v3.5 Web:** `archive/v3.5-reference/`
- **iOS v4.0:** `archive/AI-Tuner-iOS/`

## Git History Access

All v3.5 branches are preserved as `archive/*` branches:

```bash
# View all archived branches
git branch | grep archive

# Checkout a specific v3.5 branch
git checkout archive/main

# View v3.5 commit history
git log archive/main

# Compare v3.5 code
git diff archive/main HEAD -- path/to/file
```

## Key Differences: v3.5 → v5.0

### Lever Schema
- **v3.5:** 26 levers across 12 categories
- **v5.0:** 16 levers across 4 pillars (Character, Voice, Thinking, Output)

### Architecture
- **v3.5:** Single-page app with progressive disclosure
- **v5.0:** Four entry points (Guided, Discovery, Decoder, Full Controls)

### Core Engine
- **v3.5:** `v6-engine.js` (1,283 lines)
- **v5.0:** New `v6-engine.js` (to be created, compatible interface)

### Calibration
- **v3.5:** Manual model defaults
- **v5.0:** Automated calibration tool (`calibration/`)

## When to Reference v3.5

1. **Understanding legacy behavior** - Check v3.5 code for how features worked
2. **Migration decisions** - See what was kept vs. rebuilt
3. **Bug fixes** - Check if issues existed in v3.5
4. **Feature parity** - Ensure v5.0 has all v3.5 capabilities

## Accessing v3.5 Files

The original v3.5 folder remains at:
```
/Users/johnviolette/AI-Tuner-v3.5
```

It's fully accessible for:
- Reading code
- Running tests
- Comparing implementations
- Reference documentation

## File Mapping

| v3.5 Location | v5.0 Location | Purpose |
|--------------|---------------|---------|
| `v3.5/js/core/v6-engine.js` | `docs/reference/v3.5-engine/v6-engine.js` | Reference only |
| `v3.5/js/radar.js` | `docs/reference/v3.5-engine/radar.js` | Reference only |
| `v3.5/js/data/v6-levers.js` | `docs/reference/v3.5-engine/v6-levers.js` | Reference only |
| `v3.5/js/data/v6-models.js` | `src/data/v5-models.js` | To be updated |
| `v3.5/js/data/v6-personas.js` | `src/data/v5-personas.js` | To be updated |
| `2026-0315-AITuner-Model-Elicitation-Prompts.md` | `calibration/elicitation-prompts.md` | Active use |

---

*Created: March 15, 2026*
*Last Updated: March 15, 2026*
