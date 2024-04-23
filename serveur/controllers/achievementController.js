const achievementModel = require('../models/achievementModel');
const moment = require('moment');

async function addAchievement(req, res) {
    try {
        const achievementData= req.body;

                 
        // Conversion de la date d'evenement en objet Date
        const dateEvenementObj = new Date(achievementData.date_evenement);
        //Formatage de la date au format 'YYYY-MM-DD'
        const dateEvenementFormatted = moment(dateEvenementObj, 'DD/MM/YYYY').format('YYYY-MM-DD');

        achievementData.date_evenement = dateEvenementFormatted;
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
    
        // Conversion de la date d'evenement en objet Date
        const dateEvenementObj = new Date(newAchievementData.date_evenement);
        //Formatage de la date au format 'YYYY-MM-DD'
        const dateEvenementFormatted = moment(dateEvenementObj, 'DD/MM/YYYY').format('YYYY-MM-DD');
    
        newAchievementData.date_evenement = dateEvenementFormatted;
    
        await achievementModel.updateAchievement(achievementId, newAchievementData);
        res.json({ success: true, message: 'Accomplissement modifié avec succès' });
        } catch (error) {
        console.error('Erreur lors de la modification de l accomplissement :', error);
        res.json({ success: false, message: 'Erreur lors de la modification de l accomplissement' });
        }
    }

    async function getAllAchievements(req, res) {
        try {
           const achievements = await achievementModel.getAllAchievements();
           achievements.forEach(achievement => {
            achievement.date_evenement = new Date(achievement.date_evenement).toLocaleDateString();
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
    getAllAchievements
    
}