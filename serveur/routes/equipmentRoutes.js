const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');

// Router pour manipuler les equipements:
router.post('/addEquipment', equipmentController.addEquipment);// Ajout d'un equipement
router.delete('/deleteEquipment/:id', equipmentController.deleteEquipment);// Suppression d'un equipement
router.put('/updateEquipment/:id', equipmentController.updateEquipment);// Mise à jour d'un equipement
router.get('/getEquipmentsSalle/:id', equipmentController.getEquipmentsSalle);// Récupération des equipements d'une salle

 
// Exportation du module
module.exports = router;