"use strict";

var User = require('./../dev-data/models/userModel.js');

var catchAsync = require('./../utils/catchAsync');

var multer = require('multer'); //for file upload


var sharp = require('sharp');

var fs = require('fs');

var path = require('path'); //for image processing


var AppError = require('./../utils/AppError');

var factory = require('./handlerFactory'); // const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + '-' + Date.now());
//   },
// });


var multerStorage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'public/img/users');
  },
  filename: function filename(req, file, cb) {
    var ext = file.mimetype.split('/')[1];
    cb(null, "user-".concat(req.user.id, "-").concat(Date.now(), ".").concat(ext));
  }
});

var multerFilter = function multerFilter(req, file, cb) {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image. Please upload only images!', 400), false);
  }
};

var upload = new multer({
  storage: multerStorage,
  fileFilter: multerFilter
}); //dest is the option that specifies the path where our file is to be saved.

exports.uploadUserPhoto = upload.single('photo');
exports.resizeUserPhoto = catchAsync(function _callee(req, res, next) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (req.file) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", next());

        case 2:
          //   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
          req.file.buffer = fs.readFileSync(path.join(__dirname + '/../public/img/users/' + req.file.filename));
          console.log(req.file);
          _context.next = 6;
          return regeneratorRuntime.awrap(sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({
            quality: 90
          }).toFile("public/img/users/".concat(req.file.filename)));

        case 6:
          next();

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
});

var filterObj = function filterObj(obj) {
  for (var _len = arguments.length, allowedFields = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    allowedFields[_key - 1] = arguments[_key];
  }

  var newObj = {};
  Object.keys(obj).forEach(function (el) {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = function (req, res, next) {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(function _callee2(req, res, next) {
  var filteredBody, updatedUser;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(req.body.password || req.body.confirmPassword)) {
            _context2.next = 2;
            break;
          }

          return _context2.abrupt("return", next(new AppError('This route is not for password update. Please use /updatePassword', 400)));

        case 2:
          //2) Filtered out unwanted field names that are not allowed to be updated (like role, passwordChangeAt, etc)
          filteredBody = filterObj(req.body, 'name', 'email');

          if (req.file) {
            filteredBody.img = {
              data: req.file.buffer
            };
            console.log('This');
          }

          console.log(filteredBody); //3) Update user document

          _context2.next = 7;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, filteredBody, {
            "new": true,
            runValidators: true
          }));

        case 7:
          updatedUser = _context2.sent;
          res.status(200).json({
            status: 'success',
            user: {
              updatedUser: updatedUser
            }
          });

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.deleteMe = catchAsync(function _callee3(req, res, next) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, {
            active: false
          }));

        case 2:
          res.status(204).json({
            status: 'success',
            data: null
          });

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createNewUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);