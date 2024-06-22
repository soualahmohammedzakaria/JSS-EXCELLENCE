const salleModel = require('../models/salleModel');

// Ajout d'une salle
async function addSalle(req, res) {
    try {
        const { capacite, nom_salle } = req.body;
        const salle = await salleModel.getSalleByNom(nom_salle);
        if (salle) {
            res.json({ success: false, message: 'Salle déjà trouvée' });
            return;
        }
        await salleModel.addSalle(nom_salle, capacite);
        res.json({ success: true, message: 'Salle ajoutée avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'ajout d\'une salle :', error);
        res.json({ success: false, message: 'Erreur lors de l\'ajout d\'une salle' });
    }
}

// Récupération de toutes les salles
async function getAllSalles(req, res) {
    try {
        const salles = await salleModel.getAllSalles();
        res.json({ success: true, salles });
    } catch (error) {
        console.error('Erreur lors de la récupération des salles :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération des salles' });
    }
}

// Mise à jour d'une salle
async function updateSalle(req, res) {
    try {
        const salleId = req.params.id;
        const newSalleData = req.body;
        const salleExists = await salleModel.checkSalle(newSalleData.nom_salle, salleId);
        if (salleExists) {
            return res.json({ success: false, message: 'Cette salle existe déjà' });
        }
        await salleModel.updateSalle(salleId, newSalleData);
        res.json({ success: true, message: 'Salle modifiée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la modification de la salle :', error);
        res.json({ success: false, message: 'Erreur lors de la modification de la salle' });
    }
}

// Récupération des noms et des id des salles
async function getNomIdSalles(req, res) {
    try {
        const salles = await salleModel.getNomIdSalles();
        res.json({ success: true, salles });
    } catch (error) {
        console.error('Erreur lors de la récupération des salles :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération des salles' });
    }
}

// Suppression d'une salle
async function deleteSalle(req, res) {
    try {
        const id = req.params.id;
        await salleModel.deleteSalle(id);
        res.json({ success: true, message: 'Salle supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la salle :', error);
        res.json({ success: false, message: 'Erreur lors de la suppression de la salle' });
    }
}

// Récupération d'une salle
async function getSalle(req, res) {
    try {
        const id = req.params.id;
        const salle = await salleModel.getSalle(id);
        res.json({ success: true, salle });
    } catch (error) {
        console.error('Erreur lors de la récupération de la salle :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération de la salle' });
    }
}

module.exports = {
    addSalle,
    getAllSalles,
    updateSalle,
    deleteSalle,
    getNomIdSalles,
    getSalle
}