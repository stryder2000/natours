"use strict";

require("@babel/polyfill");

var _mapbox = require("./mapbox");

var _login = require("./login");

var _updateSettings = require("./updateSettings");

var _stripe = require("./stripe");

var _alerts = require("./alerts");

var _reviews = require("./reviews");

//DOM ELEMENTS
var mapBox = document.getElementById('map');
var loginForm = document.querySelector('.form--login');
var forgotPasswordForm = document.querySelector('.form--forgotPassword');
var passwordResetForm = document.getElementById('resetPassword');
var signupForm = document.querySelector('.form--signup');
var logOutBtn = document.querySelector('.nav__el--logout');
var updateUserForm = document.querySelector('.form-user-data');
var updateUserPassword = document.querySelector('.form-user-password');
var bookBtn = document.getElementById('book-tour');
var reviewBtn = document.querySelector('.review-btn'); //DELEGATION

if (mapBox) {
  var locations = JSON.parse(mapBox.dataset.locations);
  (0, _mapbox.displayMap)(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    (0, _login.login)(email, password);
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('email').value;
    (0, _login.forgotPassword)(email);
  });
}

if (passwordResetForm) {
  passwordResetForm.addEventListener('click', function (e) {
    e.preventDefault();
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm-password').value;
    console.log(password, confirmPassword);
    (0, _login.passwordReset)(password, confirmPassword);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('password', document.getElementById('password').value);
    form.append('confirmPassword', document.getElementById('confirm-password').value);
    document.getElementById('signup').textContent = 'Signing up...';
    (0, _login.signup)(form);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', _login.logout);
}

if (updateUserForm) {
  updateUserForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    (0, _updateSettings.updateUserSettings)(form, 'data');
  });
}

if (updateUserPassword) {
  updateUserPassword.addEventListener('submit', function _callee(e) {
    var passwordCurrent, password, confirmPassword;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            e.preventDefault();
            document.querySelector('.btn--save-password').textContent = 'Updating...';
            passwordCurrent = document.getElementById('password-current').value;
            password = document.getElementById('password').value;
            confirmPassword = document.getElementById('password-confirm').value;
            _context.next = 7;
            return regeneratorRuntime.awrap((0, _updateSettings.updateUserSettings)({
              passwordCurrent: passwordCurrent,
              password: password,
              confirmPassword: confirmPassword
            }, 'password'));

          case 7:
            document.getElementById('password-current').value = '';
            document.getElementById('password').value = '';
            document.getElementById('password-confirm').value = '';
            document.querySelector('.btn--save-password').textContent = 'Save Password';

          case 11:
          case "end":
            return _context.stop();
        }
      }
    });
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', function (e) {
    e.target.textContent = 'Processing...';
    var tourId = e.target.dataset.tourId;
    (0, _stripe.bookTour)(tourId);
  });
}

if (reviewBtn) {
  reviewBtn.addEventListener('click', function (e) {
    e.preventDefault();
    var review = document.querySelector('.review__input').value;
    var tour = document.getElementById('data-tour').value;
    var rating = 0;

    if (document.getElementById('star1').checked) {
      rating = 1;
    } else if (document.getElementById('star2').checked) {
      rating = 2;
    } else if (document.getElementById('star3').checked) {
      rating = 3;
    } else if (document.getElementById('star4').checked) {
      rating = 4;
    } else if (document.getElementById('star5').checked) {
      rating = 5;
    }

    if (review && rating != 0) {
      var data = {
        review: review,
        rating: rating,
        tour: tour
      };
      (0, _reviews.addReview)(data);
    }
  });
}

var alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) (0, _alerts.showAlert)('success', alertMessage, 20);