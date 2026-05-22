#!/usr/bin/env node
/**
 * One-way sync: v5-model-rooms.js (MODEL_ROOMS_V5) → src/data/registry/model-rooms.json
 */
const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '../src/data/v5-model-rooms.js');
const outPath = path.join(__dirname, '../src/data/registry/model-rooms.json');

const raw = fs.readFileSync(jsPath, 'utf8');
const start = raw.indexOf('const MODEL_ROOMS_V5 = ');
if (start === -1) {
    console.error('Could not find MODEL_ROOMS_V5');
    process.exit(1);
}
let depth = 0;
let i = start + 'const MODEL_ROOMS_V5 = '.length;
let begin = -1;
for (; i < raw.length; i++) {
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
            let MODEL_ROOMS_V5;
            try {
                MODEL_ROOMS_V5 = new Function(`"use strict"; return ${literal};`)();
            } catch (e) {
                console.error(e);
                process.exit(1);
            }
            fs.mkdirSync(path.dirname(outPath), { recursive: true });
            fs.writeFileSync(outPath, JSON.stringify(MODEL_ROOMS_V5, null, 2), 'utf8');
            console.log('Wrote', outPath);
            process.exit(0);
        }
    }
}
console.error('Could not parse object literal');
process.exit(1);
