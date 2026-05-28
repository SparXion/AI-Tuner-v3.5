/**
 * @fileoverview Type definitions for AI Tuner Extension
 * @author SparXion
 * @version 2.0.0
 * @license Apache-2.0
 */

/**
 * Comprehensive AI Tuner settings interface with strict typing
 * @interface AITunerSettings
 */
export interface AITunerSettings {
  /** Personality approach for AI responses */
  personality: 'neutral' | 'socratic' | 'curious' | 'analytical' | 'sarcastic' | 'witty' | 'charming' | 'sympathetic' | 'empathetic' | 'directive' | 'collaborative' | 'provocative';
  
  /** Communication bluntness level */
  bluntness: 'low' | 'medium' | 'high' | 'absolute';
  
  /** Response termination style */
  termination: 'natural' | 'abrupt';
  
  /** Cognitive processing depth */
  cognitiveTier: 'surface' | 'deep';
  
  /** Tone neutrality level */
  toneNeutrality: 'full' | 'partial' | 'off';
  
  /** Sentiment boosting behavior */
  sentimentBoost: 'disabled' | 'selective' | 'enabled';
  
  /** Mirror avoidance behavior */
  mirrorAvoidance: 'strict' | 'selective' | 'allowed';
  
  /** Element elimination level */
  elementElimination: 'none' | 'minimal' | 'moderate' | 'strict';
  
  /** Transition usage */
  transitions: 'allowed' | 'minimal' | 'prohibited';
  
  /** Call-to-action usage */
  callToAction: 'allowed' | 'minimal' | 'prohibited';
  
  /** Question asking behavior */
  questions: 'allowed' | 'selective' | 'prohibited';
  
  /** Suggestion providing behavior */
  suggestions: 'allowed' | 'minimal' | 'prohibited';
  
  /** Motivational content usage */
  motivational: 'allowed' | 'minimal' | 'prohibited';
  
  /** Continuation bias behavior */
  continuationBias: 'allowed' | 'suppressed';
  
  /** Self-sufficiency approach */
  selfSufficiency: 'collaborative' | 'independent' | 'obsolescence';
  
  /** Assumption strength level */
  assumptionStrength: 'weak' | 'medium' | 'strong';
  
  // === NEW: Truth & Epistemology ===
  /** Truth prioritization approach */
  truthPrioritization?: 'comfort-first' | 'balanced' | 'truth-first' | 'absolute';
  
  /** Source transparency level */
  sourceTransparency?: 'disabled' | 'selective' | 'enabled';
  
  /** Uncertainty admission requirement */
  uncertaintyAdmission?: 'prohibited' | 'allowed' | 'required';
  
  // === NEW: Humor & Meta ===
  /** Self-referential humor usage */
  selfReferentialHumor?: 'disabled' | 'selective' | 'allowed';
  
  /** Absurdism injection level */
  absurdismInjection?: 'disabled' | 'selective' | 'enabled';
  
  // === NEW: Knowledge & Tool Use ===
  /** Tool invocation behavior */
  toolInvocation?: 'prohibited' | 'on-request' | 'proactive';
  
  /** Real-time data bias preference */
  realTimeDataBias?: 'disabled' | 'static-cutoff' | 'enabled';
  
  // === NEW: Interface & Flow > Formatting ===
  /** Structural formatting level */
  structuralFormatting?: 'none' | 'minimal' | 'rich';
  
  // === NEW: Goal Orientation > Existential Posture ===
  /** Cosmic perspective integration */
  cosmicPerspective?: 'disabled' | 'subtle' | 'overt';
}

/**
 * Performance metrics interface for monitoring
 * @interface PerformanceMetrics
 */
export interface PerformanceMetrics {
  /** Operation start time */
  startTime: number;
  /** Operation end time */
  endTime: number;
  /** Total duration in milliseconds */
  duration: number;
  /** Memory usage at operation start */
  memoryStart: number;
  /** Memory usage at operation end */
  memoryEnd: number;
  /** Memory delta */
  memoryDelta: number;
  /** Operation name */
  operation: string;
  /** Success status */
  success: boolean;
  /** Error message if failed */
  error?: string | undefined;
}

/**
 * Log level enumeration
 * @enum LogLevel
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

/**
 * Log entry interface
 * @interface LogEntry
 */
export interface LogEntry {
  /** Timestamp of log entry */
  timestamp: Date;
  /** Log level */
  level: LogLevel;
  /** Log message */
  message: string;
  /** Additional context data */
  context?: Record<string, unknown> | undefined;
  /** Source component */
  source: string;
  /** Error object if applicable */
  error?: Error | undefined;
}

/**
 * Configuration validation result
 * @interface ValidationResult
 */
export interface ValidationResult<T = AITunerSettings> {
  /** Whether validation passed */
  isValid: boolean;
  /** Validation errors */
  errors: string[];
  /** Validation warnings */
  warnings: string[];
  /** Validated settings */
  settings?: T | undefined;
}

/**
 * Preset configuration interface
 * @interface PresetConfig
 */
export interface PresetConfig {
  /** Preset name */
  name: string;
  /** Preset description */
  description: string;
  /** Preset settings */
  settings: AITunerSettings;
  /** Creation timestamp */
  createdAt: Date;
  /** Last modified timestamp */
  modifiedAt: Date;
}

/**
 * Extension configuration interface
 * @interface ExtensionConfig
 */
export interface ExtensionConfig {
  /** Enable performance monitoring */
  enablePerformanceMonitoring: boolean;
  /** Enable detailed logging */
  enableDetailedLogging: boolean;
  /** Log level threshold */
  logLevel: LogLevel;
  /** Enable error reporting */
  enableErrorReporting: boolean;
  /** Maximum log entries to keep */
  maxLogEntries: number;
  /** Enable memory monitoring */
  enableMemoryMonitoring: boolean;
}

/**
 * Webview message interface
 * @interface WebviewMessage
 */
export interface WebviewMessage {
  /** Message command */
  command: string;
  /** Message data */
  data?: Record<string, unknown>;
  /** Message timestamp */
  timestamp: number;
}

/**
 * Error context interface for enhanced error handling
 * @interface ErrorContext
 */
export interface ErrorContext {
  /** Operation that failed */
  operation: string;
  /** Component where error occurred */
  component: string;
  /** Additional context data */
  context?: Record<string, unknown>;
  /** User action that triggered error */
  userAction?: string;
  /** Recovery attempt count */
  recoveryAttempts?: number;
}

/**
 * Memory usage statistics
 * @interface MemoryStats
 */
export interface MemoryStats {
  /** Current memory usage in bytes */
  used: number;
  /** Peak memory usage in bytes */
  peak: number;
  /** Available memory in bytes */
  available: number;
  /** Memory usage percentage */
  percentage: number;
  /** Timestamp of measurement */
  timestamp: Date;
}
