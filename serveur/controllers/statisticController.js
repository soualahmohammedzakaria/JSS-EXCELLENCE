const statisticModel = require('../models/statisticModel');
const moment = require('moment-timezone');

async function getDistribution(req, res) {
    try {
        const Statistics = await statisticModel.getDistribution();
        const coachCount = await statisticModel.getCoachCount();
        Statistics.coachCount = coachCount;
        res.json({ success: true, Statistics });
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques  :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération des statistiques ' });
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

async function getMonthExpenses(req, res) {
    try {
        const currentMonthExpenses = await statisticModel.getCurrentMonthExpenses();
        const previousMonthExpenses = await statisticModel.getPreviousMonthExpenses();
        const monthExpenses = {
            currentMonthExpenses,
            previousMonthExpenses
        };
        res.json({ success: true, monthExpenses });
    } catch (error) {
        console.error('Erreur lors de la récupération des dépenses du mois en cours :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération des dépenses du mois en cours' });
    }
}

async function getMonthIncome(req, res) {
    try {
        const currentMonthIncome = await statisticModel.getCurrentMonthIncome();
        const previousMonthIncome = await statisticModel.getPreviousMonthIncome();        
        const monthIncome = {
            currentMonthIncome,
            previousMonthIncome
        };
        res.json({ success: true, monthIncome });
    } catch (error) {
        console.error('Erreur lors de la récupération des revenus du mois en cours :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération des revenus du mois en cours' });
    }
}


async function getMonthNewMembers(req, res) {
    try {
        const currentMonthNewMembers= await statisticModel.getCurrentMonthNewMembers();
        const previousMonthNewMembers = await statisticModel.getPreviousMonthNewMembers();        
        const MonthNewMembers= {
            currentMonthNewMembers,
            previousMonthNewMembers
        };
        res.json({ success: true, MonthNewMembers });
    } catch (error) {
        console.error('Erreur lors de la récupération du nombre des nouveaux membres du mois en cours :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération du nombre des nouveaux membres du mois en cours' });
    }
}

async function getMonthSubscriptions(req, res) {
    try {
        const currentMonthSubscriptions= await statisticModel.getCurrentMonthSubscriptions();
        const previousMonthSubscriptions = await statisticModel.getPreviousMonthSubscriptions();        
        const MonthSubscriptions= {
            currentMonthSubscriptions,
            previousMonthSubscriptions
        };
        res.json({ success: true, MonthSubscriptions }); 
    } catch (error) {
        console.error('Erreur lors de la récupération du nombre des abonnements du mois en cours :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération du nombre des abonnements du mois en cours' });
    }
}

async function getNextCreneaux(req, res) {
    try {
        const NextCreneaux = await statisticModel.getNextCreneaux();
        NextCreneaux.forEach(NextCreneau => {            
            NextCreneau.date_debut = moment(NextCreneau.date_debut).format('YYYY-MM-DD HH:mm:ss');
            NextCreneau.date_fin = moment(NextCreneau.date_fin).format('YYYY-MM-DD HH:mm:ss');
        }); 
        res.json({ success: true, NextCreneaux });
    } catch (error) {
        console.error('Erreur lors de la récupération des  prochains créneaux :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération des  prochains créneaux' });
    }
}




module.exports = {
    getDistribution,
    getDistributionBySport,
    getMonthExpenses,
    getMonthIncome,
    getMonthNewMembers,
    getMonthSubscriptions,
    getNextCreneaux
    
}