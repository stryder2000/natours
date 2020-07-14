const express = require('express');
const fs = require('fs');

const router = express.Router();
const handlers = require('./../controllers/userController');
const auth = require('./../controllers/authController');
//const {checkID, getAllUsers, createNewUser, getUserByID, updateUser, deleteUser} = require(`${__dirname}/../controllers/userController`);

router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.post('/forgotPassword', auth.forgotPassword);
router.patch('/resetPassword/:token', auth.resetPassword);
router.patch('/updatePassword', auth.protect, auth.updatePassword);
router.patch('/updateMe', auth.protect, handlers.updateMe);
router.delete('/deleteMe', auth.protect, handlers.deleteMe);

router
    .route('/')
    .get(handlers.getAllUsers)
    .post(handlers.createNewUser);

router
    .route('/:id')
    .get(handlers.getUserByID)
    .patch(handlers.updateUser)
    .delete(handlers.deleteUser);

module.exports = router;
