import React, { useState, useEffect } from "react";
import './DetailsMembre.css';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from 'axios';
import {QRCodeCanvas} from 'qrcode.react';
import html2canvas from 'html2canvas';
import PhotoStandard from '../../assets/images/photoprofilestandard.png';
import JSSLogo from '../../assets/images/logo.png';
import { formatDate, formatAnMois } from "../../utils/datesUtils";

const DetailsMembre = () => {
    const location = useLocation();
    const [disabledBtn, setDisabledBtn] = useState(false); // État pour le bouton désactivé
    const [errorMessage, setErrorMessage] = useState(""); // État pour le message d'erreur
    const [qrErrorMessage, setQRErrorMessage] = useState(""); // État pour le message d'erreur du code QR
    const [membre, setMembre] = useState([]); // État pour les informations du membre
    const [sportsGroupes, setSportsGroupes] = useState([]); // État pour les sports et groupes
    const [selectedSport, setSelectedSport] = useState(null); // État pour le sport sélectionné
    const [selectedGroup, setSelectedGroup] = useState(null); // État pour le groupe sélectionné
    const [groupToDelete, setGroupToDelete] = useState(null); // État pour le groupe à supprimer
    const [showCodeQRModal, setShowCodeQRModal] = useState(false); // État pour le modal du code QR
    const [showDeleteModal, setShowDeleteModal] = useState(false);  // État pour le modal de suppression
    const [showAssignerModal, setShowAssignerModal] = useState(false); // État pour le modal d'assignation

    useEffect(() => { // Fonction pour obtenir les informations du membre et les sports et groupes
        fetchMembre();
        fetchSportsGroupes();
    }, []);

    const fetchMembre = () => { // Fonction pour obtenir les informations du membre
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

    const fetchSportsGroupes = () => { // Fonction pour obtenir les sports et groupes
        axios.get("http://localhost:4000/sport/getAllSportsGroupes")
            .then(response => {
                if (response.data.success) {
                    const defaultSport = response.data.sportsGroupes[0];
                    const defaultGroup = defaultSport.groupes[0];
                    setSelectedSport(defaultSport);
                    setSelectedGroup(defaultGroup);
                    setSportsGroupes(response.data.sportsGroupes);
                }
            })
            .catch(error => {
                console.error('Erreur de l\'obtention des sports et groupes:', error);
            });
    };

    const handleSportChange = (e) => { // Fonction pour gérer le changement de sport
        const sportId = parseInt(e.target.value);
        const selectedSport = sportsGroupes.find(sport => sport.id_sport === sportId);
        setSelectedSport(selectedSport);
        setSelectedGroup(selectedSport.groupes[0]);
    };

    const handleGroupChange = (e) => { // Fonction pour gérer le changement de groupe
        const groupId = parseInt(e.target.value);
        const selectedGroup = selectedSport.groupes.find(group => group.id_groupe === groupId);
        setSelectedGroup(selectedGroup);
    };

    const handleAssignerGroupe = async () => { // Fonction pour assigner un membre à un groupe
        try {
            const response = await axios.post(`http://localhost:4000/member/assignMemberToGroup/${location.state.id}`, { groupId: selectedGroup.id_groupe });
            if(response.data.success){
                setShowAssignerModal(false);
                fetchMembre();
            }else {   
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setErrorMessage("Désolé, une erreur s'est produite!");
        }
    };

    const handleTelechagerQR = async () => { // Fonction pour télécharger le code QR
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

    const handleDeleteMembreGroup = async (id) => { // Fonction pour supprimer un membre du groupe
        setGroupToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDeleteMembre = async () => { // Fonction pour confirmer la suppression du membre du groupe
        try {
            await axios.delete(`http://localhost:4000/member/deleteGroupMember/${location.state.id}`, { data: { groupId: groupToDelete } });
            setShowDeleteModal(false);
            fetchMembre();
        } catch (error) {
            console.error('Erreur lors de la suppression du membre du groupe:', error);
        }
    };

    const handleSendQR = async () => { // Fonction pour envoyer le code QR par email
        setDisabledBtn(true);
        if(membre.email === "" || membre.email === null || !(membre.email.length > 2 && membre.email.includes('@') && membre.email.includes('.')) ){
            setShowCodeQRModal(false);
            setDisabledBtn(false);
            return;
        }else{
            try {
                const response = await axios.post(`http://localhost:4000/member/sendQrCodeByEmail/${location.state.id}`);
                if(response.data.success){
                    setShowCodeQRModal(false);
                }else{
                    setQRErrorMessage(response.data.message);
                }
            } catch (error) {
                console.error('Erreur lors de l\'envoi du code QR:', error);
            }
        }
        setDisabledBtn(false); // Réactiver le bouton de l'envoi
    }

    return (
        <>
            <Navbar/>
            <main>
                <Sidebar currPage="/membres" />
                <div className="top-container">
                    <div className="header">
                        <h1>Profil d'un membre</h1>
                        <button className="btn">
                            <Link to="/membres" className="link">
                                <span className="material-icons-outlined">undo</span>
                            </Link>
                        </button>
                    </div>
                    <div className="details-membre">
                        <div className="infos-membre">
                            <div className="infos-bouttons">
                                <img src={membre.photo !== null ? `http://localhost:4000/images/membres/${membre.photo}.jpeg` : PhotoStandard} alt=""/>
                                <button className="membre-btn pointed">
                                    <Link to="./accomplissements" state={{id: membre.id_membre, path: "/membres/details"}} className="link"><span className="material-icons-outlined">military_tech</span><span>Accomplissements</span></Link>
                                </button>
                                <button className="membre-btn pointed">
                                    <Link to="./paiements" className="link" state={{id: membre.id_membre, email: membre.email, path: "/membres/details"}}><span className="material-icons-outlined">history</span><span>Paiements</span></Link>
                                </button>
                                <button className="membre-btn pointed">
                                    <Link to="./presences" className="link" state={{id: membre.id_membre, path: "/membres/details"}}><span className="material-icons-outlined">check_circle</span><span>Voir présences</span></Link>
                                </button>
                                <button className="membre-btn pointed">
                                    <Link to="./absences" className="link" state={{id: membre.id_membre, path: "/membres/details"}}><span className="material-icons-outlined">cancel</span><span>Voir absences</span></Link>
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
                                        {membre.transaction && membre.transaction.date_abonnement ? (
                                            <p className="info-membre-val">{membre.id_paiement ? formatDate(membre.transaction.date_abonnement) : "-"}</p>
                                        ) : "-"}
                                    </div>
                                    <div className="info-membre">
                                        <h2>Mois d'abonnement</h2>
                                        {membre.transaction && membre.transaction.mois_abonnement ? (
                                            <p className="info-membre-val">{membre.id_paiement ? formatAnMois(membre.transaction.mois_abonnement) : "-"}</p>
                                        ) : "-"}
                                    </div>
                                    <div className="info-membre">
                                        <h2>Montant Payé</h2>
                                        {membre.transaction && membre.transaction.montant_paye ? (
                                            <p className="info-membre-val">{membre.id_paiement ? membre.transaction.montant_paye : "-"} DZD</p>
                                        ) : "-"}
                                    </div>
                                    <div className="info-membre">
                                        <h2>Montant Restant</h2>
                                        <p className={`info-membre-val ${membre.transaction && membre.transaction.montant_restant && membre.transaction.montant_restant > 0 ? "danger" : ""}`}>
                                            {membre.id_paiement ?
                                                (membre.transaction && membre.transaction.montant_restant ? `${membre.transaction.montant_restant} DZD` : "0 DZD")
                                            : "-"
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="membre-groupes-header">
                                <span className="material-icons-outlined">group</span>
                                <h1>Groupes</h1>
                                <button className="link pointed" onClick={() => setShowAssignerModal(true)}><span className="material-icons-outlined">control_point</span><span>Assigner à un groupe</span></button>
                            </div>
                            <div className="membre-groupes">
                                {membre.groupes && membre.groupes.length > 0 && membre.groupes[0].id_groupe !== null ?
                                    membre.groupes.map(groupe => (
                                        <button onClick={() => handleDeleteMembreGroup(groupe.id_groupe)} key={groupe.id_groupe} className="membre-groupe pointed">{groupe.nom_sport} | {groupe.nom_groupe}</button>
                                    ))
                                : <h2>Pas de groupes!</h2>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </main>    
            {showAssignerModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1>Assigner le membre</h1>
                            </div>
                            <div className="filters-body">
                                <div className="filter-options">
                                    <div className="filter-option">
                                        <label>Sport</label>
                                        <select name="sport" value={selectedSport?.id_sport} onChange={handleSportChange}>
                                        {sportsGroupes.map(sport => (
                                            <option key={sport.id_sport} value={sport.id_sport}>
                                                {sport.nom}
                                            </option>
                                        ))}
                                        </select>
                                    </div>
                                    <div className="filter-option">
                                        <label>Groupe</label>
                                        <select name="id_groupe" value={selectedGroup?.id_groupe} onChange={handleGroupChange}>
                                        {selectedSport?.groupes.map(group => (
                                            <option key={group.id_groupe} value={group.id_groupe}>
                                                {group.nom_groupe}
                                            </option>
                                        ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={handleAssignerGroupe} className="btn pointed"><span className="link">Confirmer</span></button>
                            <button onClick={() => { setShowAssignerModal(false); setErrorMessage(""); }} className="btn pointed"><span className="link">Retourner</span></button>
                        </div>
                        {errorMessage && <p style={{ marginTop: "1rem", textAlign: "center" }} className="danger">{errorMessage}</p>}
                    </div>
                </div>
            )}   
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-content">
                            <h3>Etes-vous sûr de vouloir supprimer ce membre du groupe?</h3>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={confirmDeleteMembre} className="btn pointed"><span className="link">Confirmer</span></button>
                            <button onClick={() => {setShowDeleteModal(false); setGroupToDelete(null)}} className="btn pointed"><span className="link">Retourner</span></button>
                        </div>
                    </div>
                </div>
            )} 
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
                        {qrErrorMessage && <p style={{ marginTop: "1rem", textAlign: "center" }} className="danger">{qrErrorMessage}</p>}
                        <div className="modal-buttons">
                            <button onClick={() => handleTelechagerQR()} className="btn pointed"><span className="link"><span className="material-icons-sharp">download</span></span></button>
                            <button onClick={() => handleSendQR()} className="btn pointed" disabled={disabledBtn}><span className="link"><span className="material-icons-outlined">email</span></span></button>
                            <button onClick={() => setShowCodeQRModal(false)} className="btn pointed"><span className="link"><span className="material-icons-outlined">undo</span></span></button>
                        </div>
                    </div>
                </div>
            )}           
        </>
    )
}

export default DetailsMembre;