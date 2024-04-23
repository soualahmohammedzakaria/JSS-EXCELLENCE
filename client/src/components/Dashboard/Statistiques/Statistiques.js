import React from "react";
import './Statistiques.css';

const Statistiques = () => {
    return (
        <div className="stats">
            <div>
                <h3>Dépenses</h3> 
                <div>
                    <h2>10250 DZD</h2>
                    <h4 className="success">+2.5%</h4>
                    <p>Compare avec 10000 DA le dernier mois</p>
                </div>
            </div>
            <div>
                <h3>Revenu des abonnements</h3> 
                <div>
                    <h2>25000 DZD</h2>
                    <h4 className="danger">-6%</h4>
                    <p>Compare avec 27500 DA le dernier mois</p>
                </div>
            </div>
            <div>
                <h3>Nouveaux membres</h3> 
                <div>
                    <h2>16</h2>
                    <h4 className="success">+2.5%</h4>
                    <p>Compare avec 14 le dernier mois</p>
                </div>
            </div>
            <div>
                <h3>Dépenses</h3> 
                <div>
                    <h2>10250 DZD</h2>
                    <h4 className="danger">-1%</h4>
                    <p>Compare avec 10000 DA le dernier mois</p>
                </div>
            </div>
        </div>
    )
}

export default Statistiques