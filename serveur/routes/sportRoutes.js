const express = require('express');
const router = express.Router();
const sportController = require('../controllers/sportController');

 
//router.post('/addsport', sportController.addsport);
router.get('/getAllSports', sportController.getAllSports); 
//router.put('/updatesport/:id', sportController.updatesport); 
//router.delete('/deletesport/:id', sportController.deletesport); 
router.get('/getAllSportsGroupes', sportController.getAllSportsGroupes);

module.exports = router;
