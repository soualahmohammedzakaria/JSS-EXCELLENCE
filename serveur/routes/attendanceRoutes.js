const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/addPresence', PresenceController.addPresence);
router.delete('/deletePresence/:id', PresenceController.deletePresence);
router.put('/modifyPresence', PresenceController.modifyPresence);
router.get('/getAllPresences', PresenceController.getAllPresences);

module.exports = router;