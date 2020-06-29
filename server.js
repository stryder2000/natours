const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({path : './config.env'});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

app.use((req,res,next) => {
    console.log("Hello from the server👋👋");
    next();
});

mongoose.connect(process.env.DATABASE_LOCAL,{
    useNewUrlParser : true,
    useCreateIndex : true,
    useFindAndModify : false,
    useUnifiedTopology: true
}).then(con => console.log('DB connection successful!'));


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

const port = process.env.port || 3000;
//
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});