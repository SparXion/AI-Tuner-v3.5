/**
 * Project Setup — knowledge block for Instructions formatter.
 * Knowledge is uploaded as files in the host app (no generated template from Setup).
 */
(function (global) {
    'use strict';

    function buildKnowledgeSummaryPlain() {
        return '';
    }

    global.ProjectSetupKnowledge = {
        buildKnowledgeSummaryPlain: buildKnowledgeSummaryPlain
    };
})(typeof window !== 'undefined' ? window : globalThis);
