const express = require('express');
const settingController = require('../controllers/settingController');
const router = express.Router();


router.put('/updateSettings', settingController.updateSettings);// Mise à jour des paramètres
router.get('/getSettings', settingController.getSettings);// Récupération des paramètres
 
// Exportation du module
module.exports = router;