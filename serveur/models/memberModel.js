const mydb=require('../config/database');
const nodemailer = require('nodemailer');

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
        const query = 'INSERT INTO membres (nom, prenom, sexe, date_naissance, date_inscription, email, telephone, groupe_sanguin, maladies, poids, taille, supprime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        mydb.query(query, [newMember.nom, newMember.prenom, newMember.sexe, newMember.date_naissance, newMember.date_inscription, newMember.email, newMember.telephone, newMember.groupe_sanguin, newMember.maladies, newMember.poids, newMember.taille, 0 ], (error, results) => {
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

async function isMemberAssignedToGroup(memberId, groupId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) AS count FROM groupes_a_membres WHERE id_membre = ? AND id_groupe = ?';
        mydb.query(query, [memberId, groupId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                const count = results[0].count;
                resolve(count > 0);
            }
        });
    });
}

async function assignMemberToGroup(memberId, groupId) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO groupes_a_membres (id_membre, id_groupe) VALUES (?, ?)';
        mydb.query(query, [memberId, groupId], (error, results) => {
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
};*/

async function getAllMembers() {
  return new Promise((resolve, reject) => {
    const query =`
    SELECT 
    m.*, -- Sélectionne toutes les colonnes de la table membres
    JSON_ARRAYAGG(JSON_OBJECT('id_groupe', g.id_groupe, 'nom_groupe', g.nom_groupe)) AS groupes, -- Crée un tableau JSON des groupes associés à chaque membre
    CASE 
        WHEN EXISTS (
            SELECT * 
            FROM paiements_membres pm 
            WHERE m.id_membre = pm.id_membre 
            AND pm.mois = DATE_FORMAT(NOW(), '%Y-%m')
        ) THEN 'Payé' -- Si un paiement pour le mois actuel existe pour ce membre, définir l'état à 'Payé'
        ELSE 'Non payé' -- Sinon, définir l'état à 'Non payé'
    END AS etat_abonnement -- Alias pour l'état de l'abonnement
FROM 
    membres m
LEFT JOIN 
    groupes_a_membres gm ON m.id_membre = gm.id_membre -- Jointure pour lier les membres aux groupes auxquels ils appartiennent
LEFT JOIN 
    groupes g ON gm.id_groupe = g.id_groupe -- Jointure pour récupérer les détails des groupes
WHERE 
    m.supprime = 0 -- Filtre les membres supprimés
GROUP BY 
    m.id_membre; -- Regroupe les résultats par ID de membre pour éviter les doublons

    `;
    mydb.query(query, (error, results) => {
      if (error) {
        reject(error); // Rejeter la promesse en cas d'erreur
      } else {
        // Formatter les résultats pour inclure les informations des groupes
        const membersWithGroups = results.map(member => {
          return {
            ...member,
            groupes: member.groupes ? JSON.parse(member.groupes) : [],
            etat_abonnement: member.etat_abonnement // Ajout de l'état de l'abonnement
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
    SELECT 
      m.*, 
      JSON_ARRAYAGG(JSON_OBJECT('id_groupe', g.id_groupe, 'nom_groupe', g.nom_groupe)) AS groupes,
      CASE 
        WHEN EXISTS (
            SELECT * 
            FROM paiements_membres pm 
            WHERE m.id_membre = pm.id_membre 
            AND pm.mois = DATE_FORMAT(NOW(), '%Y-%m')
        ) THEN (
          SELECT 
            CASE 
              WHEN pm.mois = DATE_FORMAT(NOW(), '%Y-%m') THEN 'Payé'
            END
          FROM paiements_membres pm 
          WHERE m.id_membre = pm.id_membre 
          AND pm.mois = DATE_FORMAT(NOW(), '%Y-%m')
          LIMIT 1
        )
        ELSE 'Non payé' -- Si aucun paiement n'est trouvé, l'état de l'abonnement est 'Non payé'
    END AS etat_abonnement, -- Alias pour l'état de l'abonnement
    CASE
      WHEN EXISTS (
          SELECT * 
          FROM paiements_membres pm 
          WHERE m.id_membre = pm.id_membre 
          AND pm.mois = DATE_FORMAT(NOW(), '%Y-%m')
      ) THEN (
        SELECT pm.id_paiement 
        FROM paiements_membres pm 
        WHERE m.id_membre = pm.id_membre 
        AND pm.mois = DATE_FORMAT(NOW(), '%Y-%m')
        LIMIT 1
      )
      ELSE NULL -- Si aucun paiement n'est trouvé, l'id_paiement est NULL
    END AS id_paiement -- Alias pour l'id_paiement
    FROM membres m
    LEFT JOIN groupes_a_membres gm ON m.id_membre = gm.id_membre
    LEFT JOIN groupes g ON gm.id_groupe = g.id_groupe
    LEFT JOIN paiements_membres pm ON m.id_membre = pm.id_membre
    WHERE m.id_membre = ? AND m.supprime = 0
    GROUP BY m.id_membre;
    `;
    mydb.query(query, [memberId], (error, results) => {
      if (error) {
        reject(error); // Rejeter la promesse en cas d'erreur
      } else {
        if (results.length > 0) {
          const member = {
            ...results[0],
            groupes: results[0].groupes ? JSON.parse(results[0].groupes) : [],
            etat_abonnement: results[0].etat_abonnement,
            id_paiement: results[0].id_paiement // Ajouter l'id_paiement au membre
          };
          resolve(member); // Résoudre la promesse avec le membre formaté
        } else {
          resolve(null); // Aucun membre trouvé avec cet ID
        }
      }
    });
  });
} 

function getGroupeDetail(idGroupe) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT g.id_groupe, g.nom_groupe, g.id_sport, s.nom AS nom_sport
      FROM groupes g
      INNER JOIN sports s ON g.id_sport = s.id_sport
      WHERE g.id_groupe = ?`;
    mydb.query(query, [idGroupe], (error, results) => {
      if (error) {
        reject(error);
      } else {
        if (results.length > 0) {
          const groupeDetail = {
            id_groupe: results[0].id_groupe,
            nom_groupe: results[0].nom_groupe,
            id_sport: results[0].id_sport,
            nom_sport: results[0].nom_sport
          };
          resolve(groupeDetail);
        } else {
          resolve(null); // Aucun groupe trouvé avec cet ID
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

function getTransaction(id) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT montant_paye, montant_restant, date_paiement, mois FROM paiements_membres WHERE id_paiement = ?';
    mydb.query(query, [id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.length > 0 ? results[0] : undefined);
      }
    });
  });
}


function getLastTransactionBeforeCurrentMonth(memberId) {
  return new Promise((resolve, reject) => {
      const query = `
          SELECT *
          FROM paiements_membres
          WHERE id_membre = ? 
          AND mois < DATE_FORMAT(NOW(), '%Y-%m')
          ORDER BY mois DESC
          LIMIT 1
      `;
      mydb.query(query, [memberId], (error, results) => {
          if (error) {
              reject(error);
          } else {
              resolve(results.length > 0 ? results[0] : null);
          }
      });
  });
}

function DefinitivelyDeleteMember(id) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE  FROM membres WHERE id_membre = ?';
    mydb.query(query, [id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function getAllDeletedMembers() {
  return new Promise((resolve, reject) => {
    const query =`
    SELECT m.*, JSON_ARRAYAGG(JSON_OBJECT('id_groupe', g.id_groupe, 'nom_groupe', g.nom_groupe)) AS groupes
    FROM membres m
    LEFT JOIN groupes_a_membres gm ON m.id_membre = gm.id_membre
    LEFT JOIN groupes g ON gm.id_groupe = g.id_groupe
    WHERE m.supprime = 1
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

function restoreMember(id) {
  return new Promise((resolve, reject) => {
    const query = `UPDATE membres SET supprime = 0 WHERE id_membre = ?`;
    mydb.query(query, [id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function DefinitivelyDeleteAllMembers() {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM membres WHERE supprime = 1';
    mydb.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function sendQrCodeByEmail(email, qrCodeUrl, parametres, nom, prenom) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: parametres.email, 
        pass: parametres.password  
      }
    });

    const mailOptions = {
      from:  parametres.email,  
      to:  email,
      subject: 'JSS Excellence :  Code QR',
      text: 'Voici votre code QR en pièce jointe.',
      attachments: [{
        filename: `QR_${nom}_${prenom}.png`,
        content: qrCodeUrl.split(';base64,').pop(),
        encoding: 'base64'
    }]
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
    getMemberByName, 
    addMember,
    assignMemberToGroups,
    isMemberAssignedToGroup,
    assignMemberToGroup,
    deleteMemberById,
    getAllMembers,
    getMemberById,
    checkMember,     
    updateMember,
    deleteGroupMember,
    getTransaction,
    getLastTransactionBeforeCurrentMonth,
    DefinitivelyDeleteMember,
    getAllDeletedMembers,
    restoreMember,
    DefinitivelyDeleteAllMembers,
    getGroupeDetail,
    sendQrCodeByEmail
 };
  