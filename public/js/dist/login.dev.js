"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.passwordReset = exports.forgotPassword = exports.signup = exports.logout = exports.login = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _alerts = require("./alerts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var login = function login(email, password) {
  var res;
  return regeneratorRuntime.async(function login$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
              email: email,
              password: password
            }
          }));

        case 3:
          res = _context.sent;

          if (res.data.status === 'success') {
            (0, _alerts.showAlert)('success', 'Logged In successfully!');
            window.setTimeout(function () {
              location.assign('/overview');
            }, 1500);
          }

          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          (0, _alerts.showAlert)('error', _context.t0.response.data.message);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.login = login;

var logout = function logout() {
  var res;
  return regeneratorRuntime.async(function logout$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'GET',
            url: '/api/v1/users/logout'
          }));

        case 3:
          res = _context2.sent;
          if (res.data.status == 'success') location.assign('/login');
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          (0, _alerts.showAlert)('error', 'Error Logging Out! Please try again later.');

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.logout = logout;

var signup = function signup(form) {
  var name, email, password, confirmPassword, res;
  return regeneratorRuntime.async(function signup$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          name = form.get('name');
          email = form.get('email');
          password = form.get('password');
          confirmPassword = form.get('confirmPassword');
          _context3.next = 7;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'POST',
            url: '/api/v1/users/signup',
            data: {
              name: name,
              email: email,
              password: password,
              confirmPassword: confirmPassword
            }
          }));

        case 7:
          res = _context3.sent;

          if (res.data.status === 'success') {
            (0, _alerts.showAlert)('success', "Hello ".concat(name.split(' ')[0].toUpperCase(), ", Welcome to Natours Famiy!"));
            window.setTimeout(function () {
              location.assign('/overview');
            }, 1500);
          }

          _context3.next = 14;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](0);
          (0, _alerts.showAlert)('error', _context3.t0.response.data.message);

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

exports.signup = signup;

var forgotPassword = function forgotPassword(email) {
  var res, token;
  return regeneratorRuntime.async(function forgotPassword$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'POST',
            url: '/api/v1/users/forgotPassword',
            data: {
              email: email
            }
          }));

        case 3:
          res = _context4.sent;

          if (res.data.status === 'success') {
            (0, _alerts.showAlert)('success', res.data.message);
            token = res.data.resetURL.split('resetPassword/')[1]; // window.setTimeout(() => {
            //   location.assign(`/password-reset/${token}`);
            // }, 1500);
          }

          _context4.next = 10;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          (0, _alerts.showAlert)('error', _context4.t0.response.data.message);

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.forgotPassword = forgotPassword;

var passwordReset = function passwordReset(password, confirmPassword) {
  var token, res;
  return regeneratorRuntime.async(function passwordReset$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          token = document.querySelector('body').dataset.token;
          _context5.next = 4;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'PATCH',
            url: "/api/v1/users/resetPassword/".concat(token),
            data: {
              password: password,
              confirmPassword: confirmPassword
            }
          }));

        case 4:
          res = _context5.sent;

          if (res.data.status === 'success') {
            (0, _alerts.showAlert)('success', 'Password Reset Successful!');
            window.setTimeout(function () {
              location.assign("/login");
            }, 1500);
          }

          _context5.next = 11;
          break;

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          (0, _alerts.showAlert)('error', _context5.t0.response.data.message);

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.passwordReset = passwordReset;