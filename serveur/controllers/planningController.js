const planningModel = require('../models/planningModel');
const moment = require('moment-timezone');

async function addCreneau(req, res) {
    try {
        const { id_groupe, numero_salle,titre, date_debut, date_fin, type, description } = req.body;
        if(date_debut >= date_fin) {
            res.json({ success: false, message: 'La date de début doit être inférieure à la date de fin' });
            return;
        }
        const creneau = await planningModel.getCreneau(titre, date_debut, date_fin);
        if (creneau) {
        res.json({ success: false, message: 'Creneau pris' });
        } else {
        await planningModel.addCreneau(id_groupe, numero_salle,titre, date_debut, date_fin, type, description);
        res.json({ success: true, message: 'Créneau ajouté avec succès' });
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout d\'un créneau :', error);
        res.json({ success: false, message: 'Erreur lors de l\'ajout d\'un créneau' });
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

      if(newCreneauData.date_debut >= newCreneauData.date_fin) {
        res.json({ success: false, message: 'La date de début doit être inférieure à la date de fin' });
        return;
    }
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

  async function addCreneaux(req, res) {
    try {
        const { id_groupe, numero_salle, titre, jour, date_debut, date_fin, heure_debut, heure_fin, type, description } = req.body;
        if (date_debut >= date_fin) {
            res.json({ success: false, message: 'La date de début doit être inférieure à la date de fin' });
            return;
        }
        let trouve = false;
        // Insérer les créneaux pour chaque date entre date_debut et date_fin pour le jour spécifié
        let currentDate = new Date(date_debut);
        const endDate = new Date(date_fin);
        while (currentDate <= endDate) {
            if (currentDate.getDay() == jour) {              
                const dateFormatted = currentDate.toISOString().split('T')[0];
                const date_debut =  dateFormatted + ' ' + heure_debut; 
                const date_fin =  dateFormatted + ' ' + heure_fin;          
                const creneau = await planningModel.getCreneau(titre, date_debut, date_fin);
                if (creneau) {
                    trouve = true;
                } else {                     
                await planningModel.addCreneau(id_groupe, numero_salle, titre,date_debut,date_fin, type, description);
                }
            }
            currentDate.setDate(currentDate.getDate() + 1);            
        }
        if(trouve){
            res.json({ success: true, message: 'Quelques creneaux sont deja pris' });
        }
        else{
        res.json({ success: true, message: 'Créneaux ajoutés avec succès' });
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout de créneaux :', error);
        res.json({ success: false, message: 'Erreur lors de l\'ajout de créneaux' });
    }
}


module.exports = { 
    addCreneau,
    addCreneaux,
    deleteCreneau,
    updateCreneau,
    getAllCreneaux
 };