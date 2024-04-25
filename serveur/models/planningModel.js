const mydb=require('../config/database');


function addCreneau(id_groupe, numero_salle,titre, date_debut, date_fin, type, description ) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO creneaux (id_groupe, numero_salle,titre, date_debut, date_fin, type, description ) VALUES ( ?, ?, ?, ?, ?, ?, ?)';
        mydb.query(query, [id_groupe, numero_salle,titre, date_debut, date_fin, type, description ], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
  }

  function  getCreneau(titre, date_debut, date_fin) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM creneaux WHERE  titre= ? AND date_debut = ? AND date_fin = ?';
        mydb.query(query, [titre, date_debut, date_fin], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.length > 0 ? results[0] : undefined);
            }
        });
    });
}
  
  function deleteCreneauById( id) {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM creneaux WHERE  id_creneau = ?';
        mydb.query(query, [id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
  }

  function checkCreneau(titre, date_debut, date_fin, creneauId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT COUNT(*) AS count FROM creneaux WHERE titre= ? AND date_debut = ? AND date_fin = ? AND id_creneau != ? ';
      mydb.query(query, [titre, date_debut, date_fin, creneauId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          const count = results[0].count;
          resolve(count > 0);  
        }
      });
    });
  }
  
  function updateCreneau( id, newCreneauData) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE creneaux SET ? WHERE id_creneau = ?';
        mydb.query(query, [newCreneauData,id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
  }

  function getAllCreneaux() {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT c.*, g.nom_groupe, s.nom_salle
      FROM creneaux c
      LEFT JOIN groupes g ON c.id_groupe = g.id_groupe
      LEFT JOIN salles s ON c.numero_salle = s.numero_salle;          
      `;
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
      addCreneau,
      getCreneau,
      deleteCreneauById,
      updateCreneau,
      checkCreneau,
      getAllCreneaux
  
   };