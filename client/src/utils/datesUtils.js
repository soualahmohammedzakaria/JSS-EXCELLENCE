export const formatDate = (date) => {
    return date.split("-").reverse().join("/");
}

export const formatDateHeure = (date) => {
    return new Date(date).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
}

export const formatAnMois = (date) => {
    const [an, month] = date.split("-");
    const mois = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    const nomMois = mois[parseInt(month) - 1];
    return `${nomMois} ${an}`;
}

export const formatMois = (date) => {
    return date < 10 ? `0${date}` : date
}

export const extraireMois = (date) => {
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