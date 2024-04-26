const coachModel = require('../models/coachModel');
//const utils = require('../utils');
const moment = require('moment-timezone');

async function addCoach(req, res) {
    try {
        const { nom, prenom, email, dateNaissance, photo, telephone, sexe } = req.body;

        const coach = await coachModel.getCoachByName(nom,prenom);
        if (coach) {
        res.json({ success: false, message: 'Nom du coach déjà utilisé' });
        } else {     
        const coachData = {nom, prenom, email,dateNaissance, photo, telephone, sexe }
        await coachModel.addCoach(coachData); 
        // Retourner la réussite de l'ajout du coach
        res.json({ success: true, message: 'Coach ajouté avec succès'});
     }
    } catch (error) {
        console.error('Erreur lors de l\'ajout d\'un coach :', error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'ajout d\'un coach' });
    }
}

async function deleteCoach(req, res) {
    try {
      const id = req.params.id;  
      await coachModel.deleteCoachById(id);
      res.json({ success: true, message: 'Coach supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression du coach :', error);
      res.status(500).json({ success: false, message: 'Erreur lors de la suppression du coach' });
    }
  }

  async function getAllCoachs(req, res) {
    try {
       const coachs = await coachModel.getAllCoachs();
       coachs.forEach(coach => {
        coach.date_naissance = moment(coach.date_naissance).format('YYYY-MM-DD');
       });
       res.status(200).json({ success: true, coachs });
    } catch (error) {
       res.status(500).json({ success: false, message: 'Erreur lors de la récupération des coachs.', error: error.message });
    }
  }

  async function updateCoach(req, res) {
    try {
      const coachId = req.params.id;
      const newCoachData = req.body;
  
      // on verifie si le nouveau nom du coach existe déjà pour d'autres coachs
      const coachExists = await coachModel.checkCoach(newCoachData.nom, newCoachData.prenom, coachId);
      if (coachExists) {
        return res.status(400).json({ success: false, message: 'Le nouveau nom du coach existe déjà pour un autre coach' });
      }  
      await coachModel.updateCoach(coachId, newCoachData);
      res.json({ success: true, message: 'Coach modifié avec succès' });
    } catch (error) {
      console.error('Erreur lors de la modification du coach :', error);
      res.status(500).json({ success: false, message: 'Erreur lors de la modification du coach' });
    }
  }
  



module.exports = {
    addCoach,
    deleteCoach,
    getAllCoachs,
    updateCoach
    
}