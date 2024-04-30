const mydb=require('../config/database');
const pdf = require('html-pdf');
const fs = require('fs');
const nodemailer = require('nodemailer');
 



/*function getTransactionById(id1,id2,id3) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM paiements_membres WHERE id_paiement = ? AND id_membre = ? AND id_abonnement = ?';
      mydb.query(query, [id1,id2,id3], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }*/

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
function generateInvoice( ) {
  return new Promise((resolve, reject) => {
  
   
  // Afin de remplir la facture on a besoin d'accéder au type d'abonnement correspondant 

  // const membershipeType = membershipTypeModel.getMembershipTypeById(id3);

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
        font-size: 12px;
        line-height: 1.5;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .header h1 {
        font-size: 40px;
        text-align : right;
        margin-right: 10px;
        margin-top: 10;
        margin-bottom: 20px;
      }
      .header p {
        font-size: 14px;
        color: #666;
        margin-bottom: 0;
      }
      .invoice-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      .invoice-info p {
        margin-bottom: 0;
        text-align : right;
        margin-right: 10px;
        
      }
      .invoice-info .invoice-number {
        font-size: 16px;
        font-weight: bold;
      }
      .invoice-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      .invoice-table th,
      .invoice-table td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: left;
      }
      .invoice-table th {
        background-color: #f2f2f2;
        font-weight: bold;
      }
      .invoice-table tr:nth-child(even) {
        background-color: #f2f2f2;
        border-top: 2px solid black;
        margin-bottom: 20px;
      }
      .total {
        text-align: right;
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 20px;
      }
      .total span {
        font-size: 14px;
        color: #666;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #666;
        margin-top: 500px;
        border-top: 1px solid #ddd;
        padding-top: 20px;
      }
      .line {
        border-top: 2px solid black;
        margin-bottom: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Facture</h1>
       
      </div>
      <div class="invoice-info">
        <p>
          <strong>Expéditeur </strong><br>
          JSS Excellence<br>
          Cité Bellouta, Saoula<br>
          Alger, Algérie<br>
          Téléphone :  0673 08 44 80<br>
        </p>
        <hr class="line">
        <p style="text-align: left">
          <strong>Client </strong><br>
          Nom : Boukakiou Wassim <br>      
          Téléphone : 0697050635 <br>  
          Date :30/04/2024  <br>    
        </p>
      </div>
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Abonnement</th>
            <th>Description</th>
            <th>Durée</th>
            <th>Prix </th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>     <! -- normalement \${membershipType.type}  -->
            <td></td>  <! -- normalement \${membershipType.description}  -->
            <td> du $du 01 au 30 </td> 
            <td> DA</td>   <! -- normalement \${membershipType.tarif}  -->
            <td> DA</td>   <! -- normalement \${membershipType.tarif}  -->
          </tr>
        </tbody>
      </table>
      <p class="total">
        Total : DA<br>
        <span>TVA : 0 DA</span><br> 
        <span>Total TTC :  DA</span> <! -- normalement \${membershipType.tarif}  -->
      </p>
      <div class="footer">
        Merci pour votre abonnement.<br>
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
      // Enregistrer le PDF généré
      fs.writeFileSync("invoice.pdf", buffer);
      resolve(buffer);
      
    }
  });
}
)}

// Fonction pour envoyer la facture d'une transaction 
function sendInvoiceByEmail() {
  return new Promise((resolve, reject) => {
    //const user = userModel.getUserByUserName(user_username);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ghackcourrier@gmail.com', 
        pass: 'azyq rfmp mkzi botf'  
      }
    });

    const mailOptions = {
      from: 'ghackcourrier@gmail.com',  
      to: 'mz_soualahmohammed@esi.dz',
      subject: 'JSS Excellence :  Facture de votre abonnement',
      text: 'Veuillez trouver ci-joint votre facture.',
      /*attachments: [{
        filename: 'Facture.pdf',
        content: pdfBuffer
      }]*/
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

 
module.exports = {
  //getTransactionById,
  addTransaction,
  getTransactionByMemberAndMonth,
  deleteTransactionById,
  updateTransactionById,
  checkTransaction,
  generateInvoice,
  sendInvoiceByEmail,
  getTransactions
};