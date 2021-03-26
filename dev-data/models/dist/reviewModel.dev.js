"use strict";

var mongoose = require('mongoose');

var Tour = require('./tourModel');

var reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review can not be empty!']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    "default": Date.now
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must belong to a tour.']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  }
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});
reviewSchema.index({
  tour: 1,
  user: 1
}, {
  unique: true
});
reviewSchema.pre(/^find/, function (next) {
  this.populate('tour', 'name').populate('user', 'name photo');
  next();
});

reviewSchema.statics.calculateAvgRatings = function _callee(tourId) {
  var stats;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(this.aggregate([{
            $match: {
              tour: tourId
            }
          }, {
            $group: {
              _id: '$tour',
              nRating: {
                $sum: 1
              },
              avgRating: {
                $avg: '$rating'
              }
            }
          }]));

        case 2:
          stats = _context.sent;

          if (!(stats.length > 0)) {
            _context.next = 8;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap(Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
          }));

        case 6:
          _context.next = 10;
          break;

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
          }));

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
};

reviewSchema.post('save', function () {
  //this point to the current review
  //this.constructor points to Review Model
  //Note that we have to use this.constructor here instead of
  //Review here, as review is defined after definition of this function.
  this.constructor.calculateAvgRatings(this.tour);
}); // findByIdAndUpdate
// findByIdAndDelete

reviewSchema.pre(/^findOneAnd/, function _callee2(next) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(this.findOne());

        case 2:
          this.r = _context2.sent;
          next();

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  }, null, this);
});
reviewSchema.post(/^findOneAnd/, function _callee3() {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(this.r.constructor.calculateAvgRatings(this.r.tour));

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  }, null, this);
});
var Review = new mongoose.model('Review', reviewSchema);
module.exports = Review;