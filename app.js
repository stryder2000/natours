const pug = require('pug');
const path = require('path');
const express = require('express');
const app = express();
const AppError = require('./utils/AppError.js');
const compression = require('compression');
const cors = require('cors');
const globalErrorHandler = require('./controllers/errorController');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');

//morgan(3rd party middleware) is used to get logging info.
const viewsRouter = require('./routes/viewsRoutes');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
//'views' stands for 'View Settings'

//GLOBAL MIDDLEWARE

//For handling simple CORS(Cross Origin Resource Sharing) requests.
app.use(cors());
//Access-Control-Allow-Origin *

//For handling non-simple CORS requests.
app.options('*', cors());
//Non-simple requests would be valid only for the specified route.
//app.options('/api/v1/tours/:id', cors());

//Serving static files - Importing static files of the project.
app.use(express.static(path.join(__dirname, 'public')));

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
  message: 'Too many requests from this IP. Please try again later in an hour!',
});

app.use('/api', limiter);

// Stripe webhook, BEFORE body-parser, because stripe needs the body as stream
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);

//Body parser, reading data from body into req.body
//Limits the incoming data to body to 10kb
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'price',
      'difficulty',
      'maxGroupSize',
    ],
  })
);

app.use(compression());
//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//app.use(morgan('tiny'));

//Here we refactor our code to improve readability of our code.
//We group together the HTTP methods that have same URL.
app.use('/', viewsRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server!`, 404));
});

//Global error handling middleware - It handles all the errors
//that are generated using next() in any of the routes above.
//Note here that this is the last statement to handle every error
//that is generated in any of the above statements.
app.use(globalErrorHandler);

module.exports = app;
