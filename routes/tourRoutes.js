const express = require('express');
const router = express.Router();
const handlers = require('./../controllers/tourController');
const auth = require('./../controllers/authController');
//const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');

//Middleware to direct the tour/reviews further to reviewRoutes
router.use('/:tourId/reviews', reviewRouter);

//Parameter middleware - To check if the id sent as parameter(through url) is valid or invalid.
//router.param('id', handlers.checkID);

router
    .route('/tours-within/:distance/center/:latlong/unit/:unit')
    .get(handlers.getToursWithin);
router.route('/distances/:latlong/unit/:unit').get(handlers.getDistances);

router.route('/top-5-tours').get(handlers.aliasTopTours, handlers.getAllTours);
router.route('/stats').get(handlers.getTourStats);
router
    .route('/monthly-plan/:year')
    .get(
        auth.protect,
        auth.restrictTo('admin', 'lead-guide', 'guide'),
        handlers.getMonthlyPlan
    );

//To route further based on the url.
router
    .route('/')
    .get(auth.protect, handlers.getAllTours)
    .post(
        auth.protect,
        auth.restrictTo('admin', 'lead-guide'),
        handlers.createNewTour
    );

router
    .route('/:id')
    .get(handlers.getTourByID)
    .patch(
        auth.protect,
        auth.restrictTo('admin', 'lead-guide'),
        handlers.uploadTourImages,
        handlers.resizeTourImages,
        handlers.updateTour
    )
    .delete(
        auth.protect,
        auth.restrictTo('admin', 'lead-guide'),
        handlers.deleteTour
    );

////Nested Routes
// POST /tour/14155sdf2323/reviews - create new review for a particular tour
//router
//    .route('/:tourId/reviews')
//    .post(
//        auth.protect,
//        auth.restrictTo('user'),
//        reviewController.createNewReview
//    );

// GET /tour/12342sdf34234/reviews - get all reviews of a particular tour
// GET /tour/124252sdfs242/reviews/1312sdfs5e45 - get a particular review of a particular tour

module.exports = router;
