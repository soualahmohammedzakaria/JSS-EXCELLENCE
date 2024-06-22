const mydb = require('../config/database');

// Récupérer un sport par son nom
function getSportByName(nom) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM sports WHERE nom = ?';
    mydb.query(query, [nom], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.length > 0 ? results[0] : undefined);
      }
    });
  });
}

// Ajouter un sport
function addSport(nom) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO sports (nom) VALUES (?)';
    mydb.query(query, [nom], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.insertId);
      }
    });
  });
}

// Vérifier si un sport existe déjà
function checkSport(nom, id) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT COUNT(*) AS count FROM sports WHERE nom = ?  AND id_sport != ?';
    mydb.query(query, [nom, id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        const count = results[0].count;
        resolve(count > 0);
      }
    });
  });
}

// Mettre à jour un sport
function updateSport(id, nom) {
  return new Promise(async (resolve, reject) => {
    const updateValue = {
      nom: nom // Spécifiez le nom de la colonne et la nouvelle valeur
    };
    const query = 'UPDATE sports SET ? WHERE id_sport = ?';
    mydb.query(query, [updateValue, id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Supprimer un sport par son ID
function deleteSport(id) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM sports WHERE id_sport = ?';
    mydb.query(query, [id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    }
    );
  });
}

// Récupérer tous les sports
function getAllSports() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM sports';
    mydb.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Récupérer tous les sports avec leurs groupes
function getAllSportsGroupes() {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT s.id_sport, s.nom,
        g.id_groupe, g.nom_groupe 
        FROM sports s
        LEFT JOIN groupes g ON s.id_sport = g.id_sport
        ORDER BY s.id_sport, g.id_groupe;   
      `;
    mydb.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        // Créer un objet pour stocker les sports et leurs groupes
        const sportsWithGroups = {};
        // Parcourir les résultats et regrouper les groupes par sport
        results.forEach(row => {
          const { id_sport, nom, id_groupe, nom_groupe } = row;
          // Si le sport n'existe pas encore dans l'objet, l'initialiser avec une liste vide de groupes
          if (!sportsWithGroups[id_sport]) {
            sportsWithGroups[id_sport] = {
              id_sport,
              nom,
              groupes: []
            };
          }
          // Ajouter le groupe à la liste des groupes du sport
          sportsWithGroups[id_sport].groupes.push({
            id_groupe,
            nom_groupe
          });
        });
        // Convertir l'objet en un tableau de sports
        const sportsList = Object.values(sportsWithGroups);
        resolve(sportsList);
      }
    });
  });
}

module.exports = {
  getSportByName,
  addSport,
  checkSport,
  updateSport,
  deleteSport,
  getAllSports,
  getAllSportsGroupes
};