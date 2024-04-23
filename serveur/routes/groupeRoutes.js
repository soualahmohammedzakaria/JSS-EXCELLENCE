const express = require('express');
const groupeController = require('../controllers/groupeController');
const router = express.Router();


router.get('/getNomIdGroupes', groupeController.getNomIdGroupes);

module.exports = router;