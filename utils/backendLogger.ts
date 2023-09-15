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
const debug = (...msg: unknown[]) =>
    rawLogger.debug(util.format(...msg));
const info = (...msg: unknown[]) =>
    rawLogger.info(util.format(...msg));
const warn = (...msg: unknown[]) =>
    rawLogger.warn(util.format(...msg));
const error = (...msg: unknown[]) =>
    rawLogger.error(util.format(...msg));

export const logger = {
    debug,
    info,
    warn,
    error,
};
