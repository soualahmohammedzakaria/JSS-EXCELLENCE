const mydb=require('../config/database');


function getEquipmentByName(nom) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM equipements WHERE nom = ? ';
        mydb.query(query, [nom], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.length > 0 ? results[0] : undefined);
            }
        });
    });
}

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

function checkEquipment(nom, equipmentId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) AS count FROM equipements WHERE nom = ? AND id_equipement != ?';
        mydb.query(query, [nom, equipmentId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                const count = results[0].count;
                resolve(count > 0);
            }
        });
    });
}



module.exports = { 
    getEquipmentByName,
    addEquipement,
    deleteEquipmentById,
    getAllEquipments,
    updateEquipment,
    checkEquipment
};