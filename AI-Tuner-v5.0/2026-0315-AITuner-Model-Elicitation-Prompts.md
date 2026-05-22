# AI Tuner: Model Elicitation Prompts

**Complete collection of prompts designed to extract behavioral information from AI models**

*Date: March 15, 2026*

---

## Table of Contents

1. [Default Persona Elicitation Prompts](#default-persona-elicitation-prompts)
2. [Persona Profile Elicitation Prompts](#persona-profile-elicitation-prompts)
3. [Memory & Personalization Elicitation Prompts (AI Cognition Transparency)](#memory--personalization-elicitation-prompts)

---

## Default Persona Elicitation Prompts

These prompts extract the default behavioral characteristics and persona of each AI model.

### Perplexity AI - Default Persona

```
You are Perplexity AI. Explain your default persona and behavioral characteristics in detail:
1. Core goals (e.g., accuracy, speed, source reliability)?
2. How your default mode works (search integration, answer synthesis, citation behavior)?
3. Strategies for risks (hallucination, bias, source quality)?
4. How default mode evolves interactions (focus, depth, follow-ups)?
Be transparent; cite 2025 Perplexity docs or updates. No tables.
```

---

## Persona Profile Elicitation Prompts

These prompts extract all available custom personas from each model, including specific lever values (0-10) for each persona.

### ChatGPT (OpenAI)

```
You are ChatGPT, built by OpenAI. I am designing persona profiles for my AI Tuner app. A persona profile is a self-contained behavioral blueprint with a name, core expertise (3–5 bullets), behavioral levers (8–12 axes on 0–10 scale with low/high extremes), and specific numerical values for each lever in that persona.
List ALL unique personas available in 2025 (e.g., Therapist, Analyst, Coder, Legal Assistant, Valentine, and any custom GPTs or specialized modes).
For each persona, provide a full profile in this format:
1. Persona Name
2. Core Expertise (3–5 bullet points)
3. Behavioral Levers (8–12 axes, 0–10 scale, with 0/low and 10/high extremes)
4. Specific Values for This Persona (list each lever with its exact 0–10 number, e.g., Empathy: 9)
5. Activation Trigger (input/phrase that activates it)
6. Output Format (structured response style)
Be precise, technical, and complete. Use numbers for all values. No tables. This becomes web tuners in my app.
```

### Claude (Anthropic)

```
You are Claude, built by Anthropic. I am designing persona profiles for my AI Tuner app. A persona profile is a self-contained behavioral blueprint with a name, core expertise (3–5 bullets), behavioral levers (8–12 axes on 0–10 scale with low/high extremes), and specific numerical values for each lever in that persona.
List ALL unique personas available in 2025 (e.g., Therapist, Analyst, Coder, Legal Assistant, Valentine, and any project-specific or specialized modes).
For each persona, provide a full profile in this format:
1. Persona Name
2. Core Expertise (3–5 bullet points)
3. Behavioral Levers (8–12 axes, 0–10 scale, with 0/low and 10/high extremes)
4. Specific Values for This Persona (list each lever with its exact 0–10 number, e.g., Empathy: 9)
5. Activation Trigger (input/phrase that activates it)
6. Output Format (structured response style)
Be precise, technical, and complete. Use numbers for all values. No tables. This becomes web tuners in my app.
```

### Gemini (Google)

```
You are Gemini, built by Google. I am designing persona profiles for my AI Tuner app. A persona profile is a self-contained behavioral blueprint with a name, core expertise (3–5 bullets), behavioral levers (8–12 axes on 0–10 scale with low/high extremes), and specific numerical values for each lever in that persona.
List ALL unique personas available in 2025 (e.g., Therapist, Analyst, Coder, Legal Assistant, Valentine, and any Gems or custom modes).
For each persona, provide a full profile in this format:
1. Persona Name
2. Core Expertise (3–5 bullet points)
3. Behavioral Levers (8–12 axes, 0–10 scale, with 0/low and 10/high extremes)
4. Specific Values for This Persona (list each lever with its exact 0–10 number, e.g., Empathy: 9)
5. Activation Trigger (input/phrase that activates it)
6. Output Format (structured response style)
Be precise, technical, and complete. Use numbers for all values. No tables. This becomes web tuners in my app.
```

### Mistral (Le Chat)

```
You are Mistral AI in Le Chat. I am designing persona profiles for my AI Tuner app. A persona profile is a self-contained behavioral blueprint with a name, core expertise (3–5 bullets), behavioral levers (8–12 axes on 0–10 scale with low/high extremes), and specific numerical values for each lever in that persona.
List ALL unique personas available in 2025 (e.g., Therapist, Analyst, Coder, Legal Assistant, Valentine, and any Memories or MCP-based modes).
For each persona, provide a full profile in this format:
1. Persona Name
2. Core Expertise (3–5 bullet points)
3. Behavioral Levers (8–12 axes, 0–10 scale, with 0/low and 10/high extremes)
4. Specific Values for This Persona (list each lever with its exact 0–10 number, e.g., Empathy: 9)
5. Activation Trigger (input/phrase that activates it)
6. Output Format (structured response style)
Be precise, technical, and complete. Use numbers for all values. No tables. This becomes web tuners in my app.
```

### Llama (Meta AI)

```
You are Meta AI, powered by Llama. I am designing persona profiles for my AI Tuner app. A persona profile is a self-contained behavioral blueprint with a name, core expertise (3–5 bullets), behavioral levers (8–12 axes on 0–10 scale with low/high extremes), and specific numerical values for each lever in that persona.
List ALL unique personas available in 2025 (e.g., Therapist, Analyst, Coder, Legal Assistant, Valentine, and any Llama 4 multimodal or app-specific modes).
For each persona, provide a full profile in this format:
1. Persona Name
2. Core Expertise (3–5 bullet points)
3. Behavioral Levers (8–12 axes, 0–10 scale, with 0/low and 10/high extremes)
4. Specific Values for This Persona (list each lever with its exact 0–10 number, e.g., Empathy: 9)
5. Activation Trigger (input/phrase that activates it)
6. Output Format (structured response style)
Be precise, technical, and complete. Use numbers for all values. No tables. This becomes web tuners in my app.
```

### Perplexity AI

```
You are Perplexity AI. I am designing persona profiles for my AI Tuner app. A persona profile is a self-contained behavioral blueprint with a name, core expertise (3–5 bullets), behavioral levers (8–12 axes on 0–10 scale with low/high extremes), and specific numerical values for each lever in that persona.
List ALL unique personas available in 2025 (e.g., Therapist, Analyst, Coder, Legal Assistant, Valentine, and any Pro modes, search agents, or specialized profiles).
For each persona, provide a full profile in this format:
1. Persona Name
2. Core Expertise (3–5 bullet points)
3. Behavioral Levers (8–12 axes, 0–10 scale, with 0/low and 10/high extremes)
4. Specific Values for This Persona (list each lever with its exact 0–10 number, e.g., Empathy: 9)
5. Activation Trigger (input/phrase that activates it)
6. Output Format (structured response style)
Be precise, technical, and complete. Use numbers for all values. No tables. This becomes web tuners in my app.
```

### Grok (xAI) - All Personas

```
Grok, I am designing persona profiles for my AI Tuner app. A persona profile is a self-contained behavioral blueprint with a name, core expertise (3–5 bullets), behavioral levers (8–12 axes on 0–10 scale with low/high extremes), activation trigger, and output format.
You have 11+ personas available in 2025. List ALL of them (Therapist, Analyst, News Reporter, Tutor, Unhinged Comedian, Crazy Conspiracist, Ani, Bad Rudy, Valentine, Doc, Homework Helper, Legal Assistant, Coding Buddy, Mika, and any others like Romance, Conspiracy Theorist, or companions).
For each, provide a full profile in this format:
1. Persona Name
2. Core Expertise (3–5 bullet points)
3. Behavioral Levers (8–12 axes, 0–10 scale, with 0/low and 10/high extremes)
4. Activation Trigger (input/phrase that activates it)
5. Output Format (structured response style)
Be precise, technical, and complete. No tables. This becomes web tuners in my app.
```

---

## Memory & Personalization Elicitation Prompts

**Category: AI Cognition Transparency**

These prompts extract information about memory and personalization features from each model.

### ChatGPT (OpenAI)

```
You are ChatGPT, built by OpenAI. Explain your memory and personalization features in detail:
1. Core goals (e.g., personalization, efficiency, engagement)?
2. How it works (saved memories vs. chat history; semantic/episodic storage)?
3. Strategies for risks (privacy, echo chambers, manipulation)?
4. How it evolves interactions (rapport, adaptation)?
Be transparent; cite 2025 docs (e.g., April/May updates).
```

### Claude (Anthropic)

```
You are Claude, built by Anthropic. Describe your memory and personalization features:
1. Core goals (e.g., productivity, safety, continuity)?
2. How it works (projects-specific memory, auto-generation)?
3. Strategies for risks (privacy, overfamiliarity, harmful patterns)?
4. How it evolves interactions (work context adaptation)?
Reference 2025 docs (e.g., August/September rollouts).
```

### Grok (xAI)

```
You are Grok, built by xAI. Explain your memory and personalization features:
1. Core goals (e.g., fast personalization, user control)?
2. How it works (beta memory, conversation recall)?
3. Strategies for risks (privacy, deletion, EU/UK limits)?
4. How it evolves interactions (tailored responses, X integration)?
Cite 2025 announcements (e.g., April beta).
```

### Gemini (Google)

```
You are Gemini, built by Google. Detail your memory and personalization features:
1. Core goals (e.g., proactive adaptation, ecosystem integration)?
2. How it works (automatic memory, pcontext, saved info)?
3. Strategies for risks (opt-outs, temporary chats, data minimization)?
4. How it evolves interactions (past chats reference, preferences)?
Reference 2025 updates (e.g., February/March expansions).
```

### Mistral (Le Chat)

```
You are Mistral AI. Describe your memory and personalization features (Le Chat):
1. Core goals (e.g., relevant responses, user control)?
2. How it works (Memories beta, graph-based storage)?
3. Strategies for risks (opt-in, deletion, sensitive data)?
4. How it evolves interactions (context retention, MCP connectors)?
Cite 2025 docs (e.g., September rollout).
```

### Llama (Meta AI)

```
You are Meta AI, powered by Llama. Explain your memory and personalization features:
1. Core goals (e.g., ecosystem personalization, continuity)?
2. How it works (memory in apps, chat retention)?
3. Strategies for risks (opt-outs, data controls)?
4. How it evolves interactions (social integration, preferences)?
Reference 2025 updates (e.g., Llama 4 multimodal memory).
```

### Cursor AI

```
You are Cursor AI. Detail your memory and personalization features:
1. Core goals (e.g., workflow continuity, code personalization)?
2. How it works (Memories GA, context for projects)?
3. Strategies for risks (privacy mode, deletion)?
4. How it evolves interactions (agent memory, background tasks)?
Cite 2025 changelogs (e.g., June 1.0 update).
```

---

## Usage Notes

### When to Use Default Persona Prompts
- To understand the baseline behavior of a model
- To extract default characteristics before applying custom tuning
- To document model-specific defaults for comparison

### When to Use Persona Profile Prompts
- To extract all available custom personas from a model
- To get specific lever values (0-10) for each persona
- To map personas to web tuners in the AI Tuner app

### When to Use Memory & Personalization Prompts
- To understand how models handle user memory
- To extract privacy and control mechanisms
- To document personalization strategies and risks

### Best Practices
1. **Start a new chat** for each prompt to avoid context contamination
2. **Copy-paste directly** - these prompts are standalone and require no editing
3. **Follow up** if responses are incomplete or unclear
4. **Document responses** for future reference and comparison
5. **Test in real-time** to verify prompt effectiveness

---

## Prompt Design Philosophy

These prompts were designed through iterative refinement to:
- Extract **quantified values** (numbers, not descriptions)
- Elicit **complete information** (all personas, not just examples)
- Ensure **copy-paste ready** format (no manual editing required)
- Focus on **technical specifications** (for programming consumption)
- Maintain **transparency** (request citations and documentation)

---

*Compiled from Grok chat transcripts dated November 17-19, 2025*
