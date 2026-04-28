const nodemailer = require('nodemailer');

const transporter= nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async ({to, subject, html}) => {
    await transporter.sendMail({
        from: `"Smart City" <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        html
    });
}

const sendVerificationEmail = async (userEmail, verificationUrl) => {
    await sendEmail({
        to: userEmail,
        subject : 'Verify Your Email Address',
        html:  `
      <div style="...">
        <h2>Welcome to Smart City!</h2>
        <p>Click to verify:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>Expires in 24 hours.</p>
      </div>
    `,
    })
};

module.exports = {
    sendEmail,
    sendVerificationEmail
};