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

  sendEventConfirmation: async (to, firstName) => {
    const transporter = nodemailer.createTransport({
      host: process.env.EVENTS_EMAIL_HOST,
      port: process.env.EVENTS_EMAIL_PORT,
      secure: process.env.EVENTS_EMAIL_SECURE === "true", // Use TLS
      auth: {
        user: process.env.EVENTS_EMAIL_USER, // Default email (events@ene.ac)
        pass: process.env.EVENTS_EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"ENE Events" <${process.env.EVENTS_EMAIL_USER}>`, // Default "events@ene.ac"
      to,
      subject: "Event Registration Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4CAF50;">Smart Trading Webinar</h1>
            <p style="font-size: 1.1em; color: #666;">February 3, 2025 | 8:00 PM Beirut Time</p>
          </div>
          <p style="font-size: 1.1em; color: #333;">Hi ${firstName},</p>
          <p style="font-size: 1.1em; color: #333;">
            Thank you for registering for our <strong>Smart Trading Webinar</strong>. This session is packed with valuable insights to help you elevate your trading journey. You’ll learn about:
          </p>
          <ul style="font-size: 1.1em; color: #333; margin-left: 20px;">
            <li><strong>Forex Trading Basics:</strong> Understand how the market works and what drives price movements.</li>
            <li><strong>Money Management:</strong> Key strategies to protect and grow your capital.</li>
            <li><strong>ENE Social Trading System:</strong> Discover how to leverage our system to follow expert traders and automate your trading journey.</li>
          </ul>
          <div style="margin: 20px 0; padding: 15px; background-color: #eef9ee; border-left: 5px solid #4CAF50;">
            <p style="font-size: 1.1em; margin: 0;">
              <strong>Webinar Details:</strong><br>
              <strong>Date:</strong> February 3, 2025<br>
              <strong>Time:</strong> 8:00 PM Beirut Time<br>
              <strong>Platform:</strong> Zoom<br>
              <strong>🔗 Join the Webinar:</strong> 
              <a href="https://us06web.zoom.us/j/2904802883?pwd=bmJ3UUhwc2NFU3FzNUV4dzhmalZ4dz09&omn=86803569425" style="color: #4CAF50; text-decoration: none;">
                Join Now
              </a><br>
              <strong>Meeting ID:</strong> 290 480 2883<br>
              <strong>Passcode:</strong> 123
            </p>
          </div>
          <div style="margin: 20px 0; padding: 15px; background-color: #e7f3ff; border-left: 5px solid #007bff;">
            <p style="font-size: 1.1em; margin: 0;">
              💬 <strong>Join Our Trading Community:</strong><br>
              <a href="https://t.me/+iwaFjYfQdEI4NTY0" style="color: #007bff; text-decoration: none;">
                https://t.me/+iwaFjYfQdEI4NTY0
              </a>
            </p>
            <p style="font-size: 0.9em; color: #555; margin-top: 10px;">
              Get exclusive insights and updates by joining the conversation in our Telegram group.
            </p>
          </div>
          <p style="font-size: 1.1em; color: #333;">If you have any questions, just hit "Reply."</p>
          <p style="font-size: 1.1em; color: #333;">Looking forward to seeing you there!</p>
          <br>
          <p style="font-size: 1.1em; color: #333;"><strong>Best regards,</strong></p>
          <p style="font-size: 1.1em; color: #333;"><strong>Hasan Saleh</strong><br>Founder, ENE</p>
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
