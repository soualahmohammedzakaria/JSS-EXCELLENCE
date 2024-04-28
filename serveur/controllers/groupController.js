const groupModel = require('../models/groupModel');

async function getNomIdGroups(req, res) {
    try {
        const groupes = await groupModel.getNomIdGroups();
        res.json({ success: true, groupes });
    } catch (error) {
        console.error('Erreur lors de la récupération des groupes :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération des groupes' });
    }
}

async function addGroup(req, res) {
    try {
        const { id_sport, nom_groupe, description } = req.body;
        const group = await groupModel.getGroup(id_sport, nom_groupe);
        if (group) {
            res.json({ success: false, message: 'Ce groupe existe deja' });
        } else {
        await groupModel.addGroup(id_sport, nom_groupe, description);
        res.json({ success: true, message: 'Groupe ajouté avec succès' });
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du groupe :', error);
        res.json({ success: false, message: 'Erreur lors de l\'ajout du groupe' });
    }
}

async function deleteGroup(req, res) {
    try {
        const groupId = req.params.id;
        await groupModel.deleteGroupById(groupId);
        res.json({ success: true, message: 'Groupe supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du groupe :', error);
        res.json({ success: false, message: 'Erreur lors de la suppression du groupe' });
    }
}

async function updateGroup(req, res) {
    try {
      const id_groupe = req.params.id;
      const newGroupData = req.body;
  
      // on verifie si un groupe existe
      const GroupExists = await groupModel.checkGroup(newGroupData.id_sport, newGroupData.nom_groupe, id_groupe);
      if (GroupExists) {
        res.json({ success: false, message: 'Le groupe existe deja' });
      } 
      else{ 
      await groupModel.updateGroup(id_groupe, newGroupData);
      res.json({ success: true, message: 'Groupe modifié avec succès' });
      }
    } catch (error) {
      console.error('Erreur lors de la modification du groupe :', error);
      res.json({ success: false, message: 'Erreur lors de la modification du group' });
    }
  }

 
async function getAllGroups(req, res) {
    try {
        const groupes = await groupModel.getAllGroups();
        res.json({ success: true, groupes });
    } catch (error) {
        console.error('Erreur lors de la récupération des groupes :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération des groupes' });
    }
}



module.exports = {     
    getNomIdGroups,
    addGroup,
    deleteGroup,
    updateGroup,
    getAllGroups
}