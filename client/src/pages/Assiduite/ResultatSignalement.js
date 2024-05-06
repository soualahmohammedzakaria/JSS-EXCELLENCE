import React from 'react';
import Animator from 'lottie-react';
import Check from '../../assets/animated/Check.json';
import Cross from '../../assets/animated/Cross.json';
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { Link, useLocation } from 'react-router-dom';

function ResultatSignalement() {
    const location = useLocation();

    return (
        <>
            <Navbar/>
            <main>
                <Sidebar currPage="/assiduite" />
                <div className="top-container">
                    <div className="header">
                        <h1>Assiduité</h1>
                    </div>
                    <div className="resultat-container">
                        {location.state.reponse.success ? (
                            <div className="resultat-assiduite">
                                <Animator animationData={Check} loop/>
                                {location.state.type === `Entrée` ? (
                                    <h2>Le signalement de l'entrée a été effectué avec succès</h2>
                                ) : (
                                    <h2>Le signalement de la sortie a été effectué avec succès</h2>
                                )}
                            </div>
                        ) : (
                            <div className="resultat-assiduite">
                                <Animator animationData={Cross} loop/>
                                {location.state.type === `Entrée` ? (
                                    <h2>Pas de creneau pour le groupe sélectionné!</h2>
                                ) : (
                                    <h2>Pas de creneau pour le groupe sélectionné!</h2>
                                )}
                            </div>
                        )}
                        <div className="revenir-boutton">    
                            <button className="revenir-btn btn pointed">
                                <Link to="/assiduite" className="link">
                                    <span className="material-icons-sharp">undo</span>
                                    <span>Retour</span>
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>
            </main>       
        </>
    )
}

export default ResultatSignalement
