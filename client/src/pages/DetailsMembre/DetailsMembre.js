import React, { useState, useEffect } from "react";
import './DetailsMembre.css';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from 'axios';
import PhotoStandard from '../../assets/images/photoprofile.png';
import { formatDate, calculerAge } from "../../utils/datesUtils";

const DetailsMembre = () => {
    const location = useLocation();
    const [errorMessage, setErrorMessage] = useState("");
    const [membre, setMembre] = useState([]);
    const [sportsGroupes, setSportsGroupes] = useState([]);
    const [selectedSport, setSelectedSport] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupToDelete, setGroupToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAssignerModal, setShowAssignerModal] = useState(false);

    useEffect(() => {
        fetchMembre();
        fetchSportsGroupes();
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

    const fetchSportsGroupes = () => {
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

    const handleSportChange = (e) => {
        const sportId = parseInt(e.target.value);
        const selectedSport = sportsGroupes.find(sport => sport.id_sport === sportId);
        setSelectedSport(selectedSport);
        setSelectedGroup(selectedSport.groupes[0]);
    };

    const handleGroupChange = (e) => {
        const groupId = parseInt(e.target.value);
        const selectedGroup = selectedSport.groupes.find(group => group.id_groupe === groupId);
        setSelectedGroup(selectedGroup);
    };

    const handleAssignerGroupe = async () => {
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

    const handleDeleteMembreGroup = async (id) => {
        setGroupToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDeleteMembre = async () => {
        console.log('Groupe à supprimer:', groupToDelete);
        try {
            const response = await axios.delete(`http://localhost:4000/member/deleteGroupMember/${location.state.id}`, { data: { groupId: groupToDelete } });

            setShowDeleteModal(false);
            fetchMembre();
            console.log(response.data.success + " " + response.data.message);
        } catch (error) {
            console.error('Erreur lors de la suppression du membre du groupe:', error);
        }
    };

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
                                <img src={PhotoStandard} alt=""/>
                                <button className="membre-btn pointed">
                                    <Link to="/membres/modifier" className="link"><span className="material-icons-outlined">edit</span><span>Modifier profil</span></Link>
                                </button>
                                <button className="membre-btn pointed">
                                    <Link to="/membres/details/accomplissements" state={{id: membre.id_membre}} className="link"><span className="material-icons-outlined">military_tech</span><span>Accomplissements</span></Link>
                                </button>
                                <button className="membre-btn pointed">
                                    <Link to="/membres/details/presences" className="link"><span className="material-icons-outlined">check_circle</span><span>Voir présences</span></Link>
                                </button>
                                <button className="membre-btn pointed">
                                    <Link to="/membres/details/absences" className="link"><span className="material-icons-outlined">cancel</span><span>Voir absences</span></Link>
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
                                    <h1>Informations de paiement</h1>
                                    <div className="info-membre">
                                        <h2>Date d'inscription</h2>
                                        {membre.date_naissance && (
                                            <p className="info-membre-val">{formatDate(membre.date_inscription)}</p>
                                        )}
                                    </div>
                                    <div className="info-membre">
                                        <h2>Etat de l'abonnement</h2>
                                        <p className={`info-membre-val ${new Date(membre.date_inscription) > new Date() ? "success" : "danger"}`}>{new Date(membre.date_inscription) > new Date() ? "Payé" : "Non payé"}</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Date d'abonnement</h2>
                                        {membre.date_naissance && (
                                            <p className="info-membre-val">{formatDate(membre.date_inscription)}</p>
                                        )}
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
                                        <p className="info-membre-val">{calculerAge(membre.date_naissance)} ans</p>
                                    </div>
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
                                        <p className="info-membre-val">Pas de maladies!</p>
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
                                {membre.groupes &&
                                    membre.groupes.map(groupe => (
                                        <button onClick={() => handleDeleteMembreGroup(groupe.id_groupe)} key={groupe.id_groupe} className="membre-groupe pointed">{groupe.nom_groupe}</button>
                                    ))
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
        </>
    )
}

export default DetailsMembre;