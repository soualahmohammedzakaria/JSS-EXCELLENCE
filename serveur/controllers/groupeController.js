const groupeModel = require('../models/groupeModel');

async function getNomIdGroupes(req, res) {
    try {
        const groupes = await groupeModel.getNomIdGroupes();
        res.json({ success: true, groupes });
    } catch (error) {
        console.error('Erreur lors de la récupération des groupes :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération des groupes' });
    }
}


module.exports = {     
    getNomIdGroupes
}