/**
 * AITuner v5.0 - Proposed Model Defaults
 * 
 * This file is written by the calibration tool pipeline.
 * It NEVER gets written to directly by the app.
 * 
 * After calibration runs, compare this file with v5-models.js
 * and manually promote changes via: npm run apply-calibration
 */

const MODELS_V5_PROPOSED = {
    // Calibration tool writes proposed updates here
    // Format matches MODELS_V5 structure
};

if (typeof window !== 'undefined') {
    window.MODELS_V5_PROPOSED = MODELS_V5_PROPOSED;
}
