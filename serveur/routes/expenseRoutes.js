const express = require('express');
const expenseController = require('../controllers/expenseController');

const router = express.Router();


router.post('/addExpense', expenseController.addExpense);
router.delete('/deleteExpense/:id', expenseController.deleteExpense);
router.get('/getAllExpenses', expenseController.getAllExpenses);
router.put('/updateExpense/:id', expenseController.updateExpense);
     

 

module.exports = router;