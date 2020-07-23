const express = require('express');
const router = express.Router({ mergeParams: true });
//Basically, we cannot access url params intended for some route in another route, so mergeParams makes all the url parameters accessible in all the routes.
const auth = require('./../controllers/authController.js');
const reviewController = require('./../controllers/reviewController.js');

router.use(auth.protect);

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        auth.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createNewReview
    );
router
    .route('/:id')
    .delete(auth.restrictTo('user', 'admin'), reviewController.deleteReview)
    .patch(auth.restrictTo('user', 'admin'), reviewController.updateReview)
    .get(reviewController.getReview);

module.exports = router;
