import nodemailer from "nodemailer";

const sendMail = async ({ email, contactReason, message, name }) => {
    try {
        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: "Thank You for Reaching Out – Ghost Chat app",
            html: `<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" bgcolor="#f4f4f4">
        <tr>
            <td align="center">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td align="left" style="font-family: Arial, sans-serif; color: #333;">
                            <h2>Hi, ${name} ! 👋</h2>
                            <p style="color: #555; line-height: 1.6;">
                                Thank you for reaching out to me through Ghost Chat app. I have received your message and will get back to you as soon as possible.
                            </p>
                            <p><strong>Reason for Contact:</strong> ${contactReason}</p>
                            <p><strong>Your Message:</strong><br> ${message}</p>
                            <p style="color: #555;">I appreciate your time and will do my best to respond promptly.</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-top: 20px;">
                            <a href="https://your-portfolio-link.com" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-family: Arial, sans-serif;">
                                Visit My Portfolio
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-top: 20px; font-size: 14px; color: #777; font-family: Arial, sans-serif;">
                            &copy; 2025 Vikram Singh. All rights reserved.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>`
        };

        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;
    } catch (error) {
        throw new Error(error.message || 'An unknown error occurred');
    }
};

module.exports = sendMail;