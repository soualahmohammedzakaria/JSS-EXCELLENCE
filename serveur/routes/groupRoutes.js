const express = require('express');
const groupController = require('../controllers/groupController');
const router = express.Router();


router.post('/addGroup', groupController.addGroup);
router.delete('/deleteGroup/:id', groupController.deleteGroup);
router.put('/updateGroup/:id', groupController.updateGroup);
router.get('/getAllGroups', groupController.getAllGroups);
router.get('/getNomIdGroups', groupController.getNomIdGroups);

module.exports = router;