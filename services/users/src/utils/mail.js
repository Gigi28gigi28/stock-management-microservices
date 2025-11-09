import nodemailer from "nodemailer";

// Create transporter using Mailtrap SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
    port: process.env.SMTP_PORT || 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Generic function to send an email
export const sendEmail = async ({ to, subject, html }) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"AI Dashboard" <noreply@aidashboard.local>',
            to,
            subject,
            html,
        });

        console.log(`Email sent to ${to}: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Unable to send email");
    }
};
