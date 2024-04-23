const express = require('express');
const router = express.Router();
const planningController = require('../controllers/planningController');


//Router pour manipuler les créneaux:
router.post('/addCreneau', planningController.addCreneau);
router.delete('/deleteCreneau/:id', planningController.deleteCreneau);
router.put('/updateCreneau/:id', planningController.updateCreneau);
router.get('/getAllCreneaux', planningController.getAllCreneaux);

module.exports = router;
