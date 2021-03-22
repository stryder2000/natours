"use strict";

//Handling uncaught exceptions -
//to handle the errors that occur in asynchronous code.
//Note that this handler(defined synchronously) can only handle
//the errors that are defined synchronously after the handler.
//So we ideally define the handler at the top so that all exceptions
//are caught.
process.on('uncaughtException', function (err) {
  console.log('UNCAUGHT EXCEPTION! 🎇 Shutting down..');
  console.log(err.name, err.message);
  console.log(err);
  process.exit(1);
});

var mongoose = require('mongoose');

var dotenv = require('dotenv');

var app = require('./app');

dotenv.config({
  path: './config.env'
});
var DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(process.env.DATABASE_LOCAL, {
  // .connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(function (con) {
  return console.log('DB connection successful!');
}); //.catch(err => console.log("ERROR 🎇"));

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
  console.log("App running on port ".concat(port, "..."));
}); //Handling unhandled rajection promises -
//that allows us to handle all the errors that occur in
//asynchronous code that were not handled previously.
//Note that these act as a safety net to all the
//unhandled rejections.

process.on('unhandledRejection', function (err) {
  console.log('UNHANDLED REJECTION! 🎇 Shutting down..');
  server.close(function () {
    console.log(err.name, err.message);
    process.exit(1);
  });
});
process.on('SIGTERM', function () {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(function () {
    console.log('💥 Process terminated!');
  });
}); //To call upon the uncaught Exception defined above,
//we use synchronous code such as : console.log(x);
//where x is not defined.
//const testTour = new tour({
//    name : 'The City Explorer4',
//    price : 299
//});
//const testTour2 = new tour({
//    name : 'The Forest Hiker4',
//    rating : 4.9,
//    price : 497
//});
//
//testTour
//    .save()
//    .then(doc => console.log(doc))
//    .catch(err => console.log("ERROR 🎇🎇"));
//
//testTour2
//    .save()
//    .then(doc => console.log(doc))
//    .catch(err => console.log("ERROR 🎇🎇"));