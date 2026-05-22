#!/bin/bash
# AI Tuner v5.0 Setup Script
# Clones v3.5 repo, preserves history, sets up v5.0 structure
# Date: March 15, 2026

set -e  # Exit on error

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"
V5_DIR="$SCRIPT_DIR"
V35_DIR="$PARENT_DIR"

echo "🚀 AI Tuner v5.0 Setup"
echo "======================"
echo ""

# Check if we're in the right directory
if [ ! -f "$V5_DIR/AITuner-v5-FINAL-Cursor-Spec.md" ]; then
    echo "❌ Error: Must run from AI-Tuner-v5.0 directory"
    echo "   Current directory: $V5_DIR"
    exit 1
fi

# Step 1: Check if v3.5 exists
if [ ! -d "$V35_DIR/.git" ]; then
    echo "❌ Error: AI-Tuner-v3.5 git repository not found at $V35_DIR"
    exit 1
fi

# Step 2: Initialize git if not already initialized
if [ ! -d "$V5_DIR/.git" ]; then
    echo "📦 Initializing git repository..."
    cd "$V5_DIR"
    git init
    
    # Add v3.5 parent directory as a remote to preserve history
    git remote add v3.5-source "$V35_DIR"
    echo "✅ Added v3.5-source remote"
    
    # Fetch all branches from v3.5
    echo "📥 Fetching all branches from v3.5..."
    git fetch v3.5-source
    
    # Create tracking branches for all v3.5 branches
    echo "🌿 Creating tracking branches..."
    for branch in $(git branch -r | grep 'v3.5-source/' | sed 's|v3.5-source/||' | grep -v HEAD); do
        git branch "archive/$branch" "v3.5-source/$branch" 2>/dev/null || true
    done
    
    # Checkout main branch (or create from v3.5 main)
    if git show-ref --verify --quiet refs/remotes/v3.5-source/main; then
        git checkout -b main v3.5-source/main
    else
        git checkout -b main
    fi
    
    echo "✅ Git repository initialized with v3.5 history"
else
    echo "ℹ️  Git repository already initialized"
    cd "$V5_DIR"
    
    # Add v3.5 remote if not already added
    if ! git remote | grep -q "v3.5-source"; then
        git remote add v3.5-source "$V35_DIR"
        git fetch v3.5-source
        echo "✅ Added v3.5-source remote"
    fi
fi

# Step 3: Create archive directory and copy old versions
echo ""
echo "📁 Setting up archive structure..."
mkdir -p archive
mkdir -p archive/v3.5-reference

# Copy v3.5 files to archive for reference (read-only access)
if [ -d "$V35_DIR/v3.5" ]; then
    echo "   Copying v3.5 web version..."
    cp -r "$V35_DIR/v3.5" archive/v3.5-reference/ 2>/dev/null || true
fi

if [ -d "$V35_DIR/v2.0" ]; then
    echo "   Copying v2.0..."
    cp -r "$V35_DIR/v2.0" archive/ 2>/dev/null || true
fi

if [ -d "$V35_DIR/v3.0" ]; then
    echo "   Copying v3.0..."
    cp -r "$V35_DIR/v3.0" archive/ 2>/dev/null || true
fi

# Copy iOS version if it exists
if [ -d "$V35_DIR/AI-Tuner-iOS" ]; then
    echo "   Copying iOS version..."
    cp -r "$V35_DIR/AI-Tuner-iOS" archive/ 2>/dev/null || true
fi

# Copy important docs from v3.5
echo "   Copying reference documentation..."
mkdir -p docs/reference
if [ -f "$V35_DIR/2026-0315-AITuner-Current-Structure.md" ]; then
    cp "$V35_DIR/2026-0315-AITuner-Current-Structure.md" docs/reference/ 2>/dev/null || true
fi
if [ -d "$V35_DIR/Claude insights" ]; then
    cp -r "$V35_DIR/Claude insights" docs/reference/ 2>/dev/null || true
fi

echo "✅ Archive structure created"

# Step 4: Create v5.0 folder structure from spec
echo ""
echo "📂 Creating v5.0 folder structure..."

# Core directories
mkdir -p src/data
mkdir -p src/onboarding
mkdir -p src/discovery
mkdir -p src/decoder
mkdir -p src/profile
mkdir -p src/core

# Calibration tool
mkdir -p calibration
mkdir -p calibration/elicitation-responses

# Scripts
mkdir -p scripts

# Docs
mkdir -p docs

echo "✅ Folder structure created"

# Step 5: Copy essential reference files
echo ""
echo "📋 Copying essential reference files..."

# Copy elicitation prompts
if [ -f "$V35_DIR/2026-0315-AITuner-Model-Elicitation-Prompts.md" ]; then
    cp "$V35_DIR/2026-0315-AITuner-Model-Elicitation-Prompts.md" calibration/elicitation-prompts.md
    echo "   ✅ Copied elicitation prompts"
fi

# Copy v6-engine reference (for understanding, not using)
if [ -f "$V35_DIR/v3.5/js/core/v6-engine.js" ]; then
    mkdir -p docs/reference/v3.5-engine
    cp "$V35_DIR/v3.5/js/core/v6-engine.js" docs/reference/v3.5-engine/
    echo "   ✅ Copied v3.5 engine reference"
fi

# Copy radar.js reference
if [ -f "$V35_DIR/v3.5/js/radar.js" ]; then
    cp "$V35_DIR/v3.5/js/radar.js" docs/reference/v3.5-engine/
    echo "   ✅ Copied radar.js reference"
fi

# Copy lever definitions reference
if [ -f "$V35_DIR/v3.5/js/data/v6-levers.js" ]; then
    cp "$V35_DIR/v3.5/js/data/v6-levers.js" docs/reference/v3.5-engine/
    echo "   ✅ Copied v6-levers.js reference"
fi

# Copy existing spec files (they're already here, but ensure they're tracked)
if [ -f "$V5_DIR/AITuner-v5-levers.js" ]; then
    echo "   ✅ Found AITuner-v5-levers.js"
fi

echo "✅ Reference files copied"

# Step 6: Summary
echo ""
echo "✅ Setup Complete!"
echo ""
echo "📊 Summary:"
echo "   • Git repository initialized with v3.5 history"
echo "   • All branches preserved as archive/*"
echo "   • Folder structure created"
echo "   • Reference files copied"
echo ""
echo "📁 Next Steps:"
echo "   1. Review docs/CONTEXT-BRIDGE.md"
echo "   2. Start implementing from AITuner-v5-FINAL-Cursor-Spec.md"
echo "   3. Create new v6-engine.js in src/core/"
echo ""
echo "🔗 Access v3.5:"
echo "   • Original folder: $V35_DIR"
echo "   • Git remote: git remote show v3.5-source"
echo "   • Branches: git branch | grep archive"
echo ""
