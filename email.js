var nodemailer = require('nodemailer');
require('dotenv').config({ silent: true });

export function email(to, subject, message) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ROBOT_EMAIL,
      pass: process.env.ROBOT_PASS
    }
  });

  var mailOptions = {
    from: transporter.auth.user,
    to: to,
    subject: subject,
    text: message
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
