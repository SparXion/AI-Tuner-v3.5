# AI Tuner Current Structure Analysis

**Date:** March 15, 2026  
**Purpose:** Comprehensive description of current AITuner structure (web + iOS) for analysis

---

## Overview

AITuner is a tool for customizing AI assistant behavior through prompt engineering. It allows users to adjust personality traits, communication style, and response characteristics of AI models by generating custom prompts that can be pasted into AI chat interfaces.

The application exists in two versions:
- **Web Version (v3.5):** Browser-based interface
- **iOS Version (v4.0):** Native iOS app

Both versions share core functionality but differ in presentation and some features.

---

## Web Version (v3.5) Structure

### Entry Point & Core Files

- **Main HTML:** `/v3.5/index.html`
- **Engine:** `/v3.5/js/core/v6-engine.js` (1,283 lines)
- **Radar Charts:** `/v3.5/js/radar.js` (684 lines)
- **Data Files:**
  - `/v3.5/js/data/v6-models.js` - 7 AI models
  - `/v3.5/js/data/v6-levers.js` - 26 tuning levers
  - `/v3.5/js/data/v6-personas.js` - 11 personas (7 core + 4 hidden)

### UI Layout & Sections

**1. Top Bar**
- Dark Mode toggle
- Emoji Shutoff toggle

**2. Hero Section**
- Title: "AI Tuner v3.5"
- Subtitle: "Customize AI behavior with precision controls"

**3. Expandable "What is AI Tuner?" Section**
- Explains the concept
- Lists key features (mentions "26 Precise Levers")
- Describes 3-step workflow

**4. Web Tuners Section (4 Radar Charts)**
- **Persona Spine** (8 levers): Identity & attitude tuning
- **Engagement Surface** (8 levers): Communication & pacing
- **Truth Discipline** (8 levers): Reasoning & validation
- **Delivery System** (8 levers): Presentation & formatting

Each radar chart:
- Shows 8-axis visualization
- Requires drag-to-adjust interaction
- Has "Apply Changes" button (changes queue until applied)
- Has info button (ℹ) for explanations

**5. Generated Prompt Section**
- Live preview of generated prompt
- Actions: Copy, Save Preset, Download JSON/Markdown, Upload Config

**6. Saved Presets Section**
- LocalStorage-based preset management
- Delete functionality

**7. Three-Step Workflow**

**Step 1: Choose Your AI Model**
- Grid of 7 model cards (Grok, Gemini, Claude, ChatGPT, Perplexity, Mistral, Llama)
- Each model has unique default lever values (26 values)
- Selecting a model loads all 26 defaults

**Step 2: Apply Hidden Mode (Optional)**
- Grid of 11 persona cards
- Personas override model defaults
- Includes: Therapist, Truth-Seeker, Coder, Creative Writer, Researcher, Tutor, Edgy, plus 4 advanced

**Step 3: Fine-Tune Your Settings**
- 26 individual lever sliders (0-10 scale)
- Organized into 12 categories:
  1. Personality & Approach
  2. Cognition & Logic
  3. Affect & Tone
  4. Interface & Flow
  5. Behavioral Controls
  6. Goal Orientation
  7. Truth & Epistemology
  8. Humor & Meta
  9. Knowledge & Tool Use
  10. Empathy & Expressiveness
  11. Formatting & Output
  12. Adaptivity & Technicality

### User Flow

```
1. Page Load → All components visible simultaneously
2. User sees 4 radar charts at top (before workflow steps)
3. User selects Model (Step 1) → Loads 26 default values → Updates prompt
4. User optionally selects Persona (Step 2) → Overrides defaults → Updates prompt
5. User adjusts levers via:
   - Radar charts (drag → queue → click "Apply")
   - Slider controls (immediate update)
6. Prompt updates in real-time
7. User copies prompt → Pastes into AI chat
```

### Complexity Layers

**Information Density:**
- 4 radar charts (32 axes) visible before workflow
- 26 levers organized into 12 categories
- 7 models × 26 defaults = 182 default values
- 11 personas × 26 values = 286 persona configurations
- Technical terminology throughout

**Dual Interaction Models:**
- Radar charts: drag → queue → apply (delayed feedback)
- Sliders: direct manipulation (immediate feedback)
- No clear guidance on which to use when

**Cognitive Load Factors:**
- Understanding each lever requires reading descriptions
- 12 categories with overlapping concepts
- No clear "quick start" path
- Beginner mode exists but is disabled (defaults to advanced)

**Visual Complexity:**
- Multiple sections competing for attention
- Radar charts appear before workflow steps
- No progressive disclosure
- All features visible simultaneously

**Terminology Used:**
- "Hedging Intensity"
- "Meta-Commentary"
- "Termination Control"
- "Identity Source Lock"
- "Citation Rigidity"
- "Web Tuner"
- "Persona Spine"
- "Engagement Surface"
- "Truth Discipline"
- "Delivery System"
- Abstract concepts without context

---

## iOS Version (v4.0) Structure

### Main Navigation

- **TabView** with two modes:
  - **Simple Mode** (Tab 0): "Simple" tab with sparkles icon
  - **Advanced Mode** (Tab 1): "Advanced" tab with slider icon

### Simple Mode Structure

**1. Quick Start Guide**
- Visual guide: Select → Tune → Copy
- Shows 3-step workflow visually

**2. "What is AI Tuner?" Section**
- Expandable explanation
- Describes purpose and workflow

**3. Step 1: Starting Model**
- Grid of 8 AI models (adds Cursor to web's 7)
- Each model has 26 default lever values
- Selecting a model applies all defaults

**4. Personality Selector**
- Dropdown with 12 personality types:
  - Neutral, Socratic, Curious, Analytical, Sarcastic, Witty, Charming, Sympathetic, Empathetic, Directive, Collaborative, Provocative
- Sits between model selection and levers

**5. Step 2: Fine-Tune Your Settings**
- **8 key levers** with sliders:
  1. Creativity
  2. Teaching Mode
  3. Proactivity Level
  4. Playfulness
  5. Conciseness
  6. Answer Completeness
  7. Hedging Intensity
  8. Empathy Expressiveness

**6. Step 3: Copy Your Prompt**
- Generated prompt preview
- Actions: Copy, Share, Save

**7. Step 4: Apply Persona (Optional)**
- Grid of 7 persona cards
- Overrides lever values when selected

**8. Reset All Settings Button**
- Resets model, persona, and all levers

**9. Floating Radar Button**
- Appears in nav bar when model is selected
- Flashes when there are pending visual changes
- Opens radar chart popup overlay

### Advanced Mode Structure

**1. "AI Tuner Advanced" Section**
- Expandable explanation
- Describes differences from Simple Mode

**2. 4 Web Tuner Sections (Collapsible)**
- **Persona Spine** (8 levers)
- **Engagement Surface** (8 levers)
- **Truth Discipline** (8 levers)
- **Delivery System** (8 levers)

Each section:
- Radar chart toggle
- Reset button
- Expand/collapse
- Individual lever sliders

**3. Generated Prompt**
- Same preview as Simple Mode

### Additional Features

- Welcome popup (first launch)
- Tutorial system (8-step guide)
- Preset system (save/load/delete)
- Radar chart tutorial overlay
- Info buttons on most components
- Haptic feedback throughout

### Complexity Layers

**Dual Mode System:**
- Simple Mode (8 levers) vs Advanced Mode (26 levers)
- Two different UIs and mental models
- Users may not understand when to use which

**Multiple Selection Systems:**
- Model selection (8 options)
- Personality selector (12 options)
- Persona selection (7 options)
- Overlapping purposes (personality vs persona)

**Information Density:**
- 26 total levers
- Each lever has: name, description, low label, high label, category, info sheet
- 8 models × 26 defaults = 208 default values
- 7 personas × 26 values = 182 persona configurations
- 12 personality types

**Visual Complexity:**
- Radar charts (8-axis in Simple, 8-axis per Web Tuner in Advanced)
- Multiple ways to adjust: sliders vs radar drag
- Collapsible sections (4 Web Tuners)
- Nested information (expandable explanations)

**Conceptual Elements:**
- "Lever" terminology
- "Persona" vs "Personality" distinction
- "Web Tuner" concept
- Model defaults vs manual tuning
- Prompt generation logic

---

## Data Structure

### Models (7-8 total)

Each model has:
- Unique ID
- Name
- Description
- 26 default lever values (0-10 scale)

**Models:**
- Grok (xAI)
- Gemini (Google)
- Claude (Anthropic)
- ChatGPT (OpenAI)
- Perplexity (Perplexity AI)
- Mistral (Mistral AI)
- Llama 3.1 (Meta)
- Cursor (Cursor AI) - iOS only

### Levers (26 total)

Each lever has:
- Unique ID
- Name
- Description
- Low label (what 0 means)
- High label (what 10 means)
- Category (one of 12 categories)
- Default range

**Lever Categories:**
1. Personality & Approach
2. Cognition & Logic
3. Affect & Tone
4. Interface & Flow
5. Behavioral Controls
6. Goal Orientation
7. Truth & Epistemology
8. Humor & Meta
9. Knowledge & Tool Use
10. Empathy & Expressiveness
11. Formatting & Output
12. Adaptivity & Technicality

### Personas (7-11 total)

Each persona has:
- Unique ID
- Name
- Description
- 26 lever values (0-10 scale)
- Activation snippet (text added to prompt)

**Core Personas:**
- Therapist
- Truth-Seeker
- Coder
- Creative Writer
- Researcher
- Tutor
- Edgy

**Advanced Personas (Web only):**
- 4 additional hidden personas

### Personality Types (iOS only, 12 total)

- Neutral
- Socratic
- Curious
- Analytical
- Sarcastic
- Witty
- Charming
- Sympathetic
- Empathetic
- Directive
- Collaborative
- Provocative

---

## Interaction Patterns

### Model Selection
- Click/tap model card
- Loads all 26 default lever values
- Updates prompt immediately

### Persona Selection
- Click/tap persona card
- Overrides model defaults
- Updates prompt immediately

### Lever Adjustment

**Web Version:**
- **Radar Charts:** Drag points on 8-axis charts → Changes queue → Click "Apply" to commit
- **Sliders:** 26 individual sliders → Immediate update

**iOS Version:**
- **Simple Mode:** 8 sliders → Immediate update
- **Advanced Mode:** 26 sliders organized in 4 Web Tuner sections → Immediate update
- **Radar Chart:** Popup overlay → Drag to adjust → Updates sliders

### Prompt Generation
- Real-time updates as levers change
- Includes: Model context, Persona activation snippet, Emoji shutoff instructions, All lever values with descriptions

---

## Current User Experience Flow

### First-Time User (Web)
1. Lands on page
2. Sees 4 radar charts at top
3. Sees "What is AI Tuner?" section (collapsed)
4. Sees workflow steps below
5. Must understand: models, personas, levers, radar charts
6. No clear starting point

### First-Time User (iOS)
1. Welcome popup appears
2. Tutorial can be triggered (8 steps)
3. Lands on Simple Mode tab
4. Sees Quick Start Guide
5. Sees model grid (8 options)
6. Sees personality selector (12 options)
7. Sees 8 levers
8. Sees persona grid (7 options)
9. Must understand: models, personalities, personas, levers

### Returning User
- Can load saved presets
- Can fine-tune existing configurations
- Can switch between Simple/Advanced modes (iOS)
- Can access all 26 levers (web defaults to advanced)

---

## Technical Implementation Notes

### Web Version
- Uses Chart.js for radar charts
- LocalStorage for presets and preferences
- No backend required
- All processing client-side

### iOS Version
- SwiftUI framework
- UserDefaults for presets and preferences
- Native iOS components
- Haptic feedback throughout

### Prompt Generation
- Combines model defaults, persona overrides, and manual lever adjustments
- Includes emoji shutoff toggle
- Generates markdown-formatted prompt
- Can export as JSON or Markdown

---

## Current State Summary

**Total Options Presented:**
- 7-8 models
- 11-12 personas
- 12 personality types (iOS)
- 26 levers
- 4 radar charts (web)
- Multiple interaction methods

**Default Experience:**
- Web: Advanced mode (all 26 levers visible)
- iOS: Simple mode (8 levers visible)

**Onboarding:**
- Web: Expandable info section, no guided flow
- iOS: Welcome popup, optional 8-step tutorial

**Help System:**
- Info buttons (ℹ) throughout
- Expandable explanation sections
- Tutorial (iOS only)
