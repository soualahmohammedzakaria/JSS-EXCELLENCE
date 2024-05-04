const mydb=require('../config/database');
const utils = require('../utils'); 
const pdf = require('html-pdf');
const nodemailer = require('nodemailer');
 

// Fonction pour obtenir une transaction par id
async function getTransactionById(id) {
  return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM paiements_membres WHERE id_paiement = ?';
      mydb.query(query, [id], (error, results) => {
          if (error) {
              reject(error);
          } else {
              resolve(results[0]);
          }
      });
  });
}

// Fonction pour obtenir une transaction par membre et mois
async function getTransactionByMemberAndMonth(id_membre, mois) {
  return new Promise((resolve, reject) => {
      const query = `
          SELECT * FROM paiements_membres 
          WHERE id_membre = ? AND mois = ?;
      `;
      mydb.query(query, [id_membre, mois], (error, results) => {
          if (error) {
              reject(error);
          } else {
              resolve(results[0]);
          }
      });
  });
}

// Fonction pour ajouter une transaction  
async function addTransaction(id_membre, montant_paye, montant_restant, date_paiement, mois) {
  return new Promise((resolve, reject) => {
      const query = `
          INSERT INTO paiements_membres (id_membre, montant_paye, montant_restant, date_paiement, mois) 
          VALUES (?, ?, ?, ?, ?);
      `;
      mydb.query(query, [id_membre, montant_paye, montant_restant, date_paiement, mois], (error, results) => {
          if (error) {
              reject(error);
          } else {
              resolve(results.insertId);
          }
      });
  });
}



async function deleteTransactionById(id) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM paiements_membres WHERE id_paiement = ?';
    mydb.query(query, [id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function checkTransaction(id_membre, mois, TransactionId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT COUNT(*) AS count FROM paiements_membres WHERE id_membre = ? AND mois = ? AND id_paiement != ?';
    mydb.query(query, [id_membre, mois, TransactionId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        const count = results[0].count;
        resolve(count > 0);  
      }
    });
  });
}

function updateTransactionById(transactionId, newTransactionData) {
  return new Promise(async (resolve, reject) => {
    
      const query = 'UPDATE paiements_membres SET ? WHERE id_paiement = ?';
      mydb.query(query, [newTransactionData, transactionId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });     
    });
}

function getTransactions(memberId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM paiements_membres WHERE id_membre = ?';
    mydb.query(query, [memberId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

  
 


// Fonction pour générer la facture au format PDF s'une transaction d'id_paiement = id1 , id_abonnement = id3 
function generateInvoice(data) {
  return new Promise((resolve, reject) => { 
    const currentYear = new Date().getFullYear(); 
  // code HTML de la facture
  const html = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture</title>
    <style>
        body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    font-size: 14px;
    background-color: #fff; /* Fond blanc */
}

.container {
    width: 80%;
    margin: 0 auto;
    padding: 20px;
}

.header {
    text-align: center;
    margin-bottom: 20px;
}

.invoice-details {
    margin-top: 20px;
}

.invoice-details table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #ccc; /* Ajout d'une bordure */
}

.invoice-details table td, .invoice-details table th {
    padding: 10px;
    border: 1px solid #ccc; /* Ajout d'une bordure */
    text-align: center; /* Centrage du contenu */
}

.invoice-details table th {
    background-color: #f2f2f2;
}

.footer {
    margin-top: 20px;
    text-align: center;
    font-size: 12px;
    color: #777;
}

    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Facture de Paiement</h1>
            <p>Merci pour votre paiement !</p>
        </div>
        <div class="invoice-details">
            <h2>Informations du Membre</h2>
            <table>
                <tr>
                    <th>Nom:</th>
                    <td> ${data.dataMember.nom} ${data.dataMember.prenom} </td>
                </tr>
                <tr>
                    <th>Email:</th>
                    <td>${data.dataMember.email}</td>
                </tr>
                <tr>
                    <th>Date d'Inscription:</th>
                    <td>${utils.formatDate(data.dataMember.date_inscription)}</td>
                </tr>
                <!-- Ajoutez plus d'informations sur le membre si nécessaire -->
            </table>
            <br>
            <h2>Détails du Paiement</h2>
            <table>
                <tr>
                    <th>Date de Paiement</th>
                    <th>Montant Payé</th>
                    <th>Montant Restant</th>
                    <th>Mois de Paiement</th>
                </tr>
                <tr>
                    <td>${utils.formatDate(data.dataPayment.date_paiement)}</td>
                    <td>${data.dataPayment.montant_paye} DZD</td>
                    <td>${data.dataPayment.montant_restant} DZD</td>
                    <td>${utils.formatMois(data.dataPayment.mois)}</td>
                </tr>
            </table>
        </div>
        <div class="footer">
            <p>© ${currentYear} JSS EXCELLENCE. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
  `;
  // Options pour la conversion en PDF
  const options = { format: 'A4' };
  // Générer le PDF
  pdf.create(html, options).toBuffer(function(err, buffer) {
    if (err) {
      reject(error);
    } else {
      resolve(buffer);
      
    }
  });
}
)}

// Fonction pour envoyer la facture d'une transaction 
function sendInvoiceByEmail(invoice,email,parametres) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: parametres.email, 
        pass: parametres.password  
      }
    });

    const mailOptions = {
      from:  parametres.email,  
      to:  email,
      subject: 'JSS Excellence :  Facture de votre abonnement',
      text: 'Veuillez trouver ci-joint votre facture.',
      attachments: [{
        filename: 'Facture.pdf',
        content: invoice,
      }]
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function getMemberById(id) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT nom, prenom, email, date_inscription FROM membres WHERE id_membre = ?';
    mydb.query(query, [id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
}

 
module.exports = {
  getTransactionById,
  getMemberById,
  addTransaction,
  getTransactionByMemberAndMonth,
  deleteTransactionById,
  updateTransactionById,
  checkTransaction,
  generateInvoice,
  sendInvoiceByEmail,
  getTransactions
};