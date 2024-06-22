const settingModel = require('../models/settingModel');

// Récupération des paramètres
async function getSettings(req, res) {
    try {
        const parametres = await settingModel.getParametres();
        res.json({ success: true, parametres });
    } catch (error) {
        console.error('Erreur lors de la récupération des paramètres :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération des paramètres' });
    }
}

// Mise à jour des paramètres
async function updateSettings(req, res) {
    try {
        const { email, password, petites_tables, grandes_tables } = req.body;
        await settingModel.updateParametres(email, password, petites_tables, grandes_tables);
        res.json({ success: true, message: 'Paramètres mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour des paramètres :', error);
        res.json({ success: false, message: 'Erreur lors de la mise à jour des paramètres' });
    }
}

module.exports = {
    getSettings,
    updateSettings
};
