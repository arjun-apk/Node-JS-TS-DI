import winston, { Logger, format, transports } from "winston";
import dotenv from "dotenv";
import { TransformableInfo } from "logform";

dotenv.config();
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const { timestamp, combine, printf } = format;

interface LogInfo extends TransformableInfo {
  file?: string;
}

const logFormat = printf(({ timestamp, level, message, file }: LogInfo) => {
  if (file === undefined) {
    return `\n[${level.toUpperCase()}] ${timestamp}\n${message}`;
  }
  return `\n${file}\n[${level.toUpperCase()}] ${timestamp}\n${message}`;
});

const logger: Logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  format: combine(timestamp(), logFormat),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: `${process.env.LOG_PATH}\\${process.env.LOG_FILE_NAME}`,
      maxsize: parseInt(process.env.LOG_MAX_FILE_SIZE as string, 10),
      maxFiles: parseInt(process.env.LOG_MAX_FILE_COUNT as string, 10),
    }),
  ],
});

export default logger;
