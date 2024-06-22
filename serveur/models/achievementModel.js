const mydb = require('../config/database');// Importation de la configuration de la base de données

// Ajouter un accomplissement
function addAchievement(achievementData) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO accomplissements (nom_evenement, date_evenement, discipline, palmares, id_membre) VALUES (?, ?, ?, ?, ?)';
    mydb.query(query, [achievementData.nom_evenement, achievementData.date_evenement, achievementData.discipline, achievementData.palmares, achievementData.id_membre], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Supprimer un accomplissement par son ID
function deleteAchievementById(id) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE  FROM accomplissements WHERE id_accomp = ?';
    mydb.query(query, [id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Mettre à jour un accomplissement
function updateAchievement(achievementId, newAchievementData) {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE accomplissements SET nom_evenement = ?, date_evenement = ?, discipline = ?, palmares = ?  WHERE id_accomp = ?';
    mydb.query(query, [newAchievementData.nom_evenement, newAchievementData.date_evenement, newAchievementData.discipline, newAchievementData.palmares, achievementId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Récupérer les accomplissements d'un membre
function getAchievements(memberId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM accomplissements WHERE id_membre = ?';
    mydb.query(query, [memberId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}


module.exports = {
  addAchievement,
  deleteAchievementById,
  updateAchievement,
  getAchievements,


};