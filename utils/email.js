const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  // const transporter = nodemailer.createTransport({
  //   service: 'Gmail',
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  //ACTIVATE IN GMAIL: LESS SECURE APP option
  // });
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define email Options
  const mailOptions = {
    from: 'Hugo Veloso <8bc2ea86a5-04d728@inbox.mailtrap.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html:
  };

  // 3)Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
