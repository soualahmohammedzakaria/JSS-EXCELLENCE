const coachModel = require('../models/coachModel');
//const utils = require('../utils');
const moment = require('moment-timezone');
const multer = require('multer');
const path = require('path');



// Configuration de Multer pour stocker les images dans le dossier "images"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../public/images/coachs'); // Dossier de destination
  },
  filename: (req, file, cb) => {
    const ext = '.jpeg'; // Extension fixe
    const filename = 'c_' + req.body.nom + '_' + req.body.prenom + ext; // Nom du fichier basé sur le nom et le prénom
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

async function addCoach(req, res) {
    try {
        const { nom, prenom, email, dateNaissance, telephone, sexe, groupIds } = req.body;

        const coach = await coachModel.getCoachByName(nom,prenom);
        if (coach) {
        res.json({ success: false, message: 'Nom du coach déjà utilisé' });
        } else {     
        const coachData = {nom, prenom, email,dateNaissance, telephone, sexe, groupIds}; 
        const IdCoach = await coachModel.addCoach(coachData);
        // Traitement du téléchargement de la photo
        /*upload.single('photo')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
        // Erreur Multer
         return res.json({ success: false, message: 'Erreur lors du téléchargement de la photo' });
         } else if (err) {
         // Autres erreurs
         return res.json({ success: false, message: err.message });
       }
       });*/

        // Assignation du coach aux groupes
        if (coachData.groupIds && coachData.groupIds.length > 0) {
          await coachModel.assignCoachToGroups(IdCoach, coachData.groupIds);
         }
        res.json({ success: true, message: 'coach ajouté avec succès' });
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout d\'un coach :', error);
        res.json({ success: false, message: 'Erreur lors de l\'ajout d\'un coach' });
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
       res.json({ success: true, coachs });
    } catch (error) {
       res.json({ success: false, message: 'Erreur lors de la récupération des coachs.', error: error.message });
    }
  }

  async function getCoach(req, res) {
    try {
      const CoachId = req.params.id;
      const Coach = await coachModel.getCoachById(CoachId);
      if (Coach) {
        Coach.date_naissance = moment(Coach.date_naissance).format('YYYY-MM-DD');
        res.json({ success: true, Coach });
      } else {
        res.json({ success: false, message: 'Coach non trouvé' });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du coach :', error);
      res.json({ success: false, message: 'Erreur lors de la récupération du coach' });
    }
  }

  async function updateCoach(req, res) {
    try {
      const coachId = req.params.id;
      const newCoachData = req.body;
  
      // on verifie si le nouveau nom du coach existe déjà pour d'autres coachs
      const coachExists = await coachModel.checkCoach(newCoachData.nom, newCoachData.prenom, coachId);
      if (coachExists) {
        return res.json({ success: false, message: 'Le nouveau nom du coach existe déjà pour un autre coach' });
      }  
      await coachModel.updateCoach(coachId, newCoachData);
      res.json({ success: true, message: 'Coach modifié avec succès' });
    } catch (error) {
      console.error('Erreur lors de la modification du coach :', error);
      res.json({ success: false, message: 'Erreur lors de la modification du coach' });
    }
  }
  
  async function assignCoachToGroups(req, res) {
    try {
      const coachId = req.params.id;
      const  { groupIds }  = req.body;
      if (groupIds && groupIds.length > 0) {
        await coachModel.assignCoachToGroups(coachId, groupIds); 
        res.json({ success: true, message: 'Coach assigné aux groupes avec succès' });
      }      
      else{
        res.json({ success: false, message: 'Veuillez sélectionner au moins un groupe' });
      }
    } catch (error) {
      console.error('Erreur lors de l\'assignation du coach aux groupes :', error);
      res.json({ success: false, message: 'Erreur lors de l\'assignation du coach aux groupes' });
    }
  }

  async function assignCoachToGroup(req, res) {
    try {
        const coachId = req.params.id;
        const {groupId} = req.body;

        // Vérifier si le coach appartient déjà au groupe
        const isCoachAssigned = await coachModel.isCoachAssignedToGroup(coachId, groupId);

        if (isCoachAssigned) {
            res.json({ success: false, message: 'Le coach est déjà assigné à ce groupe' });
        } else {
            await coachModel.assignCoachToGroup(coachId, groupId);
            res.json({ success: true, message: 'Coach assigné au groupe avec succès' });
        }
    } catch (error) {
        console.error('Erreur lors de l\'assignation du coach au groupe :', error);
        res.json({ success: false, message: 'Erreur lors de l\'assignation du coach au groupe' });
    }
}
  
  async function deleteGroupCoach(req, res) {
    try {
      const coachId = req.params.id;
      const {groupId} = req.body;
      await coachModel.deleteGroupCoach(coachId, groupId);
      res.json({ success: true, message: 'Coach retiré du groupe avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression du coach du groupe :', error);
      res.json({ success: false, message: 'Erreur lors de la suppression du coach du groupe' });
    }
  }



module.exports = {
    addCoach,
    deleteCoach,
    getAllCoachs,
    getCoach,
    updateCoach,
    assignCoachToGroups,
    assignCoachToGroup,
    deleteGroupCoach
    
}