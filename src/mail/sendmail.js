import jwt from "jsonwebtoken";
import transporter from "../config/mail.config.js";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

export const sendMailAdmin = (emailDestination, res) => {
  const IP = process.env.IP;
  const verificationToken = crypto.randomBytes(16).toString("hex");
  const token = jwt.sign({ emailDestination, verificationToken }, process.env.SECRET, { expiresIn: '5m' });

  let mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: emailDestination,
    subject: "verify email",
    html: `กรุณาคลิ๊ก <a href="${IP}:3000/verify/admin${token}">ที่นี่</a> เพื่อยืนยันอีเมล์`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      // console.log(error);
      res.json({ message: "error", status: "error" });
    } else {
      // console.log('Email sent: ' + info.response);
      res.json({ message: info.response, status: "success" });
    }
  });
};

export const sendMailResearch = (emailDestination, res) => {
  const IP = process.env.IP;
  const verificationToken = crypto.randomBytes(16).toString("hex");
  const token = jwt.sign({ emailDestination, verificationToken }, process.env.SECRET, { expiresIn: '5m' });

  let mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: emailDestination,
    subject: "verify email",
    html: `กรุณาคลิ๊ก <a href="${IP}:3000/verify/research${token}">ที่นี่</a> เพื่อยืนยันอีเมล์`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      // console.log(error);
      res.json({ message: "error", status: "error" });
    } else {
      // console.log('Email sent: ' + info.response);
      res.json({ message: info.response, status: "success" });
    }
  });
};
