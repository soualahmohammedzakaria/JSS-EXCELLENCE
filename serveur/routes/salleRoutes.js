const express = require('express');
const router = express.Router();
const salleController = require('../controllers/salleController');

 
router.post('/addSalle', salleController.addSalle);// Ajout d'une salle
router.get('/getAllSalles', salleController.getAllSalles); // toutes les salles
router.get('/getSalle/:id', salleController.getSalle);// chaque salle avec ses equipements
router.put('/updateSalle/:id', salleController.updateSalle); // mise à jour d'une salle
router.delete('/deleteSalle/:id', salleController.deleteSalle); // suppression d'une salle
router.get('/getNomIdSalles', salleController.getNomIdSalles);// Récupération des noms et id des salles

//  Exportation du module
module.exports = router;