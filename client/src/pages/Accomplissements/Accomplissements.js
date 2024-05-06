import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { useLocation } from 'react-router-dom';
import { formatDate } from "../../utils/datesUtils";
import axios from 'axios';

function Accomplissements() {
    const location = useLocation();
    const [accomplissements, setAccomplissements] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [accomplissementIdToDelete, setAccomplissementIdToDelete] = useState(null);

    useEffect(() => {
        fetchAccomplissements();
    }, []);

    const fetchAccomplissements = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/achievement/getAchievements/${location.state.id}`);
            if (response.data.success) {
                setAccomplissements(response.data.achievements);
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.error('Erreur de récupération des accomplissements:', error);
            setErrorMessage("Désolé, une erreur s'est produite lors de la récupération des accomplissements.");
        }
    };

    const handleDeleteAccomplissement = (id) => {
        setAccomplissementIdToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDeleteAccomplissement = async () => {
        try {
            const response = await axios.delete(`http://localhost:4000/achievement/deleteAchievement/${accomplissementIdToDelete}`);
            if (response.data.success) {
                setShowDeleteModal(false);
                fetchAccomplissements();
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'accomplissement:', error);
            setErrorMessage("Désolé, une erreur s'est produite lors de la suppression de l'accomplissement.");
        }
    };

    return (
        <>
            <Navbar/>
            <main>
                <Sidebar currPage="/membres" />
                <div className="top-container">
                    <div className="header">
                        <h1>Accomplissements d'un membre</h1>
                        <div>
                            <button className="btn" style={{ marginRight: "0.5rem" }}>
                                <Link to="./ajouter" state={{id: location.state.id, path: location.state.path}} className="link">
                                    <span className="material-icons-outlined">add</span>
                                </Link>
                            </button>
                            <button className="btn">
                                <Link to={location.state.path} className="link" state={{id: location.state.id, path: location.state.path}}>
                                    <span className="material-icons-outlined">undo</span>
                                </Link>
                            </button>
                        </div>
                    </div>
                    <div className="scroll-form">
                    {accomplissements && accomplissements.length > 0 ? (
                        accomplissements.map((accomplissement, index) => (
                            <div style={{margin: "1em 2rem"}} className="infos-groupe" key={index}>
                                <div className="header">
                                    <h1>{accomplissement.nom_evenement}</h1>
                                    <div>
                                        <button className="btn" style={{ marginRight: "0.5rem" }}>
                                            <Link to="./modifier" className="link" state={{id_accomplissement: accomplissement.id_accomp, nom_evenement: accomplissement.nom_evenement, discipline: accomplissement.discipline, date_evenement: accomplissement.date_evenement, palmares: accomplissement.palmares, id: location.state.id, path: location.state.path}}>
                                                <span className="material-icons-outlined">edit</span>
                                            </Link>
                                        </button>
                                        <button className="btn" onClick={() => handleDeleteAccomplissement(accomplissement.id_accomp)}>
                                            <span className="link pointed"><span className="material-icons-outlined">delete</span></span>
                                        </button>
                                    </div>
                                </div>
                                <div className="info-membre">
                                    <h2>Discipline</h2>
                                    <p style={{marginTop: "0"}}className="info-membre-val">{accomplissement.discipline}</p>
                                </div>    
                                <div className="info-membre">
                                    <h2>Date de l'événement</h2>
                                    <p style={{marginTop: "0"}} className="info-membre-val">{formatDate(accomplissement.date_evenement)}</p>
                                </div>
                                <div className="info-membre">
                                    <h2>Palmares</h2>
                                    <p style={{marginTop: "0"}} className="info-membre-val">{accomplissement.palmares}</p>
                                </div>            
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: "center" }}>
                            {errorMessage ? <p className="danger" style={{marginTop: "5rem"}}>{errorMessage}</p> : <p className="info-membre-val">Aucun accomplissement trouvé!</p>}
                        </div>
                    )}
                    </div>
                </div>
            </main>
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-content">
                            <h3>Êtes-vous sûr de vouloir supprimer cet accomplissement?</h3>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={confirmDeleteAccomplissement} className="btn pointed"><span className="link">Confirmer</span></button>
                            <button onClick={() => setShowDeleteModal(false)} className="btn pointed"><span className="link">Retourner</span></button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Accomplissements;