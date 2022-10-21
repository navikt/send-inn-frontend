import winston from 'winston';
import util from 'util';

export const rawLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: process.env.LOG_LEVEL || 'info', //Sett til 'debug', hvis debug-meldinger skal vises
            format: winston.format.json(),
        }),
    ],
});

// Etterlingner console.log - Støtter melding over flere parametere
const debug = (...msg) => rawLogger.debug(util.format(...msg));
const info = (...msg) => rawLogger.info(util.format(...msg));
const warn = (...msg) => rawLogger.warn(util.format(...msg));
const error = (...msg) => rawLogger.error(util.format(...msg));

export const logger = {
    debug,
    info,
    warn,
    error,
};
