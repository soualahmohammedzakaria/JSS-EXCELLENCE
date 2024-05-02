import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from "axios";
import { formatDate, formatAnMois } from "../../utils/datesUtils";

const Paiements = () => {
    const location = useLocation();
    const [paiements, setPaiements] = useState([]);
    const [afficherSupprimerPaiement, setSupprimerModal] = useState(false);
    const [idPaiementSupprimer, setIdASupprime] = useState(null);
    const [currInd, setCurrInd] = useState(1);

    useEffect(() => {
        fetchPaiements();
    }, []);

    const fetchPaiements = () => {
        axios
            .get(`http://localhost:4000/transaction/getTransactions/${location.state.id}`)
            .then((response) => {
                if (response.data.success) {
                    const fetchedPaiements = response.data.transactions || [];
                    fetchedPaiements.sort((a, b) => { return new Date(b.date_abonnement) - new Date(a.date_abonnement); });
                    setPaiements(fetchedPaiements);
                }
            })
            .catch((error) => {
                console.error("Erreur de l'obtention des paiements:", error);
            });
    };

    const nbItems = 7;
    const nbPages = Math.ceil(paiements.length / nbItems);

    // Ensure indices are within valid bounds
    const debInd = Math.max((currInd - 1) * nbItems, 0); // Start index
    const finInd = Math.min(debInd + nbItems, paiements.length); // End index

    const paiementsParPage = paiements.slice(debInd, finInd);

    const handleSupprimerPaiement = (id) => {
        setIdASupprime(id);
        setSupprimerModal(true);
    };

    const confirmerSupprimerPaiement = async () => {
        try {
            await axios.delete(`http://localhost:4000/transaction/deleteTransaction/${idPaiementSupprimer}`);
            setSupprimerModal(false);
            fetchPaiements();
            setCurrInd(1);
        } catch (error) {
            console.error("Erreur lors de la suppression du paiement:", error);
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
                        <h1>Paiements d'un membre</h1>
                        <div>
                            <button className="btn" style={{ marginRight: "0.5rem" }}>
                                <Link to="./ajouter" state={{id: location.state.id}} className="link">
                                    <span className="material-icons-outlined">add</span>
                                </Link>
                            </button>
                            <button className="btn">
                                <Link to="/membres/details" className="link" state={{id: location.state.id}}>
                                    <span className="material-icons-outlined">undo</span>
                                </Link>
                            </button>
                        </div>
                    </div>
                    <div>
                        {paiementsParPage.length === 0 ? (
                                <h1 style={{ textAlign: 'center', marginTop: '3%' }}>Pas de paiements!</h1>
                            ) : (
                            <table className="table-profiles">
                                <thead>
                                <tr>
                                    <th>Numéro</th>
                                    <th>Date de paiement</th>
                                    <th>Mois du paiement</th>
                                    <th>Montant payé</th>
                                    <th>Montant restant</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {paiementsParPage.map((paiement) => (
                                        <tr key={paiement.id_paiement}>
                                            <th>{paiement.id_paiement}</th>
                                            <th>{formatDate(paiement.date_abonnement)}</th>
                                            <th>{formatAnMois(paiement.mois_abonnement)}</th>
                                            <th>{paiement.montant_paye} DZD</th>
                                            <th>{paiement.montant_restant} DZD</th>                             
                                            <th>
                                                <Link className="link" to="./modifier" state={{id_paiement: paiement.id_paiement, id_membre: location.state.id, date_abonnement: paiement.date_abonnement, mois: paiement.mois_abonnement, montant_paye: paiement.montant_paye, montant_restant: paiement.montant_restant}}><span className="material-icons-outlined pointed">edit</span></Link>
                                                <button className="link" onClick={() => handleSupprimerPaiement(paiement.id_paiement)}><span className="material-icons-outlined pointed">delete</span></button>
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
            {afficherSupprimerPaiement && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-content">
                            <h3>Etes-vous sûr de vouloir supprimer ce paiement?</h3>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={confirmerSupprimerPaiement} className="btn pointed"><span className="link">Confirmer</span></button>
                            <button onClick={() => setSupprimerModal(false)} className="btn pointed"><span className="link">Retourner</span></button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Paiements;