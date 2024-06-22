const e = require('express');
const equipmentModel = require('../models/equipmentModel');

// Ajout d'un équipement
async function addEquipment(req, res) {
    try {
        const { nom, quantite, numero_salle } = req.body;
        await equipmentModel.addEquipement(nom, quantite, numero_salle);
        res.json({ success: true, message: 'Équipement ajouté avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'ajout d\'un équipement :', error);
        res.json({ success: false, message: 'Erreur lors de l\'ajout d\'un équipement' });
    }
}

// Suppression d'un équipement
async function deleteEquipment(req, res) {
    try {
        const id = req.params.id;  
        await  equipmentModel.deleteEquipmentById(id);
        res.json({ success: true, message: 'Equipement supprimé avec succès' });
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'equipement :', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la suppression de l\'equipement' });
      }
}

//  Modification d'un équipement
async function updateEquipment(req, res) {
    try {
        const equipmentId = req.params.id;
        const newEquipmentData = req.body;
        await equipmentModel.updateEquipment(equipmentId, newEquipmentData);
        res.json({ success: true, message: 'Equipement modifié avec succès' });
      } catch (error) {
        console.error('Erreur lors de la modification de l\'equipement :', error);
        res.json({ success: false, message: 'Erreur lors de la modification de l\'equipement' });
      }
}

// Récupération des équipements d'une salle
async function getEquipmentsSalle(req, res) {
    try {
        const numero_salle = req.params.id;
        const equipements = await equipmentModel.getEquipmentsSalle(numero_salle);
        equipements.forEach(equipement => {
             delete equipement.numero_salle;
        });
        res.json({ success: true, equipements });
    } catch (error) {
        res.json({ success: false, message: 'Erreur lors de la récupération des équipements.', error: error.message });
    }
}


module.exports = { 
    addEquipment,
    deleteEquipment,
    updateEquipment,
    getEquipmentsSalle
}