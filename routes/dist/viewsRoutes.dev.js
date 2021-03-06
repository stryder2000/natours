"use strict";

var express = require('express');

var router = express.Router();

var viewsController = require('./../controllers/viewsController');

var auth = require('./../controllers/authController'); //const bookingController = require('./../controllers/bookingController');


router.use(viewsController.alerts);
router.get('/', viewsController.getLanding);
router.get('/overview', auth.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', auth.isLoggedIn, viewsController.getTour);
router.get('/login', auth.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', viewsController.getSignupForm);
router.get('/me', auth.protect, viewsController.getAccount);
router.get('/my-tours', auth.protect, viewsController.getMyTours);
router.get('/all-tours', auth.protect, viewsController.getAllTours);
router.get('/my-reviews', auth.protect, viewsController.getMyReviews);
router.get('/manage-reviews', auth.protect, viewsController.getAllReviews);
router.get('/manage-users', auth.protect, viewsController.getAllUsers);
router.post('/submit-user-data', auth.protect, viewsController.updateUserData);
router.get('/forgot-password', viewsController.getForgotPasswordForm);
router.get('/password-reset/:token', viewsController.getPasswordResetForm);
module.exports = router;