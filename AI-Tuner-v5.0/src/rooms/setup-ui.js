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
            '<div class="room-setup-zone-row">' +
            '<div class="room-setup-zone room-setup-zone-k"><strong>Knowledge</strong><span>Files & facts</span></div>' +
            '<div class="room-setup-zone room-setup-zone-i"><strong>Instructions</strong><span>Standing behavior</span></div>' +
            '<div class="room-setup-zone room-setup-zone-m"><strong>Memory</strong><span>Emergent over time</span></div>' +
            '</div>' +
            '<button type="button" class="primary-btn" data-setup-next="1">Let\'s start →</button>' +
            '</div>'
        );
    };

    ProjectSetupUI.prototype.tplStep1 = function () {
        var modelName = escapeHtml(modelDisplayForId(this.modelId));
        var cue = knowledgeUploadCue(this.modelId);
        var pathEsc = escapeHtml(cue.pathPlain);
        return (
            '<div class="room-screen room-setup-wizard">' +
            '<p class="room-setup-meta">Step 1 · Knowledge · Zone 1 (static)</p>' +
            '<h2 class="room-setup-title">What to put in your files</h2>' +
            '<p class="room-setup-lead">' +
            escapeHtml(
                'Your AI works best when it knows who you are and what you\'re working on. Upload these as files in your project\'s knowledge section — the AI will treat them as standing context for every conversation.'
            ) +
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
            '<p class="room-setup-meta">Step 2 · Instructions · Zone 1 (behavior)</p>' +
            '<h2>Instructions content</h2>' +
            '<p class="room-setup-hint">' +
            escapeHtml(
                'Built from Tune using the clustering/synthesis engine. Adjust levers in Tune first if needed.'
            ) +
            '</p>' +
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
            '<p class="room-setup-meta">Step 3 · Memory · Zone 2</p>' +
            '<h2>Memory prompts</h2>' +
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
        return (
            '<div class="room-screen room-setup-wizard">' +
            '<p class="narrative-label">You\'re set up</p>' +
            '<h2>Three layers</h2>' +
            '<ul class="room-setup-summary-list">' +
            '<li><strong>Knowledge:</strong> upload files in your project\'s knowledge area (see Step 1)</li>' +
            '<li><strong>Instructions:</strong> copy from Step 2</li>' +
            '<li><strong>Memory:</strong> use prompt commands from Step 3</li>' +
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
