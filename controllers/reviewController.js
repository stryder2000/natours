const Review = require('./../dev-data/models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
//const AppError = require('./../utils/AppError');
const factory = require('./handlerFactory');

exports.setTourUserIds = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  next();
});

exports.createNewReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.getReview = factory.getOne(Review);
exports.getAllReviews = factory.getAll(Review);
