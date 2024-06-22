import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from "axios";
import { formatDate } from "../../utils/datesUtils";
import { useParamsContext } from '../../hooks/paramsContext/ParamsContext';

const Absences = () => {
    const { paramsData } = useParamsContext(); // Récupérer les paramètres de l'application
    const location = useLocation(); // Récupérer les données de la page précédente
    const [absences, setAbsences] = useState([]); // Les absences du membre
    const [supprimerModal, setSupprimerModal] = useState(false); // Modal pour la suppression
    const [justificationModal, setJustificationModal] = useState(false); // Modal pour la justification
    const [justification, setJustification] = useState(""); // La justification de l'absence
    const [idASupprime, setIdASupprime] = useState(null); // L'id de l'absence à supprimer
    const [currInd, setCurrInd] = useState(1); // L'indice de la page courante

    useEffect(() => {
        // Récupérer les absences du membre
        fetchAbsences();
    }, []);

    // Récupérer les absences du membre
    const fetchAbsences = () => {
        axios
            .get(`http://localhost:4000/attendance/getAbsencesMember/${location.state.id}`)
            .then((response) => {
                if (response.data.success) {
                    const fetchedAbsences = response.data.absences || [];
                    fetchedAbsences.sort((a, b) => { return new Date(b.date_entree) - new Date(a.date_sortie); });
                    setAbsences(fetchedAbsences);
                }
            })
            .catch((error) => {
                console.error("Erreur de l'obtention des absences:", error);
            });
    };

    const nbItems = paramsData.petites_tables || 7; // Nombre d'éléments par page
    const nbPages = Math.ceil(absences.length / nbItems); // Nombre de pages

    const debInd = Math.max((currInd - 1) * nbItems, 0); // Index de début
    const finInd = Math.min(debInd + nbItems, absences.length); // Index de fin

    const absencesParPage = absences.slice(debInd, finInd); // Les absences de la page courante

    const handleSupprimerAbsence = (id) => {
        // Mettre à jour l'id de l'absence à supprimer
        setIdASupprime(id);
        // Afficher la modal de suppression
        setSupprimerModal(true);
    };

    // Confirmer la suppression de l'absence
    const confirmerSupprimerAbsence = async () => {
        try {
            await axios.delete(`http://localhost:4000/attendance/deleteAbsenceMember/${idASupprime}`);
            setSupprimerModal(false);
            fetchAbsences();
            setCurrInd(1);
        } catch (error) {
            console.error("Erreur lors de la suppression de la présences:", error);
        }
    };

    // Changer la page courante
    const handlePageChange = (newInd) => {
        if (newInd >= 1 && newInd <= nbPages) {
            setCurrInd(newInd);
        }
    };

    // Afficher la justification de l'absence
    const handleJustification = (justification) => {
        setJustificationModal(true);
        setJustification(justification);
    };

    return (
        <>
            <Navbar />
            <main>
                <Sidebar currPage="/membres" />
                <div className="top-container">
                    <div className="header">
                        <h1>Absences d'un membre</h1>
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
                    <div>
                        {absencesParPage.length === 0 ? (
                                <h1 style={{ textAlign: 'center', marginTop: '3%' }}>Pas d'absences!</h1>
                            ) : (
                            <table className="table-profiles">
                                <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Groupe</th>
                                    <th>Créneau horaire</th>
                                    <th>Justifiée</th>
                                    <th>Justification</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {absencesParPage.map((absence) => (
                                        <tr key={absence.id_absence}>
                                            <th>{formatDate(absence.date)}</th>
                                            <th>{absence.nom_groupe}</th>
                                            <th>{absence.titre_creneau}</th>
                                            <th>{absence.justifiee === 0 ? "Non" : "Oui"}</th>       
                                            <th><button disabled={absence.justifiee === 0} className={absence.justifiee === 0 ? "disabled-button" : "link"} onClick={() => handleJustification(absence.justification)}><span className={`material-icons-outlined ${absence.justifiee !== 0 ? "pointed" : ""}`}>info</span></button></th>      
                                            <th>
                                                <Link className="link" to="./modifier" state={{id_absence: absence.id_absence, id: location.state.id, date: absence.date, justifiee: absence.justifiee, justification: absence.justification, id_groupe: absence.id_groupe, id_creneau: absence.id_creneau, path: location.state.path}}><span className="material-icons-outlined pointed">edit</span></Link>
                                                <button className="link" onClick={() => handleSupprimerAbsence(absence.id_absence)}><span className="material-icons-outlined pointed">delete</span></button>
                                            </th>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            )}
                        {nbPages >= 2 && (
                            <div className="pagination">
                                <button className="pagination-btn pointed" onClick={() => handlePageChange(currInd - 1)} disabled={currInd === 1}><span className="material-icons-outlined">arrow_back_ios</span></button>
                                <button className="pagination-btn pointed" onClick={() => handlePageChange(1)}><span className="pagination-numero-page">1</span></button>
                                <button className="pagination-btn pointed" onClick={() => handlePageChange(2)}><span className="pagination-numero-page">2</span></button> 
                                {nbPages >= 3 && (
                                    <>
                                        {nbPages >= 4 ? <button className="pagination-btn" disabled><span className="pagination-numero-page">...</span></button> : null}
                                        <button className="pagination-btn pointed" onClick={() => handlePageChange(nbPages)}><span className="pagination-numero-page">{nbPages}</span></button>
                                    </>
                                )}
                                <button className="pagination-btn pointed" onClick={() => handlePageChange(currInd + 1)} disabled={currInd === nbPages}><span className="material-icons-outlined">arrow_forward_ios</span></button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            {supprimerModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-content">
                            <h3>Etes-vous sûr de vouloir supprimer ce absence?</h3>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={confirmerSupprimerAbsence} className="btn pointed"><span className="link">Confirmer</span></button>
                            <button onClick={() => setSupprimerModal(false)} className="btn pointed"><span className="link">Retourner</span></button>
                        </div>
                    </div>
                </div>
            )}
            {justificationModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h2>Justification de l'absence</h2>
                        </div>
                        <div className="modal-body" style={{textAlign: "center", margin: "1rem", fontSize: "1.4rem"}}>
                            <p>{justification}</p>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={() => setJustificationModal(false)} className="btn pointed"><span className="link">Retourner</span></button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Absences;