"use strict";

var Review = require('./../dev-data/models/reviewModel');

var catchAsync = require('./../utils/catchAsync'); //const AppError = require('./../utils/AppError');


var factory = require('./handlerFactory');

exports.setTourUserIds = catchAsync(function _callee(req, res, next) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!req.body.user) req.body.user = req.user.id;
          if (!req.body.tour) req.body.tour = req.params.tourId;
          next();

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.createNewReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.getReview = factory.getOne(Review);
exports.getAllReviews = factory.getAll(Review);