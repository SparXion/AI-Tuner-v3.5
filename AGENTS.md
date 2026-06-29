# AGENTS.md

## Cursor Cloud specific instructions

This repository is a collection of **static, dependency-free web apps** plus an iOS app. There is no build step, no package manager, no linter, and no automated test suite for the production web app.

### Services / products

- **`AI-Tuner-v5.0/`** — the live web app (Netlify publish root). This is the primary product. Pure HTML/CSS/JS, served by any static file server. Entry point is `index.html`; the main tool is `app.html`.
- **`AI-Tuner-iOS/AITuner4/`** — iOS app, requires Xcode/macOS. Cannot be built or run on the Linux cloud VM.
- **`AI Tuner Legacy/`** — archived web apps (v2.0–v4.0) and a Cursor extension. Not deployed; out of scope for normal development.

### Running the web app (v5.0)

Serve the directory with a static server and open `index.html` / `app.html`:

```bash
cd AI-Tuner-v5.0
python3 -m http.server 8080
# open http://localhost:8080/index.html
```

Notes:
- `python3` is preinstalled; there are no dependencies to install.
- It **must** be served over HTTP (not opened as a `file://` path) because the app fetches JSON from `src/data/registry/` and uses ES-module-style script loading; `file://` will hit CORS/fetch errors.
- `index.html` and `app.html` load `lucide` icons from a CDN (`unpkg.com`); without network access icons may not render but the core tuning functionality still works.
- There is no lint/test/build command for this app — verification is manual (open in a browser, select a model, adjust a radar/slider, confirm the generated prompt preview updates, copy the prompt).
