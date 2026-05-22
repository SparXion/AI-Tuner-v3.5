# AI Tuner v5.0

**AI Literacy Platform** — Understand, build, and decode AI behavior.

## Quick Start

See [AITuner-v5-FINAL-Cursor-Spec.md](./AITuner-v5-FINAL-Cursor-Spec.md) for complete implementation spec.

## Project Structure

```
/aituner-v5/
  /calibration/          # CLI calibration tools
  /src/
    /data/               # Lever definitions, model defaults, personas
    /onboarding/         # Tier progression system
    /discovery/          # Model comparison feature
    /decoder/            # Prompt decoder (NEW)
    /profile/            # User profile & session memory
    /core/               # Core engine (v6-engine.js, radar.js)
  /scripts/              # Utility scripts
  /docs/                 # Documentation
  /archive/              # Archived v2.0, v3.0, v3.5 versions
```

## Key Features

- **Four Entry Points:** Guided onboarding, Discovery mode, Prompt decoder, Full controls
- **Tier Progression:** Starter → Tuner → Architect
- **16 Levers:** Simplified from 26, organized into 4 pillars
- **Prompt Decoder:** Paste any prompt, see what levers it's pulling
- **Calibration Tool:** Automated model behavior tracking

## Development

```bash
# Run calibration
npm run calibrate

# Apply calibration results
npm run apply-calibration
```

## Context & History

- [Context Bridge](./docs/CONTEXT-BRIDGE.md) - Links to v3.5 documentation
- [Archived Versions](./archive/) - v2.0, v3.0, v3.5 reference code

## Git Branches

All v3.5 branches preserved as `archive/*` branches:
- `archive/main` - v3.5 main branch
- `archive/v3.0-live-default` - v3.0 default
- See all: `git branch | grep archive`

## Setup

Run the setup script to initialize git and folder structure:

```bash
./setup-v5.0.sh
```

---

*Version: 5.0*
*Date: March 15, 2026*
