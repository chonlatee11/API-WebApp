import jwt from "jsonwebtoken";
import transporter from "../config/mail.config.js";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

export const sendMail = (emailDestination) => {
  const IP = process.env.IP;
  const verificationToken = crypto.randomBytes(16).toString("hex");
  const token = jwt.sign({ emailDestination, verificationToken }, 'secret_key', { expiresIn: '1h' });

  let mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: emailDestination,
    subject: "verify email",
    html: `กรุณาคลิ๊ก <a href="http://${IP}:3000/verify/${token}">ที่นี่</a> เพื่อยืนยันอีเมล์`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return error;
    } else {
      console.log('Email sent: ' + info.response);
      return info.response;
    }
  });
};
