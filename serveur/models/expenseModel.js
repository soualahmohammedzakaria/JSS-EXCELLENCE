const mydb = require('../config/database');

// Récupérer une dépense par son ID
function getExpenseById(id) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM depense WHERE id_depense = ?';
    mydb.query(query, [id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
}

// Ajouter une dépense
async function addExpense(nom, type, montant, date, description) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO depenses (nom, type, montant, date, description) VALUES (?, ?, ?, ?, ?)';
    mydb.query(query, [nom, type, montant, date, description], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Supprimer une dépense par son ID
async function deleteExpenseById(id) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM depenses WHERE id_depense = ?';
    mydb.query(query, [id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Mettre à jour une dépense
async function updateExpenseById(id, nom, type, montant, date, description) {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE depenses SET nom = ?, type = ?, montant = ?, date = ?, description = ? WHERE id_depense = ?';
    mydb.query(query, [nom, type, montant, date, description, id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Récupérer toutes les dépenses
function getAllExpenses() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM depenses';
    mydb.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}


module.exports = {
  getExpenseById,
  addExpense,
  deleteExpenseById,
  updateExpenseById,
  getAllExpenses
};