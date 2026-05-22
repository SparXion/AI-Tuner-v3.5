# AI Tuner: Full Context for Claude

**Purpose:** Give Claude complete context on what AI Tuner is, how it works, and how it relates to persona extraction (e.g. the "Trusted Integration Partner" config). Use this when you need Claude to understand the product, not just the extraction we stored.

---

## 1. What AI Tuner Is

**AI Tuner** is a **visual AI personality configuration tool**. It removes the guesswork from how a chatbot is “wired.”

- **Core idea:** No more guessing why an AI answers the way it does. No more fighting hidden defaults. With one click you see how the AI is configured—and with one drag you change it.
- **Output:** A **text prompt** (instructions) that you copy into your AI assistant (or apply via extension). The AI then behaves according to that prompt.
- **Free:** Web app + Cursor extension; no API keys needed for tuning.

**Tagline (from the app):** *"AI Tuner removes the mystery from every chatbot."*

---

## 2. Platforms

| Platform | What it does |
|----------|----------------|
| **Web** | Visit in browser → pick model/persona, tune levers → see prompt update in real time → copy prompt → paste into ChatGPT, Claude, etc. |
| **Cursor extension** | Same tuning inside Cursor; "Apply to Cursor" sends the generated prompt into Cursor’s AI context so the editor uses that personality. |
| **iOS app** | Native app (AI Tuner v4): model grid, persona grid, radar chart, sliders. Same concepts—pick AI, see “inside its mind,” tune it. |

All share the same **tuning model**: **models**, **personas**, and **levers**.

---

## 3. Core Concepts

### 3.1 Models

**Models** are the underlying AIs: Claude, GPT, Gemini, Grok, Perplexity, Mistral, Llama, etc.

- Each model has **default lever values** (e.g. Grok: structural density high, truth-seeking bias; Claude: more hedging, supportive).
- Selecting a model adds **model context** to the generated prompt (e.g. *"You are Claude (Anthropic). Supportive teacher; over-elaborative."*).
- **Model templates** reset that model to known defaults before you tune.

### 3.2 Personas

**Personas** are **pre-built configurations** that fix both:

1. **An activation snippet** — Short instructional text (e.g. *"Enter Therapist Mode: You are a compassionate, non-judgmental listener…"*).
2. **Lever presets** — A full set of lever values (0–10) that implement that persona.

When you **select a persona**, the app:

- Applies those lever values to the radar/sliders.
- Adds the persona’s **activation snippet** to the prompt.

**Examples (v6):** Therapist, Truth-Seeker, Coder/Engineer, Researcher, Friend, Scam Hunter, etc. There are also “hidden” / power-user personas. Each has a **name**, **description**, **best models**, **activationSnippet**, and **levers** (object mapping lever keys to 0–10).

### 3.3 Levers

**Levers** are **26 universal tuning axes**. Each has:

- **Name** (e.g. Hedging Intensity, Empathy Expressiveness, Conciseness).
- **Low** / **High** labels (e.g. "Direct – No hedging" vs "Qualify everything").
- **Category** (Truth & Epistemology, Empathy & Expressiveness, Formatting & Output, etc.).

**Scale:** 0–10. The engine turns these into **Tuning Parameters** text in the prompt (e.g. *"Hedging Intensity: Direct – No hedging (2/10)"*).

**Modes:**

- **Simple / Beginner:** A smaller set of high-impact levers (e.g. hedging, empathy, formality, conciseness, playfulness, teaching mode, etc.).
- **Advanced:** All 26 levers, often represented on a **radar chart**. You drag axes to change values; the chart and prompt update live.

### 3.4 Radar Chart

The **radar** is a visual representation of the current lever profile. Each axis = one lever. Shape changes as you tune. It “shows inside the AI’s mind”—you see personality at a glance.

---

## 4. How the Prompt Is Built

The engine generates a single **prompt** by concatenating:

1. **Model context** (if a model is selected): *"You are [Model]. [Description]."*
2. **Persona activation snippet** (if a persona is selected): The persona’s instructional blurb.
3. **Optional “emoji shutoff” block:** Eliminate emojis, filler, hype; be direct and factual.
4. **Tuning Parameters:** For each lever, a line like *"- [Lever name]: [Low/Mid/High instruction] (value/10)"*.

You **copy** this prompt (or **apply** it in Cursor) and paste it into the chat (or system context). The AI then follows those instructions.

---

## 5. Typical Flows

### 5.1 New users

1. Pick an AI (e.g. Claude, Grok).
2. Tap a **persona** (Therapist, Coder, Friend, …).  
   → Levers jump to that persona’s defaults; the activation snippet is added to the prompt.
3. Copy (or apply) the prompt.

### 5.2 Power users

1. Pick model + optional persona.
2. **Drag radar axes** (or move sliders) to override any lever.
3. Watch the prompt update in real time.
4. Copy / apply.

### 5.3 Custom reuse

- **Save as preset:** Store current model + persona + lever state.
- **Download:** JSON or Markdown of the generated prompt.
- **Upload:** Load a saved config and continue tuning.

---

## 6. Where the “Trusted Integration Partner” Extraction Fits

John had a long-running Claude chat where you both developed a **custom persona**: "Trusted Integration Partner" — peer-level thinking partner, attachment/Gottman context, evidence-based reality checking, Elisha dating situation, etc.

- We **extracted** that persona (your structured JSON + additional questions + gaps + format variations) and stored it, **unchanged**, in `persona-extraction.md`.
- **AI Tuner** does not yet implement that persona. The extraction is **raw material** for possible next steps, e.g.:
  - Define an **activation snippet** and **lever presets** so "Trusted Integration Partner" becomes a **persona** in AI Tuner (web, extension, or iOS).
  - Use the **constraints**, **response framework**, and **format preferences** to refine lever definitions or add new ones.
  - Answer the **additional questions** in the extraction, then map those answers into persona + lever form.

So: **AI Tuner** = the product. **Persona extraction** = a specific, saved configuration that could eventually be turned into an AI Tuner persona (or otherwise used to tune AI behavior).

---

## 7. Summary Table

| Concept | Role |
|--------|------|
| **Model** | Which AI (Claude, Grok, …); adds base context + default levers. |
| **Persona** | Pre-built “mode” = activation snippet + lever presets; one-tap apply. |
| **Levers** | 26 axes (0–10) that fine-tune behavior; feed into “Tuning Parameters” in the prompt. |
| **Radar** | Visual map of current lever profile; drag to tune. |
| **Prompt** | Final text: model + persona snippet + optional emoji rules + lever list. User copies/applies it. |

---

## 8. Domain Model

A **comprehensive domain model** (entities, attributes, relationships, behaviors, platform mapping) lives in **`AI-TUNER-DOMAIN-MODEL.md`**. Use it when designing features, integrating external configs (e.g. extracted personas), or aligning web/iOS/Cursor implementation. It defines **Lever**, **Model**, **Persona**, **Tuner**, **Config**, **GeneratedPrompt**, **Preset**, and **TuningSession** as the core concepts.

---

## 9. How to Use This With Claude

When you want Claude to understand **AI Tuner** (e.g. before discussing how to implement the extracted persona):

1. **Paste this document** (or the sections you need) into the chat.
2. **For design or integration:** Also paste **`AI-TUNER-DOMAIN-MODEL.md`** so Claude has the entity/relationship map.
3. **Optionally add:** *"The extraction we stored is in `persona-extraction.md`. We're thinking about turning it into an AI Tuner persona or using it to refine tuning."*

That gives Claude full product context, the domain model when needed, and the link to the extraction work.
