/**
 * @fileoverview Enterprise-grade logging system for AI Tuner Extension
 * @author SparXion
 * @version 2.0.0
 * @license Apache-2.0
 */

import * as vscode from 'vscode';
import { LogLevel, LogEntry, ExtensionConfig } from './types';

/**
 * Enterprise-grade logger with performance monitoring and output channels
 * @class Logger
 */
export class Logger {
  private static instance: Logger;
  private outputChannel: vscode.OutputChannel;
  private logLevel: LogLevel;
  private logEntries: LogEntry[] = [];
  private maxEntries: number;
  private performanceMetrics: Map<string, number[]> = new Map();

  /**
   * Private constructor for singleton pattern
   * @param config - Extension configuration
   */
  private constructor(config: ExtensionConfig) {
    this.outputChannel = vscode.window.createOutputChannel('AI Tuner');
    this.logLevel = config.logLevel;
    this.maxEntries = config.maxLogEntries;
  }

  /**
   * Get singleton instance
   * @param config - Extension configuration
   * @returns Logger instance
   */
  public static getInstance(config?: ExtensionConfig): Logger {
    if (!Logger.instance && config) {
      Logger.instance = new Logger(config);
    }
    if (!Logger.instance) {
      throw new Error('Logger must be initialized with configuration');
    }
    return Logger.instance;
  }

  /**
   * Log a message with specified level
   * @param level - Log level
   * @param message - Log message
   * @param source - Source component
   * @param context - Additional context
   * @param error - Error object if applicable
   */
  private log(
    level: LogLevel,
    message: string,
    source: string,
    context?: Record<string, unknown>,
    error?: Error
  ): void {
    if (level < this.logLevel) {
      return;
    }

    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context: context ?? {},
      source,
      error: error ?? undefined
    };

    this.logEntries.push(logEntry);
    this.trimLogEntries();

    const levelName = LogLevel[level];
    const timestamp = logEntry.timestamp.toISOString();
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    const errorStr = error ? ` | Error: ${error.message}` : '';
    
    const logMessage = `[${timestamp}] ${levelName} | ${source} | ${message}${contextStr}${errorStr}`;
    
    this.outputChannel.appendLine(logMessage);

    // Show critical errors to user
    if (level >= LogLevel.CRITICAL) {
      vscode.window.showErrorMessage(`AI Tuner Critical Error: ${message}`);
    }
  }

  /**
   * Log debug message
   * @param message - Debug message
   * @param source - Source component
   * @param context - Additional context
   */
  public debug(message: string, source: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, source, context);
  }

  /**
   * Log info message
   * @param message - Info message
   * @param source - Source component
   * @param context - Additional context
   */
  public info(message: string, source: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, source, context);
  }

  /**
   * Log warning message
   * @param message - Warning message
   * @param source - Source component
   * @param context - Additional context
   */
  public warn(message: string, source: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, source, context);
  }

  /**
   * Log error message
   * @param message - Error message
   * @param source - Source component
   * @param error - Error object
   * @param context - Additional context
   */
  public error(message: string, source: string, error?: Error, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, source, context, error);
  }

  /**
   * Log critical error message
   * @param message - Critical error message
   * @param source - Source component
   * @param error - Error object
   * @param context - Additional context
   */
  public critical(message: string, source: string, error?: Error, context?: Record<string, unknown>): void {
    this.log(LogLevel.CRITICAL, message, source, context, error);
  }

  /**
   * Record performance metric
   * @param operation - Operation name
   * @param duration - Duration in milliseconds
   */
  public recordPerformance(operation: string, duration: number): void {
    if (!this.performanceMetrics.has(operation)) {
      this.performanceMetrics.set(operation, []);
    }
    
    const metrics = this.performanceMetrics.get(operation)!;
    metrics.push(duration);
    
    // Keep only last 100 measurements
    if (metrics.length > 100) {
      metrics.shift();
    }

    this.debug(`Performance: ${operation} took ${duration}ms`, 'PerformanceMonitor', {
      operation,
      duration,
      average: this.getAveragePerformance(operation)
    });
  }

  /**
   * Get average performance for operation
   * @param operation - Operation name
   * @returns Average duration in milliseconds
   */
  public getAveragePerformance(operation: string): number {
    const metrics = this.performanceMetrics.get(operation);
    if (!metrics || metrics.length === 0) {
      return 0;
    }
    
    return metrics.reduce((sum, duration) => sum + duration, 0) / metrics.length;
  }

  /**
   * Get recent log entries
   * @param count - Number of entries to return
   * @returns Array of log entries
   */
  public getRecentLogs(count: number = 50): LogEntry[] {
    return this.logEntries.slice(-count);
  }

  /**
   * Get performance metrics summary
   * @returns Performance metrics summary
   */
  public getPerformanceSummary(): Record<string, { average: number; count: number; min: number; max: number }> {
    const summary: Record<string, { average: number; count: number; min: number; max: number }> = {};
    
    for (const [operation, metrics] of this.performanceMetrics) {
      if (metrics.length > 0) {
        summary[operation] = {
          average: metrics.reduce((sum, duration) => sum + duration, 0) / metrics.length,
          count: metrics.length,
          min: Math.min(...metrics),
          max: Math.max(...metrics)
        };
      }
    }
    
    return summary;
  }

  /**
   * Clear all logs
   */
  public clearLogs(): void {
    this.logEntries = [];
    this.outputChannel.clear();
    this.info('Logs cleared', 'Logger');
  }

  /**
   * Export logs to file
   * @param filePath - File path to export to
   */
  public async exportLogs(filePath: string): Promise<void> {
    try {
      const logData = {
        exportedAt: new Date().toISOString(),
        logLevel: LogLevel[this.logLevel],
        entries: this.logEntries,
        performanceSummary: this.getPerformanceSummary()
      };

      await vscode.workspace.fs.writeFile(
        vscode.Uri.file(filePath),
        Buffer.from(JSON.stringify(logData, null, 2))
      );

      this.info(`Logs exported to ${filePath}`, 'Logger', { filePath, entryCount: this.logEntries.length });
    } catch (error) {
      this.error('Failed to export logs', 'Logger', error as Error, { filePath });
      throw error;
    }
  }

  /**
   * Trim log entries to maximum allowed
   */
  private trimLogEntries(): void {
    if (this.logEntries.length > this.maxEntries) {
      this.logEntries = this.logEntries.slice(-this.maxEntries);
    }
  }

  /**
   * Dispose of logger resources
   */
  public dispose(): void {
    this.outputChannel.dispose();
    this.logEntries = [];
    this.performanceMetrics.clear();
  }
}
