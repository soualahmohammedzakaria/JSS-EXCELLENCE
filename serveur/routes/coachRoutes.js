const express = require('express');
const coachController = require('../controllers/coachController');
const router = express.Router();


router.post('/addCoach', coachController.addCoach);
router.delete('/deleteCoach/:id', coachController.deleteCoach);
router.get('/getAllCoachs', coachController.getAllCoachs);
router.put('/updateCoach/:id', coachController.updateCoach);
     

 

module.exports = router;