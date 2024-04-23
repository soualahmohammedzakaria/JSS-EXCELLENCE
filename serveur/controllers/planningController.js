const planningModel = require('../models/planningModel');
const moment = require('moment-timezone');
async function addCreneau(req, res) {
    try {
        const { id_groupe, numero_salle,titre, date_debut, date_fin, type, description } = req.body;
        const creneau = await planningModel.getCreneau(titre, date_debut, date_fin);
        if (creneau) {
        res.json({ success: false, message: 'Creneau pris' });
        } else {
        await planningModel.addCreneau(id_groupe, numero_salle,titre, date_debut, date_fin, type, description);
        res.json({ success: true, message: 'Créneau ajouté avec succès' });
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du créneau :', error);
        res.json({ success: false, message: 'Erreur lors de l\'ajout du créneau' });
    }
}

async function deleteCreneau(req, res) {
    try {
      const id = req.params.id;  
      await planningModel.deleteCreneauById(id);
      res.json({ success: true, message: 'Creneau supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression du creneau :', error);
      res.json({ success: false, message: 'Erreur lors de la suppression du creneau' });
    }
  }

  async function updateCreneau(req, res) {
    try {
      const creneauId = req.params.id;
      const newCreneauData = req.body;
  
      // on verifie si le creneau est pris 
      const creneauExists = await planningModel.checkCreneau(newCreneauData.titre, newCreneauData.date_debut,newCreneauData.date_fin, creneauId);
      if (creneauExists) {
        res.json({ success: false, message: 'Le creneau est deja pris' });
      } 
      else{ 
      await planningModel.updateCreneau(creneauId, newCreneauData);
      res.json({ success: true, message: 'creneau modifié avec succès' });
      }
    } catch (error) {
      console.error('Erreur lors de la modification du creneau :', error);
      res.json({ success: false, message: 'Erreur lors de la modification du creneau' });
    }
  }

  async function getAllCreneaux(req, res){
    try {
      const creneaux = await planningModel.getAllCreneaux(); 
      creneaux.forEach(creneau => {
      const formattedDateDebut = moment(creneau.date_debut).format('YYYY-MM-DDTHH:mm:ss');
      const formattedDateFin = moment(creneau.date_fin).format('YYYY-MM-DDTHH:mm:ss');
      creneau.start = formattedDateDebut;
      creneau.end = formattedDateFin;
      delete creneau.date_debut; // Supprimer l'ancienne clé
      delete creneau.date_fin; // Supprimer l'ancienne clé
      creneau.title = creneau.titre; // Renommer "titre" en "title"
      delete creneau.titre; // Supprimer l'ancienne clé
         });  
      res.json({ success: true, creneaux });
    } catch (error) {
      res.json({ success: false, message: 'Erreur lors de la récupération des creneaux.', error: error.message });
    }
  }





module.exports = { 
    addCreneau,
    deleteCreneau,
    updateCreneau,
    getAllCreneaux
 };