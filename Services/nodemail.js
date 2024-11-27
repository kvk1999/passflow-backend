import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { text } from "express";

dotenv.config();

export const mail = async (userEmail, sub, body) => {
  try {
    //creating transport
    let mailTransporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MY_APP_EMAIL,
        pass: process.env.MY_EMAIL_APP_PASSWORD,
      },
    });

    //setting up all details
    let details = {
      from: `"Koushik K V" <${process.env.MY_APP_EMAIL}>`,
      to: userEmail,
      subject: `${sub}`,
      html: `Your account reset password link : <a href= ${body} } >${body}</a></p>
            <p>It will expire within 12 hours</p>
            <p><i>Please don't reply to this email</i></p>
            <p>Thank you!</p>`,
    };
    //sending mail
    await mailTransporter.sendMail(details);
    // console.log(`Mail Sent Successfully!`);
    return true;
  } catch (error) {
    console.log(`Mail Not Sent: ${error.message}`);
    return false;
  }
};
