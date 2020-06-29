const express = require('express');
const fs = require('fs');

const router = express.Router();

//const handlers = require('./../controllers/tourController');

const {checkID, getAllUsers, createNewUser, getUserByID, updateUser, deleteUser} = require(`${__dirname}/../controllers/userController`);

router.param('id', checkID);

router.route('/')
    .get(getAllUsers)
    .post(createNewUser);

router.route('/:id')
    .get(getUserByID)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;