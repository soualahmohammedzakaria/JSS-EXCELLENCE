const mydb=require('../config/database');


function getSalleByNom(nom_salle) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM salles WHERE nom_salle = ? ';
        mydb.query(query, [nom_salle], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.length > 0 ? results[0] : undefined);
            }
        });
    });
}

function addSalle(nom_salle, capacite) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO salles (nom_salle, capacite) VALUES (?, ?)';
        mydb.query(query, [nom_salle, capacite], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

/*function getAllSalles() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM salles';
        mydb.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}*/

async function getAllSalles() {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                s.*,
                (CASE WHEN COUNT(e.id_equipement) > 0 THEN TRUE ELSE FALSE END) AS equipe
            FROM 
                salles s
            LEFT JOIN 
                equipements e ON s.numero_salle = e.numero_salle
            GROUP BY 
                s.numero_salle`;
        
        mydb.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}


function checkSalle(nom_salle, numero_salle) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM salles WHERE nom_salle = ? AND numero_salle != ?';
        mydb.query(query, [nom_salle, numero_salle], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.length > 0);
            }
        });
    });
}

function updateSalle(numero_salle, newSalleData) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE salles SET nom_salle = ?, capacite = ? WHERE numero_salle = ?';
        mydb.query(query, [newSalleData.nom_salle, newSalleData.capacite, numero_salle], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function getNomIdSalles() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT numero_salle, nom_salle FROM salles';
        mydb.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
  }

    function deleteSalle(numero_salle) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM salles WHERE numero_salle = ?';
            mydb.query(query, [numero_salle], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    function getSalle(salleId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT s.*, 
                JSON_ARRAYAGG(JSON_OBJECT('id_equipement', e.id_equipement, 'nom', e.nom, 'quantite', e.quantite)) AS equipementss
                FROM salles s
                LEFT JOIN equipements e ON s.numero_salle = e.numero_salle
                WHERE s.numero_salle = ?
                GROUP BY s.numero_salle
            `;
            mydb.query(query, [salleId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    if (results.length > 0) {
                        const salle = {
                            ...results[0],
                            equipementss: JSON.parse(results[0].equipements) // Analyser la chaîne JSON encodée en un objet JavaScript
                        };
                        resolve(salle);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }
    


  module.exports = {  
    getSalleByNom,
    addSalle,    
    getAllSalles,
    checkSalle,
    updateSalle,
    getNomIdSalles,
    deleteSalle,
    getSalle
    
     
 };