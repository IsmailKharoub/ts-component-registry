"use strict";
/**
 * Logger utility for ts-component-map
 * Provides clean, configurable logging with different levels
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["SILENT"] = 4] = "SILENT";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class Logger {
    constructor(config = {}) {
        this.config = {
            level: LogLevel.INFO,
            enableColors: true,
            enableTimestamp: false,
            prefix: '[ts-component-map]',
            ...config
        };
    }
    static getInstance(config) {
        if (!Logger.instance) {
            Logger.instance = new Logger(config);
        }
        return Logger.instance;
    }
    static configure(config) {
        if (Logger.instance) {
            Logger.instance.config = { ...Logger.instance.config, ...config };
        }
        else {
            Logger.instance = new Logger(config);
        }
    }
    shouldLog(level) {
        return level >= this.config.level;
    }
    formatMessage(level, message, ...args) {
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
                [LogLevel.INFO]: '\x1b[32m', // Green
                [LogLevel.WARN]: '\x1b[33m', // Yellow
                [LogLevel.ERROR]: '\x1b[31m', // Red
                [LogLevel.SILENT]: ''
            };
            const reset = '\x1b[0m';
            formattedMessage += `${colors[level] || ''}${message}${reset}`;
        }
        else {
            formattedMessage += message;
        }
        return formattedMessage;
    }
    debug(message, ...args) {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.debug(this.formatMessage(LogLevel.DEBUG, message), ...args);
        }
    }
    info(message, ...args) {
        if (this.shouldLog(LogLevel.INFO)) {
            console.info(this.formatMessage(LogLevel.INFO, message), ...args);
        }
    }
    warn(message, ...args) {
        if (this.shouldLog(LogLevel.WARN)) {
            console.warn(this.formatMessage(LogLevel.WARN, message), ...args);
        }
    }
    error(message, ...args) {
        if (this.shouldLog(LogLevel.ERROR)) {
            console.error(this.formatMessage(LogLevel.ERROR, message), ...args);
        }
    }
    setLevel(level) {
        this.config.level = level;
    }
    enableColors(enable) {
        this.config.enableColors = enable;
    }
    enableTimestamp(enable) {
        this.config.enableTimestamp = enable;
    }
    setPrefix(prefix) {
        this.config.prefix = prefix;
    }
}
exports.Logger = Logger;
// Export a default logger instance for convenience
exports.logger = Logger.getInstance();
//# sourceMappingURL=Logger.js.map