const salleModel = require('../models/salleModel');


async function addSalle(req, res) {
    try {
        const { capacite, nom_salle } = req.body;
        const salle = await salleModel.getSalleByNom(nom_salle);
        if (salle) {
            res.json({ success: false, message: 'Salle déjà trouvée' });
            return;
        }
        await salleModel.addSalle( nom_salle,capacite);
        res.json({ success: true, message: 'Salle ajoutée avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'ajout d\'une salle :', error);
        res.json({ success: false, message: 'Erreur lors de l\'ajout d\'une salle' });
    }
}

async function getAllSalles(req, res) {
    try {
        const salles = await salleModel.getAllSalles();
        res.json({ success: true, salles });
    } catch (error) {
        console.error('Erreur lors de la récupération des salles :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération des salles' });
    }
}

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
        res.status(500).json({ success: false, message: 'Erreur lors de la modification de la salle' });
    }
}

async function getNomIdSalles(req, res) {
    try {
        const salles = await salleModel.getNomIdSalles();         
        res.json({ success: true, salles });
    } catch (error) {
        console.error('Erreur lors de la récupération des salles :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération des salles' });
    }
}

async function deleteSalle(req, res) {
    try {
        const id = req.params.id;
        await salleModel.deleteSalle(id);
        res.json({ success: true, message: 'Salle supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la salle :', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la suppression de la salle' });
    }
}


module.exports = {    
    addSalle, 
    getAllSalles, 
    updateSalle,  
    deleteSalle,
    getNomIdSalles
   
}
    