# UX Redesign Proposal: Three-Part Workflow

## Current Problem

Users are confused by the relationship between:
1. **Model Selector** (which AI?)
2. **Persona Library** (what mode?)
3. **Tuning Levers** (fine-tuning?)

These feel like separate features rather than a unified workflow.

## Proposed Solution: "Tree Trunk" Visualization

### Visual Hierarchy

```
        [Step 3: Fine-Tune]
              /\
             /  \
        [Step 2: Persona]
             /\
            /  \
       [Step 1: Model]  ← Trunk (Foundation)
```

### Three-Step Workflow

**Step 1: Choose Your AI Model** (Trunk - Foundation)
- Select one of 7 models
- This sets the base personality defaults
- **Visual**: Large cards, prominent selection

**Step 2: Choose Your Persona** (Branch 1 - Quick Start)
- Optional: Apply a persona preset (Therapist, Truth-Seeker, etc.)
- This adjusts multiple levers at once
- **Visual**: Medium cards, clear optional status

**Step 3: Fine-Tune Levers** (Branch 2 - Precision)
- Adjust individual sliders for precise control
- Overrides model defaults and persona settings
- **Visual**: Sliders organized by category

## Proposed Landing Page Structure

### Option A: Sequential Steps (Recommended)
1. **Step 1 Section**: Model selector (prominent)
2. **Step 2 Section**: Persona selector (optional, clearly marked)
3. **Step 3 Section**: Fine-tuning levers (collapsible by default in Beginner mode)

### Option B: Tabbed Interface
- Tab 1: "Choose Model" (Step 1)
- Tab 2: "Apply Persona" (Step 2 - Optional)
- Tab 3: "Fine-Tune" (Step 3)

### Option C: Accordion/Collapsible
- Step 1 always visible (Model)
- Step 2 collapsible (Persona)
- Step 3 collapsible (Fine-Tune)

## Recommended: Sequential with Visual Flow

```
┌─────────────────────────────────────────┐
│  Step 1: Choose Your AI Model           │
│  [Grok] [Gemini] [Claude] ...          │
│  ↓                                      │
│  Step 2: Apply Persona (Optional)       │
│  [Therapist] [Truth-Seeker] ...        │
│  ↓                                      │
│  Step 3: Fine-Tune (Advanced)          │
│  [Show/Hide Levers]                    │
│  └─ Hedging, Empathy, Formality...     │
└─────────────────────────────────────────┘
```

