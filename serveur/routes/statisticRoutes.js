const express = require('express');
const statisticController = require('../controllers/statisticController');
const router = express.Router();


router.get('/getDistribution', statisticController.getDistribution);
router.get('/getDistributionBySport', statisticController.getDistributionBySport);
router.get('/getMonthExpenses', statisticController.getMonthExpenses);
router.get('/getMonthIncome', statisticController.getMonthIncome);
router.get('/getMonthNewMembers', statisticController.getMonthNewMembers);
router.get('/getMonthSubscriptions', statisticController.getMonthSubscriptions);
router.get('/getNextCreneaux', statisticController.getNextCreneaux);


module.exports = router;