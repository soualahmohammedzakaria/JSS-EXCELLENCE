const mydb=require('../config/database');


function getNomIdSalles() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT numero_salle, nom_salle FROM salles';
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
    getNomIdSalles
     
 };