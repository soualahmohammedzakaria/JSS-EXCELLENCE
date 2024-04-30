const express = require('express');
const achievementController = require('../controllers/achievementController');
const router = express.Router();


router.post('/addAchievement', achievementController.addAchievement);
router.delete('/deleteAchievement/:id', achievementController.deleteAchievement);
router.get('/getAchievements/:id', achievementController.getAchievements);
router.put('/updateAchievement/:id', achievementController.updateAchievement);
     

 

module.exports = router;