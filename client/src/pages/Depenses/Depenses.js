import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from "axios";
import Searchbar from "../../components/general/Searchbar/Searchbar";
import { formatDate } from "../../utils/datesUtils";
import { useParamsContext } from '../../hooks/paramsContext/ParamsContext';

const Depenses = () => {
    const { paramsData } = useParamsContext(); // Les paramètres de l'application
    const [searchQuery, setSearchQuery] = useState(""); // La recherche
    const [depenses, setDepenses] = useState([]); // Les dépenses
    const [filteredDepenses, setFilteredDepenses] = useState([]); // Les dépenses filtrées
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Afficher le modal de suppression
    const [showFilterModal, setShowFilterModal] = useState(false); // Afficher le modal de filtre
    const [depenseIdToDelete, setDepenseIdToDelete] = useState(null); // L'identifiant de la dépense à supprimer
    const [selectedNom, setSelectedNom] = useState("Pas de filtre"); // Le filtre par nom
    const [selectedMontant, setSelectedMontant] = useState("Tous"); // Le filtre par montant
    const [selectedDate, setSelectedDate] = useState("Tous"); // Le filtre par date
    const [currInd, setCurrInd] = useState(1); // L'indice de la page actuelle

    useEffect(() => {
        fetchDepense(); // Récupérer les dépenses
    }, []);

    const fetchDepense = () => {
        axios
            .get("http://localhost:4000/expense/getAllExpenses") // Récupérer les dépenses
            .then((response) => { // Gérer la réponse
                if (response.data.success) { // Si la requête s'est bien déroulée
                    const depenses = response.data.depenses || [];
                    setDepenses(depenses); // Mettre à jour les dépenses
                    setFilteredDepenses(depenses); // Mettre à jour les dépenses filtrées
                }
            })
            .catch((error) => {
                console.error("Erreur de l'obtention des dépenses:", error);
            });
    };

    const nbItems = paramsData.petites_tables || 7; // Nombre d'éléments par page
    const nbPages = Math.ceil(filteredDepenses.length / nbItems); // Nombre de pages

    // Pagination
    const debInd = Math.max((currInd - 1) * nbItems, 0); // Index de début
    const finInd = Math.min(debInd + nbItems, filteredDepenses.length); // Index de fin

    const depensesParPage = filteredDepenses.slice(debInd, finInd); // Les dépenses par page

    const handleDeleteDepense = (id) => { // Fonction pour gérer la suppression d'une dépense
        setDepenseIdToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDeleteDepense = async () => { // Fonction pour confirmer la suppression d'une dépense
        try {
            await axios.delete(`http://localhost:4000/expense/deleteExpense/${depenseIdToDelete}`); // Supprimer la dépense
            setShowDeleteModal(false); // Cacher le modal
            fetchDepense(); // Récupérer les dépenses
            setCurrInd(1); // Mettre à jour l'indice de la page actuelle
        } catch (error) {
            console.error("Erreur lors de la suppression de la dépense:", error);
        }
    };
 
    const handlePageChange = (newInd) => { // Fonction pour gérer le changement de page
        if (newInd >= 1 && newInd <= nbPages) {
            setCurrInd(newInd);
        }
    };

    const handleSearch = (event) => { // Fonction pour gérer la recherche
        const value = event.target.value;
        setSearchQuery(value);
    };
    
    useEffect(() => { // Filtrer les dépenses
        setCurrInd(1);
        filterDepenses();
    }, [searchQuery]);

    const handleFilterModal = () => { // Fonction pour afficher le modal de filtre
        setShowFilterModal(true);
    };

    const HandleClearFilters = () => { // Fonction pour réinitialiser les filtres
        setSelectedNom("Pas de filtre");
        setSelectedDate("Tous");
        setSelectedMontant("Tous");
    };

    const filterDepenses = () => {
        let filtered = depenses;
    
        // Filtrer par recherche
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter((depense) => {
                const name = depense.nom.toLowerCase();
                const type = depense.type.toLowerCase();
                return (name.includes(searchQuery.toLowerCase()) || type.includes(searchQuery.toLowerCase()));
            });
        }
    
        // Filtrer par montant
        if (selectedMontant !== "Tous") {
            const montantThreshold = parseInt(selectedMontant.substring(1), 10); // Convert selectedMontant to integer
            const isNegative = selectedMontant.includes("-");
            filtered = filtered.filter((depense) => {
                if (isNegative) {
                    return depense.montant <= montantThreshold;
                } else {
                    return depense.montant > montantThreshold;
                }
            });
        }        
    
        // Filtrer par date
        if (selectedDate !== "Tous") {
            const currentDate = new Date();
            filtered = filtered.filter((depense) => {
                const depenseDate = new Date(depense.date);
                const diffTime = currentDate - depenseDate;
                const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365); // Convert milliseconds to years
                switch (selectedDate) {
                    case "Ce mois":
                        return depenseDate.getMonth() === currentDate.getMonth() && depenseDate.getFullYear() === currentDate.getFullYear();
                    case "-6 mois":
                        return diffYears <= 0.5;
                    case "-1 ans":
                        return diffYears <= 1;
                    case "-2 ans":
                        return diffYears <= 2;
                    case "+2 ans":
                        return diffYears > 2;
                    default:
                        return true;
                }
            });
        }
    
        // Filtrer par nom
        if (selectedNom !== "Pas de filtre") {
            filtered.sort((a, b) => {
                if (selectedNom === "Ascendant") {
                    return a.nom.localeCompare(b.nom);
                } else if (selectedNom === "Descendant") {
                    return b.nom.localeCompare(a.nom);
                }
                return 0;
            });
        }
    
        setFilteredDepenses(filtered); // Mettre à jour les dépenses filtrées
    };    

    const handleFilter = () => { // Fonction pour gérer le filtre
        setShowFilterModal(false);
        filterDepenses();
        setCurrInd(1);
    };
    return (
        <>
            <Navbar />
            <main>
                <Sidebar currPage="/depenses" />
                <div className="top-container">
                    <div className="header">
                        <h1>Dépenses</h1>
                        <button className="btn">
                            <Link to="/depenses/ajouter" className="link">
                                <span className="material-icons-outlined">add</span>
                            </Link>
                        </button>
                    </div>
                    <Searchbar handleSearch={handleSearch} handleFilterModal={handleFilterModal}/>
                    <div>
                        {depensesParPage.length === 0 ? (
                                <h1 style={{ textAlign: 'center', marginTop: '3%' }}>Pas de dépenses!</h1>
                            ) : (
                            <table className="table-profiles">
                                <thead>
                                <tr>
                                    <th>Numéro</th>
                                    <th>Nom</th>
                                    <th>Type</th>
                                    <th>Montant</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {depensesParPage.map((depense) => (
                                        <tr key={depense.id_depense}>
                                            <th>{depense.id_depense}</th>
                                            <th>{depense.nom}</th>
                                            <th>{depense.type}</th>
                                            <th>{depense.montant} DZD</th>
                                            <th>{formatDate(depense.date)}</th>            
                                            <th>
                                                <Link className="link" to="./modifier" state={{id: depense.id_depense, nom: depense.nom, montant:depense.montant, type: depense.type, date: depense.date}}><span className="material-icons-outlined pointed">edit</span></Link>
                                                <button className="link" onClick={() => handleDeleteDepense(depense.id_depense)}><span className="material-icons-outlined pointed">delete</span></button>
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
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-content">
                            <h3>Etes-vous sûr de vouloir supprimer cette dépense?</h3>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={confirmDeleteDepense} className="btn pointed"><span className="link">Confirmer</span></button>
                            <button onClick={() => setShowDeleteModal(false)} className="btn pointed"><span className="link">Retourner</span></button>
                        </div>
                    </div>
                </div>
            )}
            {showFilterModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1>Filtrer les résultats</h1>
                            </div>
                            <div className="filter-options">
                                <div className="filter-option">
                                    <label>Nom</label>
                                    <select name="nom" id="nom" value={selectedNom} onChange={(e) => setSelectedNom(e.target.value)}>
                                        <option value="Pas de filtre">Pas de filtre</option>
                                        <option value="Ascendant">Ascendant</option>
                                        <option value="Descendant">Descendant</option>
                                    </select>
                                </div>
                                <div className="filter-option">
                                    <label>Date</label>
                                    <select name="date" id="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                                        <option value="Tous">Tous</option>
                                        <option value="Ce mois">Ce mois</option>
                                        <option value="-6 mois">-6 mois</option>
                                        <option value="-1 ans">-1 ans</option>
                                        <option value="-2 ans">-2 ans</option>
                                        <option value="+2 ans">+2 ans</option>
                                    </select>
                                </div>
                                <div className="filter-option">
                                    <label>Montant</label>
                                    <select name="montant" id="montant" value={selectedMontant} onChange={(e) => setSelectedMontant(e.target.value)}>
                                        <option value="Tous">Tous</option>
                                        <option value="-5000 DZD">-5000 DZD</option>
                                        <option value="-10000 DZD">-10000 DZD</option>
                                        <option value="-50000 DZD">-50000 DZD</option>
                                        <option value="+50000 DZD">+50000 DZD</option>
                                    </select>
                                </div>
                                <button onClick={HandleClearFilters} className="btn-reinit pointed">
                                    <span className="link">Réinitialiser les filtres</span>
                                </button>
                            </div>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={handleFilter} className="btn pointed"><span className="link">Filtrer</span></button>
                            <button onClick={() => setShowFilterModal(false)} className="btn pointed"><span className="link">Retour</span></button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Depenses;