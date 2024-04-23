const memberModel = require('../models/memberModel');
const moment = require('moment');


// il reste des choses à faire 
async function addMember(req, res){
    try {
      const newMember = req.body;

      const member = await memberModel.getMemberByName(newMember.nom,newMember.prenom);
      if (member) {
      res.json({ success: false, message: 'Nom du membre déjà utilisé' });
      } else {
      const dateNaissanceObjN = new Date(newMember.date_naissance);
      //Formatage de la date au format 'YYYY-MM-DD'
      const dateNaissanceFormattedN = moment(dateNaissanceObjN, 'DD/MM/YYYY').format('YYYY-MM-DD');
      newMember.date_naissance=dateNaissanceFormattedN;
      
      const dateNaissanceObjI = new Date(newMember.date_inscription);
      //Formatage de la date au format 'YYYY-MM-DD'
      const dateNaissanceFormattedI = moment(dateNaissanceObjI, 'DD/MM/YYYY').format('YYYY-MM-DD');
      newMember.date_inscription=dateNaissanceFormattedI;
      
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
      member.date_naissance = new Date(member.date_naissance).toLocaleDateString();
      member.date_inscription = new Date(member.date_inscription).toLocaleDateString();
       });
      res.json({ success: true, members });
    } catch (error) {
      res.json({ success: false, message: 'Erreur lors de la récupération des membres.', error: error.message });
    }
  }

  async function updateMember(req, res) {
    try {
      const memberId = req.params.id;
      const newMemberData = req.body;
  
      // on verifie si le nouveau nom du membre existe déjà pour d'autres membres
      const memberExists = await memberModel.checkMember(newMemberData.nom, newMemberData.prenom, memberId);
      if (memberExists) {
        return res.status(400).json({ success: false, message: 'Le nouveau nom du membre existe déjà pour un autre member' });
      }
  
      // Conversion de la date de naissance en objet Date
      const dateNaissanceObj = new Date(newMemberData.date_naissance);
      //Formatage de la date au format 'YYYY-MM-DD'
      const dateNaissanceFormatted = moment(dateNaissanceObj, 'DD/MM/YYYY').format('YYYY-MM-DD');
  
      newMemberData.date_naissance = dateNaissanceFormatted;

      // Conversion de la date d inscription en objet Date
      const dateInscriptionObj = new Date(newMemberData.date_inscription);
      //Formatage de la date au format 'YYYY-MM-DD'
      const dateInscriptionFormatted = moment(dateInscriptionObj, 'DD/MM/YYYY').format('YYYY-MM-DD');
  
      newMemberData.date_inscription = dateInscriptionFormatted;
  
      await memberModel.updateMember(memberId, newMemberData);
      res.json({ success: true, message: 'membre modifié avec succès' });
    } catch (error) {
      console.error('Erreur lors de la modification du membre :', error);
      res.status(500).json({ success: false, message: 'Erreur lors de la modification du membre' });
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
      res.status(500).json({ success: false, message: 'Erreur lors de l\'assignation du membre aux groupes' });
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
      res.status(500).json({ success: false, message: 'Erreur lors de la suppression du membre du groupe' });
    }
  }
  





  module.exports = {
    addMember,
    deleteMember,
    getAllMembers,
    updateMember,
    assignMemberToGroups,
    deleteGroupMember
}