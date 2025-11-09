import rateLimit from "express-rate-limit";

// Generic rate limiter
export const createRateLimiter = (options = {}) => {
    return rateLimit({
        windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
        max: options.max || 100, // limit each IP to 100 requests per window
        message: options.message || {
            success: false,
            message: "Too many requests, please try again later",
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

// Example usage for login route
export const loginLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: { success: false, message: "Too many login attempts. Try again in 15 minutes" },
});
