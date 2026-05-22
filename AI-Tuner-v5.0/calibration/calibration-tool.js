#!/usr/bin/env node
/**
 * Compares elicitation JSON + last-run.json; prints drift; writes v5-models.proposed.js when both are usable.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MODELS_PATH = path.join(ROOT, 'src/data/v5-models.js');
const PROPOSED_PATH = path.join(ROOT, 'src/data/v5-models.proposed.js');
const ELICIT_DIR = path.join(__dirname, 'elicitation-responses');
const LAST_RUN = path.join(__dirname, 'last-run.json');

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

function loadModelsV5() {
    const raw = fs.readFileSync(MODELS_PATH, 'utf8');
    const needle = 'const MODELS_V5 = ';
    const start = raw.indexOf(needle);
    if (start === -1) {
        throw new Error('MODELS_V5 not found');
    }
    let depth = 0;
    let begin = -1;
    for (let i = start + needle.length; i < raw.length; i++) {
        const c = raw[i];
        if (c === '{') {
            if (depth === 0) {
                begin = i;
            }
            depth++;
        } else if (c === '}') {
            depth--;
            if (depth === 0 && begin !== -1) {
                const literal = raw.slice(begin, i + 1);
                return new Function(`"use strict"; return ${literal};`)();
            }
        }
    }
    throw new Error('Could not parse MODELS_V5');
}

function isTemplateName(name) {
    return /template\.json$/i.test(name) || /-template\.json$/i.test(name);
}

function elicitationFiles() {
    if (!fs.existsSync(ELICIT_DIR)) {
        return [];
    }
    return fs
        .readdirSync(ELICIT_DIR)
        .filter((f) => f.endsWith('.json') && !isTemplateName(f));
}

function readJson(p) {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function elicitationHasNumericLevers(obj) {
    if (!obj || !obj.levers || typeof obj.levers !== 'object') {
        return false;
    }
    return LEVER_KEYS.some((k) => typeof obj.levers[k] === 'number' && !Number.isNaN(obj.levers[k]));
}

function lastRunHasNumericAggregate(obj) {
    if (!obj || !obj.aggregate_by_lever || typeof obj.aggregate_by_lever !== 'object') {
        return false;
    }
    return LEVER_KEYS.some((k) => typeof obj.aggregate_by_lever[k] === 'number' && !Number.isNaN(obj.aggregate_by_lever[k]));
}

function printSetup() {
    console.log('\nAI Tuner v5 — Calibration tool\n===============================\n');
    console.log('This tool compares **self-reported** lever values (elicitation) with **observed** aggregates (behavioral battery).\n');
    console.log('Setup:\n');
    console.log('1. Run: npm run interview');
    console.log('   → Fills calibration/elicitation-responses/*-template.json; rename/copy to <model_id>.json with numeric `levers`.\n');
    console.log('2. Run: npm run observe');
    console.log('   → Prints prompts; fill calibration/last-run.json (copy from last-run-template.json) with `model_id` and numeric `aggregate_by_lever`.\n');
    console.log('3. Run: npm run calibrate\n');
}

function clampInt(n) {
    return Math.max(0, Math.min(10, Math.round(Number(n))));
}

function main() {
    printSetup();

    const hasLastRun = fs.existsSync(LAST_RUN);
    let lastRun = null;
    if (hasLastRun) {
        try {
            lastRun = readJson(LAST_RUN);
        } catch (e) {
            console.error('Could not parse', LAST_RUN, e.message);
            process.exit(1);
        }
    }

    const targetMid = lastRun && lastRun.model_id ? lastRun.model_id : null;

    const hasElicitDir = fs.existsSync(ELICIT_DIR);
    const files = hasElicitDir ? elicitationFiles() : [];
    let filledElicitation = null;
    let elicitPath = null;

    for (const f of files) {
        const full = path.join(ELICIT_DIR, f);
        let data;
        try {
            data = readJson(full);
        } catch (e) {
            continue;
        }
        if (!elicitationHasNumericLevers(data)) {
            continue;
        }
        if (targetMid && data.model_id && data.model_id !== targetMid) {
            continue;
        }
        filledElicitation = data;
        elicitPath = full;
        break;
    }

    if (!filledElicitation && files.length && !targetMid) {
        for (const f of files) {
            const full = path.join(ELICIT_DIR, f);
            let data;
            try {
                data = readJson(full);
            } catch (e) {
                continue;
            }
            if (elicitationHasNumericLevers(data)) {
                filledElicitation = data;
                elicitPath = full;
                break;
            }
        }
    }

    if (!filledElicitation || !lastRunHasNumericAggregate(lastRun)) {
        console.log('Status: **Not ready** — missing numeric elicitation file or aggregate_by_lever in last-run.json.\n');
        if (!filledElicitation) {
            console.log('- No elicitation JSON with filled numeric `levers` found in', ELICIT_DIR);
            console.log('  (files named *template*.json are ignored)\n');
        }
        if (!lastRun || !lastRunHasNumericAggregate(lastRun)) {
            console.log('- Need', LAST_RUN, 'with at least one numeric value in aggregate_by_lever.\n');
        }
        process.exit(0);
    }

    const mid = lastRun.model_id || filledElicitation.model_id;
    if (!mid) {
        console.error('Set model_id in last-run.json (and elicitation JSON) so drift is scoped to one model.');
        process.exit(1);
    }
    if (filledElicitation.model_id && filledElicitation.model_id !== mid) {
        console.warn('Warning: elicitation model_id', filledElicitation.model_id, '!= last-run model_id', mid);
    }

    console.log('Using elicitation file:', elicitPath);
    console.log('Using last-run model_id:', mid, '\n');

    const selfLevers = filledElicitation.levers || {};
    const obs = lastRun.aggregate_by_lever || {};

    console.log('Lever drift (observed − self), integer clamp 0–10 context:\n');
    console.log('lever\tself\tobs\tdrift\n' + '-'.repeat(44));
    LEVER_KEYS.forEach((k) => {
        const s = typeof selfLevers[k] === 'number' ? selfLevers[k] : null;
        const o = typeof obs[k] === 'number' ? obs[k] : null;
        if (s === null && o === null) {
            return;
        }
        const drift = s !== null && o !== null ? o - s : 'n/a';
        console.log([k, s, o, drift].join('\t'));
    });

    const live = loadModelsV5();
    if (!live[mid]) {
        console.error('Unknown model_id', mid, 'in v5-models.js');
        process.exit(1);
    }

    const proposed = JSON.parse(JSON.stringify(live));
    const nextDefaults = { ...proposed[mid].defaults };
    LEVER_KEYS.forEach((k) => {
        if (typeof obs[k] === 'number') {
            nextDefaults[k] = clampInt(obs[k]);
        }
    });
    proposed[mid].defaults = nextDefaults;

    const banner = `/**
 * AI Tuner v5.0 - Proposed Model Defaults
 *
 * GENERATED by calibration/calibration-tool.js — review before promote.
 * Merge via: npm run apply-calibration (manual)
 */

`;
    const body = `${banner}const MODELS_V5_PROPOSED = ${JSON.stringify(proposed, null, 4)};

if (typeof window !== 'undefined') {
    window.MODELS_V5_PROPOSED = MODELS_V5_PROPOSED;
}
`;

    fs.writeFileSync(PROPOSED_PATH, body, 'utf8');
    console.log('\nWrote', PROPOSED_PATH);
    console.log('Updated defaults for model:', mid, '(from observed aggregate_by_lever)\n');
}

main();
