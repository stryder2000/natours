"use strict";

var stripe = require('stripe')('sk_test_51H8TgkGn4dG3D9SdasKbVTzaH1LGjcrfuagNafcR7tQrItqm7zxNLZbUiwb0xXlj05xOuOi6riuLPI3Vib940MrG00RlUsj2Bn');

var Tour = require('../dev-data/models/tourModel');

var User = require('../dev-data/models/userModel');

var Booking = require('../dev-data/models/bookingModel');

var factory = require('./handlerFactory');

var catchAsync = require('../utils/catchAsync');

exports.getCheckoutSession = catchAsync(function _callee(req, res, next) {
  var tour, session;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Tour.findById(req.params.tourId));

        case 2:
          tour = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            // success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
            //   req.params.tourId
            // }&user=${req.user.id}&price=${tour.price}`,
            success_url: "".concat(req.protocol, "://").concat(req.get('host'), "/my-tours?alert=booking"),
            cancel_url: "".concat(req.protocol, "://").concat(req.get('host'), "/tour/").concat(tour.slug),
            customer_email: req.user.email,
            client_reference_id: req.params.tourId,
            line_items: [{
              name: "".concat(tour.name, " Tour"),
              description: tour.summary,
              images: ["".concat(req.protocol, "://").concat(req.get('host'), "/img/tours/").concat(tour.imageCover)],
              amount: tour.price * 100,
              currency: 'inr',
              quantity: 1
            }]
          }));

        case 5:
          session = _context.sent;
          // 3) Create session as response
          res.status(200).json({
            status: 'success',
            session: session
          });

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
});

exports.webhookCheckout = function _callee2(req, res, next) {
  var signature, event, session, tour, user, price;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          signature = req.headers['stripe-signature'];
          _context2.prev = 1;
          event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
          _context2.next = 8;
          break;

        case 5:
          _context2.prev = 5;
          _context2.t0 = _context2["catch"](1);
          return _context2.abrupt("return", res.status(400).send("Webhook error: ".concat(_context2.t0.message)));

        case 8:
          if (!(event.type === 'checkout.session.completed')) {
            _context2.next = 17;
            break;
          }

          session = event.data.object;
          tour = session.client_reference_id;
          _context2.next = 13;
          return regeneratorRuntime.awrap(User.findOne({
            email: session.customer_email
          }));

        case 13:
          user = _context2.sent.id;
          price = session.display_items[0].amount / 100;
          _context2.next = 17;
          return regeneratorRuntime.awrap(Booking.create({
            tour: tour,
            user: user,
            price: price
          }));

        case 17:
          res.status(200).json({
            received: true
          });

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 5]]);
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);