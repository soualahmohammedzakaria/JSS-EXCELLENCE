export const formatDate = (date) => { // Fonction pour formater la date
    return date.split("-").reverse().join("/");
}

export const formatDateHeure = (date) => {  // Fonction pour formater la date et l'heure
    return new Date(date).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
}

export const formatAnMois = (date) => { // Fonction pour formater l'année et le mois
    const [an, month] = date.split("-");
    const mois = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    const nomMois = mois[parseInt(month) - 1];
    return `${nomMois} ${an}`;
}

export const formatMois = (date) => { // Fonction pour formater le mois
    return date < 10 ? `0${date}` : date
}

export const extraireMois = (date) => { // Fonction pour extraire le mois
    return date.split("-")[1];
}

export const extraireAnnee = (date) => {
    return date.split("-")[0];
}

export const moisActuel = () => {
    const actDate = new Date();
    const actAn = actDate.getFullYear();
    const actMois = actDate.getMonth() + 1;
    return [actAn, actMois];
}

export const calculerAge = (date) => {
    const today = new Date();
    const dateNaiss = new Date(date);
    
    const anNaiss = dateNaiss.getFullYear();
    const moisNaiss = dateNaiss.getMonth();
    const jourNaiss = dateNaiss.getDate();

    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    let age = todayYear - anNaiss;

    if (todayMonth < moisNaiss || (todayMonth === moisNaiss && todayDay < jourNaiss)) {
        age--;
    }

    return age;
};