const nodemailer = require("nodemailer");
require("dotenv").config();

const { M_USER, M_PASS } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  secure: false,
  auth: {
    user: M_USER,
    pass: M_PASS,
  },
});

const main = async (email, subject, html) => {
  const info = await transporter.sendMail({
    from: '"Kajant" <kajant.mailer@gmail.com>',
    to: email,
    subject,
    html, 
  });
  console.log("Message sent: %s", info.messageId);
};
module.exports = { main };