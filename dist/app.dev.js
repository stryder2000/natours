"use strict";

var pug = require('pug');

var path = require('path');

var express = require('express');

var app = express();

var AppError = require('./utils/AppError.js');

var compression = require('compression');

var cors = require('cors');

var globalErrorHandler = require('./controllers/errorController');

var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

var rateLimit = require('express-rate-limit');

var helmet = require('helmet');

var mongoSanitize = require('express-mongo-sanitize');

var xss = require('xss-clean');

var hpp = require('hpp');

var morgan = require('morgan'); //morgan(3rd party middleware) is used to get logging info.


var viewsRouter = require('./routes/viewsRoutes');

var tourRouter = require('./routes/tourRoutes');

var userRouter = require('./routes/userRoutes');

var reviewRouter = require('./routes/reviewRoutes');

var bookingRouter = require('./routes/bookingRoutes');

var bookingController = require('./controllers/bookingController');

app.enable('trust proxy');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); //'views' stands for 'View Settings'
//GLOBAL MIDDLEWARE
//For handling simple CORS(Cross Origin Resource Sharing) requests.

app.use(cors()); //Access-Control-Allow-Origin *
//For handling non-simple CORS requests.

app.options('*', cors()); //Non-simple requests would be valid only for the specified route.
//app.options('/api/v1/tours/:id', cors());
//Serving static files - Importing static files of the project.

app.use(express["static"](path.join(__dirname, 'public'))); //Set security HTTP headers

app.use(helmet()); //Development logging

if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
} //limit requests from same API


var limiter = new rateLimit({
  max: 100,
  windowsMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again later in an hour!'
});
app.use('/api', limiter); // Stripe webhook, BEFORE body-parser, because stripe needs the body as stream

app.post('/webhook-checkout', express.raw({
  type: 'application/json'
}), bookingController.webhookCheckout); //Body parser, reading data from body into req.body
//Limits the incoming data to body to 10kb

app.use(express.json({
  limit: '10kb'
}));
app.use(express.urlencoded({
  extended: true,
  limit: '10kb'
}));
app.use(cookieParser()); //Data sanitization against NoSQL query injection

app.use(mongoSanitize()); //Data sanitization against XSS

app.use(xss()); //Prevent Parameter Pollution

app.use(hpp({
  whitelist: ['duration', 'ratingsAverage', 'price', 'difficulty', 'maxGroupSize']
}));
app.use(compression()); //Test middleware

app.use(function (req, res, next) {
  req.requestTime = new Date().toISOString();
  next();
}); //app.use(morgan('tiny'));
//ROUTES
//app.get('/api/v1/tours', getAllTours);
//app.get('/api/v1/tours/:id', getTourByID);
//app.post('/api/v1/tours', createNewTour);
//app.patch('/api/v1/tours/:id', updateTour);
//app.delete('/api/v1/tours/:id', deleteTour);
//Here we refactor our code to improve readability of our code.
//We group together the HTTP methods that have same URL.

app.use('/', viewsRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.all('*', function (req, res, next) {
  //    const err = new Error(`Can't find ${req.originalUrl} on the server!`);
  //    err.statusCode = 404;
  //    err.status = 'fail';
  //    next(err);
  next(new AppError("Can't find ".concat(req.originalUrl, " on the server!"), 404));
}); //Global error handling middleware - It handles all the errors
//that are generated using next() in any of the routes above.
//Note here that this is the last statement to handle every error
//that is generated in any of the above statements.

app.use(globalErrorHandler);
module.exports = app;