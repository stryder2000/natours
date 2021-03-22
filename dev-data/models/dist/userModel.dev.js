'use strict';

var mongoose = require('mongoose');

var validator = require('validator');

var bcrypt = require('bcryptjs');

var crypto = require('crypto');

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      //THIS ONLY WORKS ON CREATE AND SAVE!!!
      validator: function validator(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  changedPasswordAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
userSchema.pre('save', function _callee(next) {
  return regeneratorRuntime.async(
    function _callee$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            if (this.isModified('password')) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return', next());

          case 2:
            _context.next = 4;
            return regeneratorRuntime.awrap(bcrypt.hash(this.password, 12));

          case 4:
            this.password = _context.sent;
            //delete confirmPassword field
            //required : true only means that the field is only required as input,
            //and is not required to be persisted.
            this.confirmPassword = undefined;
            next();

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    },
    null,
    this
  );
});
userSchema.pre('save', function _callee2(next) {
  return regeneratorRuntime.async(
    function _callee2$(_context2) {
      while (1) {
        switch ((_context2.prev = _context2.next)) {
          case 0:
            if (!(!this.isModified('password') || this.isNew)) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt('return', next());

          case 2:
            this.changedPasswordAt = Date.now() - 1000;
            next();

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    },
    null,
    this
  );
});
userSchema.pre(/^find/, function (next) {
  //this points to the current query.
  this.find({
    active: {
      $ne: false,
    },
  });
  next();
});

userSchema.methods.correctPassword = function _callee3(
  candidatePassword,
  userPassword
) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch ((_context3.prev = _context3.next)) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(
            bcrypt.compare(candidatePassword, userPassword)
          );

        case 2:
          return _context3.abrupt('return', _context3.sent);

        case 3:
        case 'end':
          return _context3.stop();
      }
    }
  });
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.changedPasswordAt) {
    var changedTimestamp = parseInt(
      this.changedPasswordAt.getTime() / 1000,
      10
    ); //        console.log(changedTimestamp, JWTTimestamp);

    return JWTTimestamp < changedTimestamp;
  } //False means NOT changed

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  var resetToken = crypto.randomBytes(32).toString('hex'); //Encrypting 'resetToken'

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex'); //    console.log({ resetToken }, this.passwordResetToken);
  //The 'passwordResetToken' expires in 10 mins after its creation.

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

var User = new mongoose.model('User', userSchema);
module.exports = User;
