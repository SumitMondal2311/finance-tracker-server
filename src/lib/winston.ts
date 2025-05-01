import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { createLogger, format, transports } = winston;
const { combine, timestamp, errors, json, colorize, simple } = format;

const filterByLevel = (level: string) => {
    return winston.format((info) => {
        return info.level === level ? info : false;
    })();
};

export const appLogger = createLogger({
    format: combine(timestamp(), errors({ stack: true }), json()),
    transports: [
        new transports.Console({
            format: combine(colorize(), simple()),
        }),
        new DailyRotateFile({
            filename: path.join('logs', 'info', 'info-%DATE%.log'),
            level: 'info',
            zippedArchive: true,
            maxSize: '10m',
            maxFiles: '7d',
            format: filterByLevel('info'),
        }),
        new DailyRotateFile({
            filename: path.join('logs', 'error', 'error-%DATE%.log'),
            level: 'error',
            zippedArchive: true,
            maxSize: '10m',
            maxFiles: '7d',
            format: filterByLevel('error'),
        }),
        new DailyRotateFile({
            filename: path.join('logs', 'warn', 'warn-%DATE%.log'),
            level: 'warn',
            zippedArchive: true,
            maxSize: '10m',
            maxFiles: '7d',
            format: filterByLevel('warn'),
        }),
    ],
});

export const httpLogger = createLogger({
    level: 'http',
    format: combine(timestamp(), json()),
    transports: [
        new transports.Console({
            format: combine(colorize(), simple()),
        }),
        new DailyRotateFile({
            filename: path.join('logs', 'http', 'http-%DATE%.log'),
            level: 'http',
            zippedArchive: true,
            maxSize: '10m',
            maxFiles: '7d',
            format: filterByLevel('http'),
        }),
    ],
});
