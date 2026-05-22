#!/usr/bin/env node
/**
 * Prints behavioral battery from calibration-config.json and writes last-run-template.json.
 */
const fs = require('fs');
const path = require('path');

const CONFIG = path.join(__dirname, 'calibration-config.json');
const OUT = path.join(__dirname, 'last-run-template.json');

function main() {
    if (!fs.existsSync(CONFIG)) {
        console.error('Missing', CONFIG);
        process.exit(1);
    }
    const cfg = JSON.parse(fs.readFileSync(CONFIG, 'utf8'));
    const battery = cfg.behavioral_battery || [];

    console.log('\n========== AI Tuner v5 — Observe (behavioral battery) ==========\n');
    console.log('Run each prompt against the target model. Score 0–10 per lever listed (manual).\n');

    const byPrompt = {};
    for (const item of battery) {
        console.log(`\n--- ${item.id} ---`);
        console.log('Prompt:', item.prompt);
        console.log('Levers measured:', (item.levers_measured || []).join(', '));
        byPrompt[item.id] = {
            prompt: item.prompt,
            levers_measured: item.levers_measured || [],
            lever_scores: {}
        };
        (item.levers_measured || []).forEach((k) => {
            byPrompt[item.id].lever_scores[k] = null;
        });
    }

    const aggregate = {};
    const allLevers = new Set();
    battery.forEach((b) => (b.levers_measured || []).forEach((k) => allLevers.add(k)));
    allLevers.forEach((k) => {
        aggregate[k] = null;
    });

    const template = {
        model_id: '',
        run_notes: '',
        by_prompt: byPrompt,
        aggregate_by_lever: aggregate
    };

    fs.writeFileSync(OUT, JSON.stringify(template, null, 2), 'utf8');
    console.log('\n\nWrote', OUT);
    console.log('Rename to last-run.json when filled, or merge into last-run.json structure expected by npm run calibrate.\n');
}

main();
