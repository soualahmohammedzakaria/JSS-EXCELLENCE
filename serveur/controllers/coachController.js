const coachModel = require('../models/coachModel');
const moment = require('moment-timezone');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration de Multer pour stocker les images dans le dossier "images"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/coachs');
  },
  filename: async (req, file, cb) => {
    const coachId = req.params.id;
    const ext = '.jpeg';
    const filename = `m_${coachId}${ext}`;
    cb(null, filename);
  }
});
const upload = multer({ storage: storage });

// Ajout d'un coach
async function addCoach(req, res) {
  try {
    const { nom, prenom, email, dateNaissance, telephone, sexe, groupIds } = req.body;
    const coach = await coachModel.getCoachByName(nom, prenom);
    if (coach) {
      res.json({ success: false, message: 'Nom du coach déjà utilisé' });
    } else {
      const coachData = { nom, prenom, email, dateNaissance, telephone, sexe, groupIds };
      const IdCoach = await coachModel.addCoach(coachData);
      // Assignation du coach aux groupes
      if (coachData.groupIds && coachData.groupIds.length > 0) {
        await coachModel.assignCoachToGroups(IdCoach, coachData.groupIds);
      }
      res.json({ success: true, message: 'coach ajouté avec succès', IdCoach: IdCoach });
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'un coach :', error);
    res.json({ success: false, message: 'Erreur lors de l\'ajout d\'un coach' });
  }
}

// Mise à jour de la photo du coach
async function addPhoto(req, res) {
  try {
    const coachId = req.params.id;
    upload.single('image')(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        res.json({ success: false, message: 'Erreur lors du téléchargement de la photo' });
      } else if (err) {
        res.json({ success: false, message: err.message });
      } else {
        // Upload successful, update coach photo
        const newPhotoFileName = `m_${coachId}`;
        await coachModel.updateCoachPhoto(coachId, newPhotoFileName);
        // Send response
        res.json({ success: true, message: 'Photo du coach mise à jour avec succès' });
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la photo du membre :', error);
    res.json({ success: false, message: 'Erreur lors de la mise à jour de la photo du membre' });
  }
}

// Suppression d'un coach
async function deleteCoach(req, res) {
  try {
    const id = req.params.id;
    // Récupérer le nom de la photo du coach à partir de la base de données
    const coach = await coachModel.getCoachById(id);
    const photoFileName = coach.photo; // Supposons que le nom du champ de la photo soit "photo"
    // Supprimer le membre de la base de données
    await coachModel.deleteCoachById(id);
    // Supprimer le fichier photo du système de fichiers
    if (photoFileName) {
      const photoPath = path.join(__dirname, '../public/images/coachs', photoFileName + '.jpeg'); // Chemin complet du fichier photo
      fs.unlinkSync(photoPath); // Suppression synchronisée du fichier
    }
    res.json({ success: true, message: 'Coach supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du coach :', error);
    res.json({ success: false, message: 'Erreur lors de la suppression du coach' });
  }
}

// Suppression de la photo du coach
async function deletePhoto(req, res) {
  try {
    const coachId = req.params.id;
    const coach = await coachModel.getCoachById(coachId);
    if (coach.photo) {
      const photoFileName = `m_${coachId}`;
      const photoPath = path.join(__dirname, '../public/images/coachs', photoFileName + '.jpeg'); // Chemin complet du fichier photo
      fs.unlinkSync(photoPath); // Suppression synchronisée du fichier
      await coachModel.deletePhoto(coachId);
      res.json({ success: true, message: 'Photo du coach supprimée avec succès' });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de la photo du coach :', error);
    res.json({ success: false, message: 'Erreur lors de la suppression de la photo du coach' });
  }
}

// Récupération de tous les coachs
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

// Récupération d'un coach
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

// Mise à jour d'un coach
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

// Assigner un coach à des groupes
async function assignCoachToGroups(req, res) {
  try {
    const coachId = req.params.id;
    const { groupIds } = req.body;
    if (groupIds && groupIds.length > 0) {
      await coachModel.assignCoachToGroups(coachId, groupIds);
      res.json({ success: true, message: 'Coach assigné aux groupes avec succès' });
    }
    else {
      res.json({ success: false, message: 'Veuillez sélectionner au moins un groupe' });
    }
  } catch (error) {
    console.error('Erreur lors de l\'assignation du coach aux groupes :', error);
    res.json({ success: false, message: 'Erreur lors de l\'assignation du coach aux groupes' });
  }
}

// Assigner un coach à un groupe
async function assignCoachToGroup(req, res) {
  try {
    const coachId = req.params.id;
    const { groupId } = req.body;
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

// Supprimer un coach d'un groupe
async function deleteGroupCoach(req, res) {
  try {
    const coachId = req.params.id;
    const { groupId } = req.body;
    await coachModel.deleteGroupCoach(coachId, groupId);
    res.json({ success: true, message: 'Coach retiré du groupe avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du coach du groupe :', error);
    res.json({ success: false, message: 'Erreur lors de la suppression du coach du groupe' });
  }
}

module.exports = {
  addCoach,
  addPhoto,
  deleteCoach,
  deletePhoto,
  getAllCoachs,
  getCoach,
  updateCoach,
  assignCoachToGroups,
  assignCoachToGroup,
  deleteGroupCoach
}