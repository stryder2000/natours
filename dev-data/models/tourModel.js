const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    images: [String],
    //An array of Strings
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [
      {
        type: Date,
        default: Date.now(),
        // required: [true, 'A tour must have a Start date'],
      },
    ],
    //An array of dates
    startLocation: {
      //GeoJSON
      type: {
        type: 'String',
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: 'String',
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//Virtual Populate - helps us to get all the reviews of a tour without actually persisting that information in the database.
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
  //localField of local document is set equivalent
  //to the foreignField of foriegn document.
});

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// DOCUMENT MIDDLEWARE - works before .save() & .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
//
//tourSchema.post('save', function(doc,next){
//   console.log('Document saved...');
//   next();
//});
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
tourSchema.pre(/^find/, function (next) {
  this.populate({
    //Field name that we want to populate
    path: 'guides',
    //The User fields that we want in our guides array.
    select: '-__v -passwordChangedAt',
  });
  next();
});

////AGGREGATION MIDDLEWARE
//tourSchema.pre('aggregate', function(next) {
//    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//    console.log('Executing pre-aggregate...');
//    next();
//});

const tour = mongoose.model('Tour', tourSchema);
//mongoose.model(modelName, schemaName);
module.exports = tour;
