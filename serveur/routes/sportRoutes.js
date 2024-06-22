const express = require('express');
const router = express.Router();
const sportController = require('../controllers/sportController');

 
router.post('/addSport', sportController.addSport);// Ajout d'un sport
router.get('/getAllSports', sportController.getAllSports);// Récupération de tous les sports
router.put('/updateSport/:id', sportController.updateSport);// Mise à jour d'un sport
router.delete('/deleteSport/:id', sportController.deleteSport);// Suppression d'un sport
router.get('/getAllSportsGroupes', sportController.getAllSportsGroupes);// Récupération de tous les sports avec les groupes associés

// Exportation du module
module.exports = router;
