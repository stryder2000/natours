"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteTour = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _alerts = require("./alerts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var deleteTour = function deleteTour(tourId) {
  var url, res;
  return regeneratorRuntime.async(function deleteTour$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          url = '/api/v1/tours/' + tourId;
          _context.next = 4;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'DELETE',
            url: url
          }));

        case 4:
          res = _context.sent;

          if (res.data.status === 'success') {
            (0, _alerts.showAlert)('success', "".concat(type.toUpperCase(), " deleted successfully!"));
            window.setTimeout(function () {
              location.reload();
            }, 2000);
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

exports.deleteTour = deleteTour;