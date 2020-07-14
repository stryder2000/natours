const fs = require('fs');
const express = require('express');
const app = express();
const AppError = require('./utils/AppError.js');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
//morgan(3rd party middleware) is used to get logging info.

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//GLOBAL MIDDLEWARE
//Set security HTTP headers
app.use(helmet());

//Development logging
if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}

//limit requests from same API
const limiter = new rateLimit({
    max: 100,
    windowsMs: 60 * 60 * 1000,
    message:
        'Too many requests from this IP. Please try again later in an hour!'
});

app.use('/api', limiter);

//Body parser, reading data from body into req.body
//Limits the incoming data to body to 10kb
app.use(express.json({ limit: '10kb' }));

//Serving static files - Importing static files of the project.
app.use(express.static(`${__dirname}/public`));

//Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

//app.use(morgan('tiny'));

//ROUTES
//app.get('/api/v1/tours', getAllTours);
//app.get('/api/v1/tours/:id', getTourByID);
//app.post('/api/v1/tours', createNewTour);
//app.patch('/api/v1/tours/:id', updateTour);
//app.delete('/api/v1/tours/:id', deleteTour);

//Here we refactor our code to improve readability of our code.
//We group together the HTTP methods that have same URL.
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    //    const err = new Error(`Can't find ${req.originalUrl} on the server!`);
    //    err.statusCode = 404;
    //    err.status = 'fail';
    //    next(err);
    next(new AppError(`Can't find ${req.originalUrl} on the server!`, 404));
});

//Global error handling middleware - It handles all the errors
//that are generated using next() in any of the routes above.
//Note here that this is the last statement to handle every error
//that is generated in any of the above statements.
app.use(globalErrorHandler);

module.exports = app;
