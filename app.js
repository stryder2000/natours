const fs = require('fs');
const express = require('express');
const app = express();
const morgan = require('morgan');
//morgan(3rd party middleware) is used to get logging info.
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//Middleware
app.use(express.json());
//app.use(morgan('dev'));
//app.use(morgan('tiny'));


//app.get('/api/v1/tours', getAllTours);
//app.get('/api/v1/tours/:id', getTourByID);
//app.post('/api/v1/tours', createNewTour);
//app.patch('/api/v1/tours/:id', updateTour);
//app.delete('/api/v1/tours/:id', deleteTour);

//Here we refactor our code to improve readability of our code.
//We group together the HTTP methods that have same URL.

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;