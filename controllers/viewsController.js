const Tour = require('./../dev-data/models/tourModel');
const User = require('./../dev-data/models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

exports.getOverview = catchAsync(async (req, res, next) => {
    //1) Get Tour data from collection
    const tours = await Tour.find();
    //2) Build Template

    //3) Render that template using tour data from 1)
    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    //1) Get the data for the requested tour, (including Guides and Reviews)
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'user review rating'
    });

    if (!tour) {
        return next(new AppError('There is no tour with that name.', 404));
    }
    //2) Build Template

    //3) Render template using the data from 1)
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour
    });
});

exports.getLoginForm = (req, res, next) => {
    res.status(200).render('login', {
        title: 'Login to your Account'
    });
};

exports.getAccount = (req, res, next) => {
    res.status(200).render('account', {
        title: 'Your account'
    });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    },{
        new : true,
        runValidators : true
    });

    res.status(200).render('account', {
        title: 'Your account',
        user: updatedUser
    });
});
