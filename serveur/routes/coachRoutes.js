const express = require('express');
const coachController = require('../controllers/coachController');
const router = express.Router();

router.post('/addCoach', coachController.addCoach);// Ajout d'un coach
router.post('/addPhoto/:id', coachController.addPhoto);// Ajout d'une photo
router.delete('/deleteCoach/:id', coachController.deleteCoach);// Suppression d'un coach
router.get('/getAllCoachs', coachController.getAllCoachs);// Récupération de tous les coachs
router.get('/getCoach/:id', coachController.getCoach);// Récupération d'un coach
router.put('/updateCoach/:id', coachController.updateCoach);// Mise à jour d'un coach
router.post('/assignCoachToGroup/:id', coachController.assignCoachToGroup);// Affectation d'un coach à un groupe
router.delete('/deleteGroupCoach/:id', coachController.deleteGroupCoach);// Suppression d'un groupe d'un coach
router.delete('/deletePhoto/:id', coachController.deletePhoto);// Suppression d'une photo

// Exportation du module
module.exports = router;