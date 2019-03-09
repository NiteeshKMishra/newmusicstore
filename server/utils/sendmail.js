var nodemailer = require('nodemailer');
require('../../config/config');

function sendMail(rec, username, password) {

  return new Promise((resolve, reject) => {
    var smtpTransport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "newmusixstore@gmail.com",
        pass: process.env.PASSWORD
      }
    });

    var mailOptions = {
      to: rec,
      subject: 'Retrieve your Credentials',
      text: `Dear ${username},

      Your credentials has been successfully retrieved. Your credentials are
      UserName: ${username}
      Password:  ${password}


      
      
      Thank You,
      Musix Team
     `
    }

    smtpTransport.sendMail(mailOptions, function (error, response) {
      if (error) {
        reject(error);
      } else {
        resolve('Message Sent')
      }
    });
  })

}

module.exports.sendMail = sendMail;