const Tour = require('./../dev-data/models/tourModel.js');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const factory = require('./handlerFactory');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

//catchAsync function catches the errors generated inside the below handler functions by using catch().
exports.getTourStats = catchAsync(async (req, res, next) => {
    const tourStats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.2 } }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: { avgRating: 1 }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            tourStats
        }
    });
});
exports.getAllTours = factory.getAll(Tour);
exports.getTourByID = factory.getOne(Tour, { path: 'reviews' });
exports.createNewTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: {
                    $push: '$name'
                }
            }
        },
        {
            $addFields: {
                month: '$_id'
            }
        },
        {
            $sort: {
                numTourStarts: -1
            }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $limit: 1
        }
    ]);

    res.status(200).json({
        status: 'successPlan',
        data: {
            plan
        }
    });
});
exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlong, unit } = req.params;
    const [lat, long] = latlong.split(',');
    const radius = unit === 'mi' ? distance / 3958.8 : distance / 6371;
    if (!lat || !long) {
        return next(
            new AppError(
                'Please provide latitude and longitude in the format lat,long.',
                400
            )
        );
    }
    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[long, lat], radius] } }
    });
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
});
exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlong, unit } = req.params;
    const [lat, long] = latlong.split(',');
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
    if (!lat || !long) {
        return next(
            new AppError(
                'Please provide latitude and longitude in the format lat,long.',
                400
            )
        );
    }
    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [long * 1, lat * 1]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                name: 1,
                distance: 1
            }
        }
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            distances
        }
    });
});
