const Tour = require('./../dev-data/models/tourModel.js');

exports.getAllTours = (req,res) => {
    res.status(200).json({
        "status" : 'success'
    });
};

exports.getTourByID = (req,res) => {
    const tour = tours.find(el => el.id === id);   
    res.status(200).json({
        "status" : "success"
    });
};

exports.createNewTour = async (req,res) => {
    try{
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            "status" : "success",
            "data" : {
                tour : newTour
            }
        });
    }catch(err){
        res.status(400).json({
            "status" : "fail",
            "message" : "Invalid data sent!"
        });
    }
};

exports.updateTour = (req,res) => {
    res.status(200).json({
        "status" : "success",
        "message" : "...<Updated Tour here>..."
    });
};

exports.deleteTour = (req,res) => {
    res.status(204).json({
        "status" : "success",
        "message" : null
    });
};