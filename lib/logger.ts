import pino from 'pino';

const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'HH:MM:ss Z',
    ignore: 'pid,hostname',
  },
});

export const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    base: {
      env: process.env.NODE_ENV,
    },
  },
  process.env.NODE_ENV === 'development' ? transport : undefined
);

export const createScopedLogger = (context: string, extra = {}) => {
  return logger.child({ context, ...extra });
};
