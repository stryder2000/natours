"use strict";

var Tour = require('./../dev-data/models/tourModel');

var Booking = require('./../dev-data/models/bookingModel');

var User = require('./../dev-data/models/userModel');

var Review = require('./../dev-data/models/reviewModel');

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
          res.status(200).render('landing', {
            title: 'Exciting tours for adventurous people'
          });

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
  var activeBtn = [true, false, false, false, false, false, false, false];
  res.status(200).render('accountInfo', {
    title: 'Your account',
    activeBtn: activeBtn
  });
};

exports.getMyTours = catchAsync(function _callee4(req, res, next) {
  var bookings, tourIDs, tours, activeBtn;
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
          activeBtn = [false, true, false, false, false, false, false, false];
          res.status(200).render('booked', {
            title: 'My Tours',
            tours: tours,
            activeBtn: activeBtn
          });

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  });
});
exports.getAllTours = catchAsync(function _callee5(req, res, next) {
  var tours, activeBtn;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(Tour.find());

        case 2:
          tours = _context5.sent;
          activeBtn = [false, false, false, false, true, false, false, false];
          res.status(200).render('tours', {
            title: 'All Tours',
            tours: tours,
            activeBtn: activeBtn
          });

        case 5:
        case "end":
          return _context5.stop();
      }
    }
  });
});
exports.getAllUsers = catchAsync(function _callee6(req, res, next) {
  var users, activeBtn;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(User.find());

        case 2:
          users = _context6.sent;
          activeBtn = [false, false, false, false, false, true, false, false];
          res.status(200).render('users', {
            title: 'Manage Users',
            users: users,
            activeBtn: activeBtn
          });

        case 5:
        case "end":
          return _context6.stop();
      }
    }
  });
});
exports.getMyReviews = catchAsync(function _callee7(req, res, next) {
  var reviews, activeBtn;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(Review.find({
            user: req.user.id
          }));

        case 2:
          reviews = _context7.sent;
          activeBtn = [false, false, true, false, false, false, false, false];
          res.status(200).render('reviews', {
            title: 'My Reviews',
            reviews: reviews,
            activeBtn: activeBtn
          });

        case 5:
        case "end":
          return _context7.stop();
      }
    }
  });
});
exports.getAllReviews = catchAsync(function _callee8(req, res, next) {
  var reviews, showUserName, activeBtn;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(Review.find());

        case 2:
          reviews = _context8.sent;
          showUserName = true;
          activeBtn = [false, false, false, false, false, false, true, false];
          res.status(200).render('reviews', {
            title: 'Manage Reviews',
            reviews: reviews,
            showUserName: showUserName,
            activeBtn: activeBtn
          });

        case 6:
        case "end":
          return _context8.stop();
      }
    }
  });
});
exports.updateUserData = catchAsync(function _callee9(req, res, next) {
  var updatedUser;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, {
            name: req.body.name,
            email: req.body.email
          }, {
            "new": true,
            runValidators: true
          }));

        case 2:
          updatedUser = _context9.sent;
          res.status(200).render('account', {
            title: 'Your account',
            user: updatedUser
          });

        case 4:
        case "end":
          return _context9.stop();
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