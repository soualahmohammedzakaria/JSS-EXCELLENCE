const mydb=require('../config/database');

function addPresenceMember(id_membre, id_groupe, id_creneau, date_entree, date_sortie) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO assiduite_membres (id_membre, id_groupe, id_creneau, date_entree, date_sortie) VALUES (?, ?, ?, ?, ?)';
        mydb.query(query, [id_membre, id_groupe, id_creneau, date_entree, date_sortie], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function deletePresenceMemberById(attendanceId) {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM assiduite_membres WHERE id_assiduite = ?';
        mydb.query(query, [attendanceId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function updatePresenceMember(attendanceId, id_membre, id_groupe, id_creneau, date_entree, date_sortie) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE assiduite_membres SET id_membre = ? , id_groupe = ? , id_creneau = ? , date_entree = ? , date_sortie = ?  WHERE id_assiduite = ?';
        mydb.query(query, [id_membre, id_groupe, id_creneau, date_entree, date_sortie, attendanceId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
  }

  async function getPresencesMember(memberId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT am.*, g.nom_groupe, c.titre
        FROM assiduite_membres am
        INNER JOIN groupes g ON am.id_groupe = g.id_groupe
        INNER JOIN creneaux c ON am.id_creneau = c.id_creneau
        WHERE am.id_membre = ?
      `;
      mydb.query(query, [memberId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }



  function addAbsenceMember(id_membre, id_groupe, id_creneau, date, justifiee, justification) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO absences_membres (id_membre, id_groupe, id_creneau, date, justifiee, justification) VALUES (?, ?, ?, ?, ?, ?)';
        mydb.query(query, [id_membre, id_groupe, id_creneau, date, justifiee, justification], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function deleteAbsenceMemberById(absenceId) {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM absences_membres WHERE id_absence = ?';
        mydb.query(query, [absenceId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function updateAbsenceMember(absenceId, id_membre, id_groupe, id_creneau, date, justifiee, justification) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE absences_membres SET id_membre = ? , id_groupe = ? , id_creneau = ? , date = ? , justifiee = ? , justification = ?  WHERE id_absence = ?';
        mydb.query(query, [id_membre, id_groupe, id_creneau, date, justifiee, justification, absenceId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
  }

  async function getAbsencesMember(memberId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT am.*, g.nom_groupe, c.titre
        FROM assiduite_membres am
        INNER JOIN groupes g ON am.id_groupe = g.id_groupe
        INNER JOIN creneaux c ON am.id_creneau = c.id_creneau
        WHERE am.id_membre = ?
      `;
      mydb.query(query, [memberId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  async function getAbsencesMember(memberId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT absences_membres.*, groupes.nom_groupe AS nom_groupe, creneaux.titre AS titre_creneau, creneaux.date_debut AS date_absence
        FROM absences_membres
        JOIN groupes ON absences_membres.id_groupe = groupes.id_groupe
        JOIN creneaux ON absences_membres.id_creneau = creneaux.id_creneau
        WHERE absences_membres.id_membre = ?
      `;
      mydb.query(query, [memberId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }


    async function getCreneauActuel(id_groupe,currentDate) {
      return new Promise((resolve, reject) => {
          const twoHoursAfter = new Date(currentDate.getTime() + (2 * 60 * 60 * 1000));
          const query = ` SELECT *  FROM creneaux WHERE id_groupe = ? AND date_debut < ? AND date_fin > ? LIMIT 1 `;
  
          // Exécutez la requête SQL
          mydb.query(query, [id_groupe, twoHoursAfter, currentDate], (error, results) => {
              if (error) {
                  reject(error);
              } else {
                if (results.length > 0) {
                  resolve(results[0]);
              } else {
                  resolve(null); // Aucun résultat trouvé
              }
              }
          });
      });
  }
  
  async function updatePresenceMemberDateSortie(id_membre, id_groupe, date_sortie) {
    return new Promise((resolve, reject) => {
        const selectQuery = `
            SELECT MAX(id_assiduite) AS max_id
            FROM assiduite_membres
            WHERE id_membre = ? AND id_groupe = ?
        `;
        mydb.query(selectQuery, [id_membre, id_groupe], (error, results) => {
            if (error) {
                reject(error);
            } else {
                if (results.length > 0) {
                    const maxId = results[0].max_id;
                    const updateQuery = `
                        UPDATE assiduite_membres
                        SET date_sortie = ?
                        WHERE id_assiduite = ?
                    `;
                    mydb.query(updateQuery, [date_sortie, maxId], (updateError, updateResults) => {
                        if (updateError) {
                            reject(updateError);
                        } else {
                            resolve(updateResults);
                        }
                    });
                } else {
                    reject(new Error('Aucune ligne correspondante trouvée'));
                }
            }
        });
    });
}

async function getMembersOfGroup(id_groupe) {
  return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM groupes_a_membres WHERE id_groupe = ?';
      mydb.query(query, [id_groupe], (error, results) => {
          if (error) {
              reject(error);
          } else {
              resolve(results);
          }
      });
  });
}

async function getPresentMembersForCreneau(id_creneau) {
  return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM assiduite_membres WHERE id_creneau = ?';
      mydb.query(query, [id_creneau], (error, results) => {
          if (error) {
              reject(error);
          } else {
              resolve(results);
          }
      });
  });
}


  

 


  module.exports = {  
    addPresenceMember,
    deletePresenceMemberById,
    updatePresenceMember,
    getPresencesMember, 
    addAbsenceMember,
    deleteAbsenceMemberById,
    updateAbsenceMember,
    getAbsencesMember,
    getCreneauActuel,
    updatePresenceMemberDateSortie,
    getMembersOfGroup,
    getPresentMembersForCreneau
    
 };