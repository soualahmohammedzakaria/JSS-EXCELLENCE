const mydb=require('../config/database');

async function getDistribution() {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                COUNT(*) AS totalMembers,
                SUM(CASE WHEN sexe = 'Homme' THEN 1 ELSE 0 END) AS totalHommes,
                SUM(CASE WHEN sexe = 'Femme' THEN 1 ELSE 0 END) AS totalFemmes,
                SUM(CASE WHEN TIMESTAMPDIFF(YEAR, date_naissance, CURDATE()) < 13 THEN 1 ELSE 0 END) AS totalEnfants,
                SUM(CASE WHEN TIMESTAMPDIFF(YEAR, date_naissance, CURDATE()) >= 13 AND TIMESTAMPDIFF(YEAR, date_naissance, CURDATE()) < 19 THEN 1 ELSE 0 END) AS totalAdolescents,
                SUM(CASE WHEN TIMESTAMPDIFF(YEAR, date_naissance, CURDATE()) >= 19 THEN 1 ELSE 0 END) AS totalAdultes
            FROM membres
            WHERE supprime = 0;
        `;
        mydb.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
            }
        });
    });
}

async function getDistributionBySport() {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT s.nom AS sport, COUNT(gam.id_membre) AS nombre_membres
        FROM sports s
        INNER JOIN groupes g ON s.id_sport = g.id_sport
        INNER JOIN groupes_a_membres gam ON g.id_groupe = gam.id_groupe
        INNER JOIN membres m ON gam.id_membre = m.id_membre
        WHERE m.supprime = 0
        GROUP BY s.nom;
        
        `;
        mydb.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}


 

module.exports = {
    getDistribution,
    getDistributionBySport
};