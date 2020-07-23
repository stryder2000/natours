const express = require('express');
const router = express.Router();
const viewsController = require('./../controllers/viewsController');
const auth = require('./../controllers/authController');

router.get('/', auth.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', auth.isLoggedIn, viewsController.getTour);
router.get('/login', auth.isLoggedIn, viewsController.getLoginForm);
router.get('/me', auth.protect, viewsController.getAccount);
router.post('/submit-user-data', auth.protect, viewsController.updateUserData);

module.exports = router;
