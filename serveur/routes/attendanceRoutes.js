const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Définition des routes pour les présences et absences
router.post('/addPresenceMember', attendanceController.addPresenceMember);// Ajout d'une présence
router.delete('/deletePresenceMember/:id', attendanceController.deletePresenceMember);// Suppression d'une présence
router.put('/updatePresenceMember/:id', attendanceController.updatePresenceMember);// Mise à jour d'une présence
router.get('/getPresencesMember/:id', attendanceController.getPresencesMember); // Récupération des présences d'un membre
router.post('/addAbsenceMember', attendanceController.addAbsenceMember);// Ajout d'une absence
router.delete('/deleteAbsenceMember/:id', attendanceController.deleteAbsenceMember);// Suppression d'une absence
router.put('/updateAbsenceMember/:id', attendanceController.updateAbsenceMember);// Mise à jour d'une absence
router.get('/getAbsencesMember/:id', attendanceController.getAbsencesMember);// Récupération des absences d'un membre
router.post('/memberPresence/:id', attendanceController.memberPresence);  // Présence d'un membre
router.post('/reportAbsentsGroupe', attendanceController.reportAbsentsGroupe);// Signalement des absents d'un groupe


// Exportation du module
module.exports = router;
