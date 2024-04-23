const salleModel = require('../models/salleModel');

async function getNomIdSalles(req, res) {
    try {
        const salles = await salleModel.getNomIdSalles();
        res.json({ success: true, salles });
    } catch (error) {
        console.error('Erreur lors de la récupération des salles: ', error);
        res.json({ success: false, message: 'Erreur lors de la récupération des salles' });
    }
}


module.exports = {     
    getNomIdSalles
}
    