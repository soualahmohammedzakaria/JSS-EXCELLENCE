import React from "react";
import './Statistiques.css';

const Chiffres = () => {
    return (
        <div className="stats">
            <div className="chiffre">
                <h3><span className="material-icons-sharp">group</span> Membres</h3> 
                <h2>245</h2>
            </div>
            <div className="chiffre">
                <h3><span className="material-icons-sharp">card_membership</span> Abonnements</h3> 
                <h2>243</h2>
            </div>
            <div className="chiffre">
                <h3><span className="material-icons-sharp">group</span> Membres</h3> 
                <h2>245</h2>
            </div>
            <div className="chiffre">
                <h3><span className="material-icons-sharp">card_membership</span> Abonnements</h3> 
                <h2>243</h2>
            </div>
        </div>
    )
}

export default Chiffres