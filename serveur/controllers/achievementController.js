const achievementModel = require('../models/achievementModel');
const moment = require('moment-timezone');

async function addAchievement(req, res) {
    try {
        const achievementData= req.body;                 
        await achievementModel.addAchievement(achievementData); 
        // Retourner la réussite de l'ajout du coach
        res.json({ success: true, message: 'Accomplissement ajouté avec succès'});     
    } catch (error) {
        console.error('Erreur lors de l\'ajout d\'un Accomplissement :', error);
        res.json({ success: false, message: 'Erreur lors de l\'ajout d\'un Accomplissement' });
    }
}

async function deleteAchievement(req, res) {
    try {
      const id = req.params.id;  
      await achievementModel.deleteAchievementById(id);
      res.json({ success: true, message: 'Accomplissement supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de l accomplissement :', error);
      res.json({ success: false, message: 'Erreur lors de la suppression de l accomplissement' });
    }
  }

    async function updateAchievement(req, res) {
        try {
        const achievementId = req.params.id;
        const newAchievementData = req.body;
    
        await achievementModel.updateAchievement(achievementId, newAchievementData);
        res.json({ success: true, message: 'Accomplissement modifié avec succès' });
        } catch (error) {
        console.error('Erreur lors de la modification de l accomplissement :', error);
        res.json({ success: false, message: 'Erreur lors de la modification de l accomplissement' });
        }
    }

    async function getAchievements(req, res) {
        try {
           const memberId = req.params.id;
           const achievements = await achievementModel.getAchievements(memberId);
           achievements.forEach(achievement => {
            achievement.date_evenement = moment(achievement.date_evenement).format('YYYY-MM-DD');
           });           
           res.json({ success: true, achievements });
        } catch (error) {
           res.json({ success: false, message: 'Erreur lors de la récupération des accomplissements.', error: error.message });
        }
      }


  module.exports = {
    addAchievement,
    deleteAchievement,    
    updateAchievement,
    getAchievements
    
}