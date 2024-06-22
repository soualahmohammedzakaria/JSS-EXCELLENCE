const express = require('express');
const paymentController = require('../controllers/paymentController');
const router = express.Router();


router.post('/addTransaction/', paymentController.addTransaction);// Ajout d'une transaction
router.delete('/deleteTransaction/:id', paymentController.deleteTransaction);// Suppression d'une transaction
router.put('/updateTransaction/:id', paymentController.updateTransaction);// Mise à jour d'une transaction
router.get('/getTransactions/:id', paymentController.getTransactions);// Récupération des transactions d'un membre
router.post('/sendInvoiceByEmail', paymentController.sendInvoiceByEmail); // Envoi de la facture par mail

 
// Exportation du module
module.exports = router;