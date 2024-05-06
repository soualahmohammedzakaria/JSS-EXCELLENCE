const mydb=require('../config/database');

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

function getAllEquipments() {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT e.*, s.nom_salle  
        FROM equipements e
        LEFT JOIN salles s ON e.numero_salle = s.numero_salle;
        `
        mydb.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

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
    getAllEquipments,
    updateEquipment,
    getEquipmentsSalle
};