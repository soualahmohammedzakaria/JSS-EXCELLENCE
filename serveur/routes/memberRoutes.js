const express = require('express');
const memberController = require('../controllers/memberController');

const router = express.Router();


router.post('/addMember', memberController.addMember);
router.delete('/deleteMember/:id', memberController.deleteMember);
router.get('/getAllMembers', memberController.getAllMembers);
router.get('/getMember/:id', memberController.getMember);
router.put('/updateMember/:id', memberController.updateMember);
router.post('/assignMemberToGroups/:id', memberController.assignMemberToGroups);
router.delete('/deleteGroupMember/:id', memberController.deleteGroupMember);

     

 

module.exports = router;