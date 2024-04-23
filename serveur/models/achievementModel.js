const mydb=require('../config/database');

function addAchievement(achievementData) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO accomplissements (nom_evenement, date_evenement, discipline, palmares, id_membre) VALUES (?, ?, ?, ?, ?)';
        mydb.query(query, [achievementData.nom_evenement,achievementData.date_evenement,achievementData.discipline,achievementData.palmares,achievementData.id_membre], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

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

    function updateAchievement(achievementId, newAchievementData) {
        return new Promise((resolve, reject) => {
        const query = 'UPDATE accomplissements SET nom_evenement = ?, date_evenement = ?, discipline = ?, palmares = ?  WHERE id_accomp = ?';
        mydb.query(query, [newAchievementData.nom_evenement,newAchievementData.date_evenement,newAchievementData.discipline,newAchievementData.palmares, achievementId], (error, results) => {
            if (error) {
            reject(error);
            } else {
            resolve(results);
            }
        });
        });
    }

    function getAllAchievements() {
        return new Promise((resolve, reject) => {
          const query = 'SELECT * FROM accomplissements';
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
    addAchievement,
    deleteAchievementById,
    updateAchievement,
    getAllAchievements,

    
};