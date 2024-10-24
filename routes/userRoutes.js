const express = require('express');
const { signup, signin, logout, getProfile, createCampaign } = require('../controllers/UserController');
const checkAuthentication = require('../middlewares/Authentication');
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/logout', logout);
router.get('/profile', checkAuthentication, getProfile);

module.exports = router;