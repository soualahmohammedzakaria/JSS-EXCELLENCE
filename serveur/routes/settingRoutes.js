const express = require('express');
const settingController = require('../controllers/settingController');
const router = express.Router();


router.put('/updateSettings', settingController.updateSettings);
router.get('/getSettings', settingController.getSettings);    
 
 

module.exports = router;