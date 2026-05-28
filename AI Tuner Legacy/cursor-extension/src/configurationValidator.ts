/**
 * @fileoverview Enterprise-grade configuration validation and management system
 * @author SparXion
 * @version 2.0.0
 * @license Apache-2.0
 */

import { AITunerSettings, ValidationResult, ExtensionConfig, PresetConfig } from './types';
import { Logger } from './logger';
import { ErrorHandler, ConfigurationError } from './errorHandler';

/**
 * Comprehensive configuration validator with type safety and fallbacks
 * @class ConfigurationValidator
 */
export class ConfigurationValidator {
  private static instance: ConfigurationValidator;
  private logger: Logger;
  private errorHandler: ErrorHandler;

  /**
   * Private constructor for singleton pattern
   * @param config - Extension configuration
   * @param logger - Logger instance
   * @param errorHandler - Error handler instance
   */
  private constructor(_config: ExtensionConfig, logger: Logger, errorHandler: ErrorHandler) {
    this.logger = logger;
    this.errorHandler = errorHandler;
  }

  /**
   * Get singleton instance
   * @param config - Extension configuration
   * @param logger - Logger instance
   * @param errorHandler - Error handler instance
   * @returns ConfigurationValidator instance
   */
  public static getInstance(
    config?: ExtensionConfig,
    logger?: Logger,
    errorHandler?: ErrorHandler
  ): ConfigurationValidator {
    if (!ConfigurationValidator.instance && config && logger && errorHandler) {
      ConfigurationValidator.instance = new ConfigurationValidator(config, logger, errorHandler);
    }
    if (!ConfigurationValidator.instance) {
      throw new Error('ConfigurationValidator must be initialized with configuration, logger, and error handler');
    }
    return ConfigurationValidator.instance;
  }

  /**
   * Validate AI Tuner settings with comprehensive checks
   * @param settings - Settings to validate
   * @param source - Source of settings (user input, file, etc.)
   * @returns Validation result
   */
  public validateSettings(settings: Partial<AITunerSettings>, source: string = 'unknown'): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const validatedSettings: Partial<AITunerSettings> = {};

    try {
      this.logger.debug('Starting settings validation', 'ConfigurationValidator', {
        source,
        settingsCount: Object.keys(settings).length
      });

      // Validate personality
      if (settings.personality !== undefined) {
        const validPersonalities = ['neutral', 'socratic', 'curious', 'analytical', 'sarcastic', 'witty', 'charming', 'sympathetic', 'empathetic', 'directive', 'collaborative', 'provocative'];
        if (validPersonalities.includes(settings.personality)) {
          validatedSettings.personality = settings.personality;
        } else {
          errors.push(`Invalid personality: ${settings.personality}. Must be one of: ${validPersonalities.join(', ')}`);
        }
      }

      // Validate bluntness
      if (settings.bluntness !== undefined) {
        const validBluntness = ['low', 'medium', 'high', 'absolute'];
        if (validBluntness.includes(settings.bluntness)) {
          validatedSettings.bluntness = settings.bluntness;
        } else {
          errors.push(`Invalid bluntness: ${settings.bluntness}. Must be one of: ${validBluntness.join(', ')}`);
        }
      }

      // Validate termination
      if (settings.termination !== undefined) {
        const validTermination = ['natural', 'abrupt'];
        if (validTermination.includes(settings.termination)) {
          validatedSettings.termination = settings.termination;
        } else {
          errors.push(`Invalid termination: ${settings.termination}. Must be one of: ${validTermination.join(', ')}`);
        }
      }

      // Validate cognitive tier
      if (settings.cognitiveTier !== undefined) {
        const validCognitiveTier = ['surface', 'deep'];
        if (validCognitiveTier.includes(settings.cognitiveTier)) {
          validatedSettings.cognitiveTier = settings.cognitiveTier;
        } else {
          errors.push(`Invalid cognitive tier: ${settings.cognitiveTier}. Must be one of: ${validCognitiveTier.join(', ')}`);
        }
      }

      // Validate tone neutrality
      if (settings.toneNeutrality !== undefined) {
        const validToneNeutrality = ['full', 'partial', 'off'];
        if (validToneNeutrality.includes(settings.toneNeutrality)) {
          validatedSettings.toneNeutrality = settings.toneNeutrality;
        } else {
          errors.push(`Invalid tone neutrality: ${settings.toneNeutrality}. Must be one of: ${validToneNeutrality.join(', ')}`);
        }
      }

      // Validate sentiment boost
      if (settings.sentimentBoost !== undefined) {
        const validSentimentBoost = ['disabled', 'selective', 'enabled'];
        if (validSentimentBoost.includes(settings.sentimentBoost)) {
          validatedSettings.sentimentBoost = settings.sentimentBoost;
        } else {
          errors.push(`Invalid sentiment boost: ${settings.sentimentBoost}. Must be one of: ${validSentimentBoost.join(', ')}`);
        }
      }

      // Validate mirror avoidance
      if (settings.mirrorAvoidance !== undefined) {
        const validMirrorAvoidance = ['strict', 'selective', 'allowed'];
        if (validMirrorAvoidance.includes(settings.mirrorAvoidance)) {
          validatedSettings.mirrorAvoidance = settings.mirrorAvoidance;
        } else {
          errors.push(`Invalid mirror avoidance: ${settings.mirrorAvoidance}. Must be one of: ${validMirrorAvoidance.join(', ')}`);
        }
      }

      // Validate element elimination
      if (settings.elementElimination !== undefined) {
        const validElementElimination = ['none', 'minimal', 'moderate', 'strict'];
        if (validElementElimination.includes(settings.elementElimination)) {
          validatedSettings.elementElimination = settings.elementElimination;
        } else {
          errors.push(`Invalid element elimination: ${settings.elementElimination}. Must be one of: ${validElementElimination.join(', ')}`);
        }
      }

      // Validate transitions
      if (settings.transitions !== undefined) {
        const validTransitions = ['allowed', 'minimal', 'prohibited'];
        if (validTransitions.includes(settings.transitions)) {
          validatedSettings.transitions = settings.transitions;
        } else {
          errors.push(`Invalid transitions: ${settings.transitions}. Must be one of: ${validTransitions.join(', ')}`);
        }
      }

      // Validate call to action
      if (settings.callToAction !== undefined) {
        const validCallToAction = ['allowed', 'minimal', 'prohibited'];
        if (validCallToAction.includes(settings.callToAction)) {
          validatedSettings.callToAction = settings.callToAction;
        } else {
          errors.push(`Invalid call to action: ${settings.callToAction}. Must be one of: ${validCallToAction.join(', ')}`);
        }
      }

      // Validate questions
      if (settings.questions !== undefined) {
        const validQuestions = ['allowed', 'selective', 'prohibited'];
        if (validQuestions.includes(settings.questions)) {
          validatedSettings.questions = settings.questions;
        } else {
          errors.push(`Invalid questions: ${settings.questions}. Must be one of: ${validQuestions.join(', ')}`);
        }
      }

      // Validate suggestions
      if (settings.suggestions !== undefined) {
        const validSuggestions = ['allowed', 'minimal', 'prohibited'];
        if (validSuggestions.includes(settings.suggestions)) {
          validatedSettings.suggestions = settings.suggestions;
        } else {
          errors.push(`Invalid suggestions: ${settings.suggestions}. Must be one of: ${validSuggestions.join(', ')}`);
        }
      }

      // Validate motivational
      if (settings.motivational !== undefined) {
        const validMotivational = ['allowed', 'minimal', 'prohibited'];
        if (validMotivational.includes(settings.motivational)) {
          validatedSettings.motivational = settings.motivational;
        } else {
          errors.push(`Invalid motivational: ${settings.motivational}. Must be one of: ${validMotivational.join(', ')}`);
        }
      }

      // Validate continuation bias
      if (settings.continuationBias !== undefined) {
        const validContinuationBias = ['allowed', 'suppressed'];
        if (validContinuationBias.includes(settings.continuationBias)) {
          validatedSettings.continuationBias = settings.continuationBias;
        } else {
          errors.push(`Invalid continuation bias: ${settings.continuationBias}. Must be one of: ${validContinuationBias.join(', ')}`);
        }
      }

      // Validate self sufficiency
      if (settings.selfSufficiency !== undefined) {
        const validSelfSufficiency = ['collaborative', 'independent', 'obsolescence'];
        if (validSelfSufficiency.includes(settings.selfSufficiency)) {
          validatedSettings.selfSufficiency = settings.selfSufficiency;
        } else {
          errors.push(`Invalid self sufficiency: ${settings.selfSufficiency}. Must be one of: ${validSelfSufficiency.join(', ')}`);
        }
      }

      // Validate assumption strength
      if (settings.assumptionStrength !== undefined) {
        const validAssumptionStrength = ['weak', 'medium', 'strong'];
        if (validAssumptionStrength.includes(settings.assumptionStrength)) {
          validatedSettings.assumptionStrength = settings.assumptionStrength;
        } else {
          errors.push(`Invalid assumption strength: ${settings.assumptionStrength}. Must be one of: ${validAssumptionStrength.join(', ')}`);
        }
      }

      // Validate optional Truth & Epistemology fields
      if (settings.truthPrioritization !== undefined) {
        const validTruthPrioritization = ['comfort-first', 'balanced', 'truth-first', 'absolute'];
        if (validTruthPrioritization.includes(settings.truthPrioritization)) {
          validatedSettings.truthPrioritization = settings.truthPrioritization;
        } else {
          errors.push(`Invalid truth prioritization: ${settings.truthPrioritization}. Must be one of: ${validTruthPrioritization.join(', ')}`);
        }
      }

      if (settings.sourceTransparency !== undefined) {
        const validSourceTransparency = ['disabled', 'selective', 'enabled'];
        if (validSourceTransparency.includes(settings.sourceTransparency)) {
          validatedSettings.sourceTransparency = settings.sourceTransparency;
        } else {
          errors.push(`Invalid source transparency: ${settings.sourceTransparency}. Must be one of: ${validSourceTransparency.join(', ')}`);
        }
      }

      if (settings.uncertaintyAdmission !== undefined) {
        const validUncertaintyAdmission = ['prohibited', 'allowed', 'required'];
        if (validUncertaintyAdmission.includes(settings.uncertaintyAdmission)) {
          validatedSettings.uncertaintyAdmission = settings.uncertaintyAdmission;
        } else {
          errors.push(`Invalid uncertainty admission: ${settings.uncertaintyAdmission}. Must be one of: ${validUncertaintyAdmission.join(', ')}`);
        }
      }

      // Validate optional Humor & Meta fields
      if (settings.selfReferentialHumor !== undefined) {
        const validSelfReferentialHumor = ['disabled', 'selective', 'allowed'];
        if (validSelfReferentialHumor.includes(settings.selfReferentialHumor)) {
          validatedSettings.selfReferentialHumor = settings.selfReferentialHumor;
        } else {
          errors.push(`Invalid self-referential humor: ${settings.selfReferentialHumor}. Must be one of: ${validSelfReferentialHumor.join(', ')}`);
        }
      }

      if (settings.absurdismInjection !== undefined) {
        const validAbsurdismInjection = ['disabled', 'selective', 'enabled'];
        if (validAbsurdismInjection.includes(settings.absurdismInjection)) {
          validatedSettings.absurdismInjection = settings.absurdismInjection;
        } else {
          errors.push(`Invalid absurdism injection: ${settings.absurdismInjection}. Must be one of: ${validAbsurdismInjection.join(', ')}`);
        }
      }

      // Validate optional Knowledge & Tool Use fields
      if (settings.toolInvocation !== undefined) {
        const validToolInvocation = ['prohibited', 'on-request', 'proactive'];
        if (validToolInvocation.includes(settings.toolInvocation)) {
          validatedSettings.toolInvocation = settings.toolInvocation;
        } else {
          errors.push(`Invalid tool invocation: ${settings.toolInvocation}. Must be one of: ${validToolInvocation.join(', ')}`);
        }
      }

      if (settings.realTimeDataBias !== undefined) {
        const validRealTimeDataBias = ['disabled', 'static-cutoff', 'enabled'];
        if (validRealTimeDataBias.includes(settings.realTimeDataBias)) {
          validatedSettings.realTimeDataBias = settings.realTimeDataBias;
        } else {
          errors.push(`Invalid real-time data bias: ${settings.realTimeDataBias}. Must be one of: ${validRealTimeDataBias.join(', ')}`);
        }
      }

      // Validate optional Interface & Flow > Formatting field
      if (settings.structuralFormatting !== undefined) {
        const validStructuralFormatting = ['none', 'minimal', 'rich'];
        if (validStructuralFormatting.includes(settings.structuralFormatting)) {
          validatedSettings.structuralFormatting = settings.structuralFormatting;
        } else {
          errors.push(`Invalid structural formatting: ${settings.structuralFormatting}. Must be one of: ${validStructuralFormatting.join(', ')}`);
        }
      }

      // Validate optional Goal Orientation > Existential Posture field
      if (settings.cosmicPerspective !== undefined) {
        const validCosmicPerspective = ['disabled', 'subtle', 'overt'];
        if (validCosmicPerspective.includes(settings.cosmicPerspective)) {
          validatedSettings.cosmicPerspective = settings.cosmicPerspective;
        } else {
          errors.push(`Invalid cosmic perspective: ${settings.cosmicPerspective}. Must be one of: ${validCosmicPerspective.join(', ')}`);
        }
      }

      // Check for logical consistency
      this.validateLogicalConsistency(validatedSettings as AITunerSettings, warnings);

      // Check for completeness
      const missingFields = this.checkCompleteness(validatedSettings as AITunerSettings);
      if (missingFields.length > 0) {
        warnings.push(`Missing fields: ${missingFields.join(', ')}`);
      }

      const isValid = errors.length === 0;
      
      this.logger.info(`Settings validation completed`, 'ConfigurationValidator', {
        source,
        isValid,
        errorCount: errors.length,
        warningCount: warnings.length,
        validatedFields: Object.keys(validatedSettings).length
      });

      return {
        isValid,
        errors,
        warnings,
        settings: isValid ? validatedSettings as AITunerSettings : undefined
      };

    } catch (error) {
      const context = {
        operation: 'validate_settings',
        component: 'ConfigurationValidator',
        context: { source, settings }
      };

      this.errorHandler.handleError(error as Error, context);
      
      return {
        isValid: false,
        errors: [`Validation failed: ${(error as Error).message}`],
        warnings: [],
        settings: undefined
      };
    }
  }

  /**
   * Validate logical consistency of settings
   * @param settings - Settings to validate
   * @param warnings - Warnings array to populate
   */
  private validateLogicalConsistency(settings: AITunerSettings, warnings: string[]): void {
    // Check for conflicting settings
    if (settings.bluntness === 'absolute' && settings.personality === 'charming') {
      warnings.push('Absolute bluntness may conflict with charming personality');
    }

    if (settings.toneNeutrality === 'full' && settings.sentimentBoost === 'enabled') {
      warnings.push('Full tone neutrality may conflict with enabled sentiment boost');
    }

    if (settings.mirrorAvoidance === 'strict' && settings.personality === 'empathetic') {
      warnings.push('Strict mirror avoidance may conflict with empathetic personality');
    }

    if (settings.elementElimination === 'strict' && settings.personality === 'witty') {
      warnings.push('Strict element elimination may conflict with witty personality');
    }

    if (settings.questions === 'prohibited' && settings.personality === 'socratic') {
      warnings.push('Prohibited questions may conflict with Socratic personality');
    }

    if (settings.suggestions === 'prohibited' && settings.selfSufficiency === 'collaborative') {
      warnings.push('Prohibited suggestions may conflict with collaborative self-sufficiency');
    }

    if (settings.motivational === 'prohibited' && settings.personality === 'sympathetic') {
      warnings.push('Prohibited motivational content may conflict with sympathetic personality');
    }

    // Check for optimal combinations
    if (settings.bluntness === 'low' && settings.termination === 'abrupt') {
      warnings.push('Low bluntness with abrupt termination may create inconsistent tone');
    }

    if (settings.cognitiveTier === 'surface' && settings.assumptionStrength === 'strong') {
      warnings.push('Surface cognitive tier with strong assumptions may be contradictory');
    }
  }

  /**
   * Check for missing required fields
   * @param settings - Settings to check
   * @returns Array of missing field names
   */
  private checkCompleteness(settings: Partial<AITunerSettings>): string[] {
    const requiredFields: (keyof AITunerSettings)[] = [
      'personality', 'bluntness', 'termination', 'cognitiveTier', 'toneNeutrality',
      'sentimentBoost', 'mirrorAvoidance', 'elementElimination', 'transitions',
      'callToAction', 'questions', 'suggestions', 'motivational', 'continuationBias',
      'selfSufficiency', 'assumptionStrength'
    ];

    return requiredFields.filter(field => settings[field] === undefined);
  }

  /**
   * Sanitize user input to prevent injection attacks
   * @param input - User input to sanitize
   * @returns Sanitized input
   */
  public sanitizeInput(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }

    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/script/gi, '') // Remove script tags
      .trim()
      .substring(0, 1000); // Limit length
  }

  /**
   * Validate preset configuration
   * @param preset - Preset to validate
   * @returns Validation result
   */
  public validatePreset(preset: Partial<PresetConfig>): ValidationResult<PresetConfig> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate preset name
    if (!preset.name || typeof preset.name !== 'string') {
      errors.push('Preset name is required and must be a string');
    } else {
      const sanitizedName = this.sanitizeInput(preset.name);
      if (sanitizedName.length < 1 || sanitizedName.length > 50) {
        errors.push('Preset name must be between 1 and 50 characters');
      }
    }

    // Validate preset description
    if (preset.description && typeof preset.description !== 'string') {
      errors.push('Preset description must be a string');
    } else if (preset.description) {
      const sanitizedDescription = this.sanitizeInput(preset.description);
      if (sanitizedDescription.length > 200) {
        warnings.push('Preset description is very long');
      }
    }

    // Validate preset settings
    if (preset.settings) {
      const settingsValidation = this.validateSettings(preset.settings, 'preset');
      errors.push(...settingsValidation.errors);
      warnings.push(...settingsValidation.warnings);
    } else {
      errors.push('Preset settings are required');
    }

    // Validate timestamps
    if (preset.createdAt && !(preset.createdAt instanceof Date)) {
      errors.push('Created at timestamp must be a valid Date');
    }

    if (preset.modifiedAt && !(preset.modifiedAt instanceof Date)) {
      errors.push('Modified at timestamp must be a valid Date');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      settings: errors.length === 0 ? preset as PresetConfig : undefined
    };
  }

  /**
   * Validate extension configuration
   * @param config - Extension configuration to validate
   * @returns Validation result
   */
  public validateExtensionConfig(config: Partial<ExtensionConfig>): ValidationResult<ExtensionConfig> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const validatedConfig: Partial<ExtensionConfig> = {};

    // Validate boolean flags
    if (config.enablePerformanceMonitoring !== undefined) {
      if (typeof config.enablePerformanceMonitoring === 'boolean') {
        validatedConfig.enablePerformanceMonitoring = config.enablePerformanceMonitoring;
      } else {
        errors.push('Enable performance monitoring must be a boolean');
      }
    }

    if (config.enableDetailedLogging !== undefined) {
      if (typeof config.enableDetailedLogging === 'boolean') {
        validatedConfig.enableDetailedLogging = config.enableDetailedLogging;
      } else {
        errors.push('Enable detailed logging must be a boolean');
      }
    }

    if (config.enableErrorReporting !== undefined) {
      if (typeof config.enableErrorReporting === 'boolean') {
        validatedConfig.enableErrorReporting = config.enableErrorReporting;
      } else {
        errors.push('Enable error reporting must be a boolean');
      }
    }

    if (config.enableMemoryMonitoring !== undefined) {
      if (typeof config.enableMemoryMonitoring === 'boolean') {
        validatedConfig.enableMemoryMonitoring = config.enableMemoryMonitoring;
      } else {
        errors.push('Enable memory monitoring must be a boolean');
      }
    }

    // Validate numeric values
    if (config.maxLogEntries !== undefined) {
      if (typeof config.maxLogEntries === 'number' && config.maxLogEntries > 0 && config.maxLogEntries <= 10000) {
        validatedConfig.maxLogEntries = config.maxLogEntries;
      } else {
        errors.push('Max log entries must be a number between 1 and 10000');
      }
    }

    // Validate log level
    if (config.logLevel !== undefined) {
      if (typeof config.logLevel === 'number' && config.logLevel >= 0 && config.logLevel <= 4) {
        validatedConfig.logLevel = config.logLevel;
      } else {
        errors.push('Log level must be a number between 0 and 4');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      settings: errors.length === 0 ? validatedConfig as ExtensionConfig : undefined
    };
  }

  /**
   * Get default settings with validation
   * @returns Default validated settings
   */
  public getDefaultSettings(): AITunerSettings {
    const defaultSettings: AITunerSettings = {
      personality: 'neutral',
      bluntness: 'medium',
      termination: 'natural',
      cognitiveTier: 'surface',
      toneNeutrality: 'partial',
      sentimentBoost: 'selective',
      mirrorAvoidance: 'selective',
      elementElimination: 'minimal',
      transitions: 'allowed',
      callToAction: 'allowed',
      questions: 'allowed',
      suggestions: 'allowed',
      motivational: 'minimal',
      continuationBias: 'allowed',
      selfSufficiency: 'collaborative',
      assumptionStrength: 'medium'
    };

    const validation = this.validateSettings(defaultSettings, 'default');
    if (!validation.isValid) {
      this.logger.error('Default settings validation failed', 'ConfigurationValidator', undefined, {
        errors: validation.errors
      });
      throw new ConfigurationError('Default settings are invalid', {
        operation: 'get_default_settings',
        component: 'ConfigurationValidator',
        context: { errors: validation.errors }
      });
    }

    return defaultSettings;
  }

  /**
   * Dispose of configuration validator resources
   */
  public dispose(): void {
    this.logger.info('Configuration validator disposed', 'ConfigurationValidator');
  }
}
