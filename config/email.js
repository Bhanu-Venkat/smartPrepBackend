const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // e.g., "smtp.gmail.com"
    port: process.env.EMAIL_PORT,
    service: 'gmail', // Use your email provider
    secure: true,
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error configuring email transporter:', error);
    } else {
        console.log('✅ Email transporter is ready to send emails');
    }
});

const sendEmail = (to, subject, text) => {
   console.log("the email details: ",process.env.EMAIL_USER, to, subject, text)
    return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        // text,
        html: text, // If you want to send HTML content
    });
};

module.exports = sendEmail;
