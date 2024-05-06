const mydb = require('../config/database');

function getParametres() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM parametres LIMIT 1';
        mydb.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                if (results.length > 0) {
                    resolve(results[0]);
                } else {
                    resolve(null); // Aucun paramètre trouvé
                }
            }
        });
    });
}

function updateParametres(email, password, petites_tables, grandes_tables) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE parametres SET email = ?, password = ?, petites_tables = ?, grandes_tables = ?';
        mydb.query(query, [email, password, petites_tables, grandes_tables], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = {
    getParametres,
    updateParametres
};
