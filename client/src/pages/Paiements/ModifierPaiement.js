import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from "axios";
import { extraireAnnee, extraireMois, formatMois } from "../../utils/datesUtils";

const ModifierPaiement = () => {
    const location = useLocation(); // Pour récupérer les données passées en paramètres lors de la navigation
    const [formData, setFormData] = useState({ // Les données du formulaire
        id_membre: location.state.id_membre,
        montant_paye: location.state.montant_paye,
        montant_restant: location.state.montant_restant,
        date_paiement: location.state.date_abonnement,
        mois: parseInt(extraireMois(location.state.mois))
    });
    const [errorMessage, setErrorMessage] = useState(""); // Message d'erreur
    const navigate = useNavigate(); // Hook pour la navigation

    const handleChange = (e) => { // Fonction pour gérer les changements des champs du formulaire
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => { // Fonction pour gérer la soumission du formulaire
        event.preventDefault();
        const oldMois = formData.mois;
        try {
            formData.mois = `${extraireAnnee(location.state.mois)}-${formatMois(oldMois)}`;
            const response = await axios.put(`http://localhost:4000/transaction/updateTransaction/${location.state.id_paiement}`, formData);
            if (response.data.success) {
                navigate('/membres/details/paiements', { state: { id: location.state.id_membre, path: location.state.path } });
            } else {
                formData.mois = oldMois;
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            formData.mois = oldMois;
            setErrorMessage("Désolé, une erreur s'est produite!");
        }
    };

    return (
        <>
            <Navbar />
            <main>
                <Sidebar currPage="/membres" />
                <div className="top-container">
                    <div className="header">
                        <h1>Modifier un paiement</h1>
                        <button className="btn">
                            <Link to="/membres/details/paiements" state={{ id: location.state.id_membre, path: location.state.path }} className="link">
                                <span className="material-icons-outlined">undo</span>
                            </Link>
                        </button>
                    </div>
                    <div className="add-form-group">
                        <div className="add-container">
                            <form className="add-form" onSubmit={handleSubmit}>
                                <div className="add-input">
                                    <span className="material-icons-outlined">calendar_today</span>
                                    <label>Date de paiement</label>
                                    <input type="date" name="date_paiement" value={formData.date_paiement} onChange={handleChange} required />
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">event</span>
                                    <label>Mois du paiement</label>
                                    <select name="mois" value={formData.mois} onChange={handleChange} required>
                                        <option value={1}>Janvier</option>
                                        <option value={2}>Février</option>
                                        <option value={3}>Mars</option>
                                        <option value={4}>Avril</option>
                                        <option value={5}>Mai</option>
                                        <option value={6}>Juin</option>
                                        <option value={7}>Juillet</option>
                                        <option value={8}>Août</option>
                                        <option value={9}>Septembre</option>
                                        <option value={10}>Octobre</option>
                                        <option value={11}>Novembre</option>
                                        <option value={12}>Décembre</option>
                                    </select>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">attach_money</span>
                                    <label>Montant payé (DZD)</label>
                                    <input min={0} type="number" name="montant_paye" value={formData.montant_paye} onChange={handleChange} required />
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">money_off</span>
                                    <label>Montant restant (DZD)</label>
                                    <input min={0} type="number" name="montant_restant" value={formData.montant_restant} onChange={handleChange} required />
                                </div>
                                {errorMessage && <p className="danger">{errorMessage}</p>}
                                <button type="submit" className="btn add-btn pointed"><span className="link">Confirmer</span></button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default ModifierPaiement;