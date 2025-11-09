import Joi from "joi";

// ================= REGISTER =================
export const registerSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            "string.empty": "Username is required",
            "string.alphanum": "Username must contain only letters and numbers",
            "string.min": "Username must be at least 3 characters",
            "string.max": "Username must be at most 30 characters",
        }),
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Email must be valid",
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters",
    }),
    confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
        "any.only": "Passwords do not match",
        "string.empty": "Confirm password is required",
    }),
    role: Joi.string().valid("admin", "manager").optional(),
});

// ================= LOGIN =================
export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Email must be valid",
    }),
    password: Joi.string().required().messages({
        "string.empty": "Password is required",
    }),
});

// ================= FORGOT PASSWORD =================
export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Email must be valid",
    }),
});

// ================= RESET PASSWORD =================
export const resetPasswordSchema = Joi.object({
    token: Joi.string().required().messages({
        "string.empty": "Reset token is required",
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters",
    }),
    confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
        "any.only": "Passwords do not match",
        "string.empty": "Confirm password is required",
    }),
});

// ================= VERIFY EMAIL =================
export const verifyEmailSchema = Joi.object({
    token: Joi.string().required().messages({
        "string.empty": "Verification token is required",
    }),
});

// ================= UPDATE USER (Admin) =================
export const updateUserSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
    role: Joi.string().valid("admin", "manager").optional(),
    status: Joi.string().valid("active", "inactive", "pending").optional(),
    emailVerified: Joi.boolean().optional(),
}).min(1); // At least one field must be provided

// ================= VALIDATOR HELPER =================
export function validateWithSchema(schema, obj) {
    const { error, value } = schema.validate(obj, {
        abortEarly: false,
        convert: true,
    });

    return {
        isValid: !error,
        errors: error ? error.details.map((e) => ({ field: e.path[0], message: e.message })) : [],
        value,
    };
}