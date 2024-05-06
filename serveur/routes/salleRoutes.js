const express = require('express');
const router = express.Router();
const salleController = require('../controllers/salleController');

 
router.post('/addSalle', salleController.addSalle);
router.get('/getAllSalles', salleController.getAllSalles); 
router.get('/getSalle/:id', salleController.getSalle);// chaque salle avec ses equipements
router.put('/updateSalle/:id', salleController.updateSalle); 
router.delete('/deleteSalle/:id', salleController.deleteSalle); 
router.get('/getNomIdSalles', salleController.getNomIdSalles);

module.exports = router;