import React from 'react';
import Animator from 'lottie-react';
import Check from '../../assets/animated/Check.json';
import Cross from '../../assets/animated/Cross.json';
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { useLocation, useNavigate } from 'react-router-dom';

function ResultatSignalement() {
    const location = useLocation();

    return (
        console.log(location.state),
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
                            <div style={{height: "200px", width: "200px"}} className="">
                                <Animator animationData={Check} loop/>
                                <p className="resultat">Le signalement de l'entrée a été effectué avec succès</p>
                            </div>
                        ) : (
                            <div style={{height: "200px", width: "200px"}} className="">
                                <Animator animationData={Check} loop/>
                                <p>Le signalement de l'entrée n'a pas pu être effectué</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>       
        </>
    )
}

export default ResultatSignalement
