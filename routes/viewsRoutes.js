const express = require('express');
const router = express.Router();
const viewsController = require('./../controllers/viewsController');
const auth = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');

router.use(viewsController.alerts);
router.get(
    '/',
    //    bookingController.createBookingCheckout,
    auth.isLoggedIn,
    viewsController.getOverview
);
router.get('/tour/:slug', auth.isLoggedIn, viewsController.getTour);
router.get('/login', auth.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', viewsController.getSignupForm);
router.get('/me', auth.protect, viewsController.getAccount);
router.get('/my-tours', auth.protect, viewsController.getMyTours);
router.post('/submit-user-data', auth.protect, viewsController.updateUserData);

module.exports = router;
