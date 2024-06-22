const sportModel = require('../models/sportModel');

// Ajout d'un sport
async function addSport(req, res) {
    try {
        const { nom } = req.body;
        const sport = await sportModel.getSportByName(nom);
        if (sport) {
            res.json({ success: false, message: 'Nom du sport déjà utilisé' });
        } else {
            await sportModel.addSport(nom);
            res.json({ success: true, message: 'Sport ajouté avec succès' });
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout d\'un sport :', error);
        res.json({ success: false, message: 'Erreur lors de l\'ajout d\'un sport' });
    }
}

// Modification d'un sport
async function updateSport(req, res) {
    try {
        const id = req.params.id;
        const { nom } = req.body;
        const sportExists = await sportModel.checkSport(nom, id);
        if (sportExists) {
            return res.json({ success: false, message: 'ce sport existe deja' });
        }
        await sportModel.updateSport(id, nom);
        res.json({ success: true, message: 'Sport modifié avec succès' });

    } catch (error) {
        console.error('Erreur lors de la modification d\'un sport :', error);
        res.json({ success: false, message: 'Erreur lors de la modification d\'un sport' });
    }
}

// Suppression d'un sport
async function deleteSport(req, res) {
    try {
        const id = req.params.id;
        await sportModel.deleteSport(id);
        res.json({ success: true, message: 'Sport supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du sport :', error);
        res.json({ success: false, message: 'Erreur lors de la suppression du sport' });
    }
}

// Récupération de tous les sports
async function getAllSports(req, res) {
    try {
        const sports = await sportModel.getAllSports();
        res.json({ success: true, sports });
    } catch (error) {
        console.error('Erreur lors de la récupération des sports :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération des sports' });
    }
}

// Récupération de tous les sportsGroupes
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
    addSport,
    updateSport,
    deleteSport,
    getAllSports,
    getAllSportsGroupes

}
