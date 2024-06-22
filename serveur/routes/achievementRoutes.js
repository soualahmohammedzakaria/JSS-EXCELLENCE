const express = require('express');// Importation du framework Express
const achievementController = require('../controllers/achievementController'); // Importation du contrôleur des réalisations
const router = express.Router();// Création du routeur Express

// Définition des routes pour les réalisations
router.post('/addAchievement', achievementController.addAchievement);
router.delete('/deleteAchievement/:id', achievementController.deleteAchievement);
router.get('/getAchievements/:id', achievementController.getAchievements);
router.put('/updateAchievement/:id', achievementController.updateAchievement);
     

 
// Exportation du module
module.exports = router;