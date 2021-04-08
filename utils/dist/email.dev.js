"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var nodemailer = require('nodemailer');

var pug = require('pug');

var htmlToText = require('html-to-text');

module.exports =
/*#__PURE__*/
function () {
  function Email(user, url) {
    _classCallCheck(this, Email);

    this.from = "Siddharth Singh ".concat(process.env.EMAIL_FROM);
    this.url = url;
    this.name = user.name;
    this.to = user.email;
  }

  _createClass(Email, [{
    key: "newTransport",
    value: function newTransport() {
      return regeneratorRuntime.async(function newTransport$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                  user: process.env.GMAIL_USERNAME,
                  pass: process.env.GMAIL_PASSWORD
                }
              }));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      });
    } //Send the actual email

  }, {
    key: "send",
    value: function send(template, subject) {
      var html, mailOptions, transporter;
      return regeneratorRuntime.async(function send$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // 1) Render HTML based on a pug template
              html = pug.renderFile("".concat(__dirname, "/../views/email/").concat(template, ".pug"), {
                firstName: this.name,
                url: this.url,
                subject: subject
              }); // 2) Define email options

              mailOptions = {
                from: this.from,
                to: this.to,
                subject: subject,
                html: html,
                text: htmlToText.fromString(html)
              }; // 3) Create a transport and send email

              _context2.next = 4;
              return regeneratorRuntime.awrap(this.newTransport());

            case 4:
              transporter = _context2.sent;
              _context2.next = 7;
              return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "sendWelcome",
    value: function sendWelcome() {
      return regeneratorRuntime.async(function sendWelcome$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(this.send('welcome', 'Welcome to the Natours Family!'));

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "sendPasswordReset",
    value: function sendPasswordReset() {
      return regeneratorRuntime.async(function sendPasswordReset$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(this.send('passwordReset', 'Your password reset token (valid for only 10 minutes.)'));

            case 2:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "sendBookingSuccessful",
    value: function sendBookingSuccessful() {
      return regeneratorRuntime.async(function sendBookingSuccessful$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return regeneratorRuntime.awrap(this.send('bookingSuccess', 'Booking Confirmation'));

            case 2:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this);
    }
  }]);

  return Email;
}();