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
      const query = ` INSERT INTO groupes_a_membres (id_membre, id_groupes) VALUES ? `;
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

function getAllMembers() {
  return new Promise((resolve, reject) => {
    const query =`
    SELECT m.*, JSON_ARRAYAGG(gm.id_groupes) AS groupIds
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
};

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
    const query = 'DELETE FROM groupes_a_membres WHERE id_membre = ? AND id_groupes = ? ';
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
    checkMember,     
    updateMember,
    deleteGroupMember 
 };
  