const handlebars = require("handlebars");
const path = require("path");
const fs = require("fs");
const nodeMailer = require("nodemailer");

const emailTransporter = ({ vars = {}, mailOpt = {} }) => {
  return new Promise(async (resolve, reject) => {
    const templatePath = path.resolve(__dirname, "../templates/forgetPasswordTemplate.html");
    const templateSources = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(templateSources);
    const transporter = nodeMailer.createTransport({
      service: "smtp",
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        ciphers: "SSLv3",
      },
    });
    const html = template(vars);
    const mailOptions = {
      html: html,
      ...mailOpt,
    };
    transporter
      .sendMail(mailOptions)
      .then((body) => {
        // console.log("Email sent:", body);
        resolve("Success");
      })
      .catch((error) => {
        // console.log("Error:", error);
        reject("Error");
      });
  });
};

module.exports = emailTransporter;
