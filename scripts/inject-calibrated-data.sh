#!/usr/bin/env bash
# Optional: sync calibrated profiles FROM private AI-Tuner-Methodology into this repo
# before committing a profile update. Profiles are public product data; this script
# is for workflow convenience only — the site reads v5-models.js directly.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
V5="$ROOT/AI-Tuner-v5.0"
MODELS_DST="$V5/src/data/v5-models.js"
SAMPLES_DST="$V5/src/onboarding/model-samples.js"
TMP_CLONE=""

cleanup() {
  if [[ -n "$TMP_CLONE" && -d "$TMP_CLONE" ]]; then
    rm -rf "$TMP_CLONE"
  fi
}
trap cleanup EXIT

log() { echo "[inject-calibrated] $*"; }

copy_if_exists() {
  local src="$1" dst="$2" label="$3"
  if [[ -f "$src" ]]; then
    cp "$src" "$dst"
    log "OK $label ← $src"
    return 0
  fi
  return 1
}

resolve_methodology_dir() {
  if [[ -n "${METHODOLOGY_REPO_PATH:-}" && -d "$METHODOLOGY_REPO_PATH/calibrated" ]]; then
    echo "$METHODOLOGY_REPO_PATH"
    return 0
  fi

  local sibling="$ROOT/../AI-Tuner-Methodology"
  if [[ -d "$sibling/calibrated" ]]; then
    echo "$sibling"
    return 0
  fi

  if [[ -n "${METHODOLOGY_REPO_TOKEN:-}" ]]; then
    TMP_CLONE="$(mktemp -d)"
    local url="https://${METHODOLOGY_REPO_TOKEN}@github.com/SparXion/AI-Tuner-Methodology.git"
    log "Cloning private methodology repo…"
    git clone --depth 1 "$url" "$TMP_CLONE" >/dev/null 2>&1
    echo "$TMP_CLONE"
    return 0
  fi

  return 1
}

inject_from_methodology() {
  local dir="$1"
  local ok=0
  copy_if_exists "$dir/calibrated/v5-models.js" "$MODELS_DST" "v5-models.js" && ok=1
  copy_if_exists "$dir/calibrated/model-samples.js" "$SAMPLES_DST" "model-samples.js" && ok=1
  return $(( ok == 0 ))
}

inject_from_local_calibrated() {
  local ok=0
  copy_if_exists "$V5/src/data/v5-models.calibrated.js" "$MODELS_DST" "v5-models.js" && ok=1
  copy_if_exists "$V5/src/onboarding/model-samples.calibrated.js" "$SAMPLES_DST" "model-samples.js" && ok=1
  return $(( ok == 0 ))
}

inject_from_preserved() {
  local preserved="$ROOT/Development/preserved-pre-scrub-2026-0709"
  local ok=0
  copy_if_exists "$preserved/AI-Tuner-v5.0/src/data/v5-models.js" "$MODELS_DST" "v5-models.js" && ok=1
  copy_if_exists "$preserved/AI-Tuner-v5.0/src/onboarding/model-samples.js" "$SAMPLES_DST" "model-samples.js" && ok=1
  return $(( ok == 0 ))
}

main() {
  log "Injecting calibrated profiles into $V5"

  if methodology_dir="$(resolve_methodology_dir 2>/dev/null)"; then
    if inject_from_methodology "$methodology_dir"; then
      log "Done (methodology repo)."
      exit 0
    fi
  fi

  if inject_from_local_calibrated; then
    log "Done (local *.calibrated.js)."
    exit 0
  fi

  if inject_from_preserved; then
    log "Done (Development/preserved-pre-scrub backup)."
    exit 0
  fi

  log "WARNING: No calibrated source found — site will use public neutral stubs."
  log "Set METHODOLOGY_REPO_PATH, METHODOLOGY_REPO_TOKEN, or add *.calibrated.js files."
  exit 0
}

main "$@"
