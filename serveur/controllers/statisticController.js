const statisticModel = require('../models/statisticModel');

async function getDistribution(req, res) {
    try {
        const memberStatistics = await statisticModel.getDistribution();
        res.json({ success: true, memberStatistics });
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques des membres :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération des statistiques des membres' });
    }
}

async function getDistributionBySport(req, res) {
    try {
        const sportStatistics = await statisticModel.getDistributionBySport();
        res.json({ success: true, sportStatistics });
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques des membres par sport :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération des statistiques des membres par sport' });
    }
}




module.exports = {
    getDistribution,
    getDistributionBySport 
    
}