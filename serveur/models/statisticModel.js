const mydb = require('../config/database');
const { format, subMonths } = require('date-fns');

// Fonction pour obtenir la distribution des membres
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

// Fonction pour obtenir le nombre total d'équipements
async function getTotalEquipments() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT SUM(quantite) AS totalEquipments FROM equipements';
        mydb.query(query, [], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].totalEquipments || 0); // Assurez-vous de renvoyer 0 si aucun résultat n'est trouvé
            }
        });
    });
}

// Fonction pour obtenir la distribution des membres par sport
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

// Fonction pour obtenir le nombre de coachs
async function getCoachCount() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) AS coachCount FROM coachs';
        mydb.query(query, [], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].coachCount);
            }
        });
    });
}

// Fonction pour obtenir les dépenses du mois en cours
async function getCurrentMonthExpenses() {
    return new Promise((resolve, reject) => {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const query = 'SELECT SUM(montant) AS currentMonthExpenses FROM depenses WHERE date BETWEEN ? AND ?';
        mydb.query(query, [format(firstDayOfMonth, 'yyyy-MM-dd'), format(lastDayOfMonth, 'yyyy-MM-dd')], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].currentMonthExpenses || 0);
            }
        });
    });
}

// Fonction pour obtenir les dépenses du mois précédent
async function getPreviousMonthExpenses() {
    return new Promise((resolve, reject) => {
        const currentDate = new Date();
        const firstDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const lastDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        const query = 'SELECT SUM(montant) AS previousMonthExpenses FROM depenses WHERE date BETWEEN ? AND ?';
        mydb.query(query, [format(firstDayOfPreviousMonth, 'yyyy-MM-dd'), format(lastDayOfPreviousMonth, 'yyyy-MM-dd')], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].previousMonthExpenses || 0);
            }
        });
    });
}

// Fonction pour obtenir les revenus du mois en cours
async function getCurrentMonthIncome() {
    return new Promise((resolve, reject) => {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const query = `
            SELECT SUM(montant_paye) AS total_income
            FROM paiements_membres
            WHERE date_paiement BETWEEN ? AND ?
        `;
        mydb.query(query, [format(firstDayOfMonth, 'yyyy-MM-dd'), format(lastDayOfMonth, 'yyyy-MM-dd')], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].total_income || 0);
            }
        });
    });
}

// Fonction pour obtenir les revenus du mois précédent
async function getPreviousMonthIncome() {
    return new Promise((resolve, reject) => {
        const currentDate = new Date();
        const firstDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const lastDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        const query = `
            SELECT SUM(montant_paye) AS total_income
            FROM paiements_membres
            WHERE date_paiement BETWEEN ? AND ?
        `;
        mydb.query(query, [format(firstDayOfPreviousMonth, 'yyyy-MM-dd'), format(lastDayOfPreviousMonth, 'yyyy-MM-dd')], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].total_income || 0);
            }
        });
    });
}

// Fonction pour obtenir le nombre de nouveaux membres du mois en cours
async function getCurrentMonthNewMembers() {
    return new Promise((resolve, reject) => {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const query = `
            SELECT COUNT(*) AS count
            FROM membres
            WHERE date_inscription >= ? AND date_inscription <= ?
        `;
        mydb.query(query, [format(firstDayOfMonth, 'yyyy-MM-dd'), format(lastDayOfMonth, 'yyyy-MM-dd')], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].count);
            }
        });
    });
}

// Fonction pour obtenir le nombre de nouveaux membres du mois précédent
async function getPreviousMonthNewMembers() {
    return new Promise((resolve, reject) => {
        const currentDate = new Date();
        const firstDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const lastDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        const query = `
            SELECT COUNT(*) AS count
            FROM membres
            WHERE date_inscription >= ? AND date_inscription <= ?
        `;
        mydb.query(query, [format(firstDayOfPreviousMonth, 'yyyy-MM-dd'), format(lastDayOfPreviousMonth, 'yyyy-MM-dd')], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].count);
            }
        });
    });
}

// Fonction pour obtenir le nombre d'abonnements du mois en cours
async function getCurrentMonthSubscriptions() {
    return new Promise((resolve, reject) => {
        const currentDate = new Date();
        const currentMonth = currentDate.toISOString().slice(0, 7);
        const query = `
            SELECT COUNT(*) AS count
            FROM paiements_membres
            WHERE mois = ?
        `;
        mydb.query(query, [currentMonth], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].count);
            }
        });
    });
}

// Fonction pour obtenir le nombre d'abonnements du mois précédent
async function getPreviousMonthSubscriptions() {
    return new Promise((resolve, reject) => {
        const previousMonth = format(subMonths(new Date(), 1), 'yyyy-MM');
        const query = `
            SELECT COUNT(*) AS count
            FROM paiements_membres
            WHERE mois = ?
        `;
        mydb.query(query, [previousMonth], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].count);
            }
        });
    });
}

// Fonction pour obtenir les 5 prochains créneaux
async function getNextCreneaux() {
    return new Promise((resolve, reject) => {
        const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        const query = `
            SELECT *
            FROM creneaux
            WHERE date_debut >= ?
            ORDER BY date_debut
            LIMIT 5
        `;
        mydb.query(query, [currentDate], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

// Fonction pour obtenir le statut des membres pour le mois donné
function getMembershipStatusByMonth(currentMonth) {
    return new Promise((resolve, reject) => {
        // Requête SQL pour compter les paiements pour le mois en cours
        const query = `
        SELECT 
        COUNT(DISTINCT pm.id_membre) AS membres_actifs,
        ((SELECT COUNT(*) FROM membres WHERE date_inscription <= '${currentMonth}-01') - COUNT(DISTINCT pm.id_membre)) AS membres_non_actifs
    FROM 
        paiements_membres pm
    WHERE
        pm.mois = '${currentMonth}';`;
        mydb.query(query, [], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
            }
        });
    });
}

module.exports = {
    getDistribution,
    getTotalEquipments,
    getDistributionBySport,
    getCoachCount,
    getCurrentMonthExpenses,
    getPreviousMonthExpenses,
    getCurrentMonthIncome,
    getPreviousMonthIncome,
    getCurrentMonthNewMembers,
    getPreviousMonthNewMembers,
    getCurrentMonthSubscriptions,
    getPreviousMonthSubscriptions,
    getNextCreneaux,
    getMembershipStatusByMonth
};