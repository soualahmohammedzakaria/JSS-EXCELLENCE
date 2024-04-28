const express = require('express');
const router = express.Router();
const sportController = require('../controllers/sportController');

 
router.post('/addSport', sportController.addSport);
router.get('/getAllSports', sportController.getAllSports); 
router.put('/updateSport/:id', sportController.updateSport); 
router.delete('/deleteSport/:id', sportController.deleteSport); 
router.get('/getAllSportsGroupes', sportController.getAllSportsGroupes);

module.exports = router;
