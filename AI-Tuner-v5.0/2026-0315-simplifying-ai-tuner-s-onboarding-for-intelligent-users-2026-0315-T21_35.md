# Simplifying AI Tuner's onboarding for intelligent users

- Exported: 2026-03-16T01:35:46.921Z
- URL: https://claude.ai/chat/693cd854-a5da-4c6d-b588-89c81cc68be9

## User

I want you take a look at the structure of the AI Tuner app. This currently feels overwhelming for a new user. The user is a savvy and highly intelligent person who is simply overwhelmed by the volume of information. I need to design a version with onboarding capability for people not familiar with AI. I don't want it to be talking to kindergarteners, though. I don't want to talk down to the audience. Assume they are very capable, just don't know exactly what they are looking at.

## Claude

Reading the frontend design skillReading the frontend design skillGood. I've got the lay of the land on both the app and the design principles. Let me think through this before diving into code.

**The core problem:** AITuner front-loads everything — 4 radar charts, 26 levers, 12 categories, all visible simultaneously. A smart new user doesn't know what they're *trying to do* yet, so showing them the full instrument panel is disorienting.

**The design thesis:** Progressive revelation with a clear entry question. Not "here's everything," but "what do you want?" → reveal what's relevant → let them go deeper when ready.

**Onboarding strategy:**

- Start with intent, not controls ("What kind of AI do you want?")
- Model selection first — it's the most intuitive anchor point
- Persona as a shortcut layer: "skip the levers entirely with a preset mode"
- Levers revealed progressively — simple 4-5 levers first, "go deeper" to unlock all 26
- Radar charts relegated to expert territory — they're powerful but visually confusing as the first thing you see
- Language overhaul: "Hedging Intensity" → "How confident does it sound?" (without dumbing down)

Let me build a concept prototype of this onboarding flow as an interactive artifact.

Good, I've got what I need. Let me build this.

V

visualizeV

visualize show_widgetHere's the concept. Walk through it — it's fully interactive.

**The structural logic:**

**Screen 1 — Intent first, not controls.** "What do you want this AI to do?" anchors the user before they see anything technical. Four plain-language options. No jargon. Importantly, there's also an escape hatch at the bottom for people who already know the app.

**Screen 2 — Model selection, reframed.** Instead of just names, each model gets a one-line personality description ("Nuanced, reflective" for Claude vs "Direct, edgy" for Grok). Now the choice is meaningful even if you don't know the model landscape.

**Screen 3 — Three levers, renamed.** The existing 26 levers compressed to the three that have the most perceptual impact, with human questions instead of technical labels:

- "How much does it explain?" = Verbosity/Answer Completeness
- "How confident does it sound?" = Hedging Intensity (the old name is a non-starter for new users)
- "Tone" = casual enough to need no explanation

**Screen 4 — Prompt preview + personas as quick-switches.** The output is readable English, not a wall of config. Personas become simple tags at the bottom — optional, not mandatory. Advanced mode is always one click away.

**What this preserves for power users:** The full 26-lever system isn't gone — it's just not the door. "Already know what you're doing? Go to full controls ↗" appears on every screen.

The philosophy: **don't simplify the tool, simplify the entry.** The intelligence of the user is respected — they just need a guided ramp, not a dumbed-down version.

## User

This is brilliant. I like it. I wonder how we can incorporate the visual "Web tuner" feature that displays the selections visually and interactively. Do you think we should do that?

## Claude

Good question. Let me think through this with you rather than just saying yes.

**The case FOR keeping the radar:**

- It's genuinely distinctive — most prompt tools are pure sliders
- Once you understand what you're looking at, it communicates the "shape" of a personality at a glance
- Power users love it
- It's a signature visual that makes AITuner memorable

**The case AGAINST putting it in the onboarding flow:**

- An 8-axis radar is cognitively demanding before you've internalized what the axes mean
- If someone doesn't know what "Hedging Intensity" is, seeing it spiked on a radar chart doesn't help — it just adds visual noise
- The current problem is that the radar is the first thing new users see, which is exactly backwards

**My read:** The radar isn't the problem — the *placement* is the problem.

Here's how I'd think about it architecturally:

The radar earns its place on **Screen 4** (the prompt result screen) — after the user has made their choices. At that point they have context. The radar becomes a *confirmation* of what they built, not an instruction set. "Here's the shape of the AI you just configured." That's satisfying and legible, because the levers they just moved map directly to what they see spike or flatten on the chart.

You could even do a **reveal animation** — the radar draws itself based on their 3 lever choices, then offers "want to fine-tune the other axes?" as the gateway to advanced mode. The radar becomes the bridge between simple and advanced, not the front door.

So: yes, keep it — but make it the *reward* at the end of the flow, not the entry point. Want me to build that version with the radar on Screen 4?

## User

I think the three sliders page should be where the web is introduced? There is another question, though... How do they know what they're picking with the different models? Part of the exercise is to reveal that the models are all different AND to take some of the mystery out of the models. What do you think?

## Claude

Both points are sharp. Let me think through them separately.

**On the radar on Screen 3 (the three sliders):**

Yes, this actually works better than Screen 4. Here's why — the sliders and the radar are the *same information in two forms*. If they're both on Screen 3, the user immediately sees the connection: move a slider, watch the radar change. That's the "aha" moment — the radar stops being intimidating abstract art and becomes a live mirror of what they're doing. The radar teaches itself through interaction.

The key is to start it fully rendered but showing only 3 axes (matching the 3 sliders), not all 8. That's not overwhelming — it's legible. When they unlock advanced mode, more axes appear. The radar literally grows with the user's sophistication.

**On the model selection problem — this is the bigger issue:**

Right now, picking a model is basically a blind guess unless you already know the ecosystem. "Nuanced, reflective" for Claude is better than nothing, but it's still abstract. You can't feel it.

What if instead of *describing* the models, you *demonstrated* them?

Give users a fixed prompt — something like *"Explain why the sky is blue"* or better, something relevant to their chosen intent from Screen 1 — and show a short sample response from each model. Not a long one. Maybe 2-3 sentences. Enough to feel the difference in voice.

That does three things simultaneously:

- Takes the mystery out of the models (you're not picking a brand, you're picking a voice)
- Makes the selection genuinely meaningful
- Reinforces that these models are actually different in feel, not just in capability

The challenge is keeping it from becoming overwhelming with 8 models. A few options:

- Show 3-4 "featured" responses, with the rest accessible via "see more"
- Let them type their own sample prompt and see responses (ambitious but powerful)
- Group models by personality cluster first (Precise / Creative / Direct / Balanced), then pick within cluster

My instinct is the **sample response** approach is the right direction, but the grouping model reduces decision fatigue before you even get to samples. Maybe both — cluster first, sample on hover or expand.

What's your gut on the sample response idea? Is that too much to show in an onboarding flow, or does that feel right for the audience you're designing for?

## User

I like the sample approach but I want to add the visual representation with a web tuner... I don't know... this is a tough one... Here's a straight question - I suspect I am trying to sell the idea of the web tuner radars rather than focusing on the user experience. But maybe not... I am focused on creating a NEW user experience and want to get them going on it as soon as possible. Maybe there's a layered approach like a skill building tutorial in a video game. going from zero to novice to expert gradually?

## Claude

That's a sharp self-diagnosis. And I think you just answered your own question.

**"Am I selling the radar or serving the user?"**

Probably a bit of both — and that's not automatically wrong. The radar IS a differentiator. It's part of what makes AITuner worth using over just typing a prompt manually. So there's a legitimate product reason to introduce it. The question is *when and how* it earns its place in the flow.

**The video game skill tree framing is exactly right.**

Games solved this problem decades ago. You don't get the full ability tree in level 1. But — and this is the key — **you always feel like you're progressing toward something.** The locked content isn't hidden, it's *visible but unreachable*, which creates pull instead of overwhelm.

Think about it as three tiers with explicit unlocking:

**Level 0 → Starter**
Intent + Model (with sample responses) + Copy prompt. Nothing else. Fast, useful, done in 90 seconds. No radar, no levers yet. Just get them a working prompt.

**Level 1 → Tuner** *(unlocks after first successful prompt)*
The three core sliders appear. The radar appears alongside them — but only 3 axes lit, matching the sliders. They can now *see* what they're adjusting. This is where the radar concept clicks because they already have a working mental model from Level 0.

**Level 2 → Architect** *(unlocks after engaging with Level 1)*
All 26 levers. Full 8-axis radar. Persona system. Export/save. The whole instrument panel — but now they understand what they're looking at because they built up to it.

**The crucial UX detail that makes this work:**

At every level, show them what's coming. A grayed-out radar at Level 0 with "Unlock visual tuning →" creates desire. They're not confused by it — they're motivated by it. The radar sells itself without being forced on anyone.

**Bottom line:** The radar belongs in the product. The layered unlock approach lets it earn its place organically instead of you having to justify its presence. Want me to rebuild the prototype with this three-tier progression?

## User

Give me a detailed map of how you would implement this as a prompt for cursor. Do you know what I'm asking. I want you to tell Cursor how to do this.

I also want to share this with Grok to see what he says.

## Claude

Got it. Two things — a Cursor implementation prompt, and a version framed for Grok.

AITuner onboarding redesign spec for CursorAITuner onboarding redesign spec for Cursor
