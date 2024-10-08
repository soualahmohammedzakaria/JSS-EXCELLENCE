const mydb = require('../config/database');
const crypto = require('crypto');

// Récupérer un utilisateur par son nom d'utilisateur
function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM administrateurs WHERE username = ? LIMIT 1';
    mydb.query(query, [username], (error, results) => {
      if (error) {
        reject(error);
      } else {
        if (results.length > 0) {
          resolve(results[0]);
        } else {
          resolve(undefined);
        }
      }
    });
  });
}

// Comparer un mot de passe en clair avec un mot de passe haché
async function comparePassword(plainPassword, hashedPassword) {
  const hash = crypto.createHash('md5');
  hash.update(plainPassword);
  plainpasswordHashed = hash.digest('hex');
  return plainpasswordHashed === hashedPassword;
}

// Ajouter un utilisateur
function addUser(nom, prenom, username, password, role) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5');
    hash.update(password);
    password = hash.digest('hex');
    const query = 'INSERT INTO administrateurs (nom, prenom, username, password, role) VALUES (?, ?, ?, ?, ?)';
    mydb.query(query, [nom, prenom, username, password, role], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });

  });
}

// Supprimer un utilisateur par son ID
function deleteUserById(id) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM administrateurs WHERE id_admin = ?';
    mydb.query(query, [id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Récupérer tous les utilisateurs
function getAllUsers() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT id_admin, nom, prenom, username, role FROM administrateurs';
    mydb.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// on verifie si un nom d'utilisateur existe déjà pour d'autres utilisateurs
function checkUsername(username, userId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT COUNT(*) AS count FROM administrateurs WHERE username = ? AND id_admin != ?';
    mydb.query(query, [username, userId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        const count = results[0].count;
        resolve(count > 0); // Renvoie true si le nom d'utilisateur existe déjà pour d'autres utilisateurs, sinon false
      }
    });
  });
}

//on met à jour les informations d'un utilisateur
function updateUser(userId, newUserData) {
  return new Promise(async (resolve, reject) => {
    const query = 'UPDATE administrateurs SET ? WHERE id_admin = ?';
    mydb.query(query, [newUserData, userId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

//on met à jour le mot de passe d'un utilisateur
function updateUserPassword(userId, password) {
  return new Promise(async (resolve, reject) => {
    const hash = crypto.createHash('md5');
    hash.update(password);
    password = hash.digest('hex');
    const query = 'UPDATE administrateurs SET password = ? WHERE id_admin = ?';
    mydb.query(query, [password, userId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = {
  getUserByUsername,
  comparePassword,
  addUser,
  deleteUserById,
  getAllUsers,
  checkUsername,
  updateUser,
  updateUserPassword
};
