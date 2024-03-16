import winston, { format, transports, Logger } from 'winston';
import config from './config';

const enumerateErrorFormat = format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

class LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: config.env === 'development' ? 'debug' : 'info',
      format: format.combine(
        enumerateErrorFormat(),
        config.env === 'development' ? format.colorize() : format.uncolorize(),
        format.splat(),
        format.printf(({ level, message }) => `${level}: ${message}`)
      ),
      transports: [
        new transports.Console({
          stderrLevels: ['error'],
        }),
      ],
    });
  }

  public info(message: string) {
    this.logger.info(message);
  }

  public debug(message: string) {
    this.logger.debug(message);
  }

  public error(message: string) {
    this.logger.error(message);
  }

  public warn(message: string) {
    this.logger.warn(message);
  }

  // Add other log levels as needed
  public log(level: string, message: string) {
    this.logger.log(level, message);
  }
}

export default new LoggerService();
