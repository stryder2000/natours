const User = require('./../dev-data/models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/AppError');
const Email = require('./../utils/email');
const { promisify } = require('util');
const crypto = require('crypto');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    //res.cookie(cookieName, cookieContent, options);
    res.cookie('jwt', token, cookieOptions);
    //options -
    //expires : the cookie expires automatically after a certain time.
    //secure : cookie is transported through https or an encrypted connection.
    //httpOnly : httpOnly cookie cannot be accessed or modified by the browser.

    //Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    console.log(req.body);

    const newUser = await User.create(req.body);

    //jwt.sign(payload-object, secret string present only on server, {options})
    //expiresIn option specifies the time in which the token with expire automatically
    //jwt.sign() uses SHA256 algo for encryption.
    const url = `${req.protocol}://${req.get('host')}/me`;
    await new Email(newUser, url).sendWelcome();
    createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //1) Check if email & password exist.
    if (!email || !password) {
        return next(new AppError('Please enter your email & password', 400));
    }

    //2) Check if email is valid & password is correct.
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password!', 401));
    }
    //3) If everything is okay, then send token to client.
    createSendToken(user, 200, res);
});

exports.logout = async (req, res, next) => {
    res.cookie('jwt', 'LoggedOutttt', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        status: 'success'
    });
};

exports.protect = catchAsync(async (req, res, next) => {
    //1) Getting token & checking if its there.
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(
            new AppError(
                'You are not logged in. Please login to get access!',
                401
            )
        );
    }

    //2) Authorization - to check if someone manipulated the data or the token has expired.
    //Internally generates the JsonWebTokenError, TokenExpiredError for invalid token & Expired token respectively.
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //console.log(decoded);

    //3) Check if the user still exists.
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token does not exists.',
                401
            )
        );
    }
    //4) Check if the user changed password after the token was issued.
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                'User recently changed password. Please login again.',
                401
            )
        );
    }

    //ACCESS GRANTED TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
});

//Only for rendered pages, no errors!
exports.isLoggedIn = catchAsync(async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            //1) Verify Token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET
            );

            //2) Check if the user still exists.
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next();
            }
            //3) Check if the user changed password after the token was issued.
            if (currentUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }

            //THERE IS A LOGGED IN USER
            res.locals.user = currentUser;
            return next();
        } catch (err) {
            return next();
        }
    }
    next();
});

//...roles => rest parameter syntax that can take any number of arguments.
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'lead-guide'].
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    'You do not have permission to perform this action',
                    403
                )
            );
        }
        next();
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    //1)Get user based on the posted email.
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(
            new AppError('There is no user with this email address'),
            404
        );
    }

    //2)Generate the random reset token.
    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    //Here we set validateBeforeSave: false bcz we by now we have deleted the confirmPassword field.
    //& when the validators run again when we save the document, an error is displayed.

    //3)Send it to user's email.

    try {
        //        await sendMail({
        //            email: user.email,
        //            subject: 'Your Password Reset Token (valid for 10 min)',
        //            message
        //        });

        const resetURL = `${req.protocol}://${req.get(
            'host'
        )}/api/v1/users/resetPassword/${resetToken}`;

        await new Email(user, resetURL).sendPasswordReset();

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email successfully!'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(
            new AppError(
                'There was an error sending the email. Please try again later!',
                500
            )
        );
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    //1) Get the user based on token
    const user = await User.findOne({
        passwordResetToken: crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex'),
        passwordResetExpires: { $gt: Date.now() }
    });

    //2) If token is not expired, & the user is there, then set the new password
    if (!user) {
        return next(new AppError(`Token is invalid or has expired`, 400));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    //Note that we use here save() instead of update() or findOneAndUpdate() bcz save() would run the validators and hooks(middleware) for the model again.

    //4) Log the user in, send JWT
    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    //1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');
    //select('+password') bcz we have to explicitly select the password as it is not included in the output.

    //2) Check if POSTed current password is correct
    if (
        !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
        return next(new AppError(`Your current password is wrong!`, 401));
    }
    //3) If so, update password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    //4) Log user in, send JWT
    createSendToken(user, 200, res);
});
