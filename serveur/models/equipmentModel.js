const mydb = require('../config/database');

// Ajouter un équipement
function addEquipement(nom, quantite, numero_salle) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO equipements (nom, quantite, numero_salle) VALUES (?, ?, ?)';
        mydb.query(query, [nom, quantite, numero_salle], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

// Supprimer un équipement par son ID
function deleteEquipmentById(id) {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM equipements WHERE id_equipement = ?';
        mydb.query(query, [id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

// Mettre à jour un équipement
function updateEquipment(id, newEquipmentData) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE equipements SET ? WHERE id_equipement = ?';
        mydb.query(query, [newEquipmentData, id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

// Récupérer les équipements d'une salle
function getEquipmentsSalle(id) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM equipements WHERE numero_salle = ?';
        mydb.query(query, [id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = {
    addEquipement,
    deleteEquipmentById,
    updateEquipment,
    getEquipmentsSalle
};