const mydb = require('../config/database');

// Récupérer un coach par son nom et prénom
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

// Ajouter un coach
function addCoach(coachData) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO coachs (nom, prenom, email, date_naissance, telephone, sexe) VALUES (?, ?, ?, ?, ?, ?)';
    mydb.query(query, [coachData.nom, coachData.prenom, coachData.email, coachData.dateNaissance, coachData.telephone, coachData.sexe], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.insertId);
      }
    });
  });
}

// Supprimer un coach par son ID
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

// Supprimer la photo d'un coach
function deletePhoto(id) {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE coachs SET photo = null WHERE id_coach = ?';
    mydb.query(query, [id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

// Récupérer tous les coachs
function getAllCoachs() {
  return new Promise((resolve, reject) => {
    const query = `
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

// Récupérer un coach par son ID
function getCoachById(coachId) {
  return new Promise((resolve, reject) => {
    const query = `
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

// Vérifier si un coach existe déjà
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

// Mettre à jour un coach
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

// Mettre à jour la photo d'un coach
function updateCoachPhoto(coachId, newPhotoFileName) {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE coachs SET photo = ? WHERE id_coach = ?';
    mydb.query(query, [newPhotoFileName, coachId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Assigner un coach à des groupes
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

// Vérifier si un coach est déjà assigné à un groupe
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

// Assigner un coach à un groupe
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

// Supprimer un coach d'un groupe
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
  deletePhoto,
  getAllCoachs,
  getCoachById,
  checkCoach,
  updateCoach,
  updateCoachPhoto,
  assignCoachToGroups,
  isCoachAssignedToGroup,
  assignCoachToGroup,
  deleteGroupCoach
};