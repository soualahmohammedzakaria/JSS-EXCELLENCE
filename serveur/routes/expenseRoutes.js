const express = require('express');
const expenseController = require('../controllers/expenseController');
const router = express.Router();


router.post('/addExpense', expenseController.addExpense);// Ajout d'une dépense
router.delete('/deleteExpense/:id', expenseController.deleteExpense);// Suppression d'une dépense
router.get('/getAllExpenses', expenseController.getAllExpenses);// Récupération de toutes les dépenses
router.put('/updateExpense/:id', expenseController.updateExpense);// Mise à jour d'une dépense   

 
// Exportation du module
module.exports = router;