"use strict";

var Tour = require('./../dev-data/models/tourModel');

var Booking = require('./../dev-data/models/bookingModel');

var User = require('./../dev-data/models/userModel');

var catchAsync = require('./../utils/catchAsync');

var AppError = require('./../utils/AppError');

exports.alerts = function (req, res, next) {
  var alert = req.query.alert;
  if (alert === 'booking') res.locals.alert = 'Your booking was successful! Check your email for confirmation. If your booking does not show here immediately, please come back later.';
  next();
};

exports.getLanding = catchAsync(function _callee(req, res, next) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          res.status(200).sendFile("".concat(__dirname, "/../../public/index.html"));

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.getOverview = catchAsync(function _callee2(req, res, next) {
  var tours;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Tour.find());

        case 2:
          tours = _context2.sent;
          //2) Build Template
          //3) Render that template using tour data from 1)
          res.status(200).render('overview', {
            title: 'All Tours',
            tours: tours
          });

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.getTour = catchAsync(function _callee3(req, res, next) {
  var tour;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Tour.findOne({
            slug: req.params.slug
          }).populate({
            path: 'reviews',
            fields: 'user review rating'
          }));

        case 2:
          tour = _context3.sent;

          if (tour) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", next(new AppError('There is no tour with that name.', 404)));

        case 5:
          //2) Build Template
          //3) Render template using the data from 1)
          res.status(200).render('tour', {
            title: "".concat(tour.name, " Tour"),
            tour: tour
          });

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
});

exports.getLoginForm = function (req, res, next) {
  res.status(200).render('login', {
    title: 'Login to your Account'
  });
};

exports.getSignupForm = function (req, res, next) {
  res.status(200).render('signup', {
    title: 'Create your Account!'
  });
};

exports.getAccount = function (req, res, next) {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.getMyTours = catchAsync(function _callee4(req, res, next) {
  var bookings, tourIDs, tours;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Booking.find({
            user: req.user.id
          }));

        case 2:
          bookings = _context4.sent;
          //2) Find tours with the returned IDs
          tourIDs = bookings.map(function (el) {
            return el.tour;
          });
          _context4.next = 6;
          return regeneratorRuntime.awrap(Tour.find({
            _id: {
              $in: tourIDs
            }
          }));

        case 6:
          tours = _context4.sent;
          res.status(200).render('booked', {
            title: 'My Tours',
            tours: tours
          });

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  });
});
exports.updateUserData = catchAsync(function _callee5(req, res, next) {
  var updatedUser;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, {
            name: req.body.name,
            email: req.body.email
          }, {
            "new": true,
            runValidators: true
          }));

        case 2:
          updatedUser = _context5.sent;
          res.status(200).render('account', {
            title: 'Your account',
            user: updatedUser
          });

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
});

exports.getForgotPasswordForm = function (req, res, next) {
  res.status(200).render('forgotPassword', {
    title: 'Forgot Password'
  });
};

exports.getPasswordResetForm = function (req, res, next) {
  res.locals.token = req.params.token;
  res.status(200).render('resetPassword', {
    title: 'Reset Your Password'
  });
};