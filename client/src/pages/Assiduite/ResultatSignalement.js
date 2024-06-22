import React from 'react';
import Animator from 'lottie-react';
import Check from '../../assets/animated/Check.json';
import Cross from '../../assets/animated/Cross.json';
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { Link, useLocation } from 'react-router-dom';

function ResultatSignalement() {
    const location = useLocation(); // Pour récupérer les données passées en paramètres lors de la navigation

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
                        <div className="resultat-assiduite">
                            {location.state.reponse.success ? (
                                <Animator animationData={Check} loop/>
                            ) : (
                                <Animator animationData={Cross} loop/>
                            )}
                            <h2>{location.state.reponse.message}</h2>
                        </div>
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
