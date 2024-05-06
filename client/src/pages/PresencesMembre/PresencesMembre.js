import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from "axios";
import { formatDateHeure } from "../../utils/datesUtils";
import { useParamsContext } from '../../hooks/paramsContext/ParamsContext';

const Presences = () => {
    const { paramsData } = useParamsContext();
    const location = useLocation();
    const [presences, setPresences] = useState([]);
    const [supprimerModal, setSupprimerModal] = useState(false);
    const [idASupprime, setIdASupprime] = useState(null);
    const [currInd, setCurrInd] = useState(1);

    useEffect(() => {
        fetchPresences();
    }, []);

    const fetchPresences = () => {
        axios
            .get(`http://localhost:4000/attendance/getPresencesMember/${location.state.id}`)
            .then((response) => {
                if (response.data.success) {
                    const fetchedPresences = response.data.presences || [];
                    fetchedPresences.sort((a, b) => { return new Date(b.date_entree) - new Date(a.date_sortie); }); // A CHANGER
                    setPresences(fetchedPresences);
                }
            })
            .catch((error) => {
                console.error("Erreur de l'obtention des présences:", error);
            });
    };

    const nbItems = paramsData.petites_tables || 7;
    const nbPages = Math.ceil(presences.length / nbItems);

    const debInd = Math.max((currInd - 1) * nbItems, 0); // Start index
    const finInd = Math.min(debInd + nbItems, presences.length); // End index

    const presencesParPage = presences.slice(debInd, finInd);

    const handleSupprimerPresence = (id) => {
        setIdASupprime(id);
        setSupprimerModal(true);
    };

    const confirmerSupprimerPresence = async () => {
        try {
            await axios.delete(`http://localhost:4000/attendance/deletePresenceMember/${idASupprime}`);
            setSupprimerModal(false);
            fetchPresences();
            setCurrInd(1);
        } catch (error) {
            console.error("Erreur lors de la suppression de la présences:", error);
        }
    };

    const handlePageChange = (newInd) => {
        if (newInd >= 1 && newInd <= nbPages) {
            setCurrInd(newInd);
        }
    };

    return (
        <>
            <Navbar />
            <main>
                <Sidebar currPage="/membres" />
                <div className="top-container">
                    <div className="header">
                        <h1>Présences d'un membre</h1>
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
                        {presencesParPage.length === 0 ? (
                                <h1 style={{ textAlign: 'center', marginTop: '3%' }}>Pas de présences!</h1>
                            ) : (
                            <table className="table-profiles">
                                <thead>
                                <tr>
                                    <th>Date d'entrée</th>
                                    <th>Date de sortie</th>
                                    <th>Groupe</th>
                                    <th>Créneau horaire</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {presencesParPage.map((presence) => (
                                        <tr key={presence.id_assiduite}>
                                            <th>{formatDateHeure(presence.date_entree)}</th>
                                            <th>{presence.date_sortie == null || presence.date_sortie === "Invalid date" ? "-" : formatDateHeure(presence.date_sortie)}</th>
                                            <th>{presence.nom_groupe}</th>
                                            <th>{presence.titre}</th>                    
                                            <th>
                                                <Link className="link" to="./modifier" state={{id_presence: presence.id_assiduite, id: location.state.id, date_entree: presence.date_entree, date_sortie: presence.date_sortie, id_groupe: presence.id_groupe, id_creneau: presence.id_creneau, path: location.state.path}}><span className="material-icons-outlined pointed">edit</span></Link>
                                                <button className="link" onClick={() => handleSupprimerPresence(presence.id_assiduite)}><span className="material-icons-outlined pointed">delete</span></button>
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
                            <h3>Etes-vous sûr de vouloir supprimer ce presence?</h3>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={confirmerSupprimerPresence} className="btn pointed"><span className="link">Confirmer</span></button>
                            <button onClick={() => setSupprimerModal(false)} className="btn pointed"><span className="link">Retourner</span></button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Presences;