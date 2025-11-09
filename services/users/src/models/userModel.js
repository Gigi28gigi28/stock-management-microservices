import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

export const USER_ROLES = {
    ADMIN: "admin",
    MANAGER: "manager",
};

export const USER_STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    PENDING: "pending",
};

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
            validate: {
                validator: (v) => /^[a-zA-Z0-9_-]+$/.test(v),
                message: "Invalid username format",
            },
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate: [validator.isEmail, "Invalid email"],
            index: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            enum: Object.values(USER_ROLES),
            default: USER_ROLES.MANAGER,
        },
        status: {
            type: String,
            enum: Object.values(USER_STATUS),
            default: USER_STATUS.PENDING,
        },
        emailVerified: { type: Boolean, default: false },
        passwordResetToken: { type: String, select: false },
        passwordResetExpires: { type: Date, select: false },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
