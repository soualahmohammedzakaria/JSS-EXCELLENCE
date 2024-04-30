const express = require('express');
const paymentController = require('../controllers/paymentController');
const router = express.Router();



router.post('/addTransaction/', paymentController.addTransaction);
router.delete('/deleteTransaction/:id', paymentController.deleteTransaction);
router.put('/updateTransaction/:id', paymentController.updateTransaction);
router.get('/getTransactions/:id', paymentController.getTransactions);    
//router.get('/generateInvoice', paymentController.generateInvoice); 
//router.get('/sendInvoiceByEmail', paymentController.sendInvoiceByEmail); 

 

module.exports = router;