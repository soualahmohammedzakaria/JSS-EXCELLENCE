import React from "react";
import './Statistiques.css';

const Chiffres = ( { chiffres } ) => {
    return (
        <div className="stats">
            <div className="chiffre">
                <h3><span className="material-icons-sharp">group</span> Membres</h3> 
                <h2>{chiffres.totalMembres}</h2>
            </div>
            <div className="chiffre">
                <h3><span className="material-icons-sharp">card_membership</span> Abonnements</h3> 
                <h2>{chiffres.totalAbonnements}</h2>
            </div>
            <div className="chiffre">
                <h3><span className="material-icons-sharp">sports</span> Coachs</h3> 
                <h2>{chiffres.totalCoachs}</h2>
            </div>
            <div className="chiffre">
                <h3><span className="material-icons-sharp">fitness_center</span> Equipements</h3> 
                <h2>{chiffres.totalEquipements}</h2>
            </div>
        </div>
    )
}

export default Chiffres