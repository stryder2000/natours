const Tour = require('./../dev-data/models/tourModel.js');
const ApiFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

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
            $match : { ratingsAverage : { $gte: 4.2} }
        },
        {
            $group : {
                _id : { $toUpper : '$difficulty'},
                numTours : {$sum : 1},
                numRatings : {$sum : '$ratingsQuantity'},
                avgRating : {$avg : '$ratingsAverage'},
                avgPrice : {$avg : '$price'},
                minPrice : {$min : '$price'},
                maxPrice : {$max : '$price'}
            }
        },
        {
            $sort : {avgRating : 1}
        }
    ]);

    res.status(200).json({
        "status" : 'success',
        "data" : {
            tourStats
        }
    });
});

exports.getAllTours = catchAsync(async (req, res, next) => {

    //EXECUTE QUERY
    const features = new ApiFeatures(Tour.find(), req.query)
                        .filter()
                        .sort()
                        .limitFields()
                        .paginate();

    const tours = await features.query;

    res.status(200).json({
        "status" : 'success',
        results : tours.length,
        data : {
            tours
        }
    });
});

exports.getTourByID = catchAsync(async(req,res, next) => {

    const tour = await Tour.findById(req.params.id);
//        const tour = await Tour.findOne({_id : req.params.id});
    
    //If tour not found, i.e., tour = null, then
    if(!tour){
        return next(new AppError('No tour found with that id!', 404));
    }
    //Note that the error generated above is first handled by catchAsync 
    //that catches this error and passes it to the next function.
    //next() eventually passes the control to globalErrorHandler middleware in app.js .
    res.status(200).json({
        status : "success",
        data : {
            tour
        }
    });
});

exports.createNewTour = catchAsync(async (req, res, next) => {
    
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        "status" : "success",
        "data" : {
            tour : newTour
        }
    });
});

exports.updateTour = catchAsync(async (req, res, next) => {
    
   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    
    if(!tour){
        return next(new AppError('No tour found with that id!', 404));
    }
    
    res.status(200).json({
        status : "success",
        data : {
            tour
        }
    });
});

exports.deleteTour = catchAsync(async (req, res, next) => {

    const tour = await Tour.findByIdAndDelete(req.params.id);
    
    if(!tour){
        return next(new AppError('No tour found with that id!', 404));
    }
    
    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    
    const year = req.params.year * 1;
    
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates : {
                    $gte : new Date(`${year}-01-01`),
                    $lte : new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group : {
                _id : { $month : '$startDates'},
                numTourStarts : {$sum : 1},
                tours : {
                    $push : '$name'
                }
            }
        },
        {
            $addFields: {
                month: '$_id'
            }
        },
        {
            $sort : {
                numTourStarts : -1
            }
        },
        {
            $project : {
                _id : 0
            }
        },
        {
            $limit : 1
        }
    ]);


    res.status(200).json({
        "status" : 'successPlan',
        "data" : {
            plan
        }
    });
});