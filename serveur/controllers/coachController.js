const coachModel = require('../models/coachModel');
const utils = require('../utils');
const moment = require('moment');

async function addCoach(req, res) {
    try {
        const { nom, prenom, email, dateNaissance, photo, telephone, sexe } = req.body;

        /* Validation des données
        if (!nom || !prenom || !email || !dateNaissance || !photo || !telephone || !sexe) {
            return res.status(400).json({ success: false, message: 'Tous les champs sont requis' });
        }*/
        const coach = await coachModel.getCoachByName(nom,prenom);
        if (coach) {
        res.json({ success: false, message: 'Nom du coach déjà utilisé' });
        } else {         
        // Conversion de la date de naissance en objet Date
        const dateNaissanceObj = new Date(dateNaissance);
        //Formatage de la date au format 'YYYY-MM-DD'
        const dateNaissanceFormatted = moment(dateNaissanceObj, 'DD/MM/YYYY').format('YYYY-MM-DD');

         
        const coachData = {nom, prenom, email,dateNaissanceFormatted, photo, telephone, sexe }
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
        coach.date_naissance = new Date(coach.date_naissance).toLocaleDateString();
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
  
      // Conversion de la date de naissance en objet Date
      const dateNaissanceObj = new Date(newCoachData.date_naissance);
      if (isNaN(dateNaissanceObj.getTime())) {
          return res.status(400).json({ success: false, message: 'Format de date de naissance invalide' });
      }
      //Formatage de la date au format 'YYYY-MM-DD'
      const dateNaissanceFormatted = moment(dateNaissanceObj, 'DD/MM/YYYY').format('YYYY-MM-DD');
  
      newCoachData.date_naissance = dateNaissanceFormatted;
  
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