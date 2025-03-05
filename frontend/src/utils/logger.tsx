import pino from 'pino';

// Create the Pino logger instance with transport configuration
const logger = pino(
  {
    level: 'info', 
  },
  pino.transport({
    target: 'pino-pretty', 
    options: {
      colorize: true, 
      translateTime: 'SYS:standard', 
      ignore: 'pid,hostname', 
    },
  })
);

export default logger;
