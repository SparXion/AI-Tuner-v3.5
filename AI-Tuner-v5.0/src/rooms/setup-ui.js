/**
 * Project Setup Wizard — guided Steps 0–4 for Model Room "Setup" tab.
 */
(function (global) {
    'use strict';

    function escapeHtml(s) {
        var d = document.createElement('div');
        d.textContent = s == null ? '' : String(s);
        return d.innerHTML;
    }

    function modelDisplayForId(modelId) {
        var m = window.MODELS_V5 && window.MODELS_V5[modelId];
        return m ? m.name : modelId || 'this model';
    }

    /** Where to upload project knowledge files in each host UI (breadcrumb-style). */
    function knowledgeUploadCue(modelId) {
        var id = String(modelId || '').toLowerCase();
        switch (id) {
            case 'claude':
                return { pathPlain: 'Project → Files → + button' };
            case 'grok':
                return { pathPlain: 'Project → Sources → Attach' };
            case 'chatgpt':
                return { pathPlain: 'Custom GPT → Knowledge → Upload files' };
            case 'gemini':
                return { pathPlain: 'Gem → Files' };
            default:
                return {
                    pathPlain:
                        'Open your project or workspace in this app and find Files, Knowledge, Sources, or Upload — then add your documents there.'
                };
        }
    }

    /** Where to paste Instructions / system behavior in each host UI. */
    function instructionsPasteCue(modelId) {
        var id = String(modelId || '').toLowerCase();
        switch (id) {
            case 'claude':
                return { pathPlain: 'Project → Instructions' };
            case 'grok':
                return { pathPlain: 'Project → Instructions (or custom system prompt field)' };
            case 'chatgpt':
                return { pathPlain: 'Custom GPT → Configure → Instructions' };
            case 'gemini':
                return { pathPlain: 'Gem → Instructions' };
            default:
                return {
                    pathPlain:
                        'Find Instructions, System prompt, or Custom instructions in your project or workspace settings.'
                };
        }
    }

    /** Host project workspace name + whether it has native project sections. */
    function setupHostLanes(modelId) {
        var id = String(modelId || '').toLowerCase();
        switch (id) {
            case 'claude':
                return {
                    workspace: 'Claude Projects',
                    hasNativeProject: true,
                    knowledgeHost: 'Project → Files',
                    instructionsHost: 'Project → Instructions',
                    memoryHost: 'Project → Memory'
                };
            case 'grok':
                return {
                    workspace: 'Grok Projects',
                    hasNativeProject: true,
                    knowledgeHost: 'Project → Sources',
                    instructionsHost: 'Project → Instructions',
                    memoryHost: 'Settings → Memory'
                };
            case 'chatgpt':
                return {
                    workspace: 'Custom GPTs',
                    hasNativeProject: true,
                    knowledgeHost: 'Knowledge → Upload files',
                    instructionsHost: 'Configure → Instructions',
                    memoryHost: 'Settings → Personalization → Memory'
                };
            case 'gemini':
                return {
                    workspace: 'Gems',
                    hasNativeProject: true,
                    knowledgeHost: 'Gem → Files',
                    instructionsHost: 'Gem → Instructions',
                    memoryHost: 'Google account / product settings'
                };
            default:
                return {
                    workspace: 'your AI workspace',
                    hasNativeProject: false,
                    knowledgeHost: 'Files, Knowledge, or Sources',
                    instructionsHost: 'Instructions or System prompt',
                    memoryHost: 'Memory or personalization settings'
                };
        }
    }

    function ProjectSetupUI(container, engine, deps) {
        this.container = container;
        this.engine = engine;
        this.modelId = (deps && deps.modelId) || 'claude';
        this.onNavigateTab = (deps && deps.onNavigateTab) || function () {};
        var rawStep =
            deps && typeof deps.initialStep === 'number' ? Math.round(deps.initialStep) : 0;
        if (!Number.isFinite(rawStep)) {
            rawStep = 0;
        }
        this.step = Math.max(0, Math.min(4, rawStep));
        this.destroyed = false;
    }

    ProjectSetupUI.prototype.destroy = function () {
        this.destroyed = true;
        this.container = null;
        this.engine = null;
    };

    ProjectSetupUI.prototype.refreshInstructionsPreview = function (textarea) {
        if (!textarea) return;
        var knowPlain = '';
        try {
            if (window.ProjectSetupKnowledge && window.ProjectSetupKnowledge.buildKnowledgeSummaryPlain) {
                knowPlain = window.ProjectSetupKnowledge.buildKnowledgeSummaryPlain({});
            }
        } catch (e) {
            /* empty */
        }
        try {
            var fmt = window.ProjectSetupInstructionsFormatter.formatForInstructions(
                this.engine,
                this.modelId,
                { chatgptKnowledgeBlock: knowPlain }
            );
            textarea.value = fmt.singleField;
        } catch (err) {
            textarea.value = String(err.message || err);
        }
    };

    ProjectSetupUI.prototype.listSavedConfigs = function () {
        try {
            var raw = localStorage.getItem('aituner_configs');
            if (!raw) return [];
            var parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    };

    ProjectSetupUI.prototype.tplStep0 = function () {
        var name = escapeHtml(modelDisplayForId(this.modelId));
        var lanes = setupHostLanes(this.modelId);
        var framing =
            lanes.hasNativeProject
                ? 'This walkthrough mirrors how ' +
                  lanes.workspace +
                  ' is organized in the app. Open your project there and fill three separate sections — in this order — so setup stays clean and you do not repeat yourself in every chat.'
                : 'Many AI apps split project setup into three sections: files for facts, a field for standing behavior, and memory that grows over time. Where your app offers those areas, use this sequence — it is the efficient way to get a project ready.';
        return (
            '<div class="room-screen room-setup-wizard">' +
            '<p class="narrative-label">Project setup</p>' +
            '<h1 class="room-setup-title">Configure your working environment — for ' +
            name +
            '</h1>' +
            '<p class="room-setup-lead">' +
            escapeHtml(
                'You\'re setting up three things. Each stays in its lane — don\'t mix Knowledge into Instructions.'
            ) +
            '</p>' +
            '<p class="room-setup-framing">' +
            escapeHtml(framing) +
            '</p>' +
            '<div class="room-setup-lane-callout" role="note">' +
            '<p class="room-setup-lane-callout-title">Keep each lane separate</p>' +
            '<p class="room-setup-lane-callout-body">' +
            escapeHtml(
                'Upload documents and facts as Knowledge. Paste tuned behavior into Instructions. Use Memory for what the AI learns across chats — not for files or standing rules. Putting a project brief into Instructions makes behavior muddy and hard to update.'
            ) +
            '</p>' +
            '</div>' +
            '<div class="room-setup-zone-row">' +
            '<div class="room-setup-zone room-setup-zone-k"><strong>Knowledge</strong><span>Files &amp; facts</span><span class="room-setup-zone-host">' +
            escapeHtml(lanes.knowledgeHost) +
            '</span></div>' +
            '<div class="room-setup-zone room-setup-zone-i"><strong>Instructions</strong><span>Standing behavior</span><span class="room-setup-zone-host">' +
            escapeHtml(lanes.instructionsHost) +
            '</span></div>' +
            '<div class="room-setup-zone room-setup-zone-m"><strong>Memory</strong><span>Emergent over time</span><span class="room-setup-zone-host">' +
            escapeHtml(lanes.memoryHost) +
            '</span></div>' +
            '</div>' +
            '<p class="room-setup-steps-intro">Three steps in this guide — one per lane:</p>' +
            '<ol class="room-setup-steps-overview">' +
            '<li><strong>Knowledge</strong> — what to upload and where in ' +
            name +
            '</li>' +
            '<li><strong>Instructions</strong> — copy your tuned behavior prompt (from Tune)</li>' +
            '<li><strong>Memory</strong> — prompts to steer what it remembers later</li>' +
            '</ol>' +
            '<button type="button" class="primary-btn" data-setup-next="1">Start with Knowledge →</button>' +
            '</div>'
        );
    };

    ProjectSetupUI.prototype.tplStep1 = function () {
        var modelName = escapeHtml(modelDisplayForId(this.modelId));
        var cue = knowledgeUploadCue(this.modelId);
        var pathEsc = escapeHtml(cue.pathPlain);
        return (
            '<div class="room-screen room-setup-wizard">' +
            '<p class="room-setup-meta">Step 1 of 3 · Knowledge lane</p>' +
            '<h2 class="room-setup-title">Upload project files</h2>' +
            '<p class="room-setup-lead">' +
            escapeHtml(
                'In ' +
                    modelDisplayForId(this.modelId) +
                    ', open your project and use the Knowledge / Files area — not Instructions. Upload documents that describe you, your project, and your context. The AI reads them once and carries that forward in every chat inside the project.'
            ) +
            '</p>' +
            '<p class="room-setup-lane-reminder">' +
            escapeHtml('Do not paste these into Instructions — that field is for behavior rules (Step 2).') +
            '</p>' +
            '<ul class="room-setup-brief-checklist">' +
            '<li><span class="room-setup-check-title">A document about you</span> — ' +
            escapeHtml('name, role, expertise, how you work') +
            '</li>' +
            '<li><span class="room-setup-check-title">Your project documents</span> — ' +
            escapeHtml('briefs, research, reference material, decisions made') +
            '</li>' +
            '<li><span class="room-setup-check-title">Key people and terminology</span> — ' +
            escapeHtml('names, relationships, project-specific terms') +
            '</li>' +
            '<li><span class="room-setup-check-title">Frameworks you use</span> — ' +
            escapeHtml('mental models, methodologies, ways of thinking') +
            '</li>' +
            '<li><span class="room-setup-check-title">Relevant history</span> — ' +
            escapeHtml('past work, context that makes current work make sense') +
            '</li>' +
            '</ul>' +
            '<p class="room-setup-brief-ai-note">' +
            escapeHtml(
                'The AI reads these once and treats them as standing knowledge — you don\'t have to repeat yourself in every conversation.'
            ) +
            '</p>' +
            '<div class="room-setup-upload-block">' +
            '<p class="room-setup-field-label">Where to upload in ' +
            modelName +
            '</p>' +
            '<p class="room-setup-upload-path" aria-live="polite">' +
            pathEsc +
            '</p>' +
            '</div>' +
            '<div class="room-setup-actions">' +
            '<button type="button" class="secondary-btn" data-setup-next="0">← Back</button>' +
            '<button type="button" class="primary-btn" data-setup-next="2">Continue →</button>' +
            '</div>' +
            '</div>'
        );
    };

    ProjectSetupUI.prototype.tplStep2 = function () {
        var configs = this.listSavedConfigs();
        var modelName = escapeHtml(modelDisplayForId(this.modelId));
        var insCue = instructionsPasteCue(this.modelId);
        var insPath = escapeHtml(insCue.pathPlain);
        var btns = configs
            .map(function (c) {
                return (
                    '<button type="button" class="secondary-btn room-setup-config-chip" data-setup-load-config="' +
                    escapeHtml(c.id) +
                    '">' +
                    escapeHtml(c.name || c.id || 'Saved') +
                    '</button>'
                );
            })
            .join('');
        return (
            '<div class="room-screen room-setup-wizard">' +
            '<p class="room-setup-meta">Step 2 of 3 · Instructions lane</p>' +
            '<h2 class="room-setup-title">Paste standing behavior</h2>' +
            '<p class="room-setup-lead">' +
            escapeHtml(
                'This is how you want ' +
                    modelDisplayForId(this.modelId) +
                    ' to behave in every conversation — tone, depth, initiative, formatting. Built from your Tune settings. Project facts and documents belong in Knowledge (Step 1), not here.'
            ) +
            '</p>' +
            '<p class="room-setup-hint">' +
            escapeHtml(
                'Adjust levers in Tune first if the preview is not right, then copy and paste into your project Instructions field.'
            ) +
            '</p>' +
            '<div class="room-setup-upload-block">' +
            '<p class="room-setup-field-label">Where to paste in ' +
            modelName +
            '</p>' +
            '<p class="room-setup-upload-path" aria-live="polite">' +
            insPath +
            '</p>' +
            '</div>' +
            (configs.length
                ? '<div class="room-setup-saved-inline"><span class="room-setup-micro">Load saved configs:</span> ' +
                  btns +
                  '</div>'
                : '') +
            '<label class="room-setup-field-label">Instructions preview</label>' +
            '<textarea readonly class="room-setup-preview" id="setup-instructions-preview" rows="14"></textarea>' +
            '<div class="room-setup-actions">' +
            '<button type="button" class="secondary-btn" data-setup-next="1">← Back</button>' +
            '<button type="button" class="secondary-btn" id="setup-goto-tune">Configure in Tune →</button>' +
            '<button type="button" class="secondary-btn" id="setup-instructions-copy">Copy Instructions</button>' +
            '<button type="button" class="primary-btn" data-setup-next="3">Continue →</button>' +
            '</div>' +
            '</div>'
        );
    };

    ProjectSetupUI.prototype.tplStep3 = function () {
        var g = window.ProjectSetupMemoryGuide.getMemoryGuide(this.modelId);
        var cmds = g.commands.map(function (c) {
            return '<li>' + escapeHtml(c) + '</li>';
        }).join('');
        var seeds =
            g.seeds && g.seeds.length
                ? '<p class="room-setup-micro">Starter ideas:</p><ul class="room-setup-inline-list">' +
                  g.seeds
                      .map(function (s) {
                          return '<li>' + escapeHtml(s) + '</li>';
                      })
                      .join('') +
                  '</ul>'
                : '';
        var where =
            g.whereToLook != null && String(g.whereToLook).trim()
                ? '<p class="room-setup-micro">' + escapeHtml('Where: ' + g.whereToLook) + '</p>'
                : '';
        return (
            '<div class="room-screen room-setup-wizard">' +
            '<p class="room-setup-meta">Step 3 of 3 · Memory lane</p>' +
            '<h2 class="room-setup-title">Steer what it learns over time</h2>' +
            '<p class="room-setup-lead">' +
            escapeHtml(
                'Memory is the third lane — separate from files (Knowledge) and behavior rules (Instructions). Use these prompts in chat when you want the AI to remember, update, or forget something about you or the project.'
            ) +
            '</p>' +
            '<p class="room-setup-lead-soft">' +
            escapeHtml(g.intro) +
            '</p>' +
            where +
            '<ul class="room-setup-cmd-list">' +
            cmds +
            '</ul>' +
            seeds +
            '<div class="room-setup-actions">' +
            '<button type="button" class="secondary-btn" data-setup-next="2">← Back</button>' +
            '<button type="button" class="secondary-btn" id="setup-memory-copy">Copy prompts list</button>' +
            '<button type="button" class="primary-btn" data-setup-next="4">Done →</button>' +
            '</div>' +
            '</div>'
        );
    };

    ProjectSetupUI.prototype.tplStep4 = function () {
        var name = escapeHtml(modelDisplayForId(this.modelId));
        var lanes = setupHostLanes(this.modelId);
        var knowPath = escapeHtml(knowledgeUploadCue(this.modelId).pathPlain);
        var insPath = escapeHtml(instructionsPasteCue(this.modelId).pathPlain);
        var memPath = escapeHtml(lanes.memoryHost);
        return (
            '<div class="room-screen room-setup-wizard">' +
            '<p class="narrative-label">Project ready</p>' +
            '<h2 class="room-setup-title">Your ' +
            name +
            ' workspace — three lanes filled</h2>' +
            '<p class="room-setup-lead">' +
            escapeHtml(
                'You now have what you need to configure a project in ' +
                    modelDisplayForId(this.modelId) +
                    '. Each item goes in its own section in the app — keep them separate when you paste or upload.'
            ) +
            '</p>' +
            '<ul class="room-setup-summary-list">' +
            '<li><strong>Knowledge:</strong> upload files at ' +
            knowPath +
            '</li>' +
            '<li><strong>Instructions:</strong> paste behavior prompt at ' +
            insPath +
            '</li>' +
            '<li><strong>Memory:</strong> use chat prompts from Step 3; review at ' +
            memPath +
            '</li>' +
            '</ul>' +
            '<div class="room-setup-actions">' +
            '<button type="button" class="secondary-btn" data-setup-next="0">Restart guide</button>' +
            '<button type="button" class="primary-btn" data-setup-next="1">Jump to Knowledge</button>' +
            '</div>' +
            '</div>'
        );
    };

    ProjectSetupUI.prototype.wire = function () {
        var self = this;
        var root = this.container;

        root.querySelectorAll('[data-setup-next]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var n = parseInt(btn.getAttribute('data-setup-next'), 10);
                if (Number.isNaN(n)) return;
                self.step = n;
                self.render();
            });
        });

        var insCopy = root.querySelector('#setup-instructions-copy');
        if (insCopy) {
            insCopy.addEventListener('click', function () {
                var knowPlain = '';
                try {
                    if (window.ProjectSetupKnowledge && window.ProjectSetupKnowledge.buildKnowledgeSummaryPlain) {
                        knowPlain = window.ProjectSetupKnowledge.buildKnowledgeSummaryPlain({});
                    }
                } catch (e) {
                    /* empty */
                }
                try {
                    var fmt = window.ProjectSetupInstructionsFormatter.formatForInstructions(
                        self.engine,
                        self.modelId,
                        { chatgptKnowledgeBlock: knowPlain }
                    );
                    navigator.clipboard.writeText(fmt.singleField).catch(function () {});
                } catch (err) {
                    console.error(err);
                }
            });
        }

        root.querySelectorAll('[data-setup-load-config]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = btn.getAttribute('data-setup-load-config');
                if (typeof self.engine.loadConfig === 'function') {
                    self.engine.loadConfig(id);
                    requestAnimationFrame(function () {
                        var ta = self.container.querySelector('#setup-instructions-preview');
                        self.refreshInstructionsPreview(ta);
                    });
                }
            });
        });

        var goTune = root.querySelector('#setup-goto-tune');
        if (goTune) {
            goTune.addEventListener('click', function () {
                self.onNavigateTab('tune', { fromSetupStep2: true });
            });
        }

        var memCopy = root.querySelector('#setup-memory-copy');
        if (memCopy) {
            memCopy.addEventListener('click', function () {
                var g = window.ProjectSetupMemoryGuide.getMemoryGuide(self.modelId);
                var parts = [g.intro];
                if (g.whereToLook) {
                    parts.push('\nWhere: ' + g.whereToLook);
                }
                parts.push('\n\nPrompt commands:\n' + g.commands.join('\n'));
                navigator.clipboard.writeText(parts.join('').trim()).catch(function () {});
            });
        }
    };

    ProjectSetupUI.prototype.render = function () {
        var self = this;
        if (!this.container || this.destroyed) return;
        this.engine.selectModel(this.modelId);
        this.engine.generatePrompt();
        var mk = '';
        switch (this.step) {
            case 0:
                mk = this.tplStep0();
                break;
            case 1:
                mk = this.tplStep1();
                break;
            case 2:
                mk = this.tplStep2();
                break;
            case 3:
                mk = this.tplStep3();
                break;
            case 4:
                mk = this.tplStep4();
                break;
            default:
                this.step = 0;
                mk = this.tplStep0();
        }
        this.container.innerHTML = mk;
        this.wire();
        if (this.step === 2) {
            requestAnimationFrame(function () {
                if (self.destroyed) return;
                var ta = self.container.querySelector('#setup-instructions-preview');
                self.refreshInstructionsPreview(ta);
            });
        }
    };

    global.ProjectSetupUI = ProjectSetupUI;
})(typeof window !== 'undefined' ? window : globalThis);
