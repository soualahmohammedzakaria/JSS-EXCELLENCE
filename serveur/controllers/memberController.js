const memberModel = require('../models/memberModel');
const moment = require('moment-timezone');

// il reste des choses à faire 
async function addMember(req, res){
    try {
      const newMember = req.body;

      const member = await memberModel.getMemberByName(newMember.nom,newMember.prenom);
      if (member) {
      res.json({ success: false, message: 'Nom du membre déjà utilisé' });
      } else {
      const IdMember = await memberModel.addMember(newMember);

      // Assignation du membre aux groupes
      if (newMember.groupIds && newMember.groupIds.length > 0) {
        await memberModel.assignMemberToGroups(IdMember, newMember.groupIds);
      }
      res.json({ success: true, message: 'Membre ajouté avec succès' });
   }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du membre :', error);
      res.json({ success: false, message: 'Erreur lors de l\'ajout du membre' });
    }
  }



async function deleteMember(req, res) {
    try {
      const id = req.params.id;  
      await memberModel.deleteMemberById(id);
      res.json({ success: true, message: 'Membre supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression du membre :', error);
      res.json({ success: false, message: 'Erreur lors de la suppression du membre' });
    }
  }

  async function getAllMembers(req, res){
    try {
      const members = await memberModel.getAllMembers(); 
      members.forEach(member => {
      member.date_naissance = moment(member.date_naissance).format('YYYY-MM-DD');
      member.date_inscription = moment(member.date_inscription).format('YYYY-MM-DD');
       });
      res.json({ success: true, members });
    } catch (error) {
      res.json({ success: false, message: 'Erreur lors de la récupération des membres.', error: error.message });
    }
  }

  async function getMember(req, res) {
    try {
      const memberId = req.params.id;
      const member = await memberModel.getMemberById(memberId);
      if (member) {
        member.date_naissance = moment(member.date_naissance).format('YYYY-MM-DD');
        member.date_inscription = moment(member.date_inscription).format('YYYY-MM-DD');
        res.json({ success: true, member });
      } else {
        res.json({ success: false, message: 'Membre non trouvé' });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du membre :', error);
      res.json({ success: false, message: 'Erreur lors de la récupération du membre' });
    }
  }

  async function updateMember(req, res) {
    try {
      const memberId = req.params.id;
      const newMemberData = req.body;
  
      // on verifie si le nouveau nom du membre existe déjà pour d'autres membres
      const memberExists = await memberModel.checkMember(newMemberData.nom, newMemberData.prenom, memberId);
      if (memberExists) {
        return res.json({ success: false, message: 'Le nouveau nom du membre existe déjà pour un autre member' });
      }
      await memberModel.updateMember(memberId, newMemberData);
      res.json({ success: true, message: 'membre modifié avec succès' });
    } catch (error) {
      console.error('Erreur lors de la modification du membre :', error);
      res.json({ success: false, message: 'Erreur lors de la modification du membre' });
    }
  }

  async function assignMemberToGroups(req, res) {
    try {
      const memberId = req.params.id;
      const  { groupIds }  = req.body;
      if (groupIds && groupIds.length > 0) {
        await memberModel.assignMemberToGroups(memberId, groupIds); 
        res.json({ success: true, message: 'Membre assigné aux groupes avec succès' });
      }      
      else{
        res.json({ success: false, message: 'Veuillez sélectionner au moins un groupe' });
      }
    } catch (error) {
      console.error('Erreur lors de l\'assignation du membre aux groupes :', error);
      res.json({ success: false, message: 'Erreur lors de l\'assignation du membre aux groupes' });
    }
  }
  
  async function deleteGroupMember(req, res) {
    try {
      const memberId = req.params.id;
      const {groupId} = req.body;
      console.log(groupId);
      await memberModel.deleteGroupMember(memberId, groupId);
      res.json({ success: true, message: 'Membre retiré du groupe avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression du membre du groupe :', error);
      res.json({ success: false, message: 'Erreur lors de la suppression du membre du groupe' });
    }
  }
  





  module.exports = {
    addMember,
    deleteMember,
    getAllMembers,
    getMember,
    updateMember,
    assignMemberToGroups,
    deleteGroupMember
}