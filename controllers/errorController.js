const AppError = require('./../utils/AppError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(['"])(\\?.)*?\1/);

    const message = `Duplicate Field value : ${
        value[0]
    }. Please use another value.`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJsonWebTokenError = () =>
    new AppError('Invalid Token. Please login again!', 401);
const handleTokenExpiredError = () =>
    new AppError('Your token has expired. Please login again.', 401);

const sendErrorDev = (err, req, res) => {
    //1) API
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } 
    //B) RENDERED WEBSITE
    console.error('ERROR 💥', err);
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
    });
};
const sendErrorProd = (err, req, res) => {
    //1) API
    if(req.originalUrl.startsWith('/api')){
        //A) Operational, trusted error: Send message to Client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }
        
        // Programming or other unknown error: don't leak error details
        // 1) Log error
        console.error('ERROR 💥', err);

        // 2) Send generic message
        return res.status(500).render('error',{
            status: 'error',
            msg: 'Something went very wrong!'
        });
    }
    
    //2) RENDERED WEBSITE
    //A) Operational, trusted error : Send message to client.
    if (err.isOperational) {
        console.error('ERROR 💥', err);
        
        return res.status(err.statusCode).render('error',{
            title: 'Something went wrong!',
            msg: err.message
        });
    } 
    
    // Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    return res.status(500).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later.'
    });
};

module.exports = (err, req, res, next) => {
    //console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = err;
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError')
            error = handleJsonWebTokenError();
        if (error.name === 'TokenExpiredError')
            error = handleTokenExpiredError();
        sendErrorProd(error, req, res);
    }
};
