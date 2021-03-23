"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteReview = exports.addReview = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _alerts = require("./alerts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var addReview = function addReview(data) {
  var url, res;
  return regeneratorRuntime.async(function addReview$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          url = '/api/v1/reviews/';
          _context.next = 4;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'POST',
            url: url,
            data: data
          }));

        case 4:
          res = _context.sent;

          if (res.data.status === 'success') {
            (0, _alerts.showAlert)('success', "Thank you for your feedback!");
            window.setTimeout(function () {
              location.reload();
            }, 1000);
          }

          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          (0, _alerts.showAlert)('error', _context.t0.response.data.message);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.addReview = addReview;

var deleteReview = function deleteReview(reviewId) {
  var url, res;
  return regeneratorRuntime.async(function deleteReview$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          url = '/api/v1/reviews/' + reviewId;
          _context2.next = 4;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'DELETE',
            url: url
          }));

        case 4:
          res = _context2.sent;

          if (res.status === 204) {
            (0, _alerts.showAlert)('success', "Comment deleted Successfully!");
            window.setTimeout(function () {
              location.reload();
            }, 1000);
          }

          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          (0, _alerts.showAlert)('error', _context2.t0.response.data.message);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.deleteReview = deleteReview;