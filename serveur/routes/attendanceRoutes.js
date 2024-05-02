const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/addPresenceMember', attendanceController.addPresenceMember);
router.delete('/deletePresenceMember/:id', attendanceController.deletePresenceMember);
router.put('/updatePresenceMember/:id', attendanceController.updatePresenceMember);
router.get('/getPresencesMember/:id', attendanceController.getPresencesMember);

router.post('/addAbsenceMember', attendanceController.addAbsenceMember);
router.delete('/deleteAbsenceMember/:id', attendanceController.deleteAbsenceMember);
router.put('/updateAbsenceMember/:id', attendanceController.updateAbsenceMember);
router.get('/getAbsencesMember/:id', attendanceController.getAbsencesMember);


router.post('/memberEntry', attendanceController.memberEntry); // Entree
router.post('/memberExit', attendanceController.memberExit); // sortie
router.post('/reportAbsentsGroupe', attendanceController.reportAbsentsGroupe);



module.exports = router;