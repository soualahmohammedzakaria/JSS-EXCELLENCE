const sportModel = require('../models/sportModel');

async function getAllSports(req, res) {
    try {
        const sports = await sportModel.getAllSports();
        res.json({ success: true, sports });
    } catch (error) {
        console.error('Erreur lors de la récupération des sports :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération des sports' });
    }
}

async function getAllSportsGroupes(req, res) {
    try {
        const sportsGroupes = await sportModel.getAllSportsGroupes();
        res.json({ success: true, sportsGroupes });
    } catch (error) {
        console.error('Erreur lors de la récupération des sportsGroupes :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération des sportsGroupes' });
    }
}
 
 

module.exports = {    
    getAllSports, 
    getAllSportsGroupes
   
}
    