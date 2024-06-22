const attendanceModel = require('../models/attendanceModel');
const memberModel = require('../models/memberModel');
const moment = require('moment-timezone');

// Ajout d'une présence
async function addPresenceMember(req, res) {
    try {
        const { id_membre, id_groupe, id_creneau, date_entree, date_sortie } = req.body;
        await attendanceModel.addPresenceMember(id_membre, id_groupe, id_creneau, date_entree, date_sortie);
        res.json({ success: true, message: 'Présence ajoutée avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la présence :', error);
        res.json({ success: false, message: 'Erreur lors de l\'ajout de la présence' });
    }
}

// Suppression d'une présence
async function deletePresenceMember(req, res) {
    try {
        const attendanceId = req.params.id;
        await attendanceModel.deletePresenceMemberById(attendanceId);
        res.json({ success: true, message: 'Présence supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la présence :', error);
        res.json({ success: false, message: 'Erreur lors de la suppression de la présence' });
    }
}

// Modification d'une présence
async function updatePresenceMember(req, res) {
    try {
        const attendanceId = req.params.id;
        const { id_membre, id_groupe, id_creneau, date_entree, date_sortie } = req.body;
        await attendanceModel.updatePresenceMember(attendanceId, id_membre, id_groupe, id_creneau, date_entree, date_sortie);
        res.json({ success: true, message: 'Présence modifiée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la modification de la présence :', error);
        res.json({ success: false, message: 'Erreur lors de la modification de la présence' });
    }
}

// Récupération de toutes les présences d'un membre
async function getPresencesMember(req, res) {
    try {
        memberId = req.params.id;
        const presences = await attendanceModel.getPresencesMember(memberId);
        presences.forEach(presence => {
            presence.date_entree = moment(presence.date_entree).format('YYYY-MM-DDTHH:mm:ss');
            presence.date_sortie = moment(presence.date_sortie).format('YYYY-MM-DDTHH:mm:ss');
        });
        res.json({ success: true, presences });
    } catch (error) {
        console.error('Erreur lors de la récupération de toutes les présences :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération de toutes les présences' });
    }
}

// Ajout d'une absence
async function addAbsenceMember(req, res) {
    try {
        const { id_membre, id_groupe, id_creneau, date, justifiee, justification } = req.body;
        await attendanceModel.addAbsenceMember(id_membre, id_groupe, id_creneau, date, justifiee, justification);
        res.json({ success: true, message: 'Absence ajoutée avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'absence :', error);
        res.json({ success: false, message: 'Erreur lors de l\'ajout de l\'absence' });
    }
}

// Suppression d'une absence
async function deleteAbsenceMember(req, res) {
    try {
        const absenceId = req.params.id;
        await attendanceModel.deleteAbsenceMemberById(absenceId);
        res.json({ success: true, message: 'Absence supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'absence:', error);
        res.json({ success: false, message: 'Erreur lors de la suppression de l\'absence' });
    }
}

// Modification d'une absence
async function updateAbsenceMember(req, res) {
    try {
        const absenceId = req.params.id;
        const { id_membre, id_groupe, id_creneau, date, justifiee, justification } = req.body;
        await attendanceModel.updateAbsenceMember(absenceId, id_membre, id_groupe, id_creneau, date, justifiee, justification);
        res.json({ success: true, message: 'Absence modifiée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la modification de l\'absence :', error);
        res.json({ success: false, message: 'Erreur lors de la modification de l\'absence' });
    }
}

// Récupération de toutes les absences d'un membre
async function getAbsencesMember(req, res) {
    try {
        memberId = req.params.id;
        const absences = await attendanceModel.getAbsencesMember(memberId);
        absences.forEach(absence => {
            absence.date = moment(absence.date).format('YYYY-MM-DD');
            absence.date_absence = moment(absence.date_absence).format('YYYY-MM-DD');
        });
        res.json({ success: true, absences });
    } catch (error) {
        console.error('Erreur lors de la récupération de toutes les absences :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération de toutes les absences' });
    }
}

// Insérer des absences pour les membres absents
async function insertAbsences(absentMembers, id_groupe, id_creneau) {
    const currentDate = new Date();
    for (const member of absentMembers) {
        const { id_membre } = member;
        await attendanceModel.addAbsenceMember(id_membre, id_groupe, id_creneau, currentDate, 0, null);
    }
}

// Signaler les absences d'un groupe
async function reportAbsentsGroupe(req, res) {
    try {
        const { id_groupe, id_creneau } = req.body;
        const members = await attendanceModel.getMembersOfGroup(id_groupe);
        const presents = await attendanceModel.getPresentMembersForCreneau(id_creneau);
        const absentMembers = members.filter(member => !presents.some(present => present.id_membre === member.id_membre));
        await insertAbsences(absentMembers, id_groupe, id_creneau);
        res.json({ success: true, message: 'le signalement su groupe a ete fait avec succes' });
    } catch (error) {
        console.error('Erreur lors du signalement du groupe :', error);
        res.json({ success: false, message: 'Erreur lors du signalement du groupe :' });
    }

}

// Signaler la présence d'un membre
async function memberPresence(req, res) {
    try {
        const id_membre = req.params.id;
        const today = moment().format('YYYY-MM-DD');
        const currentDate = new Date();
        const member = await memberModel.getMemberById(id_membre);
        if (member) {
            if (member.etat_abonnement == 'Payé') {

                // Recherchez une entrée dans la table assiduite_membres pour le membre et le jour actuel
                const existingEntry = await attendanceModel.getAssiduiteEntry(id_membre, today);
                if (existingEntry) {
                    // Si une entrée existe et que le champ date_sortie est null, mettez à jour le champ date_sortie
                    await attendanceModel.updateAssiduiteSortie(existingEntry.id_assiduite);
                    res.json({ success: true, message: 'Le signalement de la sortie a été effectué avec succès!' });
                } else {
                    // Récupérez tous les groupes du membre
                    const groupes = await attendanceModel.getGroupsByMemberId(id_membre);
                    let creneauTrouve = false;
                    // Cherchez un créneau en cours pour chaque groupe
                    for (const groupe of groupes) {
                        const creneau = await attendanceModel.getCreneauActuel(groupe.id_groupe, currentDate);
                        if (creneau) {
                            // Si un créneau est trouvé, insérez une nouvelle entrée
                            await attendanceModel.addPresenceMember(id_membre, groupe.id_groupe, creneau.id_creneau, currentDate, null);
                            res.json({ success: true, message: 'Le signalement de l\'entrée a été effectué avec succès!' });
                            creneauTrouve = true;
                            break; // Arrêtez la boucle dès qu'un créneau est trouvé
                        }
                    }
                    if (!creneauTrouve) {
                        res.json({ success: false, message: 'Pas de créneau pour le(s) groupe(s) de ce membre en ce moment!' });
                    }
                }
            } else {
                res.json({ success: false, message: 'L\'abonnement de ce membre est expiré!' });
            }
        } else {
            res.json({ success: false, message: 'Membre non trouvé!' });
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la présence :', error);
        res.json({ success: false, message: 'Erreur lors du signalement de la présence' });
    }
}

module.exports = {
    addPresenceMember,
    deletePresenceMember,
    updatePresenceMember,
    getPresencesMember,
    addAbsenceMember,
    deleteAbsenceMember,
    updateAbsenceMember,
    getAbsencesMember,
    reportAbsentsGroupe,
    insertAbsences,
    memberPresence
};