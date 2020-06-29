const express = require('express');
const router = express.Router();
const handlers = require('./../controllers/tourController');

//Parameter middleware - To check if the id sent as parameter(through url) is valid or invalid.
//router.param('id', handlers.checkID);

//To route further based on the url.
router.route('/')
    .get(handlers.getAllTours)
    .post(handlers.createNewTour);

router.route('/:id')
    .get(handlers.getTourByID)
    .patch(handlers.updateTour)
    .delete(handlers.deleteTour);

module.exports = router;
