const Tour = require('./../dev-data/models/tourModel');
const Booking = require('./../dev-data/models/bookingModel');
const User = require('./../dev-data/models/userModel');
const Review = require('./../dev-data/models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      'Your booking was successful! Check your email for confirmation. If your booking does not show here immediately, please come back later.';

  next();
};

exports.getLanding = catchAsync(async (req, res, next) => {
  res.status(200).render('landing', {
    title: 'Exciting tours for adventurous people',
  });
});

exports.getOverview = catchAsync(async (req, res, next) => {
  //1) Get Tour data from collection
  const tours = await Tour.find();
  //2) Build Template

  //3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //1) Get the data for the requested tour, (including Guides and Reviews)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'user review rating',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }
  //2) Build Template

  //3) Render template using the data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Login to your Account',
  });
};

exports.getSignupForm = (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Create your Account!',
  });
};

exports.getAccount = (req, res, next) => {
  res.status(200).render('accountInfo', {
    title: 'Your account',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  //1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });
  //2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('booked', {
    title: 'My Tours',
    tours,
  });
});

exports.getAllTours = catchAsync(async (req, res, next) => {
  //1) Find all tours
  const tours = await Tour.find();

  res.status(200).render('tours', {
    title: 'All Tours',
    tours,
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  //1) Find all users
  const users = await User.find();
  res.status(200).render('users', {
    title: 'Manage Users',
    users,
  });
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
  //1) Find all bookings
  const reviews = await Review.find({ user: req.user.id });
  res.status(200).render('reviews', {
    title: 'My Reviews',
    reviews,
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  //1) Find all bookings
  const reviews = await Review.find();
  const showUserName = true;
  res.status(200).render('reviews', {
    title: 'Manage Reviews',
    reviews,
    showUserName,
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  //1) Find all bookings
  const users = await User.find();

  res.status(200).render('users', {
    title: 'Manage Users',
    users,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});

exports.getForgotPasswordForm = (req, res, next) => {
  res.status(200).render('forgotPassword', {
    title: 'Forgot Password',
  });
};

exports.getPasswordResetForm = (req, res, next) => {
  res.locals.token = req.params.token;
  res.status(200).render('resetPassword', {
    title: 'Reset Your Password',
  });
};
