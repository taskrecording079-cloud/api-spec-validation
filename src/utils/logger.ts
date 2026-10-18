import winston from "winston"
import { config } from "../config"

export const LOGS_FILE_PATH = "logs/server.log"

const { combine, timestamp, printf, json } = winston.format

// Define the log format for development and production
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`
})

// Configure the logger
const logger = winston.createLogger({
  level: config.nodeEnv === "production" ? "info" : "debug", // No debug logs shown in production
  format: combine(timestamp(), logFormat),
  transports: [
    // Console output
    new winston.transports.Console({
      format: combine(
        timestamp(),
        config.nodeEnv === "production" ? json() : logFormat
      ),
    }),

    // Optionally, you can log to a file for persistent storage
    new winston.transports.File({ filename: LOGS_FILE_PATH }),
  ],
})

export default logger
