const express = require('express');
const router = express.Router();
const { createCampaign, getAllCampaigns, getCampaignById, deleteCampaign, updateCampaign } = require("../controllers/CampaignController");
const checkAuthentication = require('../middlewares/Authentication');
const upload = require('../utils/multer');

router.post('/add', checkAuthentication, upload.fields([{ name: 'picture' }, { name: 'documents' },]), createCampaign); // images not tested ??
router.get('/getAll', getAllCampaigns);
router.get('/byId/:id', getCampaignById);
router.post('/update/:id', checkAuthentication, updateCampaign);
router.delete('/delete/:id', checkAuthentication, deleteCampaign);

module.exports = router;