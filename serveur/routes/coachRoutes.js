const express = require('express');
const coachController = require('../controllers/coachController');
const router = express.Router();


router.post('/addCoach', coachController.addCoach);
router.delete('/deleteCoach/:id', coachController.deleteCoach);
router.get('/getAllCoachs', coachController.getAllCoachs);
router.get('/getCoach/:id', coachController.getCoach);
router.put('/updateCoach/:id', coachController.updateCoach);
router.post('/assignCoachToGroups/:id', coachController.assignCoachToGroups);
router.delete('/deleteGroupCoach/:id', coachController.deleteGroupCoach);

     

 

module.exports = router;