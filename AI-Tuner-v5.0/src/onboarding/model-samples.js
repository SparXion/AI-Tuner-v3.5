/**
 * AITuner v5.0 - Model Sample Responses
 * 
 * Pre-written sample responses per model per intent.
 * These are hand-authored to show real differences between models.
 * 
 * Used on Screen 2 (Model Selection) to help users understand model voices.
 */

const MODEL_SAMPLES = {
    // Intent: think
    think: {
        claude: "I'd approach this decision by mapping out the key factors. What's driving the urgency? What are the non-negotiables? Sometimes the best move is to step back and see what patterns emerge when you're not in the heat of the moment.",
        chatgpt: "Here's a structured approach:\n\n1. List all factors\n2. Weight each by importance\n3. Consider short vs long-term impacts\n4. Make a decision matrix\n\nThis systematic method helps reduce bias.",
        gemini: "Let's think through this together. The core question seems to be about balancing immediate needs with longer-term goals. Have you considered how this decision connects to your broader strategy?",
        grok: "What's the actual constraint? If it's time, make the call. If it's information, get more. Most hard decisions are hard because we're optimizing for multiple things at once.",
        mistral: "Identify the primary constraint. List options. Evaluate against your criteria. Decide. Most analysis paralysis comes from trying to optimize everything simultaneously.",
        llama: "This depends on your specific context. What are the trade-offs you're weighing? Understanding the underlying tensions helps clarify the path forward.",
        perplexity: "Research suggests decision-making frameworks like weighted decision matrices can reduce bias. Key factors to consider: [factors]. Sources: [citations]",
        cursor: "Break it down into a decision tree. What are the branches? What's the expected value of each path? Code the logic, then execute."
    },
    
    // Intent: write
    write: {
        claude: "Start with a hook that connects to their world. Then bridge to your ask. Keep it concise but warm—you want them to feel seen, not sold to.",
        chatgpt: "Subject: [Clear, benefit-focused]\n\nHi [Name],\n\n[Opening that establishes relevance]\n[Your ask]\n[Clear next step]\n\nBest,\n[Your name]",
        gemini: "Open with something that shows you understand their context. Then make your request specific and actionable. End with a question that invites engagement.",
        grok: "Get to the point fast. What do you want? Why should they care? Make it easy to say yes.",
        mistral: "Clear subject line. Direct opening. Specific request. Clear CTA. No fluff.",
        llama: "The tone depends on your relationship. For cold outreach, be brief and value-focused. For warm contacts, you can be more conversational.",
        perplexity: "Research shows personalized subject lines increase open rates by 26%. Structure: [hook] → [value] → [ask] → [CTA]. Sources: [email marketing studies]",
        cursor: "Template structure:\n```\nSubject: [value proposition]\nBody: [context] + [ask] + [next step]\n```\nKeep it scannable."
    },
    
    // Intent: build
    build: {
        claude: "Start with the core abstraction. What's the minimal interface that solves the problem? Then layer in the details. Think about what changes and what stays constant.",
        chatgpt: "Architecture approach:\n\n1. Define core entities\n2. Map relationships\n3. Design interfaces\n4. Implement incrementally\n5. Test at each layer\n\nThis modular approach supports future changes.",
        gemini: "Consider the system holistically. What are the key components? How do they interact? Start with a simple version, then iterate based on real usage patterns.",
        grok: "What's the simplest thing that works? Build that. Then refactor when you hit real constraints, not imagined ones.",
        mistral: "Define the data model first. Then the API surface. Then implementation. This order prevents rework.",
        llama: "The structure depends on your scale and team size. For small projects, start simple. For larger systems, invest in clear boundaries early.",
        perplexity: "Best practices suggest starting with domain-driven design principles. Key patterns: [patterns]. References: [architecture guides]",
        cursor: "```typescript\n// Core types first\ntype Entity = { ... }\n\n// Then interfaces\ntype Service = { ... }\n\n// Then implementation\n```\nTypes drive the design."
    },
    
    // Intent: explore
    explore: {
        claude: "Black holes are fascinating because they break our intuitions about space and time. The event horizon isn't a physical barrier—it's a point of no return for information. What's interesting is how they connect to quantum mechanics at the smallest scales.",
        chatgpt: "Black holes are regions where gravity is so strong that nothing, not even light, can escape. Key concepts:\n\n1. Event horizon\n2. Singularity\n3. Hawking radiation\n4. Information paradox\n\nThey're laboratories for testing theories of gravity and quantum mechanics.",
        gemini: "Black holes connect general relativity to quantum mechanics in ways we're still figuring out. The information paradox—does information get destroyed?—challenges our understanding of physics itself.",
        grok: "Black holes: gravity wins. Past the event horizon, spacetime curves so much that all paths lead inward. The interesting part is what happens to information. Does it get destroyed? That breaks quantum mechanics.",
        mistral: "Black holes: regions where escape velocity exceeds light speed. Event horizon marks the boundary. Singularity at center. Hawking radiation suggests they evaporate over time.",
        llama: "Black holes represent extreme gravity. The event horizon is where escape becomes impossible. The singularity is where our physics breaks down. They're testing grounds for unified theories.",
        perplexity: "Black holes are regions of spacetime with extreme gravity. Key research areas: event horizon physics, information paradox, Hawking radiation. Recent papers: [citations]. Observational evidence: [sources]",
        cursor: "Black holes are solutions to Einstein's field equations where the metric becomes singular. The event horizon is a null surface. Code the geodesic equations to see particle paths."
    }
};

// Export
if (typeof window !== 'undefined') {
    window.MODEL_SAMPLES = MODEL_SAMPLES;
}
