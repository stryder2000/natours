"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bookTour = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _alerts = require("./alerts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var stripe = Stripe('pk_test_51H8TgkGn4dG3D9SdQfijUzjxRbENvm3xxwrzByxg66rzoU4bI5wtd8cdXjbwWlOyIvCXDA5fM95SmHQxp8Q03I7S00Dnd7fjg2');

var bookTour = function bookTour(tourId) {
  var session;
  return regeneratorRuntime.async(function bookTour$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])("/api/v1/bookings/checkout-session/".concat(tourId)));

        case 3:
          session = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(stripe.redirectToCheckout({
            sessionId: session.data.session.id
          }));

        case 6:
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          (0, _alerts.showAlert)('error', _context.t0.message);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.bookTour = bookTour;