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
      subject: "! تأكيد تسجيلك في معسكر الفوركس – جهّز نفسك للانطلاق ✅",
      html: `
        <div style="direction: rtl; font-family: 'Tajawal', Arial, sans-serif; line-height: 1.8; color: #333; background-color: #f8f9fa; padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto; text-align: right;">
      
          
          <div style="direction: rtl; text-align: center; margin-bottom: 20px;">
            <h1 style="color: #FF9800; font-size: 1.8em;">📢 تأكيد تسجيلك في معسكر الفوركس</h1>
            <p style="font-size: 1.2em; color: #666;">21، 22، 23 مارس 2025</p>
          </div>

         
          <p style="direction: rtl; font-size: 1.2em; color: #333;">مرحبًا <strong>${firstName}</strong>،</p>
          <p style="direction: rtl; font-size: 1.1em; color: #333;">
            تهانينا! لقد تم تأكيد تسجيلك في <strong>معسكر الفوركس التدريبي</strong> المجاني، والذي سيُقام على مدار <strong>3 أيام</strong> مليئة بالمعلومات والمهارات الأساسية لتحقيق النجاح في سوق الفوركس. 🎯
          </p>

          
          <h3 style="direction: rtl; color: #2196F3; font-size: 1.3em; margin-top: 20px;">🔹 ماذا ستتعلم خلال المعسكر؟</h3>
          <ul style="direction: rtl; font-size: 1.1em; color: #333; padding-right: 20px;">
            <li>✅ <strong>أساسيات سوق الفوركس</strong> – تعرّف على السوق وطريقة عمله.</li>
            <li>✅ <strong>إدارة المخاطر</strong> – كيف تحمي رأس مالك أثناء التداول.</li>
            <li>✅ <strong>تنفيذ إشارات الفوركس (نظام ENE)</strong> – كيف تستخدم الإشارات بشكل فعّال لتحقيق نتائج أفضل.</li>
          </ul>

         
          <h3 style="direction: rtl; color: #4CAF50; font-size: 1.3em; margin-top: 20px;">📌 للاستفادة القصوى من المعسكر، تأكد من:</h3>
          <ul style="direction: rtl; font-size: 1.1em; color: #333; padding-right: 20px;">
            <li>🎥 <strong>تشغيل الكاميرا</strong> لضمان التفاعل الكامل.</li>
            <li>🔕 الجلوس في مكان هادئ مع اتصال إنترنت مستقر.</li>
            <li>🎧 معرفة كيفية استخدام Zoom وربط الصوت بشكل صحيح.</li>
            <li>📝 تجهيز دفتر ملاحظات لتسجيل الأفكار وطرح الأسئلة.</li>
            <li>⏳ البقاء حتى نهاية الجلسة حتى لا تفوّت أي معلومة (هناك مفاجأة كبيرة في اليوم الثالث!).</li>
          </ul>

          
          <div style="direction: rtl; margin: 20px 0; padding: 15px; background-color: #ffebee; border-right: 5px solid #d32f2f;">
            <p style="font-size: 1.1em; margin: 0; color: #d32f2f;">
              ❗ <strong>سيتم إرسال رابط الدخول إلى الجلسة عبر واتساب</strong> من قبل فريقنا، لذا تأكد من متابعة رسائلك!
            </p>
          </div>

          
          <p style="direction: rtl; font-size: 1.2em; color: #333; text-align: center; margin-top: 20px;">
            🚀 نحن متحمسون لرؤيتك في المعسكر والانطلاق في رحلتك نحو الاحتراف في عالم الفوركس!
          </p>

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
