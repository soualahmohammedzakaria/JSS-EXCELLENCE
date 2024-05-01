
const formatMois = (date) => {
    const [an, month] = date.split("-");
    const mois = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    const nomMois = mois[parseInt(month) - 1];
    return `${nomMois} ${an}`;
};

module.exports = {
    formatMois
};