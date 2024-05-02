const mydb=require('../config/database');


function getNomIdGroups() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT id_groupe, nom_groupe FROM groupes';
        mydb.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
  }

  function getGroup(id_sport, nom_groupe) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM groupes WHERE id_sport = ? AND nom_groupe = ? ';
        mydb.query(query, [id_sport, nom_groupe], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.length > 0 ? results[0] : undefined);
            }
        });
    });
  }

  function addGroup(id_sport, nom_groupe ) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO groupes (id_sport, nom_groupe) VALUES ( ?, ?)';
        mydb.query(query, [id_sport, nom_groupe], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
  }

  function deleteGroupById(id) {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM groupes WHERE  id_groupe = ?';
        mydb.query(query, [id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
  }

  function checkGroup(id_sport, nom, id_groupe) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT COUNT(*) AS count FROM groupes WHERE id_sport = ? AND nom_groupe = ? AND id_groupe != ? ';
      mydb.query(query, [id_sport, nom, id_groupe], (error, results) => {
        if (error) {
          reject(error);
        } else {
          const count = results[0].count;
          resolve(count > 0);  
        }
      });
    });
  }

  function updateGroup( id, newGroupData) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE groupes SET ? WHERE id_groupe = ?';
        mydb.query(query, [newGroupData,id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
  }

  function getAllGroups() {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT g.*, s.nom AS nom_sport  
      FROM groupes g
      LEFT JOIN sports s ON g.id_sport = s.id_sport;
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
    getNomIdGroups,
    addGroup,
    deleteGroupById,
    checkGroup,
    updateGroup,
    getAllGroups,
    getGroup
     
 };