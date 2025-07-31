const nodemailer = require("nodemailer");
require("dotenv").config();

// console.log(process.env.SMTP_HOST);
// console.log(process.env.SMTP_PORT);
// console.log(process.env.SMTP_MAIL);
// console.log(process.env.SMTP_APP_PASS);

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT), 
      secure: false,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_APP_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: `"Anshu Yadav" <${process.env.SMTP_MAIL}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email info:", info);
    return info;
  } catch (error) {
    console.log("Error in mailSender:", error.message);
    throw error;
  }
};

module.exports = { mailSender };

