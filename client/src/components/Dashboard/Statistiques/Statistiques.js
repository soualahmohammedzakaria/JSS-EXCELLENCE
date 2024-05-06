const Statistiques = ({ depensesMois, revenuesMois, nouvMembresMois, abonnementsMois }) => {

    const calculatePercentageChange = (currentValue, previousValue) => {
        if (previousValue === 0) return 100;
        return Math.round(((currentValue - previousValue) / previousValue) * 100);
    };

    const getClassName = (percentage, isDepenses) => {
        if (isDepenses) {
            return percentage >= 0 ? 'danger' : 'success'; // Invert class names for depenses
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
                        Compare avec {nouvMembresMois.precedent} le dernier mois
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
                        Compare avec {abonnementsMois.precedent} le dernier mois
                    </p>
                </div>
            </div>
            <div>
                <h3>Revenu des abonnements</h3> 
                <div>
                    <h2>{revenuesMois.actuel} DZD</h2>
                    <h4 className={getClassName(calculatePercentageChange(revenuesMois.actuel, revenuesMois.precedent))}>
                        {calculatePercentageChange(revenuesMois.actuel, revenuesMois.precedent)}%
                    </h4>
                    <p>
                        Compare avec {revenuesMois.precedent} DA le dernier mois
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
                        Compare avec {depensesMois.precedent} DA le dernier mois
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Statistiques;