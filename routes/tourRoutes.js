const express = require('express');
const router = express.Router();
const handlers = require('./../controllers/tourController');
const auth = require('./../controllers/authController');

//Parameter middleware - To check if the id sent as parameter(through url) is valid or invalid.
//router.param('id', handlers.checkID);

router.route('/top-5-tours').get(handlers.aliasTopTours, handlers.getAllTours);

router.route('/stats').get(handlers.getTourStats);

router.route('/monthly-plan/:year').get(handlers.getMonthlyPlan);

//To route further based on the url.
router
    .route('/')
    .get(auth.protect, handlers.getAllTours)
    .post(handlers.createNewTour);

router
    .route('/:id')
    .get(handlers.getTourByID)
    .patch(handlers.updateTour)
    .delete(
        auth.protect,
        auth.restrictTo('admin', 'lead-guide'),
        handlers.deleteTour
    );

module.exports = router;
