const express = require('express');
const statisticController = require('../controllers/statisticController');
const router = express.Router();


router.get('/getDistribution', statisticController.getDistribution);// Récupération de la répartition des membres 
router.get('/getDistributionBySport', statisticController.getDistributionBySport);// Récupération de la répartition des membres par sport
router.get('/getMonthExpenses', statisticController.getMonthExpenses);// Récupération des dépenses du mois
router.get('/getMonthIncome', statisticController.getMonthIncome);// Récupération des recettes du mois
router.get('/getMonthNewMembers', statisticController.getMonthNewMembers);// Récupération des nouveaux membres du mois
router.get('/getMonthSubscriptions', statisticController.getMonthSubscriptions);// Récupération des abonnements du mois
router.get('/getNextCreneaux', statisticController.getNextCreneaux);// Récupération des prochains créneaux
router.get('/getMembershipStatusByMonth', statisticController.getMembershipStatusByMonth);// Récupération du statut des membres par mois

// Exportation du module
module.exports = router;