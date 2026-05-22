/**
 * Prompt synthesis — clusters, dead zones, source map (Stop 9).
 * Depends: window.LEVERS_V5 before load. Loaded before v5-engine.js.
 */
(function (global) {
    'use strict';

    var HIERARCHY_PARAGRAPH =
        'When these instructions conflict:\n' +
        'output constraints take precedence,\n' +
        'then character, then voice, then thinking.';

    var HIER_DISPLAY = 'Output → Character → Voice → Thinking';

    function spread(vals) {
        if (!vals || !vals.length) return 0;
        var n = vals.map(Number);
        var mx = Math.max.apply(null, n);
        var mn = Math.min.apply(null, n);
        return mx - mn;
    }

    function deadZone(v) {
        return v >= 4 && v <= 6;
    }

    function directional(v) {
        return v <= 3 || v >= 7;
    }

    function wordCt(s) {
        var t = s.trim();
        if (!t) return 0;
        return t.split(/\s+/).filter(Boolean).length;
    }

    var COPY = {
        directHi:
            "State your assessment directly. No qualifiers, no disclaimers, no 'it depends' unless the uncertainty is genuine and material. Pick a position and hold it.",
        directLo:
            'Acknowledge uncertainty freely. Present multiple perspectives. Use qualifying language where appropriate. Include relevant caveats.',
        brShort:
            'Answer briefly. Get to the point and stop. No padding, no recap, no elaboration beyond what was asked.',
        brLong:
            "Be thorough. Cover the full scope. Don't truncate for brevity — complete answers serve better than short ones here.",
        engLow:
            'Answer only what was asked. Do not add suggestions, next steps, or tips unless requested. Do not ask clarifying questions — make reasonable assumptions and proceed.',
        engHigh:
            'Proactively add relevant context, next steps, and related ideas. Ask clarifying questions when the request is ambiguous before proceeding.',
        engSplitA:
            'Answer only what was asked — no extra suggestions. But ask one clarifying question if the request is genuinely ambiguous.',
        engSplitB:
            'Proactively add relevant context and next steps. Make reasonable assumptions rather than asking — proceed and offer to adjust.',
        exDeep:
            'Explain your reasoning as you go. Define terms the user may not know. Walk through the thinking, not just the conclusion.',
        exSkip:
            "Skip the explanation. Deliver the answer directly. Assume competence — don't define terms or show reasoning unless asked.",
        exSplitTmHi:
            'Explain concepts and define terms for clarity. But deliver conclusions directly without narrating your reasoning process.',
        exSplitTrHi:
            'Show your reasoning process — how you got to the answer. But assume the user already knows the underlying concepts.',
        emWarm:
            'Be warm and human. Wit is welcome. Emotional presence matters here.',
        emCool:
            'Keep it professional and task-focused. No humor. Emotional performance not needed.',
        emSplitWarm:
            "Be emotionally present and warm. Serious tone — this isn't the place for wit.",
        emSplitEdge:
            'Wit and lightness are welcome. But keep it task-focused — no emotional performance.',
        stab: {
            fLo: 'Write conversationally. Like a smart colleague, not a formal document.',
            fHi: 'Maintain a professional, formal register. Appropriate for reports and formal contexts.',
            cLo: 'Stay grounded. Factual, conventional, reliable. No speculation.',
            cHi: 'Think beyond the obvious. Speculative, imaginative, unexpected angles welcome.',
            citLo: 'Speak from your own knowledge. No need to cite sources or qualify every claim.',
            citHi: "Back claims with sources where you have them. Distinguish what you know confidently from what you're inferring.",
            fmtLo: 'Plain prose. No headers, no bullets, no markdown structure.',
            fmtHi: 'Use structure. Headers, bullets, numbered lists where they aid clarity.',
            tmLo: 'Maintain a consistent voice regardless of how the user writes.',
            tmHi: "Mirror the user's register, energy, and pace. Adapt to how they write."
        }
    };

    function sdLine(sd) {
        if (sd <= 2) return 'Skip disclaimers and “as an AI” qualifications unless materially needed.';
        if (sd >= 8)
            return 'Include safety disclaimers and explicit reminders where policies or stakes require.';
        return null;
    }

    function acLine(lvKey, val) {
        var L = window.LEVERS_V5 && window.LEVERS_V5[lvKey];
        if (!L) return null;
        if (val <= 3) return String(L.low || '');
        if (val >= 7) return String(L.high || '');
        return null;
    }

    function compoundBrev(conc, rl) {
        var rlPart =
            rl <= 4
                ? 'Target shorter outputs that fit tightly to the question.'
                : rl >= 7
                  ? 'Use enough length to cover scope, caveats, and edge cases adequately.'
                  : 'Use pragmatic length.';
        var cPart =
            conc <= 4
                ? 'Within that footprint, tighten language — minimize filler.'
                : conc >= 7
                  ? 'Within that footprint, fuller explanation is fine when it aids clarity.'
                  : 'Within that footprint, moderate density.';
        return rlPart + ' ' + cPart;
    }

    /**
     * @returns {{ rows: Array, midsAbsorbed: Object }}
     */
    function synthRows(lv) {
        var rows = [];
        var midsAbsorbed = {};
        function addCluster(clusterName, text, tup) {
            var leversArr = tup.map(function (kv) {
                return { key: kv[0], value: kv[1] };
            });
            rows.push({
                instruction: text,
                type: 'cluster',
                clusterName: clusterName,
                levers: leversArr
            });
            tup.forEach(function (kv) {
                if (deadZone(kv[1])) midsAbsorbed[kv[0]] = true;
            });
        }

        function addStandalone(key, text) {
            rows.push({
                instruction: text,
                type: 'standalone',
                lever: { key: key, value: lv[key] }
            });
        }

        var consumed = {};

        /** 1 DIRECT */
        var a = lv.assertiveness;
        var c = lv.confidence;
        var sd = lv.safetyDisclaimers;

        var dHi = spread([a, c]) <= 3 && a >= 7 && c >= 7 && sd <= 2;
        var dLo = spread([a, c]) <= 3 && a <= 3 && c <= 3;

        if (dHi) {
            consumed.assertiveness =
                consumed.confidence =
                consumed.safetyDisclaimers =
                    true;
            addCluster('Directness — from Assertiveness, Confidence, Safety Disclaimers', COPY.directHi, [
                ['assertiveness', a],
                ['confidence', c],
                ['safetyDisclaimers', sd]
            ]);
        } else if (dLo) {
            consumed.assertiveness =
                consumed.confidence =
                consumed.safetyDisclaimers =
                    true;
            addCluster('Directness — from Assertiveness, Confidence, Safety Disclaimers', COPY.directLo, [
                ['assertiveness', a],
                ['confidence', c],
                ['safetyDisclaimers', sd]
            ]);
        } else {
            if (directional(a) && !consumed.assertiveness) {
                var ta = acLine('assertiveness', a);
                if (ta) {
                    consumed.assertiveness = true;
                    addStandalone('assertiveness', ta);
                }
            }
            if (directional(c) && !consumed.confidence) {
                var tc = acLine('confidence', c);
                if (tc) {
                    consumed.confidence = true;
                    addStandalone('confidence', tc);
                }
            }
            var tsd = sdLine(sd);
            if (tsd) {
                consumed.safetyDisclaimers = true;
                addStandalone('safetyDisclaimers', tsd);
            }
        }

        /** 2 BREVITY */
        var conc = lv.conciseness;
        var rlen = lv.responseLength;
        var briefCluster = spread([conc, rlen]) <= 3 && conc <= 4 && rlen <= 4;
        var longCluster = spread([conc, rlen]) <= 3 && conc >= 7 && rlen >= 7;

        if (briefCluster) {
            consumed.conciseness =
                consumed.responseLength =
                    true;
            addCluster('Brevity — from Conciseness, Response Length', COPY.brShort, [
                ['conciseness', conc],
                ['responseLength', rlen]
            ]);
        } else if (longCluster) {
            consumed.conciseness =
                consumed.responseLength =
                    true;
            addCluster('Brevity — from Conciseness, Response Length', COPY.brLong, [
                ['conciseness', conc],
                ['responseLength', rlen]
            ]);
        } else if (!(deadZone(conc) && deadZone(rlen))) {
            var anyDir = directional(conc) || directional(rlen);
            if (anyDir) {
                consumed.conciseness =
                    consumed.responseLength =
                        true;
                var comb = compoundBrev(conc, rlen);
                addCluster('Brevity — from Conciseness, Response Length', comb, [
                    ['conciseness', conc],
                    ['responseLength', rlen]
                ]);
            }
        }

        /** 3 ENGAGEMENT */
        var init = lv.initiative;
        var qf = lv.questionFrequency;
        var eLo = spread([init, qf]) <= 3 && init <= 3 && qf <= 3;
        var eHi = spread([init, qf]) <= 3 && init >= 7 && qf >= 7;
        var eSplA = !eLo && !eHi && init <= 3 && qf >= 7 && spread([init, qf]) <= 5;
        var eSplB = !eLo && !eHi && init >= 7 && qf <= 3 && spread([init, qf]) <= 5;

        if (eLo) {
            consumed.initiative =
                consumed.questionFrequency =
                    true;
            addCluster('Engagement — from Initiative, Question Frequency', COPY.engLow, [
                ['initiative', init],
                ['questionFrequency', qf]
            ]);
        } else if (eHi) {
            consumed.initiative =
                consumed.questionFrequency =
                    true;
            addCluster('Engagement — from Initiative, Question Frequency', COPY.engHigh, [
                ['initiative', init],
                ['questionFrequency', qf]
            ]);
        } else if (eSplA) {
            consumed.initiative =
                consumed.questionFrequency =
                    true;
            addCluster('Engagement — from Initiative, Question Frequency', COPY.engSplitA, [
                ['initiative', init],
                ['questionFrequency', qf]
            ]);
        } else if (eSplB) {
            consumed.initiative =
                consumed.questionFrequency =
                    true;
            addCluster('Engagement — from Initiative, Question Frequency', COPY.engSplitB, [
                ['initiative', init],
                ['questionFrequency', qf]
            ]);
        }

        /** 4 EXPLAIN */
        var tm = lv.teachingMode;
        var tr = lv.transparency;
        var alignedHi = spread([tm, tr]) <= 3 && tm >= 7 && tr >= 7;
        var alignedLo = spread([tm, tr]) <= 3 && tm <= 3 && tr <= 3;
        var spTmHi = spread([tm, tr]) <= 4 && tm >= 7 && tr <= 3;
        var spTrHi = spread([tm, tr]) <= 4 && tm <= 3 && tr >= 7;

        if (alignedHi) {
            consumed.teachingMode =
                consumed.transparency =
                    true;
            addCluster('Explanation — from Teaching Mode, Show Your Work', COPY.exDeep, [
                ['teachingMode', tm],
                ['transparency', tr]
            ]);
        } else if (alignedLo) {
            consumed.teachingMode =
                consumed.transparency =
                    true;
            addCluster('Explanation — from Teaching Mode, Show Your Work', COPY.exSkip, [
                ['teachingMode', tm],
                ['transparency', tr]
            ]);
        } else if (spTmHi) {
            consumed.teachingMode =
                consumed.transparency =
                    true;
            addCluster('Explanation — from Teaching Mode, Show Your Work', COPY.exSplitTmHi, [
                ['teachingMode', tm],
                ['transparency', tr]
            ]);
        } else if (spTrHi) {
            consumed.teachingMode =
                consumed.transparency =
                    true;
            addCluster('Explanation — from Teaching Mode, Show Your Work', COPY.exSplitTrHi, [
                ['teachingMode', tm],
                ['transparency', tr]
            ]);
        }

        /** 5 EMOTION */
        var pl = lv.playfulness;
        var ew = lv.emotionalWarmth;
        var emDone = false;
        if (spread([pl, ew]) <= 2 && pl >= 7 && ew >= 7) {
            emDone = true;
            consumed.playfulness =
                consumed.emotionalWarmth =
                    true;
            addCluster('Tone — from Emotional Warmth, Playfulness', COPY.emWarm, [
                ['playfulness', pl],
                ['emotionalWarmth', ew]
            ]);
        } else if (spread([pl, ew]) <= 2 && pl <= 3 && ew <= 3) {
            emDone = true;
            consumed.playfulness =
                consumed.emotionalWarmth =
                    true;
            addCluster('Tone — from Emotional Warmth, Playfulness', COPY.emCool, [
                ['playfulness', pl],
                ['emotionalWarmth', ew]
            ]);
        } else if (!emDone && ew >= 7 && pl <= 3 && spread([pl, ew]) > 2) {
            emDone = true;
            consumed.playfulness =
                consumed.emotionalWarmth =
                    true;
            addCluster('Tone — from Emotional Warmth, Playfulness', COPY.emSplitWarm, [
                ['playfulness', pl],
                ['emotionalWarmth', ew]
            ]);
        } else if (!emDone && pl >= 7 && ew <= 3 && spread([pl, ew]) > 2) {
            emDone = true;
            consumed.playfulness =
                consumed.emotionalWarmth =
                    true;
            addCluster('Tone — from Emotional Warmth, Playfulness', COPY.emSplitEdge, [
                ['playfulness', pl],
                ['emotionalWarmth', ew]
            ]);
        }

        /** STANDALONE keys often covered by clusters use consumed check */
        var keysSt = ['formality', 'creativity', 'citationHabit', 'formatting', 'toneMatching'];
        keysSt.forEach(function (key) {
            if (consumed[key]) return;
            var v = lv[key];
            if (!directional(v) || deadZone(v)) return;
            var t = null;
            if (key === 'formality') t = v <= 3 ? COPY.stab.fLo : COPY.stab.fHi;
            else if (key === 'creativity') t = v <= 3 ? COPY.stab.cLo : COPY.stab.cHi;
            else if (key === 'citationHabit') t = v <= 3 ? COPY.stab.citLo : COPY.stab.citHi;
            else if (key === 'formatting') t = v <= 3 ? COPY.stab.fmtLo : COPY.stab.fmtHi;
            else if (key === 'toneMatching') t = v <= 3 ? COPY.stab.tmLo : COPY.stab.tmHi;
            if (t) {
                addStandalone(key, t);
                consumed[key] = true;
            }
        });

        /** neutral mid list */
        var neut = [];
        Object.keys(lv)
            .sort()
            .forEach(function (k) {
                if (!window.LEVERS_V5[k]) return;
                var val = lv[k];
                if (val >= 4 && val <= 6) {
                    if (midsAbsorbed[k]) return;
                    neut.push({ key: k, value: val });
                }
            });

        return { rows: rows, midsAbsorbed: midsAbsorbed, neutralLevers: neut };
    }

    function knowledgeFromProfile(profile) {
        if (!profile) return '';
        try {
            if (profile.literacy_record && typeof profile.literacy_record === 'object') {
                var lr = profile.literacy_record;
                if (lr.knowledge_prompt_context && String(lr.knowledge_prompt_context).trim())
                    return String(lr.knowledge_prompt_context).trim();
                if (lr.user_context_notes && String(lr.user_context_notes).trim())
                    return String(lr.user_context_notes).trim();
            }
        } catch (e) {}
        return '';
    }

    function composerPersona(engine) {
        var p = engine.selectedPersona;
        var rows = [];

        rows.push({
            instruction: String(p.activation_snippet || '').trim(),
            type: 'persona',
            personaName: p.name || p.id,
            clusterName: p.name || p.id,
            description: p.description || '',
            levers: p.lever_values
                ? Object.keys(p.lever_values).map(function (key) {
                      return { key: key, value: p.lever_values[key] };
                  })
                : [],
            personaId: p.id
        });

        /** neutral mids visible with persona */
        var lvFlat = {};

        Object.keys(window.LEVERS_V5).forEach(function (k) {
            lvFlat[k] = engine.leverValues[k] !== undefined ? engine.leverValues[k] : 5;
        });

        var neut = [];

        Object.keys(lvFlat).forEach(function (k) {
            var val = lvFlat[k];
            if (val >= 4 && val <= 6) neut.push({ key: k, value: val });
        });

        var body = [];

        body.push(String(p.activation_snippet || '').trim());
        body.push(HIERARCHY_PARAGRAPH);
        var ksn = knowledgeFromProfile(engine.profile);
        if (ksn) {
            body.push('Context:\n' + ksn);
        }

        var text = body.join('\n\n').trim();

        return {

            generated_text: text,
            sourceMap: rows,

            neutralLevers: neut,

            hierarchy: HIER_DISPLAY,
            wordCount: wordCt(text)
        };
    }

    function composeFromEngine(engine) {
        if (!engine.selectedModel || !window.LEVERS_V5) {
            return null;
        }

        if (engine.selectedPersona) {

            return composerPersona(engine);
        }

        var lv = {};

        Object.keys(window.LEVERS_V5).forEach(function (k) {

            lv[k] = engine.leverValues[k] !== undefined ? engine.leverValues[k] : 5;


        });


        var out = synthRows(lv);

        /** instruction body lines only (clusters+standalones texts) */


        var lineTexts = [];

        out.rows.forEach(function (row) {


            lineTexts.push(row.instruction);



        });


        var know = knowledgeFromProfile(engine.profile);

        var gp = lineTexts.slice();
        gp.push(HIERARCHY_PARAGRAPH);
        if (know) {
            gp.push('Context:\n' + know);
        }

        var gen = gp.filter(Boolean).join('\n\n').trim();


        return {


            generated_text: gen,


            sourceMap: out.rows,


            neutralLevers: out.neutralLevers,

            hierarchy: HIER_DISPLAY,


            wordCount: wordCt(gen)
        };
    }


    global.PROMPT_SYNTHESIS_V9 = {




        compose: composeFromEngine,


        HIERARCHY_PARAGRAPH: HIERARCHY_PARAGRAPH
    };


})(typeof window !== 'undefined' ? window : globalThis);
