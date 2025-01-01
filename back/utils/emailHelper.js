const nodemailer = require("nodemailer");

const emailHelpers = {
  sendResetEmail: async (to, resetLink) => {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === "true", // Use TLS
      auth: {
        user: process.env.EMAIL_USER, // Default email (noreply@ene.ac)
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"ENE Support" <${process.env.EMAIL_USER}>`, // Default "noreply@ene.ac"
      to,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <p><a href="${resetLink}">${resetLink}</a></p>
             <p>If you did not request this, please ignore this email.</p>`,
    };

    return transporter.sendMail(mailOptions);
  },

  sendEmail: async (to, subject, htmlContent, from = process.env.EMAIL_USER) => {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === "true", // Use TLS
      auth: {
        user: from,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"ENE Team" <${from}>`, // Custom "from" address
      to,
      subject,
      html: htmlContent,
    };

    return transporter.sendMail(mailOptions);
  },
};

module.exports = emailHelpers;
