const mydb=require('../config/database');


function getAllSports() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM sports';
        mydb.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}


/*async function getAllSportsGroupes() {
    try {
        return new Promise((resolve, reject) => {
        const query = `
            SELECT s.id_sport, s.nom_sport, s.description AS sport_description, 
                   g.id_groupe, g.nom_groupe, g.description AS groupe_description
            FROM sports s
            LEFT JOIN groupes g ON s.id_sport = g.id_sport
            ORDER BY s.id_sport, g.id_groupe;`;
            mydb.query(query, (error, results) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              });
            });*/

    function getAllSportsGroupes() {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT s.id_sport, s.nom,
      g.id_groupe, g.nom_groupe 
      FROM sports s
      LEFT JOIN groupes g ON s.id_sport = g.id_sport
      ORDER BY s.id_sport, g.id_groupe;   
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
       
    getAllSports,    
    getAllSportsGroupes   
 };