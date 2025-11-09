import logger from "../utils/logger.js";

// Express error handler
export const errorHandler = (err, req, res, next) => {
    // Log the error (stack in development, message in production)
    if (process.env.NODE_ENV === "development") {
        console.error(err.stack);
        logger?.error(err.stack);
    } else {
        logger?.error(err.message);
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || null, // optional detailed validation errors
    });
};
