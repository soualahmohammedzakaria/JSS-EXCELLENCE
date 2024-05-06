const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');

// Router pour manipuler les equipements:
router.post('/addEquipment', equipmentController.addEquipment);
router.delete('/deleteEquipment/:id', equipmentController.deleteEquipment);
router.put('/updateEquipment/:id', equipmentController.updateEquipment);
router.get('/getAllEquipments', equipmentController.getAllEquipments);
router.get('/getEquipmentsSalle/:id', equipmentController.getEquipmentsSalle);

 

module.exports = router;