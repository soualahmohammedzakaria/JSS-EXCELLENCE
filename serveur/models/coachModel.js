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
        const query = 'INSERT INTO coachs (nom, prenom, email, date_naissance, telephone, sexe) VALUES (?, ?, ?, ?, ?, ?)';
        mydb.query(query, [coachData.nom,coachData.prenom,coachData.email,coachData.dateNaissance,coachData.telephone,coachData.sexe], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.insertId);
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
      const query =`
      SELECT c.*, JSON_ARRAYAGG(JSON_OBJECT('id_groupe', g.id_groupe, 'nom_groupe', g.nom_groupe)) AS groupes
      FROM coachs c
      LEFT JOIN groupes_a_coachs gm ON c.id_coach = gm.id_coach
      LEFT JOIN groupes g ON gm.id_groupe = g.id_groupe
      GROUP BY c.id_coach
      `;
      mydb.query(query, (error, results) => {
        if (error) {
          reject(error); // Rejeter la promesse en cas d'erreur
        } else {
          // Formatter les résultats pour inclure les informations des groupes
          const CoachsWithGroups = results.map(coach => {
            return {
              ...coach,
              groupes: coach.groupes ? JSON.parse(coach.groupes) : []
            };
          });
  
          resolve(CoachsWithGroups); // Résoudre la promesse avec les membres formatés
        }
      });
    });
  };

  function getCoachById(coachId) {
    return new Promise((resolve, reject) => {
      const query =`
      SELECT c.*, JSON_ARRAYAGG(JSON_OBJECT('id_groupe', g.id_groupe, 'nom_groupe', g.nom_groupe)) AS groupes
      FROM coachs c
      LEFT JOIN groupes_a_coachs gm ON c.id_coach = gm.id_coach
      LEFT JOIN groupes g ON gm.id_groupe = g.id_groupe
      WHERE c.id_coach = ?
      GROUP BY c.id_coach
      `;
      mydb.query(query, [coachId], (error, results) => {
        if (error) {
          reject(error); // Rejeter la promesse en cas d'erreur
        } else {
          if (results.length > 0) {
            const coach = {
              ...results[0],
              groupes: results[0].groupes ? JSON.parse(results[0].groupes) : []
            };
            resolve(coach); // Résoudre la promesse avec le membre formaté
          } else {
            resolve(null); // Aucun membre trouvé avec cet ID
          }
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

  const assignCoachToGroups = async (coachId, groupIds) => {
    return new Promise((resolve, reject) => {
      const values = groupIds.map(groupId => [coachId, groupId]);
      const query = ` INSERT INTO groupes_a_coachs (id_coach, id_groupe) VALUES ? `;
      mydb.query(query, [values], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  async function isCoachAssignedToGroup(coachId, groupId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) AS count FROM groupes_a_coachs WHERE id_coach = ? AND id_groupe = ?';
        mydb.query(query, [coachId, groupId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                const count = results[0].count;
                resolve(count > 0);
            }
        });
    });
}

async function assignCoachToGroup(coachId, groupId) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO groupes_a_coachs (id_coach, id_groupe) VALUES (?, ?)';
        mydb.query(query, [coachId, groupId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}


  function deleteGroupCoach(coachId, groupId) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM groupes_a_coachs WHERE id_coach = ? AND id_groupe = ? ';
      mydb.query(query, [coachId, groupId], (error, results) => {
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
    getCoachById,
    checkCoach,
    updateCoach,
    assignCoachToGroups,
    isCoachAssignedToGroup,
    assignCoachToGroup,
    deleteGroupCoach
};