# AI Tuner

Production apps for [aitunerapp.com](https://aitunerapp.com) and the iOS App Store build.

## Repository layout

| Path | Purpose |
|------|---------|
| `AI-Tuner-v5.0/` | **Live web app** (Netlify publish root) |
| `AI-Tuner-iOS/AITuner4/` | **iOS app** (open in Xcode) |
| `AI Tuner Legacy/` | Archived web apps: v2.0, v3.0, v3.5, v4.0 |
| `Development/` | Specs, chat exports, calibration, docs — **local only, not in git** |
| `netlify.toml` | Deploy config (`publish = AI-Tuner-v5.0`) |

## Run locally

**Web (v5)**

```bash
cd AI-Tuner-v5.0
python3 -m http.server 8080
# open http://localhost:8080/app.html
```

**iOS**

Open `AI-Tuner-iOS/AITuner4/AITuner4.xcodeproj` in Xcode. Copy `GoogleService-Info.plist.example` to `GoogleService-Info.plist` if needed (see example in Resources).

## Legacy web versions

Open HTML from `AI Tuner Legacy/v2.0`, `v3.0`, `v3.5`, or `v4.0` with a static server.

## Development material

Non-runtime work lives in `Development/` at the repo root. That folder is gitignored so secrets and chat exports never reach GitHub. Keep it on disk or move it elsewhere for backup.
