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

  sendRegistrationEmail: async (to, subject, htmlContent) => {
    const transporter = nodemailer.createTransport({
      host: process.env.HELLO_EMAIL_HOST,
      port: process.env.HELLO_EMAIL_PORT,
      secure: process.env.HELLO_EMAIL_SECURE === "true", // Use TLS
      auth: {
        user: process.env.HELLO_EMAIL_USER, // Default email (hello@ene.ac)
        pass: process.env.HELLO_EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"ENE Support" <${process.env.HELLO_EMAIL_USER}>`, // Default "hello@ene.ac"
      to,
      subject,
      html: htmlContent,
    };

    return transporter.sendMail(mailOptions);
  },


  sendWelcomeEmail: async (to) => {
    const transporter = nodemailer.createTransport({
      host: process.env.HELLO_EMAIL_HOST,
      port: process.env.HELLO_EMAIL_PORT,
      secure: process.env.HELLO_EMAIL_SECURE === "true", // Use TLS
      auth: {
        user: process.env.HELLO_EMAIL_USER, // Default email (hello@ene.ac)
        pass: process.env.HELLO_EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"ENE Support" <${process.env.HELLO_EMAIL_USER}>`, // Default "hello@ene.ac"
      to,
      subject,
      html: htmlContent,
    };

    return transporter.sendMail(mailOptions);
  },


  sendWalletOTP: async (to, otp) => {
    const transporter = nodemailer.createTransport({
      host: process.env.SUPPORT_EMAIL_HOST,
      port: process.env.SUPPORT_EMAIL_PORT,
      secure: process.env.SUPPORT_EMAIL_SECURE === "true", // Use TLS
      auth: {
        user: process.env.SUPPORT_EMAIL_USER, // Default email (support@ene.ac)
        pass: process.env.SUPPORT_EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"ENE Support" <${process.env.SUPPORT_EMAIL_USER}>`, // Default email (support@ene.ac)
      to,
      subject: "Wallet OTP",
      html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #4CAF50;">Wallet OTP Verification</h2>
              <p>Dear User,</p>
              <p>Your OTP to access your wallet is:</p>
              <h1 style="color: #d9534f; text-align: center;">${otp}</h1>
              <p>This OTP is valid for <strong>1 hour</strong>.</p>
              <p>If you did not request this, please ignore this email or contact our support team immediately at 
                  <a href="mailto:support@ene.ac">support@ene.ac</a>.</p>
              <br>
              <p>Best regards,</p>
              <p><strong>ENE Support Team</strong></p>
          </div>
      `,
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
