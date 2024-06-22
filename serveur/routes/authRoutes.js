const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();


router.post('/login', authController.loginUser);// Connexion d'un utilisateur

// Exportation du module
module.exports = router;