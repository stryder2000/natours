const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email!']
    },
    photo: { 
        type: String, 
        default: 'default.jpg' 
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password!'],
        validate: {
            //THIS ONLY WORKS ON CREATE AND SAVE!!!
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    changedPasswordAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

userSchema.pre('save', async function(next) {
    //If password not modified then return
    if (!this.isModified('password')) return next();

    //Otherwise Encryt with a cost 12 and then return
    //Note that : Higher the cost, more time the CPU takes to encrypt the password
    //It also means, the password is more secure.
    //This is an asynchronous version of bcrpyt.hash().
    this.password = await bcrypt.hash(this.password, 12);

    //delete confirmPassword field
    //required : true only means that the field is only required as input,
    //and is not required to be persisted.
    this.confirmPassword = undefined;
    next();
});

userSchema.pre('save', async function(next) {
    //We exit this middleware if we have not modified the password or the document is new
    if (!this.isModified('password') || this.isNew) return next();

    this.changedPasswordAt = Date.now() - 1000;

    next();
});

userSchema.pre(/^find/, function(next) {
    //this points to the current query.
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.changedPasswordAt) {
        const changedTimestamp = parseInt(
            this.changedPasswordAt.getTime() / 1000,
            10
        );
        //        console.log(changedTimestamp, JWTTimestamp);
        return JWTTimestamp < changedTimestamp;
    }
    //False means NOT changed
    return false;
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    //Encrypting 'resetToken'
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    //    console.log({ resetToken }, this.passwordResetToken);

    //The 'passwordResetToken' expires in 10 mins after its creation.
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = new mongoose.model('User', userSchema);

module.exports = User;
