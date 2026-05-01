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

const sendPasswordResetEmail = async (email, resetUrl) => {
  await sendEmail({
    to: email,
    subject: 'Password Reset - Smart City',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; padding: 12px 24px; background: #dc3545; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
          Reset Password
        </a>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });
};

module.exports = {
    sendEmail,
    sendVerificationEmail,
    sendPasswordResetEmail
};