const express = require('express');
const groupController = require('../controllers/groupController');
const router = express.Router();


router.post('/addGroup', groupController.addGroup);// Ajout d'un groupe
router.delete('/deleteGroup/:id', groupController.deleteGroup);// Suppression d'un groupe
router.put('/updateGroup/:id', groupController.updateGroup);// Mise à jour d'un groupe
router.get('/getAllGroups', groupController.getAllGroups);// Récupération de tous les groupes
router.get('/getNomIdGroups', groupController.getNomIdGroups);// Récupération des noms et id des groupes

module.exports = router;