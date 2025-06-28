/**
 * Logger utility for ts-component-map
 * Provides clean, configurable logging with different levels
 */
export declare enum LogLevel {
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
export declare class Logger {
    private static instance;
    private config;
    private constructor();
    static getInstance(config?: Partial<LoggerConfig>): Logger;
    static configure(config: Partial<LoggerConfig>): void;
    private shouldLog;
    private formatMessage;
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    setLevel(level: LogLevel): void;
    enableColors(enable: boolean): void;
    enableTimestamp(enable: boolean): void;
    setPrefix(prefix: string): void;
}
export declare const logger: Logger;
//# sourceMappingURL=Logger.d.ts.map