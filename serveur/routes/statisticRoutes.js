const express = require('express');
const statisticController = require('../controllers/statisticController');
const router = express.Router();


router.get('/getDistribution', statisticController.getDistribution);
router.get('/getDistributionBySport', statisticController.getDistributionBySport);


module.exports = router;