#!/bin/sh
# Xcode Cloud: create GoogleService-Info.plist (not in git).
set -e

PLIST="${CI_PRIMARY_REPOSITORY_PATH}/AI-Tuner-iOS/AITuner4/AITuner4/Resources/GoogleService-Info.plist"
EXAMPLE="${PLIST}.example"

if [ -f "$PLIST" ]; then
  echo "GoogleService-Info.plist already present."
  exit 0
fi

if [ -n "${GOOGLE_SERVICE_INFO_PLIST_BASE64}" ]; then
  echo "Writing GoogleService-Info.plist from Xcode Cloud secret."
  echo "${GOOGLE_SERVICE_INFO_PLIST_BASE64}" | base64 --decode > "$PLIST"
elif [ -f "$EXAMPLE" ]; then
  echo "warning: Using GoogleService-Info.plist.example — set GOOGLE_SERVICE_INFO_PLIST_BASE64 for real Firebase."
  cp "$EXAMPLE" "$PLIST"
else
  echo "error: Cannot create GoogleService-Info.plist." >&2
  exit 1
fi
