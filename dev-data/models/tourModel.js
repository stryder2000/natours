const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have name'],
            unique: true,
            trim: true,
            maxlength: [
                40,
                'A tour name must have less or equal then 40 characters'
            ],
            maxlength: [
                40,
                'A tour name must have less or equal then 40 characters'
            ],
            minlength: [
                10,
                'A tour name must have more or equal then 10 characters'
            ]
            // validate: [validator.isAlpha, 'Tour name must only contain characters']
        },
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration']
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size']
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty is either: easy, medium, difficult'
            }
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0']
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'A tour must have price']
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function(val) {
                    // this only points to current doc on NEW document creation
                    return val < this.price;
                },
                message:
                    'Discount price ({VALUE}) should be below regular price'
            }
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a summary']
        },
        description: {
            type: String,
            trim: true
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a cover image']
        },
        secretTour: {
            type: Boolean,
            default: false
        },
        images: [String],
        //An array of Strings
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        startDates: [Date]
        //An array of dates
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

//// DOCUMENT MIDDLEWARE - works before .save() & .create()
//tourSchema.pre('save', function(next){
//   console.log('Saving Document...');
//   next();
//});
//
//tourSchema.post('save', function(doc,next){
//   console.log('Document saved...');
//   next();
//});
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// QUERY MIDDLEWARE - /^find/ - works before every find(), findOne(), findAndUpdate(), findAndDelete().
//tourSchema.pre(/^find/, function(next){
//    this.find({secretTour : {$ne : true}});
//    this.start = Date.now();
//    console.log("Executing pre-find middleware...");
//    next();
//});
//
//tourSchema.post(/^find/, function(docs, next){
//    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//    console.log("Executing post-find middleware...");
//    next();
//});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    console.log('Executing pre-aggregate...');
    next();
});

const tour = mongoose.model('Tour', tourSchema);
//mongoose.model(modelName, schemaName);
module.exports = tour;
