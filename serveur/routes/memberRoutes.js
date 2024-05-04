const express = require('express');
const memberController = require('../controllers/memberController');

const router = express.Router();


router.post('/addMember', memberController.addMember);
router.delete('/deleteMember/:id', memberController.deleteMember); // suppression logique
router.delete('/DefinitivelyDeleteMember/:id', memberController.DefinitivelyDeleteMember); // suppresion physique
router.get('/getAllMembers', memberController.getAllMembers);
router.get('/getAllDeletedMembers', memberController.getAllDeletedMembers);
router.get('/getMember/:id', memberController.getMember);
router.put('/updateMember/:id', memberController.updateMember);
router.post('/assignMemberToGroup/:id', memberController.assignMemberToGroup);
router.delete('/deleteGroupMember/:id', memberController.deleteGroupMember);
router.patch('/restoreMember/:id', memberController.restoreMember);
router.delete('/DefinitivelyDeleteAllMembers', memberController.DefinitivelyDeleteAllMembers);
router.post('/sendQrCodeByEmail/:id', memberController.sendQrCodeByEmail); 


     



module.exports = router;