import React, { useState, useEffect } from "react";
import '../DetailsMembre/DetailsMembre.css';
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from 'axios';
import {QRCodeCanvas} from 'qrcode.react';
import html2canvas from 'html2canvas';
import JSSLogo from '../../assets/images/logo.png';
import PhotoStandard from '../../assets/images/photoprofile.png';
import { formatDate, formatAnMois } from "../../utils/datesUtils";

const DetailsMembre = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [membre, setMembre] = useState([]);
    const [selGroupe, setSelGroupe] = useState(null);
    const [showCodeQRModal, setShowCodeQRModal] = useState(false);

    useEffect(() => {
        fetchMembre();
    }, []);

    const fetchMembre = () => {
        axios.get(`http://localhost:4000/member/getMember/${location.state.id}`)
            .then(response => {
                if(response.data.success){
                    setMembre(response.data.member);
                }
            })
            .catch(error => {
                console.error('Erreur de l\'obtention du membre:', error);
            });
    };

    const handleTelechagerQR = async () => {
        const canvas = await (
            await html2canvas(document.getElementById('canvas'))
        ).toDataURL();
        if(canvas){
            const telecharg = document.createElement('a');
            telecharg.download = `QR_${membre.nom}_${membre.prenom}.png`;
            telecharg.href = canvas;
            document.body.appendChild(telecharg);
            telecharg.click();
            document.body.removeChild(telecharg);
        }
    };

    const handleSendQR = async () => {
        if(membre.email === "" && membre.email === null){
            setShowCodeQRModal(false);
            return;
        }else{
            try {
                const response = await axios.post(`http://localhost:4000/member/sendQrCodeByEmail/${location.state.id}`);
                if(response.data.success){
                    setShowCodeQRModal(false);
                }
            } catch (error) {
                console.error('Erreur lors de l\'envoi du code QR:', error);
            }
        }
    };

    const handleGroupe = (id) => {
        if (selGroupe === id) {
            setSelGroupe(null);
            return;
        }
        setSelGroupe(id);
    };

    const handleEntree = () => {
        if (selGroupe === null) return;
        axios.post(`http://localhost:4000/attendance/memberEntry`, { id_membre: location.state.id, id_groupe: selGroupe})
            .then(response => {
                navigate("/assiduite/resultat", {state: {reponse: response.data, type: "Entrée"}});
            })
            .catch(error => {
                console.error('Erreur de signalisation de l\'entrée:', error);
            });
    };

    const handleSortie = () => {
        if (selGroupe === null) return;
        axios.post(`http://localhost:4000/attendance/memberExit`, { id_membre: location.state.id, id_groupe: selGroupe})
            .then(response => {
                navigate("/assiduite/resultat", {state: {reponse: response.data, type: "Sortie"}});
            })
            .catch(error => {
                console.error('Erreur de signalisation de la sortie:', error);
            });
    };

    return (
        <>
            <Navbar/>
            <main>
                <Sidebar currPage="/assiduite" />
                <div className="top-container">
                    <div className="header">
                        <h1>Profil du membre</h1>
                        <button className="btn">
                            <Link to="/assiduite" className="link">
                                <span className="material-icons-outlined">undo</span>
                            </Link>
                        </button>
                    </div>
                    <div className="details-membre scroll-form">
                    <div className="infos-membre">
                            <div className="infos-bouttons">
                                <img src={PhotoStandard} alt=""/>
                                <button className="membre-btn pointed">
                                    <Link to="/membres/details/accomplissements" state={{id: membre.id_membre, path: "/assiduite/details"}} className="link"><span className="material-icons-outlined">military_tech</span><span>Accomplissements</span></Link>
                                </button>
                                <button className="membre-btn pointed">
                                    <Link to="/membres/details/paiements" className="link" state={{id: membre.id_membre, email: membre.email, path: "/assiduite/details"}}><span className="material-icons-outlined">history</span><span>Paiements</span></Link>
                                </button>
                                <button className="membre-btn pointed">
                                    <Link to="/membres/details/presences" className="link" state={{id: membre.id_membre, path: "/assiduite/details"}}><span className="material-icons-outlined">check_circle</span><span>Voir présences</span></Link>
                                </button>
                                <button className="membre-btn pointed">
                                    <Link to="/membres/details/absences" className="link" state={{id: membre.id_membre, path: "/assiduite/details"}}><span className="material-icons-outlined">cancel</span><span>Voir absences</span></Link>
                                </button>
                                <button className="membre-btn pointed" onClick={() => setShowCodeQRModal(true)}>
                                    <span className="link"><span className="material-icons-outlined">qr_code_scanner</span><span>Code QR</span></span>
                                </button>
                            </div>
                            <div>
                                <div className="infos-groupe">
                                    <h1>Informations personnelles</h1>
                                    <div className="info-membre">
                                        <h2>Nom</h2>
                                        <p className="info-membre-val">{membre.nom}</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Prénom</h2>
                                        <p className="info-membre-val">{membre.prenom}</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Date de naissance</h2>
                                        {membre.date_naissance && (
                                            <p className="info-membre-val">{formatDate(membre.date_naissance)}</p>
                                        )}
                                    </div>
                                    <div className="info-membre">
                                        <h2>Sexe</h2>
                                        <p className="info-membre-val">{membre.sexe}</p>
                                    </div>
                                </div>
                                <div className="infos-groupe">
                                    <h1>Dossier medical</h1>
                                    <div className="info-membre">
                                        <h2>Poids</h2>
                                        <p className="info-membre-val">{membre.poids} kg</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Groupe sanguin</h2>
                                        <p className="info-membre-val">{membre.groupe_sanguin}</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Taille</h2>
                                        <p className="info-membre-val">{membre.taille} cm</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Maladies</h2>
                                        <p className="info-membre-val">{membre.maladies && membre.maladies.length > 2 ? membre.maladies : "Pas de maladies!"}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="infos-groupe">
                                    <h1>Informations de contact</h1>
                                    <div className="info-membre">
                                        <h2>Télephone</h2>
                                        <p className="info-membre-val">{membre.telephone}</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Email</h2>
                                        <p className="info-membre-val">{membre.email !== null && membre.email !== "" ? membre.email : "Pas d'adresse!"}</p>
                                    </div>
                                </div>
                                <div className="infos-groupe">
                                    <h1>Informations de paiement</h1>
                                    <div className="info-membre">
                                        <h2>Date d'inscription</h2>
                                        {membre.date_inscription && (
                                            <p className="info-membre-val">{formatDate(membre.date_inscription)}</p>
                                        )}
                                    </div>
                                    <div className="info-membre">
                                        <h2>Etat de l'abonnement</h2>
                                        <p className={`info-membre-val ${membre.etat_abonnement === "Payé" ? "success" : "danger"}`}>{membre.etat_abonnement}</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Date d'abonnement</h2>
                                        {membre.transaction && membre.transaction.date_abonnement && (
                                            <p className="info-membre-val">{formatDate(membre.transaction.date_abonnement)}</p>
                                        )}
                                    </div>
                                    <div className="info-membre">
                                        <h2>Mois d'abonnement</h2>
                                        {membre.transaction && membre.transaction.mois_abonnement && (
                                            <p className="info-membre-val">{formatAnMois(membre.transaction.mois_abonnement)}</p>
                                        )}
                                    </div>
                                    <div className="info-membre">
                                        <h2>Montant Payé</h2>
                                        {membre.transaction && membre.transaction.montant_paye && (
                                            <p className="info-membre-val">{membre.transaction.montant_paye} DZD</p>
                                        )}
                                    </div>
                                    <div className="info-membre">
                                        <h2>Montant Restant</h2>
                                        <p className={`info-membre-val ${membre.transaction && membre.transaction.montant_restant && membre.transaction.montant_restant > 0 ? "danger" : ""}`}>
                                            {membre.transaction && membre.transaction.montant_restant ? `${membre.transaction.montant_restant} DZD` : "0 DZD"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="membre-groupes-header">
                                <span className="material-icons-outlined">group</span>
                                <h1>Groupes</h1>
                            </div>
                            <div className="membre-groupes">
                                {membre.groupes &&
                                    membre.groupes.map(groupe => (
                                        <button
                                            onClick={() => handleGroupe(groupe.id_groupe)}
                                            key={groupe.id_groupe}
                                            className={`${selGroupe === groupe.id_groupe ? " pointed selected-groupe" : "membre-groupe pointed"}`}
                                        >
                                            {groupe.nom_sport} | {groupe.nom_groupe}
                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="assiduite-bouttons">
                            <button className={selGroupe === null ? "disabled-assiduite-btn pointed" : "assiduite-btn pointed"} disabled={selGroupe === null} onClick={handleEntree}>
                                <span className="material-icons-outlined">login</span>
                                <span>Signaler entrée</span>
                            </button>
                            <button className={selGroupe === null ? "disabled-assiduite-btn pointed" : "assiduite-btn pointed"} disabled={selGroupe === null} onClick={handleSortie}>
                                <span className="material-icons-outlined">logout</span>
                                <span>Signaler sortie</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>    
            {showCodeQRModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Code QR du membre</h3>
                        </div>
                        <div className="modal-content" id="canvas" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <QRCodeCanvas
                            value={`${membre.nom}_${membre.prenom}_${membre.id_membre}`}
                            size={300}
                            bgColor={"#ffffff"}
                            fgColor={"#000000"}
                            level={"H"}
                            includeMargin={false}
                            imageSettings={{
                                src: JSSLogo,
                                x: undefined,
                                y: undefined,
                                height: 40,
                                width: 40,
                                excavate: true,
                            }}
                        />
                        </div>
                        <div className="modal-buttons">
                            <button onClick={() => handleTelechagerQR()} className="btn pointed"><span className="link"><span className="material-icons-sharp">download</span></span></button>
                            <button onClick={() => handleSendQR()} className="btn pointed"><span className="link"><span className="material-icons-outlined">email</span></span></button>
                            <button onClick={() => setShowCodeQRModal(false)} className="btn pointed"><span className="link"><span className="material-icons-outlined">undo</span></span></button>
                        </div>
                    </div>
                </div>
            )}    
        </>
    )
}

export default DetailsMembre;