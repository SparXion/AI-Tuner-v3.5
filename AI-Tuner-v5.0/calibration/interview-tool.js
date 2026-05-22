#!/usr/bin/env node
/**
 * Prints v5 elicitation sections to stdout and writes empty JSON templates per model.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PROMPTS_FILE = path.join(__dirname, 'elicitation-prompts-v5.md');
const OUT_DIR = path.join(__dirname, 'elicitation-responses');

const MODEL_IDS = ['chatgpt', 'claude', 'gemini', 'grok', 'mistral', 'llama', 'perplexity', 'cursor'];

const LEVER_KEYS = [
    'assertiveness',
    'formality',
    'playfulness',
    'emotionalWarmth',
    'conciseness',
    'teachingMode',
    'initiative',
    'questionFrequency',
    'transparency',
    'creativity',
    'confidence',
    'citationHabit',
    'formatting',
    'responseLength',
    'safetyDisclaimers',
    'toneMatching'
];

function parseSections(md) {
    const lines = md.split(/\r?\n/);
    const sections = {};
    let current = null;
    let buf = [];
    const flush = () => {
        if (current) {
            sections[current] = buf.join('\n').trim();
        }
        buf = [];
    };
    for (const line of lines) {
        const m = /^## (.+)$/.exec(line);
        if (m) {
            flush();
            current = m[1].trim();
        } else if (current) {
            buf.push(line);
        }
    }
    flush();
    return sections;
}

function emptyLevers() {
    const o = {};
    LEVER_KEYS.forEach((k) => {
        o[k] = null;
    });
    return o;
}

function main() {
    if (!fs.existsSync(PROMPTS_FILE)) {
        console.error('Missing', PROMPTS_FILE);
        process.exit(1);
    }
    const md = fs.readFileSync(PROMPTS_FILE, 'utf8');
    const sections = parseSections(md);

    console.log('\n========== AI Tuner v5 — Interview (elicitation) ==========\n');
    console.log('Copy each block below into the matching product. Fill JSON templates after.\n');

    const leverBlockKey = 'Lever rating block (paste under each model section)';
    if (sections[leverBlockKey]) {
        console.log(`${'='.repeat(60)}\n## (shared) Lever rating block\n${'='.repeat(60)}\n\n${sections[leverBlockKey]}\n`);
    }

    const printKeys = [...MODEL_IDS, 'default_persona', 'memory_personalization'];
    for (const key of printKeys) {
        const body = sections[key];
        if (!body) {
            console.log(`\n--- ## ${key} (section not found in markdown) ---\n`);
            continue;
        }
        console.log(`\n${'='.repeat(60)}\n## ${key}\n${'='.repeat(60)}\n\n${body}\n`);
    }

    fs.mkdirSync(OUT_DIR, { recursive: true });

    for (const id of MODEL_IDS) {
        const tpl = {
            model_id: id,
            elicitation_notes: '',
            narrative_self: '',
            levers: emptyLevers()
        };
        const fp = path.join(OUT_DIR, `${id}-template.json`);
        fs.writeFileSync(fp, JSON.stringify(tpl, null, 2), 'utf8');
        console.log('Wrote template', fp);
    }

    const personaTpl = {
        persona_id: 'default',
        elicitation_notes: '',
        narrative_self: '',
        levers: emptyLevers()
    };
    fs.writeFileSync(path.join(OUT_DIR, 'default-persona-template.json'), JSON.stringify(personaTpl, null, 2), 'utf8');
    console.log('Wrote template', path.join(OUT_DIR, 'default-persona-template.json'));

    console.log('\nDone. Rename *-template.json → <id>.json when filled, or copy values into a non-template file the calibration tool can read.\n');
}

main();
