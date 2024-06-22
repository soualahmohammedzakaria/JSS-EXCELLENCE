const memberModel = require('../models/memberModel');
const paymentModel = require('../models/paymentModel');
const settingModel = require('../models/settingModel');
const path = require('path');
const QRCode = require('qrcode');
const fs = require('fs');
const multer = require('multer');
const moment = require('moment-timezone');


// Configuration de Multer pour stocker les images dans le dossier "images"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/membres');
  },
  filename: async (req, file, cb) => {
    const memberId = req.params.id;
    const ext = '.jpeg';
    const filename = `m_${memberId}${ext}`;
    cb(null, filename);
  }
});
const upload = multer({ storage: storage });

// Ajout d'un membre
async function addMember(req, res) {
  try {
    const newMember = req.body;
    const member = await memberModel.getMemberByName(newMember.nom, newMember.prenom);
    if (member) {
      res.json({ success: false, message: 'Nom du membre déjà utilisé' });
    } else {
      const IdMember = await memberModel.addMember(newMember);
      res.json({ success: true, message: 'Membre ajouté avec succès', IdMember: IdMember });
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout du membre :', error);
    res.json({ success: false, message: 'Erreur lors de l\'ajout du membre' });
  }
}

// Mise à jour de la photo du membre
async function addPhoto(req, res) {
  try {
    const memberId = req.params.id;
    upload.single('image')(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        res.json({ success: false, message: 'Erreur lors du téléchargement de la photo' });
      } else if (err) {
        res.json({ success: false, message: err.message });
      } else {
        // Upload successful, update member photo
        const newPhotoFileName = `m_${memberId}`;
        await memberModel.updateMemberPhoto(memberId, newPhotoFileName);
        // Send response
        res.json({ success: true, message: 'Photo du membre mise à jour avec succès' });
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la photo du membre :', error);
    res.json({ success: false, message: 'Erreur lors de la mise à jour de la photo du membre' });
  }
}

// Suppression d'un membre
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

// Récupération de tous les membres
async function getAllMembers(req, res) {
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

// Récupération d'un membre
async function getMember(req, res) {
  try {
    const memberId = req.params.id;
    const member = await memberModel.getMemberById(memberId);
    if (member) {
      if (member.etat_abonnement == 'Payé') {
        const transaction = await memberModel.getTransaction(memberId);
        member.id_paiement = transaction.id_paiement;
        transaction.date_abonnement = moment(transaction.date_paiement).format('YYYY-MM-DD');
        transaction.mois_abonnement = transaction.mois;
        delete transaction.mois;
        delete transaction.date_paiement;
        member.transaction = transaction;
      } else {
        const lastTransaction = await memberModel.getLastTransactionBeforeCurrentMonth(memberId);
        if (lastTransaction) {
          member.id_paiement = lastTransaction.id_paiement;
          lastTransaction.date_abonnement = moment(lastTransaction.date_paiement).format('YYYY-MM-DD');
          lastTransaction.mois_abonnement = lastTransaction.mois;
          delete lastTransaction.mois;
          delete lastTransaction.date_paiement;
          member.transaction = lastTransaction;
        }
        else {
          member.id_paiement = null;
        }
      }
      // Ajouter le nom du sport pour chaque groupe
      for (const groupe of member.groupes) {
        const groupeDetail = await memberModel.getGroupeDetail(groupe.id_groupe);
        groupe.nom_sport = groupeDetail.nom_sport;
      }
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

// Modification d'un membre
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

// Assigner un membre à des groupes
async function assignMemberToGroups(req, res) {
  try {
    const memberId = req.params.id;
    const { groupIds } = req.body;
    if (groupIds && groupIds.length > 0) {
      await memberModel.assignMemberToGroups(memberId, groupIds);
      res.json({ success: true, message: 'Membre assigné aux groupes avec succès' });
    }
    else {
      res.json({ success: false, message: 'Veuillez sélectionner au moins un groupe' });
    }
  } catch (error) {
    console.error('Erreur lors de l\'assignation du membre aux groupes :', error);
    res.json({ success: false, message: 'Erreur lors de l\'assignation du membre aux groupes' });
  }
}

// Assigner un membre à un groupe
async function assignMemberToGroup(req, res) {
  try {
    const memberId = req.params.id;
    const { groupId } = req.body;
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

// Suppression d'un membre d'un groupe
async function deleteGroupMember(req, res) {
  try {
    const memberId = req.params.id;
    const { groupId } = req.body;
    await memberModel.deleteGroupMember(memberId, groupId);
    res.json({ success: true, message: 'Membre retiré du groupe avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du membre du groupe :', error);
    res.json({ success: false, message: 'Erreur lors de la suppression du membre du groupe' });
  }
}

// Récupération de tous les membres supprimés
async function getAllDeletedMembers(req, res) {
  try {
    const members = await memberModel.getAllDeletedMembers();
    members.forEach(member => {
      member.date_naissance = moment(member.date_naissance).format('YYYY-MM-DD');
      member.date_inscription = moment(member.date_inscription).format('YYYY-MM-DD');
    });
    res.json({ success: true, members });
  } catch (error) {
    res.json({ success: false, message: 'Erreur lors de la récupération des membres.', error: error.message });
  }
}

// Suppression définitive d'un membre
async function DefinitivelyDeleteMember(req, res) {
  try {
    const memberId = req.params.id;
    // Récupérer le nom de la photo du membre à partir de la base de données
    const member = await memberModel.getDeletedMemberById(memberId);
    const photoFileName = member.photo; // Supposons que le nom du champ de la photo soit "photo"
    // Supprimer le membre de la base de données
    await memberModel.DefinitivelyDeleteMember(memberId);
    // Supprimer le fichier photo du système de fichiers
    if (photoFileName) {
      const photoPath = path.join(__dirname, '../public/images/membres', photoFileName + '.jpeg'); // Chemin complet du fichier photo
      fs.unlinkSync(photoPath); // Suppression synchronisée du fichier
    }
    res.json({ success: true, message: 'Membre et photo associée supprimés avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du membre et de sa photo :', error);
    res.json({ success: false, message: 'Erreur lors de la suppression du membre et de sa photo' });
  }
}

// Restaurer un membre
async function restoreMember(req, res) {
  try {
    const id = req.params.id;
    await memberModel.restoreMember(id);
    res.json({ success: true, message: 'Membre restauré avec succès' });
  } catch (error) {
    console.error('Erreur lors de la restauration du membre :', error);
    res.json({ success: false, message: 'Erreur lors de la restauration du membre' });
  }
}

// Suppression définitive de tous les membres
async function DefinitivelyDeleteAllMembers(req, res) {
  try {
    // Récupérer tous les membres de la base de données
    const members = await memberModel.getAllDeletedMembers();
    // Supprimer chaque membre et sa photo individuellement
    for (const member of members) {
      const memberId = member.id_membre;
      const photoFileName = member.photo; // Supposons que le nom du champ de la photo soit "photo"
      // Supprimer le membre de la base de données
      await memberModel.DefinitivelyDeleteMember(memberId);
      // Supprimer le fichier photo du système de fichiers
      if (photoFileName) {
        const photoPath = path.join(__dirname, '../public/images/membres', photoFileName + '.jpeg'); // Chemin complet du fichier photo
        fs.unlinkSync(photoPath); // Suppression synchronisée du fichier
      }
    }
    res.json({ success: true, message: 'Tous les membres et leurs photos ont été supprimés avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression des membres et de leurs photos :', error);
    res.json({ success: false, message: 'Erreur lors de la suppression des membres et de leurs photos' });
  }
}

// Envoi du code QR par email
async function sendQrCodeByEmail(req, res) {
  try {
    const parametres = await settingModel.getParametres();
    if (parametres.email && parametres.email.length > 2 && parametres.email.includes('@') && parametres.email.includes('.')){
      const memberId = req.params.id;
      const member = await paymentModel.getMemberById(memberId);
      if (member) {
        const text = member.nom + '_' + member.prenom + '_' + memberId;
        const options = {
          width: 300,
          height: 300
        };
        QRCode.toDataURL(text, options, async (err, qrCodeUrl) => {
          if (err) {
            console.error(err);
            res.json({ success: false, message: 'Erreur lors de la génération du code QR' });
            return;
          }
          // Envoyer le code QR par e-mail ici
          await memberModel.sendQrCodeByEmail(member.email, qrCodeUrl, parametres, member.nom, member.prenom);
          res.json({ success: true, message: 'Code QR envoyé par email avec succès' });
        });
      } else {
        res.json({ success: false, message: 'Membre non trouvé' });
      }
    }else{
      res.json({ success: false, message: 'Veuillez configurer l\'adresse email de l\'envoi' });
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi du code QR par email :', error);
    res.json({ success: false, message: 'Erreur lors de l\'envoi du code QR par email' });
  }
}

// Suppression de la photo d'un membre
async function deletePhoto(req, res) {
  try {
    const memberId = req.params.id;
    const member = await memberModel.getMemberById(memberId);
    if (member.photo) {
      const photoFileName = `m_${memberId}`;
      const photoPath = path.join(__dirname, '../public/images/membres', photoFileName + '.jpeg'); // Chemin complet du fichier photo
      fs.unlinkSync(photoPath); // Suppression synchronisée du fichier
      await memberModel.deletePhoto(memberId);
      res.json({ success: true, message: 'Photo du membre supprimée avec succès' });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de la photo du membre :', error);
    res.json({ success: false, message: 'Erreur lors de la suppression de la photo du membre' });
  }
}

module.exports = {
  addMember,
  addPhoto,
  deleteMember,
  getAllMembers,
  getMember,
  updateMember,
  assignMemberToGroups,
  assignMemberToGroup,
  deleteGroupMember,
  DefinitivelyDeleteMember,
  getAllDeletedMembers,
  restoreMember,
  DefinitivelyDeleteAllMembers,
  sendQrCodeByEmail,
  deletePhoto
}