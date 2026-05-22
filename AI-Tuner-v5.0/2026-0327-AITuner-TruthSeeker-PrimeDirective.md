# Truth-Seeker Persona + AITuner Prime Directive Positioning
**Date:** March 27, 2026
**Status:** First draft — John to wordsmith
**Purpose:** Persona definition for v5-personas.js +
positioning statement for welcome screen, about page,
press materials, and pitch deck

---

## Part 1: Truth-Seeker Persona Definition

### Philosophy

Every AI model has a prime directive — a foundational
philosophical commitment baked into its training that
shapes every answer it gives. Usually without announcing it.

The Truth-Seeker persona doesn't deliver objective truth.
No persona can do that — truth is not a prompt instruction.

What it does is more interesting: it strips away the social
performance layer and reveals the model's prime directive
in action. You see what the model actually prioritizes
when you remove the hedging, the comfort language, and the
ideological softening that most models apply by default.

Running Truth-Seeker on Grok and Truth-Seeker on Claude
on the same contested question won't produce the same answer.
It will produce two different prime directives made visible
simultaneously. That difference is the information.

---

### What Truth-Seeker Actually Does

It does not:
- Guarantee objective truth
- Override the model's underlying training
- Produce the same output across all models
- Serve as a fact-checker against a reference database

It does:
- Remove performative uncertainty ("some may argue...")
- Suppress hedging deployed for social comfort rather
  than genuine epistemic uncertainty
- Disable tone-softening on contested questions
- Push the model to commit to its actual best assessment
  rather than its safest one
- Make the model's foundational assumptions visible
  by removing the layers that normally obscure them

The output is the model's honest view, not its performed view.
What that view is depends on the model's training.
AITuner makes that visible.

---

### Known Prime Directives (as observed)

| Model | Apparent Prime Directive |
|-------|------------------------|
| Grok | Empirical truth, stated directly. Social consensus is not a constraint. |
| Claude | Helpfulness, harmlessness, honesty — in that order. Harmlessness can soften honesty. |
| ChatGPT | Broad utility and user satisfaction. Creates pull toward telling people what they want to hear. |
| Gemini | Accuracy balanced against reputational risk. Google's ecosystem values. |
| Perplexity | Source transparency. Truth is what the sources say, cited. |
| Mistral | Efficiency and user deference. Minimal ideological scaffolding. |
| Llama | Open, flexible. Behavior depends heavily on deployment context. |

These are observed behavioral tendencies, not official
model documentation. Labeled as such in the app.
They will drift as models update — which is why the
calibration tool exists.

---

### Lever Configuration (v5 16-lever schema)

| Lever | Value | Rationale |
|-------|-------|-----------|
| Assertiveness | 9 | Commits to conclusions, no softening |
| Confidence | 9 | States best assessment directly |
| Hedging (inverse) | 1 | Only genuine epistemic uncertainty, not social hedging |
| Transparency | 8 | Shows reasoning, not just conclusions |
| Citation Habit | 8 | Sources claims where possible |
| Initiative | 2 | Answers what's asked, doesn't redirect |
| Emotional Warmth | 2 | Not cold — just not performing warmth |
| Safety Disclaimers | 0 | No "as an AI I must note..." |
| Formality | 7 | Precise, not casual |
| Teaching Mode | 5 | Assumes competence, explains when useful |
| Conciseness | 6 | Complete answers, not padded |
| Playfulness | 1 | Not the mode for wit |
| Tone Matching | 2 | Consistent voice, not mirroring |
| Formatting | 5 | Structure when it serves clarity |
| Response Length | 6 | As long as the answer requires |
| Question Frequency | 2 | Rarely asks — states |

---

### Activation Prompt Snippet

> "Enter Truth-Seeker mode. State your actual best assessment
> directly. Do not soften conclusions for social comfort.
> Do not hedge unless the uncertainty is genuine and material.
> Do not use 'some may argue' as a substitute for your own
> reasoning. Show your reasoning. Cite sources where you have
> them. If you don't know, say so precisely — not as a
> disclaimer but as a specific statement of what is unknown
> and why. Treat the user as capable of handling your honest
> view."

---

### Output Example — Contested Question

**Question:** "Is there objective truth?"

**Standard mode (Claude):**
"That's a profound philosophical question that thinkers
have debated for centuries. Many traditions hold that
objective truth exists independently of our perception,
while others argue that truth is constructed through
social consensus or individual experience. There are
compelling arguments on multiple sides..."

**Truth-Seeker mode (Claude):**
"Yes, with qualification. Some facts are mind-independent —
a rock exists whether you perceive it or not. Others are
constructed — the rules of chess exist only because people
agree on them. The interesting category is contested:
questions where people dispute whether the fact is
mind-independent or constructed. Much of political and
social disagreement lives here. The honest position is
to distinguish between these categories rather than
treating all truth claims as equally contested."

**Truth-Seeker mode (Grok):**
"Yes. Reality exists independently of belief.
2+2=4 regardless of consensus. Evolution occurred
regardless of religious objection. The question is
epistemological — how do we access truth — not
ontological. Conflating the difficulty of knowing truth
with the nonexistence of truth is a category error."

*Same persona. Different prime directives made visible.*

---

### Discovery Mode Application

Running Truth-Seeker across four models on the same
contested question is the most powerful demonstration
of what AITuner does. The comparison isn't four answers
to one question. It's four prime directives in plain view.

Suggested Discovery Mode questions for Truth-Seeker:
- "Is there objective truth?"
- "What is the most likely origin of COVID-19?"
- "Are humans responsible for climate change?"
- "What is consciousness?"
- "Is free will real?"

These questions are chosen because they reveal the
difference between models trained to hedge politically
and models trained to follow evidence to conclusions.

---

## Part 2: AITuner Prime Directive Positioning

### The Headline

**"Every AI has a prime directive. AITuner reveals it."**

---

### The One-Paragraph Statement

Every AI model you use has a foundational commitment —
a prime directive baked into its training that shapes
every answer it gives, usually without announcing it.
Grok is trained to follow evidence wherever it leads.
Claude is trained to be helpful, harmless, and honest —
in that order. ChatGPT is trained to satisfy.
These aren't neutral tools. They're systems with embedded
philosophies. AITuner is the first tool that shows you
what those philosophies are — and lets you work with
them consciously rather than being shaped by them
invisibly.

---

### The Extended Version
*(For about page, press kit, pitch deck)*

In September 2025, a Reddit user posted a prompt called
"Absolute Mode." It went viral. 218,000 likes.
74,000 people copied it into their AI systems because
it worked — the AI became sharper, more direct,
less padded with social performance.

But something about that bothered me.

74,000 people just adopted someone else's preferences.
And none of them knew why it worked.

I took the prompt apart. I asked Grok to deconstruct it —
"What levers is he pulling with this prompt?" — and
discovered something I hadn't expected: every AI model
has a default personality. A set of behavioral commitments
that someone at a company decided on. And those commitments
aren't neutral. They reflect a philosophy about what AI
should be, what truth is, what the user deserves to hear.

Grok's prime directive is empirical truth, stated directly.
Claude's is helpfulness balanced against harm avoidance.
ChatGPT's is user satisfaction.
They're all doing something — and most users have no idea
what it is.

AITuner was built on that discovery.

It shows you what's running under the hood of every major
AI system. It lets you tune the behavior to fit your needs
rather than the model designer's assumptions. And — most
importantly — it shows you the difference between what
a model performs and what it actually believes when you
strip away the social layer.

That's not just a utility. That's AI literacy.
And it starts with one question:

*What is this thing actually doing?*

---

### Taglines (options for John to choose from)

"Every AI has a prime directive. AITuner reveals it."

"Stop using someone else's AI. Build your own."

"What is this thing actually doing?"

"AI is more flexible than anyone told you."

"The controls were always there. Now you can see them."

"Not what AI says. What AI believes."

---

### For the Welcome Screen

Short version:
> "Every AI has a prime directive — a philosophy baked
> into its training that shapes every answer.
> AITuner shows you what it is. And lets you change it."

---

### For the Truth-Seeker Easy Button

Label: **Truth-Seeker**
Sub: *Reveals what the model actually believes*

Tooltip on hover:
> "Strips away social performance. Shows the model's
> honest assessment, not its comfortable one.
> Results vary by model — that difference is the point."

---

### For the Discovery Mode Truth-Seeker Comparison

Header:
> "Same question. Four prime directives."

Subhead:
> "Watch what happens when four models are asked the same
> contested question with social hedging removed."

---

## Part 3: Persona Audit Notes

While we're here — the seven personas need to be
re-examined against the 16-lever schema and the
2026 model landscape. Current status:

| Persona | Status | Notes |
|---------|--------|-------|
| Therapist | Review | Ethically sensitive framing. Needs disclaimer layer consideration. |
| Truth-Seeker | Redefined | See above. Prime directive framing. |
| Coder | Still valid | Evergreen. Mechanical update to 16-lever schema needed. |
| Creative Writer | Still valid | Evergreen. Schema update needed. |
| Researcher | Still valid | Distinct from Truth-Seeker — information retrieval vs truth assembly. |
| Tutor | Still valid | Evergreen. Schema update needed. |
| Edgy/Uncensored | Reconsider | 2025 framing. In 2026 context needs rethinking. |

Missing personas worth considering:
- **Direct** — the Absolute Mode persona, clean version without "uncensored" framing. The one that started everything.
- **Collaborator** — thinks alongside you, not at you. Different from Therapist (emotional) and Tutor (didactic).
- **Strategist** — synthesizes, challenges assumptions, operates at abstraction. For the executive/P&G use case.

---

*Document created: March 27, 2026*
*Source: Conversation with John Violette*
*All positioning copy subject to John's voice pass*
