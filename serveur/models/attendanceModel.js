const mydb = require('../config/database');

// Ajouter une présence
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

// Supprimer une présence par son ID
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

// Mettre à jour une présence
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

// Récupérer les présences d'un membre
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

// Ajouter une absence
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

// Supprimer une absence par son ID
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

// Mettre à jour une absence
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

// Récupérer le créneau actuel pour un groupe
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

// Récupérer le créneau actuel pour un groupe
async function getCreneauActuel(id_groupe, currentDate) {
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

// Récupérer les membres d'un groupe
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

// Récupérer les membres présents pour un créneau
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

// Récupérer une entrée d'assiduité pour un membre
async function getAssiduiteEntry(id_membre, today) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM assiduite_membres
            WHERE id_membre = ? AND DATE(date_entree) = ? AND date_sortie IS NULL
        `;
        mydb.query(query, [id_membre, today], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]); // Retourne la première entrée trouvée ou undefined si aucune entrée n'est trouvée
            }
        });
    });
}

// Mettre à jour une sortie d'assiduité
async function updateAssiduiteSortie(id_assiduite) {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE assiduite_membres
            SET date_sortie = NOW()
            WHERE id_assiduite = ?
        `;
        mydb.query(query, [id_assiduite], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

// Récupérer les groupes d'un membre
async function getGroupsByMemberId(id_membre) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM groupes_a_membres WHERE id_membre = ?
        `;
        mydb.query(query, [id_membre], (error, results) => {
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
    getMembersOfGroup,
    getPresentMembersForCreneau,
    getAssiduiteEntry,
    updateAssiduiteSortie,
    getGroupsByMemberId
};