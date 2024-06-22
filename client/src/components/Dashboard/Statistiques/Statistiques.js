const Statistiques = ({ depensesMois, revenuesMois, nouvMembresMois, abonnementsMois }) => {

    // Fonction pour calculer le pourcentage de changement
    const calculatePercentageChange = (currentValue, previousValue) => {
        if (previousValue === 0) return 100;
        return Math.round(((currentValue - previousValue) / previousValue) * 100);
    };

    // Fonction pour obtenir la classe CSS en fonction du pourcentage
    const getClassName = (percentage, isDepenses) => {
        if (isDepenses) {
            return percentage >= 0 ? 'danger' : 'success';
        }
        return percentage >= 0 ? 'success' : 'danger';
    };

    return (
        <div className="stats">
            <div>
                <h3>Nouveaux membres</h3>
                <div>
                    <h2>{nouvMembresMois.actuel}</h2>
                    <h4 className={getClassName(calculatePercentageChange(nouvMembresMois.actuel, nouvMembresMois.precedent))}>
                        {calculatePercentageChange(nouvMembresMois.actuel, nouvMembresMois.precedent)}%
                    </h4>
                    <p>
                        Comparé à {nouvMembresMois.precedent} le dernier mois
                    </p>
                </div>
            </div>    
            <div>
                <h3>Abonnements</h3>
                <div>
                    <h2>{abonnementsMois.actuel}</h2>
                    <h4 className={getClassName(calculatePercentageChange(abonnementsMois.actuel, abonnementsMois.precedent))}>
                        {calculatePercentageChange(abonnementsMois.actuel, abonnementsMois.precedent)}%
                    </h4>
                    <p>
                        Comparé à {abonnementsMois.precedent} le dernier mois
                    </p>
                </div>
            </div>
            <div>
                <h3>Revenus des abonnements</h3> 
                <div>
                    <h2>{revenuesMois.actuel} DZD</h2>
                    <h4 className={getClassName(calculatePercentageChange(revenuesMois.actuel, revenuesMois.precedent))}>
                        {calculatePercentageChange(revenuesMois.actuel, revenuesMois.precedent)}%
                    </h4>
                    <p>
                        Comparé à {revenuesMois.precedent} DA le dernier mois
                    </p>
                </div>
            </div>   
            <div>
                <h3>Dépenses</h3>
                <div>
                    <h2>{depensesMois.actuel} DZD</h2>
                    <h4 className={getClassName(calculatePercentageChange(depensesMois.actuel, depensesMois.precedent), true)}>
                        {calculatePercentageChange(depensesMois.actuel, depensesMois.precedent)}%
                    </h4>
                    <p>
                        Comparé à {depensesMois.precedent} DA le dernier mois
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Statistiques;