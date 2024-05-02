const attendanceModel = require('../models/attendanceModel');
const moment = require('moment-timezone');

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

async function deletePresenceMember(req, res) {
    try {
        const  attendanceId  = req.params.id;
        await attendanceModel.deletePresenceMemberById(attendanceId);
        res.json({ success: true, message: 'Présence supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la présence :', error);
        res.json({ success: false, message: 'Erreur lors de la suppression de la présence' });
    }
}

async function updatePresenceMember(req, res) {
    try {
        const attendanceId = req.params.id;
        const { id_membre, id_groupe, id_creneau, date_entree, date_sortie } = req.body;
        await attendanceModel.updatePresenceMember(attendanceId, id_membre, id_groupe, id_creneau, date_entree, date_sortie);
        res.json({ success: true, message: 'Présence modifiée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la modification de la présence :', error);
        res .json({ success: false, message: 'Erreur lors de la modification de la présence' });
    }
}

async function getPresencesMember(req, res) {
    try {
        memberId = req.params.id;
        const presences = await attendanceModel.getPresencesMember(memberId);
        presences.forEach(presence => {
            presence.date_entree = moment(presence.date_entree ).format('YYYY-MM-DDTHH:mm:ss');
            presence.date_sortie = moment(presence.date_sortie ).format('YYYY-MM-DDTHH:mm:ss');
           }); 
        res.json({ success: true, presences });
    } catch (error) {
        console.error('Erreur lors de la récupération de toutes les présences :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération de toutes les présences' });
    }
}



async function addAbsenceMember(req, res) {
    try {
        const { id_membre, id_groupe, id_creneau, justifiee, justification } = req.body;
        const date = moment().format('YYYY-MM-DD'); // Date actuelle
        await attendanceModel.addAbsenceMember(id_membre, id_groupe, id_creneau, date, justifiee, justification );
        res.json({ success: true, message: 'Absence ajoutée avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'absence :', error);
        res.json({ success: false, message: 'Erreur lors de l\'ajout de l\'absence' });
    }
}

async function deleteAbsenceMember(req, res) {
    try {
        const  absenceId  = req.params.id;
        await attendanceModel.deleteAbsenceMemberById(absenceId);
        res.json({ success: true, message: 'Absence supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'absence:', error);
        res.json({ success: false, message: 'Erreur lors de la suppression de l\'absence' });
    }
}

async function updateAbsenceMember(req, res) {
    try {
        const absenceId = req.params.id;
        const { id_membre, id_groupe, id_creneau, date, justifiee, justification } = req.body;
        await attendanceModel.updateAbsenceMember(absenceId, id_membre, id_groupe, id_creneau, date, justifiee, justification);
        res.json({ success: true, message: 'Absence modifiée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la modification de l\'absence :', error);
        res .json({ success: false, message: 'Erreur lors de la modification de l\'absence' });
    }
}

async function getAbsencesMember(req, res) {
    try {
        memberId = req.params.id;
        const absences = await attendanceModel.getAbsencesMember(memberId);
        absences.forEach(absence => {
            absence.date = moment(absence.date ).format('YYYY-MM-DD');
            absence.date_absence = moment(absence.date_absence).format('YYYY-MM-DD');
           }); 
        res.json({ success: true, absences });
    } catch (error) {
        console.error('Erreur lors de la récupération de toutes les absences :', error);
        res.json({ success: false, message: 'Erreur lors de la récupération de toutes les absences' });
    }
}

async function memberEntry(req, res) {
    try {
        const { id_membre, id_groupe} = req.body;
        const currentDate = new Date();
        const creneau = await attendanceModel.getCreneauActuel(id_groupe,currentDate);
        if(creneau==null){
            res.json({ success: false, message: 'Aucun créneau actuel pour ce groupe' });
            return;
        }
        const date_entree = currentDate;       
        await attendanceModel.addPresenceMember(id_membre, id_groupe, creneau.id_creneau, date_entree, null);
        res.json({ success: true, message: 'Présence ajoutée avec succès'}); 
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la présence :', error);
        res.json({ success: false, message: 'Erreur lors de l\'ajout de la présence' });
    }
}
async function memberExit(req, res) {
    try {
        const { id_membre, id_groupe } = req.body;
        const currentDate = new Date();

        // Mettre à jour la date de sortie du membre
        await attendanceModel.updatePresenceMemberDateSortie(id_membre, id_groupe, currentDate);

        res.json({ success: true, message: 'Heure de sortie enregistrée avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'heure de sortie :', error);
        res.json({ success: false, message: 'Erreur lors de l\'enregistrement de l\'heure de sortie' });
    }
}

async function insertAbsences(absentMembers, id_groupe, id_creneau) {
    const currentDate = new Date();  
    for (const member of absentMembers) {
        const { id_membre } = member;
        await attendanceModel.addAbsenceMember(id_membre, id_groupe, id_creneau, currentDate, 0, null);
    }
  }

async function reportAbsentsGroupe(req, res) {
        try {
            const { id_groupe, id_creneau } = req.body; 
            const members = await attendanceModel.getMembersOfGroup(id_groupe);             
            const presents = await attendanceModel.getPresentMembersForCreneau(id_creneau);  
            console.log(members);
            console.log(presents);          
            const absentMembers = members.filter(member => !presents.some(present => present.id_membre === member.id_membre));             
            await insertAbsences(absentMembers, id_groupe, id_creneau);
            res.json({ success: true, message: 'le signalement su groupe a ete fait avec succes' });
        } catch (error) {
            console.error('Erreur lors du signalement du groupe :', error);
            res.json({ success: false, message: 'Erreur lors du signalement du groupe :' });
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
    memberEntry,
    memberExit,
    reportAbsentsGroupe,
    insertAbsences  
 };