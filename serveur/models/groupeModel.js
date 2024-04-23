const mydb=require('../config/database');


function getNomIdGroupes() {
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


  module.exports = {      
    getNomIdGroupes
     
 };