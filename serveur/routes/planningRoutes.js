const express = require('express');
const router = express.Router();
const planningController = require('../controllers/planningController');


//Router pour manipuler les créneaux:
router.post('/addCreneau', planningController.addCreneau); // ajouter un seul creneau seulement
router.post('/addCreneaux', planningController.addCreneaux); // ajouter plusieurs creneaux a la fois 
router.delete('/deleteCreneau/:id', planningController.deleteCreneau);// Suppression d'un creneau
router.put('/updateCreneau/:id', planningController.updateCreneau);// Mise à jour d'un creneau
router.get('/getAllCreneaux', planningController.getAllCreneaux);// Récupération de tous les creneaux

// Exportation du module
module.exports = router;
