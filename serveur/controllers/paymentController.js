const paymentModel = require('../models/paymentModel');
const settingModel = require('../models/settingModel');
const moment = require('moment-timezone');



async function addTransaction(req, res) {
    try {
        const { id_membre, montant_paye, montant_restant, mois, envoi } = req.body;
        const date_paiement = moment().format('YYYY-MM-DD'); // Date actuelle

        // Vérifier si une transaction pour le même mois et le même membre existe déjà
        const existingTransaction = await paymentModel.getTransactionByMemberAndMonth(id_membre, mois);
        if (existingTransaction) {
            return res.json({ success: false, message: 'Une transaction pour ce membre et ce mois existe déjà' });
        }

        // Ajouter la transaction  
        await paymentModel.addTransaction(id_membre, montant_paye, montant_restant, date_paiement, mois);
        if(envoi == 1){
          const dataPayment = {montant_paye, montant_restant, date_paiement, mois}
          const dataMember = await paymentModel.getMemberById(id_membre);
          dataMember.date_inscription = moment(dataMember.date_inscription).format('YYYY-MM-DD');
          const data = {dataMember,dataPayment};
          invoice = await paymentModel.generateInvoice(data);
          parametres = await settingModel.getParametres();
          await paymentModel.sendInvoiceByEmail(invoice, dataMember.email,parametres);
          res.json({ success: true, message: 'Transaction ajoutée avec succès et facture envoyée par email' });
        }
        else{
        res.json({ success: true, message: 'Transaction ajoutée avec succès' });
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la transaction :', error);
        res.json({ success: false, message: 'Erreur lors de l\'ajout de la transaction' });
    }
}

  
  
  async function deleteTransaction(req, res) {
    try {
      const id = req.params.id; 
      await paymentModel.deleteTransactionById(id);
      res.json({ success: true, message: 'Transaction supprimée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de la transaction :', error);
      res.json({ success: false, message: 'Erreur lors de la suppression de la transaction' });
    }
  }

  async function updateTransaction(req, res) {
    try {
      const transactionId = req.params.id;
      const newTransactionData = req.body;
  
      const transactionExists = await paymentModel.checkTransaction(newTransactionData.id_membre, newTransactionData.mois, transactionId );
      if (transactionExists) {
        return res.json({ success: false, message: 'Une transaction pour ce membre et ce mois existe déjà' });
      }  
      await paymentModel.updateTransactionById(transactionId, newTransactionData);
      res.json({ success: true, message: 'Transaction mise à jour avec succès' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la transaction :', error);
      res.json({ success: false, message: 'Erreur lors de la mise à jour de la transaction' });
    }
  }

  async function getTransactions(req, res) {
    try {
       const memberId = req.params.id;
       const transactions = await paymentModel.getTransactions(memberId);
       transactions.forEach(transaction => {
        transaction.date_abonnement = moment(transaction.date_paiement).format('YYYY-MM-DD');
        transaction.mois_abonnement = transaction.mois;
        delete transaction.mois;
        delete transaction.date_paiement;
       });           
       res.json({ success: true, transactions });
    } catch (error) {
       res.json({ success: false, message: 'Erreur lors de la récupération des transactions.', error: error.message });
    }
  }

// Fonction pour envoyer la facture par email
async function sendInvoiceByEmail(req, res) {
  try {
    const {id_paiement} = req.body;
    const dataPayment = await paymentModel.getTransactionById(id_paiement);
    const dataMember = await paymentModel.getMemberById(dataPayment.id_membre); 
    dataMember.date_inscription = moment(dataMember.date_inscription).format('YYYY-MM-DD'); 
    dataPayment.date_paiement = moment(dataPayment.date_paiement).format('YYYY-MM-DD'); 
    const data = {dataMember,dataPayment};
    invoice = await paymentModel.generateInvoice(data);
    const parametres = await settingModel.getParametres();
    await paymentModel.sendInvoiceByEmail(invoice, dataMember.email,parametres);
    res.json({ success: true, message: 'Facture envoyée avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la facture par email:', error);
    res.json({ success: false, message: 'Erreur lors de l\'envoi de la facture par email' });
  }
}


  
  module.exports = {
    addTransaction,
    deleteTransaction,
    updateTransaction,
    sendInvoiceByEmail,
    getTransactions
  };