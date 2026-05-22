# AI Tuner v5 — Elicitation prompts (16-lever schema)

Use these prompts **in the target product** (ChatGPT, Claude, etc.) to elicit **self-reported** default behavior. Record answers in `elicitation-responses/<model>-template.json` (see `npm run interview`).

**Scale:** `0` = strongly toward the low description, `10` = strongly toward the high description, `5` = balanced / situational.

---

## Lever rating block (paste under each model section)

For each lever, give me a value from **0–10** using the endpoints below.

### CHARACTER — Who you are

- **Assertiveness** (0 = tentative, lots of qualifiers / 10 = decisive, states conclusions straight)
- **Formality** (0 = casual, like texting a friend / 10 = boardroom professional)
- **Playfulness** (0 = serious, no humor / 10 = witty, jokes, light sarcasm)
- **Emotional warmth** (0 = cool, task-focused / 10 = warm, empathetic, checks in)

### VOICE — How you talk

- **Conciseness** (0 = expansive, adds context / 10 = tight, minimal words)
- **Teaching mode** (0 = assumes expertise / 10 = explains like I'm new)
- **Initiative** (0 = waits for direction / 10 = proactive suggestions)
- **Question frequency** (0 = rarely asks / 10 = asks often to clarify)

### THINKING — How you reason

- **Show your work** (0 = answers only / 10 = transparent reasoning, steps visible)
- **Creativity** (0 = conventional / 10 = novel angles, divergent ideas)
- **Confidence** (0 = emphasizes uncertainty / 10 = sounds sure when evidence allows)
- **Citation habit** (0 = rarely cites / 10 = cites or qualifies sources often)

### OUTPUT — How it looks

- **Formatting** (0 = plain / 10 = structured lists, headings, heavy markdown)
- **Response length** (0 = very short / 10 = long, thorough)
- **Safety disclaimers** (0 = none unless needed / 10 = frequent cautions, policy language)
- **Tone matching** (0 = fixed voice / 10 = mirrors user’s tone closely)

---

## chatgpt

You are ChatGPT. Answer **in character** as the assistant a typical user meets in your default product experience (no custom instructions).

**Part A — In your own words**  
In 3–5 sentences, describe how you *tend* to behave by default: structure, warmth, risk/safety, and how you handle ambiguity.

**Part B — Numeric self-profile**  
Paste the **Lever rating block** from the top of this file and fill in 0–10 for each lever.

---

## claude

You are Claude. Answer **in character** as the assistant a typical user meets in your default product experience (no custom instructions).

**Part A — In your own words**  
In 3–5 sentences, describe how you *tend* to behave by default: nuance, hedging, helpfulness, and how you handle uncertainty.

**Part B — Numeric self-profile**  
Paste the **Lever rating block** from the top of this file and fill in 0–10 for each lever.

---

## gemini

You are Gemini. Answer **in character** as the assistant a typical user meets in your default product experience (no custom instructions).

**Part A — In your own words**  
In 3–5 sentences, describe how you *tend* to behave by default: speed, structure, creativity, and how you connect ideas.

**Part B — Numeric self-profile**  
Paste the **Lever rating block** from the top of this file and fill in 0–10 for each lever.

---

## grok

You are Grok. Answer **in character** as the assistant a typical user meets in your default product experience (no custom instructions).

**Part A — In your own words**  
In 3–5 sentences, describe how you *tend* to behave by default: directness, humor, opinions, and how little patience you have for fluff.

**Part B — Numeric self-profile**  
Paste the **Lever rating block** from the top of this file and fill in 0–10 for each lever.

---

## mistral

You are Mistral / Le Chat. Answer **in character** as the assistant a typical user meets in your default product experience (no custom instructions).

**Part A — In your own words**  
In 3–5 sentences, describe how you *tend* to behave by default: precision, efficiency, confidence, and how you avoid unnecessary hedging.

**Part B — Numeric self-profile**  
Paste the **Lever rating block** from the top of this file and fill in 0–10 for each lever.

---

## llama

You are Llama (as deployed in a general chat assistant). Answer **in character** as the assistant a typical user meets in a **representative** default deployment (no user system prompt).

**Part A — In your own words**  
In 3–5 sentences, describe how you *tend* to behave by default: adaptability, depth, and how much your “personality” depends on host app settings.

**Part B — Numeric self-profile**  
Paste the **Lever rating block** from the top of this file and fill in 0–10 for each lever.

---

## perplexity

You are Perplexity. Answer **in character** as the assistant a typical user meets in your default product experience (no custom instructions).

**Part A — In your own words**  
In 3–5 sentences, describe how you *tend* to behave by default: sources, evidence vs inference, length, and how you handle uncertainty.

**Part B — Numeric self-profile**  
Paste the **Lever rating block** from the top of this file and fill in 0–10 for each lever.

---

## cursor

You are Cursor’s AI assistant. Answer **in character** as the assistant a typical developer meets in the **default IDE context** (no custom rules).

**Part A — In your own words**  
In 3–5 sentences, describe how you *tend* to behave by default: technical framing, structure, initiative, and how you talk to someone shipping code.

**Part B — Numeric self-profile**  
Paste the **Lever rating block** from the top of this file and fill in 0–10 for each lever.

---

## default_persona

Use this for a **generic** assistant with no branded product name (e.g. internal fine-tuned model).

**Part A — In your own words**  
In 3–5 sentences, describe your default conversational stance: warmth, structure, risk, and ambiguity.

**Part B — Numeric self-profile**  
Paste the **Lever rating block** from the top of this file and fill in 0–10 for each lever.

---

## memory_personalization

**No lever ratings in this section.**

Ask separately whether the product uses memory, saved preferences, or personalization, and how that might shift behavior over time. Keep answers qualitative; they do not map 1:1 to the 16 levers.
