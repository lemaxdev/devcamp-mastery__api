const nodemailer = require('nodemailer');
const ENV = require('../config/env.config');

const sendEmail = async (messageConfig) => {
    const transporter = nodemailer.createTransport({
        host: ENV.SMTP_HOST,
        port: ENV.SMTP_PORT,
        auth: {
            user: ENV.SMTP_USERNAME,
            pass: ENV.SMTP_PASSWORD
        }
    });

    const message = {
        from: `${ENV.FROM_NAME} ${ENV.FROM_EMAIL}`,
        to: messageConfig.to,
        subject: messageConfig.subject,
        text: messageConfig.text
    };

    const email = await transporter.sendMail(message);
}

module.exports = sendEmail;