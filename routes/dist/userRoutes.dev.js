"use strict";

var express = require('express');

var fs = require('fs');

var router = express.Router();

var handlers = require('./../controllers/userController');

var auth = require('./../controllers/authController');

var factory = require('./../controllers/handlerFactory'); //const {checkID, getAllUsers, createNewUser, getUserByID, updateUser, deleteUser} = require(`${__dirname}/../controllers/userController`);


router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.get('/logout', auth.logout);
router.post('/forgotPassword', auth.forgotPassword);
router.patch('/resetPassword/:token', auth.resetPassword); //Protects all routes after this middleware

router.use(auth.protect);
router.patch('/updatePassword', auth.updatePassword);
router.patch('/updateMe', handlers.uploadUserPhoto, handlers.resizeUserPhoto, handlers.updateMe); //upload.single('field-name')
//field name is the name of the field in the form from which to extract the file.

router["delete"]('/deleteMe', handlers.deleteMe);
router.route('/me').get(handlers.getMe, handlers.getUser); //Restrict access to admin after this middleware

router.use(auth.restrictTo('admin', 'user'));
router.route('/').get(handlers.getAllUsers).post(handlers.createNewUser);
router.route('/:id').get(handlers.getUser).patch(handlers.updateUser)["delete"](handlers.deleteUser);
module.exports = router;