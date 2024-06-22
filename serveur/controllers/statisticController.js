const statisticModel = require('../models/statisticModel');
const moment = require('moment-timezone');

// Récupération des statistiques
async function getDistribution(req, res) {
    try {
        const Statistics = await statisticModel.getDistribution();
        const coachCount = await statisticModel.getCoachCount();
        const totalEquipments = await statisticModel.getTotalEquipments();
        Statistics.coachCount = coachCount;
        Statistics.totalEquipments = totalEquipments;
        res.json({ success: true, Statistics });
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques  :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération des statistiques ' });
    }
}

// Récupération des statistiques par sport
async function getDistributionBySport(req, res) {
    try {
        const sportStatistics = await statisticModel.getDistributionBySport();
        res.json({ success: true, sportStatistics });
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques des membres par sport :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération des statistiques des membres par sport' });
    }
}

// Récupération des dépenses du mois en cours
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

// Récupération des revenus du mois en cours
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

// Récupération des nouveaux membres du mois en cours
async function getMonthNewMembers(req, res) {
    try {
        const currentMonthNewMembers = await statisticModel.getCurrentMonthNewMembers();
        const previousMonthNewMembers = await statisticModel.getPreviousMonthNewMembers();
        const MonthNewMembers = {
            currentMonthNewMembers,
            previousMonthNewMembers
        };
        res.json({ success: true, MonthNewMembers });
    } catch (error) {
        console.error('Erreur lors de la récupération du nombre des nouveaux membres du mois en cours :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération du nombre des nouveaux membres du mois en cours' });
    }
}

// Récupération des abonnements du mois en cours
async function getMonthSubscriptions(req, res) {
    try {
        const currentMonthSubscriptions = await statisticModel.getCurrentMonthSubscriptions();
        const previousMonthSubscriptions = await statisticModel.getPreviousMonthSubscriptions();
        const MonthSubscriptions = {
            currentMonthSubscriptions,
            previousMonthSubscriptions
        };
        res.json({ success: true, MonthSubscriptions });
    } catch (error) {
        console.error('Erreur lors de la récupération du nombre des abonnements du mois en cours :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération du nombre des abonnements du mois en cours' });
    }
}

// Récupération des prochains créneaux
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

// Récupération des membres actifs et non actifs par mois
async function getMembershipStatusByMonth(req, res) {
    try {
        const membershipStatus = [];
        for (let i = 0; i < 12; i++) {
            const currentMonth = moment().subtract(i, 'months').format('YYYY-MM');
            const membershipStatusByMonth = await statisticModel.getMembershipStatusByMonth(currentMonth);
            membershipStatusByMonth.mois = currentMonth;
            membershipStatus.push(membershipStatusByMonth);
        }
        res.json({ success: true, membershipStatus });
    } catch (error) {
        console.error('Erreur lors de la récupération des membres actifs et non actifs par mois :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération des données des membres' });
    }
}


module.exports = {
    getDistribution,
    getDistributionBySport,
    getMonthExpenses,
    getMonthIncome,
    getMonthNewMembers,
    getMonthSubscriptions,
    getNextCreneaux,
    getMembershipStatusByMonth

}