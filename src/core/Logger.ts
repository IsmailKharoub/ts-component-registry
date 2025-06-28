/**
 * Logger utility for ts-component-map
 * Provides clean, configurable logging with different levels
 */

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    SILENT = 4
}

export interface LoggerConfig {
    level: LogLevel;
    enableColors: boolean;
    enableTimestamp: boolean;
    prefix: string;
}

export class Logger {
    private static instance: Logger;
    private config: LoggerConfig;

    private constructor(config: Partial<LoggerConfig> = {}) {
        this.config = {
            level: LogLevel.INFO,
            enableColors: true,
            enableTimestamp: false,
            prefix: '[ts-component-map]',
            ...config
        };
    }

    public static getInstance(config?: Partial<LoggerConfig>): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger(config);
        }
        return Logger.instance;
    }

    public static configure(config: Partial<LoggerConfig>): void {
        if (Logger.instance) {
            Logger.instance.config = { ...Logger.instance.config, ...config };
        } else {
            Logger.instance = new Logger(config);
        }
    }

    private shouldLog(level: LogLevel): boolean {
        return level >= this.config.level;
    }

    private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
        let formattedMessage = '';

        if (this.config.enableTimestamp) {
            formattedMessage += `[${new Date().toISOString()}] `;
        }

        if (this.config.prefix) {
            formattedMessage += `${this.config.prefix} `;
        }

        if (this.config.enableColors) {
            const colors = {
                [LogLevel.DEBUG]: '\x1b[36m', // Cyan
                [LogLevel.INFO]: '\x1b[32m',  // Green
                [LogLevel.WARN]: '\x1b[33m',  // Yellow
                [LogLevel.ERROR]: '\x1b[31m', // Red
                [LogLevel.SILENT]: ''
            };
            const reset = '\x1b[0m';
            formattedMessage += `${colors[level] || ''}${message}${reset}`;
        } else {
            formattedMessage += message;
        }

        return formattedMessage;
    }

    public debug(message: string, ...args: any[]): void {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.debug(this.formatMessage(LogLevel.DEBUG, message), ...args);
        }
    }

    public info(message: string, ...args: any[]): void {
        if (this.shouldLog(LogLevel.INFO)) {
            console.info(this.formatMessage(LogLevel.INFO, message), ...args);
        }
    }

    public warn(message: string, ...args: any[]): void {
        if (this.shouldLog(LogLevel.WARN)) {
            console.warn(this.formatMessage(LogLevel.WARN, message), ...args);
        }
    }

    public error(message: string, ...args: any[]): void {
        if (this.shouldLog(LogLevel.ERROR)) {
            console.error(this.formatMessage(LogLevel.ERROR, message), ...args);
        }
    }

    public setLevel(level: LogLevel): void {
        this.config.level = level;
    }

    public enableColors(enable: boolean): void {
        this.config.enableColors = enable;
    }

    public enableTimestamp(enable: boolean): void {
        this.config.enableTimestamp = enable;
    }

    public setPrefix(prefix: string): void {
        this.config.prefix = prefix;
    }
}

// Export a default logger instance for convenience
export const logger = Logger.getInstance(); 