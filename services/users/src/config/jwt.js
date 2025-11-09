import jwt from "jsonwebtoken";

// JWT secrets from .env
const SECRETS = {
    access: process.env.JWT_ACCESS_SECRET,
    refresh: process.env.JWT_REFRESH_SECRET,
    email: process.env.JWT_EMAIL_SECRET,
    reset: process.env.JWT_PASSWORD_RESET_SECRET
};

const OPTIONS = { audience: "stock-management-users", issuer: "stock-management" };

// Sign token
const sign = (payload, secret, expiresIn) => jwt.sign(payload, secret, { expiresIn, ...OPTIONS });

// Verify token
const verify = (token, secret) => {
    try {
        const decoded = jwt.verify(token, secret);
        return { valid: true, decoded };
    } catch (err) {
        return { valid: false, error: err.message };
    }
};

// JWT Manager
export const JWTManager = {
    generateAccessToken: (payload) => ({ token: sign(payload, SECRETS.access, "15m") }),
    verifyAccessToken: (token) => verify(token, SECRETS.access),

    generateRefreshToken: (payload) => ({ token: sign(payload, SECRETS.refresh, "7d") }),
    verifyRefreshToken: (token) => verify(token, SECRETS.refresh),

    generateEmailToken: (payload) => ({ token: sign(payload, SECRETS.email, "24h") }),
    verifyEmailToken: (token) => verify(token, SECRETS.email),

    generatePasswordResetToken: (payload) => ({ token: sign(payload, SECRETS.reset, "1h") }),
    verifyPasswordResetToken: (token) => verify(token, SECRETS.reset)
};
