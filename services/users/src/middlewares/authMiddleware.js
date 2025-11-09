import { JWTManager } from "../config/jwt.js";
import User from "../models/userModel.js";

export const authMiddleware = async (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies?.accessToken;
        if (!token) {
            return res.status(401).json({ success: false, message: "No access token provided" });
        }

        // Verify token
        const { valid, decoded, error } = JWTManager.verifyAccessToken(token);
        if (!valid) return res.status(401).json({ success: false, message: "Invalid or expired token" });

        // Find user
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Attach user to request
        req.user = user;

        next();
    } catch (err) {
        next(err);
    }
};
