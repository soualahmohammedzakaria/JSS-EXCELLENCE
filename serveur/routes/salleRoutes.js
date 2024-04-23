const express = require('express');
const salleController = require('../controllers/salleController');
const router = express.Router();


//Router pour manipuler les salles:
/*router.post('/abonnement', salleController.addSalle);
router.delete('/abonnement', salleController.deleteSalle);
router.get('/abonnement', salleController.getAllSalles);
router.patch('/abonnement', salleController.modifySalle);*/
router.get('/getNomIdSalles', salleController.getNomIdSalles);

module.exports = router;