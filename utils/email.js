const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.from = `Siddharth Singh ${process.env.EMAIL_FROM}`;
    this.url = url;
    this.name = user.name;
    this.to = user.email;
  }

  async newTransport() {
    return nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
    // if (process.env.NODE_ENV === 'production') {
    //   //Gmail
    //   return nodemailer.createTransport({
    //     service: 'Gmail',
    //     auth: {
    //       user: process.env.GMAIL_USERNAME,
    //       pass: process.env.GMAIL_PASSWORD,
    //     },
    //   });
    // }
    // return nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: process.env.EMAIL_PORT,
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });
  }

  //Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.name,
      url: this.url,
      subject,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    // 3) Create a transport and send email
    const transporter = await this.newTransport();
    await transporter.sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes.)'
    );
  }

  async sendBookingSuccessful() {
    await this.send('bookingSuccess', 'Booking Confirmation');
  }
};
