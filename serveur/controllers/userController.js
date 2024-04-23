const userModel = require('../models/userModel');
const passwordValidator = require('password-validator');

// On crée un schema pour valider la robustesse du mot de passe.
const passwordSchema = new passwordValidator();
passwordSchema
  .is().min(8) // Longueur minimale 8 caractères
  .has().digits() // Au moins un chiffre

async function addUser(req, res) {
  try {
    const {nom, prenom, username, password, role } = req.body;
    const user = await userModel.getUserByUsername(username);
    if (user) {
    res.json({ success: false, message: 'Nom d\'utilisateur déjà utilisé!' });
    } else {
      // On verfie la robustesse du mot de passe
        if (!passwordSchema.validate(password)) {
          return res.json({ success: false, message: 'Essayez un mot de passe plus fort. Votre mot de passe doit être composé d\'au moins 8 caractères, avec des lettres et des chiffres.'});
        }
      await userModel.addUser(nom, prenom, username, password, role);
      res.json({ success: true, message: 'Utilisateur ajouté avec success!' });
    }
  } catch(error) {
    console.error('Erreur lors de l\'ajout d\'un utilisateur:', error);
    res.json({ success: false, message: 'Erreur lors de l\'ajout de l\'utilisateur!' });
  }
}
async function deleteUser(req, res) {
  try {
    const id = req.params.id;  
    await userModel.deleteUserById(id);
    res.json({ success: true, message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur :', error);
    res.json({ success: false, message: 'Erreur lors de la suppression de l\'utilisateur' });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await userModel.getAllUsers();     
    res.json({ success: true, users });
  } catch (error) {
    res.json({ success: false, message: 'Erreur lors de la récupération des utilisateurs.', error: error.message });
  }
}

      async function updateUser(req, res) {
        try {
          const userId = req.params.id;
          const newUserData = req.body;     
          // On vérifie si le nouveau nom d'utilisateur existe déjà pour d'autres utilisateurs.
          const usernameExists = await userModel.checkUsername(newUserData.username, userId);
          if (usernameExists) {
            return res.json({ success: false, message: 'Ce nom d\'utilisateur existe déjà!' });
          }           
          // Mise à jour les informations de l'utilisateur
          const result = await userModel.updateUser(userId, newUserData);
          res.json({ success: true, message: 'Informations utilisateur ont été mises à jour avec succès!'});
        } catch (error) {
          console.error('Erreur lors de la mise à jour des informations de l\'utilisateur: ', error);
          res.json({ success: false, message: 'Erreur lors de la mise à jour des informations de l\'utilisateur!' });
        }
      }

      async function updateUserPassword(req, res) {
        try {
          const userId = req.params.id;
          const { password } = req.body;
          // On verifie la robustesse du mot de passe.
          console.log(req.body);
          console.log("password is: " + password);
          console.log("User ID is: " + userId);
          if (!passwordSchema.validate(password)) {
            return res.json({ success: false, message: 'Essayez un mot de passe plus fort. Votre mot de passe doit être composé d\'au moins 8 caractères, avec des lettres et des chiffres.'});
          }
          // Mettre à jour le mot de passe de l'utilisateur
          const result = await userModel.updateUserPassword(userId, password);
          res.json({ success: true, message: 'Mot de passe utilisateur mis à jour avec succès'});
        } catch (error) {
          console.error('Erreur lors de la mise à jour du mot de passe utilisateur:', error);
          res.json({ success: false, message: 'Erreur lors de la mise à jour du mot de passe utilisateur!' });
        }
      }






module.exports = {
    addUser,
    deleteUser,
    getAllUsers,
    updateUser,
    updateUserPassword
}

 