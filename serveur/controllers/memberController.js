const memberModel = require('../models/memberModel');
const multer = require('multer');
const moment = require('moment-timezone');

// Configuration de Multer pour stocker les images dans le dossier "images"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../public/images/membres'); // Dossier de destination
  },
  filename: (req, file, cb) => {
    const ext = '.jpeg'; // Extension fixe
    const filename = 'm_' + req.body.nom + '_' + req.body.prenom + ext; // Nom du fichier basé sur le nom et le prénom
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

// A verifier apres le cas des membres supprimes logiquement 
async function addMember(req, res){
    try {
      const newMember = req.body;

      const member = await memberModel.getMemberByName(newMember.nom,newMember.prenom);
      if (member) {
      res.json({ success: false, message: 'Nom du membre déjà utilisé' });
      } else {
      const IdMember = await memberModel.addMember(newMember);
      
       // Traitement du téléchargement de la photo  
    /*upload.single('photo')(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        // Erreur Multer
        return res.json({ success: false, message: 'Erreur lors du téléchargement de la photo' });
      } else if (err) {
        // Autres erreurs
        return res.json({ success: false, message: err.message });
    }
  });*/
  
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
      if(member.id_paiement != null){
        const transaction = await memberModel.getTransaction(member.id_paiement);
        transaction.date_abonnement = moment(transaction.date_paiement).format('YYYY-MM-DD');
        transaction.mois_abonnement = transaction.mois;
        delete transaction.mois;
        delete transaction.date_paiement;
        member.transaction = transaction;
      }
      else{
        const lastTransaction = await memberModel.getLastTransactionBeforeCurrentMonth(memberId);
            if (lastTransaction) {
                member.id_paiement = lastTransaction.id_paiement;
                lastTransaction.date_abonnement = moment(lastTransaction.date_paiement).format('YYYY-MM-DD');
                lastTransaction.mois_abonnement = lastTransaction.mois;
                delete lastTransaction.mois;
                delete lastTransaction.date_paiement;
                member.transaction = lastTransaction;
            }        
      }
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

  async function assignMemberToGroup(req, res) {
    try {
        const memberId = req.params.id;
        const {groupId} = req.body;

        // Vérifier si le membre appartient déjà au groupe
        const isMemberAssigned = await memberModel.isMemberAssignedToGroup(memberId, groupId);

        if (isMemberAssigned) {
            res.json({ success: false, message: 'Le membre est déjà assigné à ce groupe' });
        } else {
            await memberModel.assignMemberToGroup(memberId, groupId);
            res.json({ success: true, message: 'Membre assigné au groupe avec succès' });
        }
    } catch (error) {
        console.error('Erreur lors de l\'assignation du membre au groupe :', error);
        res.json({ success: false, message: 'Erreur lors de l\'assignation du membre au groupe' });
    }
}

  
  async function deleteGroupMember(req, res) {
    try {
      const memberId = req.params.id;
      const {groupId} = req.body;
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
    assignMemberToGroup,
    deleteGroupMember
}