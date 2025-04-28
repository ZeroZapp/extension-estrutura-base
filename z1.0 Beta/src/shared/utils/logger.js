// src/shared/utils/logger.js

function log(level, message, context) {
    const logMessage = {
        level,
        message,
        context,
    };

    chrome.runtime.sendMessage({
        event: 'log',
        to: 'background',
        payload: logMessage,
    });
}

export const logger = {
    debug: (message, context) => log('debug', message, context),
    info: (message, context) => log('info', message, context),
    warn: (message, context) => log('warn', message, context),
    error: (message, context) => log('error', message, context),
};