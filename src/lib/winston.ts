import { APP_CONFIG } from '@/config';
import winston from 'winston';

const { combine, timestamp, json, errors, align, printf, colorize } =
  winston.format;

const transports: winston.transport[] = [];

if (process.env.NODE_ENV !== 'production') {
  const consoleTransport = new winston.transports.Console({
    format: combine(
      colorize({ all: true }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss A' }),
      align(),
      printf(({ level, message, timestamp, ...meta }) => {
        const metaString = Object.keys(meta).length
          ? '\n' + JSON.stringify(meta, null, 2)
          : '';
        return `${timestamp} [${level}]: ${message}${metaString}`;
      }),
    ),
  });
  transports.push(consoleTransport);
}

const Logger = winston.createLogger({
  level: APP_CONFIG.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss A' }),
    errors({ stack: true }),
    json(),
  ),
  transports,
  silent: APP_CONFIG.NODE_ENV === 'test',
});

export { Logger };
