//Handling uncaught exceptions -
//to handle the errors that occur in asynchronous code.
//Note that this handler(defined synchronously) can only handle
//the errors that are defined synchronously after the handler.
//So we ideally define the handler at the top so that all exceptions
//are caught.
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 🎇 Shutting down..');
    console.log(err.name, err.message);
    process.exit(1);
});

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
        .connect(process.env.DATABASE_LOCAL,{
    //.connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(con => console.log('DB connection successful!'));
//.catch(err => console.log("ERROR 🎇"));

const port = process.env.port || 3000;

const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

//Handling unhandled rajection promises -
//that allows us to handle all the errors that occur in
//asynchronous code that were not handled previously.
//Note that these act as a safety net to all the
//unhandled rejections.
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 🎇 Shutting down..');
    server.close(() => {
        console.log(err.name, err.message);
        process.exit(1);
    });
});

//To call upon the uncaught Exception defined above,
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
