import React, { useState } from "react";
import { BrowserRouter, useHistory } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import Searchbar from "../../components/general/Searchbar/Searchbar";
import QRCode from '../../assets/images/QRCode.png';
import './Assiduite.css';
import useScanDetection from "use-scan-detection";
import { Link } from "react-router-dom";
import PhotoStandard from '../../assets/images/photoprofile.png';

const Assiduite = () => {
    const [QRcodeScan, setQRcodeScan] = useState("ucun Code QR scanné");
    const [groupeSelectionne, setGroupeSelectionne] = useState(null);
     // Fonction pour gérer la sélection d'un groupe
    
    const handleSelectGroupe = (id) => {
        // Si le groupe actuellement sélectionné est le même que celui cliqué, le désélectionner
        if (groupeSelectionne === id) {
            setGroupeSelectionne(null);
        } else {
            // Sinon, sélectionner le groupe cliqué
            setGroupeSelectionne(id);
        }
    };

    useScanDetection({
        onComplete : setQRcodeScan,
        minlength: 3,
    })
        
    

    return (
        <>
            <Navbar />
            <main>
                <Sidebar currPage="/assiduite" />
                <div className="top-container">
                    <div className="header">
                        <h1>Assiduite</h1>
                    </div>
                    
                    <div>
                        { QRcodeScan == "Aucun Code QR scanné" ? (
                            <div className="qr-page">
                                <h2 className="qr-title">Scannez votre code QR </h2>
                                <img src={QRCode} alt="QRCode" className="QRCode" /> 
                                <p>Barcode : {QRcodeScan} </p>
                            </div>
                        ) : (
                            <div className="details-membre">
                                <div className="infos-membre">
                                    <div className="infos-bouttons">
                                        <img src={PhotoStandard} alt=""/>
                                        
                                    </div>
                                    <div>
                                        <div className="infos-groupe">
                                            <h1>Informations personnelles</h1>
                                            <div className="info-membre">
                                                <h2>Nom</h2>
                                                <p className="info-membre-val">SOUALAH MOHAMMED</p>
                                            </div>
                                            <div className="info-membre">
                                                <h2>Prénom</h2>
                                                <p className="info-membre-val">Zakaria</p>
                                            </div>
                                            <div className="info-membre">
                                                <h2>Date de naissance</h2>
                                                <p className="info-membre-val">18/09/2005</p>
                                            </div>
                                            <div className="info-membre">
                                                <h2>Sexe</h2>
                                                <p className="info-membre-val">Homme</p>
                                            </div>
                                        </div>
                                        <div className="infos-groupe">
                                            <h1>Informations de paiement</h1>
                                            <div className="info-membre">
                                                <h2>Etat de l'abonnement</h2>
                                                <p className="info-membre-val success">Payé</p>
                                            </div>
                                            <div className="info-membre">
                                                <h2>Date d'abonnement</h2>
                                                <p className="info-membre-val">18/03/2024</p>
                                            </div>
                                            <div className="info-membre">
                                                <h2>Montant Payé</h2>
                                                <p className="info-membre-val">2500 DZD</p>
                                            </div>
                                            <div className="info-membre">
                                                <h2>Montant Restant</h2>
                                                <p className="info-membre-val danger">500 DZD</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="infos-groupe">
                                            <h1>Informations de contact</h1>
                                            <div className="info-membre">
                                                <h2>Télephone</h2>
                                                <p className="info-membre-val">0715234102</p>
                                            </div>
                                            <div className="info-membre">
                                                <h2>Email</h2>
                                                <p className="info-membre-val">mz_soualahmohammed@esi.dz</p>
                                            </div>
                                        </div>
                                        <div className="infos-groupe">
                                            <h1>Dossier medical</h1>
                                            <div className="info-membre">
                                                <h2>Age</h2>
                                                <p className="info-membre-val">18 ans</p>
                                            </div>
                                            <div className="info-membre">
                                                <h2>Poids</h2>
                                                <p className="info-membre-val">89 kg</p>
                                            </div>
                                            <div className="info-membre">
                                                <h2>Groupe sanguin</h2>
                                                <p className="info-membre-val">O+</p>
                                            </div>
                                            <div className="info-membre">
                                                <h2>Taille</h2>
                                                <p className="info-membre-val">183 cm</p>
                                            </div>
                                            <div className="info-membre">
                                                <h2>Maladies</h2>
                                                <button className="btn pointed"><span className="link">Voir maladies</span></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h1>Groupes</h1>
                                    <div className="membre-groupes">
                                    <button className={`membre-groupe ${groupeSelectionne === 1 ? 'selected' : ''}`} onClick={() => handleSelectGroupe(1)}>
                                            <div>Judo | Judo U17</div>
                                        </button>

                                        <button className={`membre-groupe ${groupeSelectionne === 2 ? 'selected' : ''}`} onClick={() => handleSelectGroupe(2)}>
                                            <div>Karate | Karate Junior</div>
                                        </button>
                                        <button className={`membre-groupe ${groupeSelectionne === 3 ? 'selected' : ''}`} onClick={() => handleSelectGroupe(3)}>
                                            <div>Judo | Judo U17</div>
                                        </button>
                                        <button className={`membre-groupe ${groupeSelectionne === 4 ? 'selected' : ''}`} onClick={() => handleSelectGroupe(4)}>
                                            <div>Karate | Karate Junior</div>
                                        </button>
                                        <button className={`membre-groupe ${groupeSelectionne === 5 ? 'selected' : ''}`} onClick={() => handleSelectGroupe(5)}>
                                            <div>Judo | Judo U17</div>
                                        </button>
                                        <button className={`membre-groupe ${groupeSelectionne === 6 ? 'selected' : ''}`} onClick={() => handleSelectGroupe(6)}>
                                            <div>Karate | Karate Junior</div>
                                        </button>
                                        <button className={`membre-groupe ${groupeSelectionne === 7 ? 'selected' : ''}`} onClick={() => handleSelectGroupe(7)}>
                                            <div>Judo | Judo U17</div>
                                        </button>
                                       <p>groupe : {groupeSelectionne}</p>
                                        {/* Ajoutez d'autres boutons de groupe ici */}
                                    </div>
                                </div>
                               
                               
                                        
                                    <div className="bottom-buttons"> 
                                        <button className={`membre-btn pointed ${!groupeSelectionne ? 'disabled' : ''}`} disabled={!groupeSelectionne}>
                                            <Link to="/membres/details/presences" className="link"><span className="material-icons-outlined">check_circle</span><span>Signaler la présence</span></Link>
                                        </button>
                                        <button className="membre-btn">
                                            <Link to="/membres/details/absences" className="link"><span className="material-icons-outlined">undo</span><span>Retour</span></Link>
                                        </button>
                                    </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    )
}

export default Assiduite;

