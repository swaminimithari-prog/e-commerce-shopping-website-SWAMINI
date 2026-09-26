// utils/mail.js
const nodemailer = require("nodemailer");

const sendMail = async ({ to, subject, html, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"E-Commerce Shop" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || "",
      html: html || "",
    };

    const info = await transporter.sendMail(mailOptions);

    return info;
  } catch (error) {
    throw new Error(`Email send failed: ${error.message}`);
  }
};

module.exports = sendMail;