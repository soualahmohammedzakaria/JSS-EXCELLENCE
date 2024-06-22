const express = require('express');
const memberController = require('../controllers/memberController');
const router = express.Router();


router.post('/addMember', memberController.addMember);// Ajout d'un membre
router.post('/addPhoto/:id', memberController.addPhoto);// Ajout d'une photo
router.delete('/deleteMember/:id', memberController.deleteMember); // suppression logique
router.delete('/DefinitivelyDeleteMember/:id', memberController.DefinitivelyDeleteMember); // suppresion physique
router.get('/getAllMembers', memberController.getAllMembers);// Récupération de tous les membres
router.get('/getAllDeletedMembers', memberController.getAllDeletedMembers);// Récupération de tous les membres supprimés
router.get('/getMember/:id', memberController.getMember);// Récupération d'un membre
router.put('/updateMember/:id', memberController.updateMember);// Mise à jour d'un membre
router.post('/assignMemberToGroup/:id', memberController.assignMemberToGroup);// Affectation d'un membre à un groupe
router.delete('/deleteGroupMember/:id', memberController.deleteGroupMember);// Suppression d'un groupe d'un membre
router.patch('/restoreMember/:id', memberController.restoreMember);// Restauration d'un membre
router.delete('/DefinitivelyDeleteAllMembers', memberController.DefinitivelyDeleteAllMembers);// Suppression physique de tous les membres
router.post('/sendQrCodeByEmail/:id', memberController.sendQrCodeByEmail);// Envoi du QR code par mail
router.delete('/deletePhoto/:id', memberController.deletePhoto);// Suppression d'une photo

// Exportation du module
module.exports = router;