const express = require('express');
const { doDonation, allUsersWhoDonate, userAllDonation } = require('../controllers/DonationController');
const router = express.Router();
const checkAuthentication = require('../middlewares/Authentication');

router.post('/add/:id', checkAuthentication, doDonation)
router.get('/all/:id', allUsersWhoDonate)
router.get('/by-you', checkAuthentication, userAllDonation)

module.exports = router;