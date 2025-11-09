import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        accessToken: { type: String, required: true },
        refreshToken: { type: String, required: true },
        userAgent: { type: String },
        ipAddress: { type: String },
    },
    { timestamps: true }
);

// Create new session
sessionSchema.statics.createSession = async function ({
    userId,
    accessToken,
    refreshToken,
    userAgent,
    ipAddress,
}) {
    return this.create({ userId, accessToken, refreshToken, userAgent, ipAddress });
};

// Delete all sessions for a user (used on logout)
sessionSchema.statics.deleteManyByUser = async function (userId) {
    return this.deleteMany({ userId });
};

//  Find active session by refresh token
sessionSchema.statics.findActiveSession = async function (refreshToken) {
    return this.findOne({ refreshToken });
};

//  Instance method: refresh tokens
sessionSchema.methods.refreshSession = async function (accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    await this.save();
    return this;
};
//  Revoke a specific session (for logout)
sessionSchema.statics.revokeSession = async function (userId, refreshToken) {
    return this.deleteOne({ userId, refreshToken });
};

const Session = mongoose.model("Session", sessionSchema);
export default Session;
