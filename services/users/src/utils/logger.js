import { createLogger, format, transports } from "winston";
import fs from "fs";
import path from "path";

// Ensure logs directory exists
const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const combinedLogPath = path.join(logDir, "combined.log");

const logger = createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.printf(({ timestamp, level, message, stack }) =>
            `${timestamp} [${level}]: ${stack || message}`
        )
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: path.join(logDir, "error.log"), level: "error" }),
        new transports.File({ filename: combinedLogPath })
    ],
});

//  get recent logs
logger.getRecent = async (limit = 50) => {
    try {
        if (!fs.existsSync(combinedLogPath)) return [];
        const data = fs.readFileSync(combinedLogPath, "utf-8");
        return data.trim().split("\n").slice(-limit);
    } catch (err) {
        logger.error("Failed to read recent logs", err);
        return [];
    }
};

export default logger;
