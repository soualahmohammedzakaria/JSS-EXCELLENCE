const mydb=require('../config/database');

function getCoachByName(nom, prenom) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM coachs WHERE nom = ? AND prenom = ?';
        mydb.query(query, [nom, prenom], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.length > 0 ? results[0] : undefined);
            }
        });
    });
}
 function addCoach(coachData) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO coachs (nom, prenom, email, date_naissance, photo, telephone, sexe) VALUES (?, ?, ?, ?, ?, ?, ?)';
        mydb.query(query, [coachData.nom,coachData.prenom,coachData.email,coachData.dateNaissance,coachData.photo,coachData.telephone,coachData.sexe], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function deleteCoachById(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE  FROM coachs WHERE id_coach = ?';
      mydb.query(query, [id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  function getAllCoachs() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM coachs';
      mydb.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  function checkCoach(nom, prenom, coachId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT COUNT(*) AS count FROM coachs WHERE nom = ? AND prenom = ? AND id_coach != ?';
      mydb.query(query, [nom, prenom, coachId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          const count = results[0].count;
          resolve(count > 0);  
        }
      });
    });
  }

  function updateCoach(coachId, newCoachData) {
    return new Promise(async (resolve, reject) => {
      
        const query = 'UPDATE coachs SET ? WHERE id_coach = ?';
        mydb.query(query, [newCoachData, coachId], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });     
      });
  }
  

module.exports = { 
    getCoachByName,
    addCoach,
    deleteCoachById,
    getAllCoachs,
    checkCoach,
    updateCoach
};