const mydb=require('../config/database');


function getMemberByName(nom, prenom) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM membres WHERE nom = ? AND prenom = ?';
        mydb.query(query, [nom, prenom], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.length > 0 ? results[0] : undefined);
            }
        });
    });
}

function addMember(newMember) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO membres (nom, prenom, age, sexe, date_naissance, date_inscription, email, photo, telephone, groupe_sanguin, maladies, poids, taille, supprime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        mydb.query(query, [newMember.nom, newMember.prenom, newMember.age, newMember.sexe, newMember.date_naissance, newMember.date_inscription, newMember.email, newMember.photo, newMember.telephone, newMember.groupe_sanguin, newMember.maladies, newMember.poids, newMember.taille, 0 ], (error, results) => {
        if (error) {
            reject(error);
        } else {
            resolve(results.insertId);
        }
        });
    });    
}

const assignMemberToGroups = async (memberId, groupIds) => {
    return new Promise((resolve, reject) => {
      const values = groupIds.map(groupId => [memberId, groupId]);
      const query = ` INSERT INTO groupes_a_membres (id_membre, id_groupe) VALUES ? `;
      mydb.query(query, [values], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
  
function deleteMemberById(id) {
  return new Promise((resolve, reject) => {
    const query = `UPDATE membres SET supprime = 1 WHERE id_membre = ?`;
    mydb.query(query, [id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

/*function getAllMembers() {
  return new Promise((resolve, reject) => {
    const query =`
    SELECT m.*, JSON_ARRAYAGG(gm.id_groupe) AS groupIds
    FROM membres m
    LEFT JOIN groupes_a_membres gm ON m.id_membre = gm.id_membre
    WHERE m.supprime = 0
    GROUP BY m.id_membre
    `;
    mydb.query(query, (error, results) => {
      if (error) {
        reject(error); // Rejeter la promesse en cas d'erreur
      } else {
        // Formatter les résultats pour inclure le tableau d'IDs de groupe
        const membersWithGroups = results.map(member => {
          return {
            ...member,
            groupIds: member.groupIds ? JSON.parse(member.groupIds) : []
          };
        });

        resolve(membersWithGroups); // Résoudre la promesse avec les membres formatés
      }
    });
  });
};*/

function getAllMembers() {
  return new Promise((resolve, reject) => {
    const query =`
    SELECT m.*, JSON_ARRAYAGG(JSON_OBJECT('id_groupe', g.id_groupe, 'nom_groupe', g.nom_groupe)) AS groupes
    FROM membres m
    LEFT JOIN groupes_a_membres gm ON m.id_membre = gm.id_membre
    LEFT JOIN groupes g ON gm.id_groupe = g.id_groupe
    WHERE m.supprime = 0
    GROUP BY m.id_membre
    `;
    mydb.query(query, (error, results) => {
      if (error) {
        reject(error); // Rejeter la promesse en cas d'erreur
      } else {
        // Formatter les résultats pour inclure les informations des groupes
        const membersWithGroups = results.map(member => {
          return {
            ...member,
            groupes: member.groupes ? JSON.parse(member.groupes) : []
          };
        });

        resolve(membersWithGroups); // Résoudre la promesse avec les membres formatés
      }
    });
  });
};

function getMemberById(memberId) {
  return new Promise((resolve, reject) => {
    const query =`
    SELECT m.*, JSON_ARRAYAGG(JSON_OBJECT('id_groupe', g.id_groupe, 'nom_groupe', g.nom_groupe)) AS groupes
    FROM membres m
    LEFT JOIN groupes_a_membres gm ON m.id_membre = gm.id_membre
    LEFT JOIN groupes g ON gm.id_groupe = g.id_groupe
    WHERE m.id_membre = ? AND m.supprime = 0
    GROUP BY m.id_membre
    `;
    mydb.query(query, [memberId], (error, results) => {
      if (error) {
        reject(error); // Rejeter la promesse en cas d'erreur
      } else {
        if (results.length > 0) {
          const member = {
            ...results[0],
            groupes: results[0].groupes ? JSON.parse(results[0].groupes) : []
          };
          resolve(member); // Résoudre la promesse avec le membre formaté
        } else {
          resolve(null); // Aucun membre trouvé avec cet ID
        }
      }
    });
  });
}


function checkMember(nom, prenom, memberId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT COUNT(*) AS count FROM membres WHERE nom = ? AND prenom = ? AND id_membre != ? AND supprime != ?';
    mydb.query(query, [nom, prenom, memberId, 1], (error, results) => {
      if (error) {
        reject(error);
      } else {
        const count = results[0].count;
        resolve(count > 0);  
      }
    });
  });
}

function updateMember(memberId, newMemberData) {
  return new Promise(async (resolve, reject) => {
    
      const query = 'UPDATE membres SET ? WHERE id_membre = ?';
      mydb.query(query, [newMemberData,memberId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });     
    });
}


function deleteGroupMember(memberId, groupId) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM groupes_a_membres WHERE id_membre = ? AND id_groupe = ? ';
    mydb.query(query, [memberId, groupId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}





module.exports = { 
    getMemberByName, 
    addMember,
    assignMemberToGroups,
    deleteMemberById,
    getAllMembers,
    getMemberById,
    checkMember,     
    updateMember,
    deleteGroupMember 
 };
  