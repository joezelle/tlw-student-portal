const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, firstName, id) {
    this.to = user;
    this.firstName = firstName;
    this.id = id || '';
    this.from = 'TLW <admission@tlw.com>';
  }

  newTransport() {
    // Sendgrid
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USN,
        pass: process.env.SENDGRID_PWD
      }
    });
  }

  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName.trim().split(' ')[0],
        subject,
        url: `https://tlw-student-portal.herokuapp.com/register/interview?id=${this.id}`
      }
    );

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendRegistered() {
    await this.send('registered', 'Registration Successful');
  }

  async sendFollowUp() {
    await this.send('followup', 'Fix Interview Date');
  }
};
