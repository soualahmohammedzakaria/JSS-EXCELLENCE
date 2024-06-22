const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();


router.post('/addUser', userController.addUser);// Ajout d'un utilisateur
router.delete('/deleteUser/:id', userController.deleteUser);// Suppression d'un utilisateur
router.get('/getAllUsers', userController.getAllUsers);// Récupération de tous les utilisateurs
router.put('/updateUser/:id', userController.updateUser);// Mise à jour d'un utilisateur
router.put('/updateUserPassword/:id', userController.updateUserPassword);// Mise à jour du mot de passe d'un utilisateur   

// Exportation du module 
module.exports = router;