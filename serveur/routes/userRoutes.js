const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();



router.post('/addUser', userController.addUser);
router.delete('/deleteUser/:id', userController.deleteUser);
router.get('/getAllUsers', userController.getAllUsers);
router.put('/updateUser/:id', userController.updateUser);
router.put('/updateUserPassword/:id', userController.updateUserPassword);
     

 

module.exports = router;