import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

import { adjectives, nouns } from "./words";
import sgMail from "@sendgrid/mail";
import jwt from "jsonwebtoken";

export const generatorSecret = () => {
  const randomNumber = Math.floor(Math.random() * adjectives.length);
  return `${adjectives[randomNumber]} ${nouns[randomNumber]}`;
};

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendSecretMail = (adress, secret) => {
  const email = {
    from: "prismagram@react.js",
    to: adress,
    subject: "🔒 Login Secret for Prismagram 🔒",
    html: `Hello! Your login secret is <strong>${secret}</strong>. <br/> Copy paste on the app/website to log in`
  };
  return sgMail.send(email);
};

export const generateToken = id => jwt.sign({ id }, process.env.JWT_SECRET);
