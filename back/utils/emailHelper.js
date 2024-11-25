const nodemailer = require("nodemailer");

const emailHelpers = {
  sendResetEmail: async (to, resetLink) => {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // Use the SMTP server host from .env
      port: process.env.EMAIL_PORT, // Use the SMTP port from .env
      secure: process.env.EMAIL_SECURE === "true", // Use TLS (true for port 465, false for others)
      auth: {
        user: process.env.EMAIL_USER, // Your email username from .env
        pass: process.env.EMAIL_PASS, // Your email password from .env
      },
    });

    const mailOptions = {
      from: `"ENE Support" <${process.env.EMAIL_USER}>`, // Sender address
      to,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <p><a href="${resetLink}">${resetLink}</a></p>
             <p>If you did not request this, please ignore this email.</p>`,
    };

    return transporter.sendMail(mailOptions);
  },

  sendEmail: async (to, subject, htmlContent) => {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // Use the SMTP server host from .env
      port: process.env.EMAIL_PORT, // Use the SMTP port from .env
      secure: process.env.EMAIL_SECURE === "true", // Use TLS (true for port 465, false for others)
      auth: {
        user: process.env.EMAIL_USER, // Your email username from .env
        pass: process.env.EMAIL_PASS, // Your email password from .env
      },
    });

    const mailOptions = {
      from: `"ENE Support" <${process.env.EMAIL_USER}>`, // Sender address
      to,
      subject,
      html: htmlContent,
    };

    return transporter.sendMail(mailOptions);
  },
};

module.exports = emailHelpers;
