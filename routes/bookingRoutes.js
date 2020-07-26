const express = require('express');
const router = express.Router();
const auth = require('./../controllers/authController.js');
const bookingController = require('./../controllers/bookingController.js');

router.use(auth.protect);

router.get('/checkout-session/:tourID', bookingController.getCheckoutSession);

router.use(auth.restrictTo('admin', 'lead-guide'));

router
    .route('/')
    .get(bookingController.getAllBookings)
    .post(bookingController.createBooking);

router
    .route('/:id')
    .get(bookingController.getBooking)
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleteBooking);

module.exports = router;
