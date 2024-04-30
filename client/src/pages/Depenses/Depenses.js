import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from "axios";
import Searchbar from "../../components/general/Searchbar/Searchbar";
import { formatDate } from "../../utils/datesUtils";

const Depenses = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [depenses, setDepenses] = useState([]);
    const [filteredDepenses, setFilteredDepenses] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [depenseIdToDelete, setDepenseIdToDelete] = useState(null);
    const [selectedNom, setSelectedNom] = useState("Pas de filtre");
    const [selectedMontant, setSelectedMontant] = useState("Tous");
    const [selectedDate, setSelectedDate] = useState("Tous");
    const [currInd, setCurrInd] = useState(1);

    useEffect(() => {
        fetchDepense();
    }, []);

    const fetchDepense = () => {
        axios
            .get("http://localhost:4000/expense/getAllExpenses")
            .then((response) => {
                if (response.data.success) {
                    const depenses = response.data.depenses || [];
                    setDepenses(depenses);
                    setFilteredDepenses(depenses);
                }
            })
            .catch((error) => {
                console.error("Erreur de l'obtention des dépenses:", error);
            });
    };

    const nbItems = 7;
    const nbPages = Math.ceil(filteredDepenses.length / nbItems);

    // Ensure indices are within valid bounds
    const debInd = Math.max((currInd - 1) * nbItems, 0); // Start index
    const finInd = Math.min(debInd + nbItems, filteredDepenses.length); // End index

    const depensesParPage = filteredDepenses.slice(debInd, finInd);

    const handleDeleteDepense = (id) => {
        setDepenseIdToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDeleteDepense = async () => {
        try {
            await axios.delete(`http://localhost:4000/expense/deleteExpense/${depenseIdToDelete}`);
            setShowDeleteModal(false);
            fetchDepense();
            setCurrInd(1);
        } catch (error) {
            console.error("Erreur lors de la suppression du dépense:", error);
        }
    };

    const handlePageChange = (newInd) => {
        if (newInd >= 1 && newInd <= nbPages) {
            setCurrInd(newInd);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        filterDepenses();
    };

    const handleFilterModal = () => {
        setShowFilterModal(true);
    };

    const HandleClearFilters = () => {
        setSelectedNom("Pas de filtre");
        setSelectedDate("Tous");
        setSelectedMontant("Tous");
    };

    const filterDepenses = () => {
        let filtered = depenses;
    
        // Case insensitive search by name
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter((depense) => {
                const name = depense.nom.toLowerCase();
                const type = depense.type.toLowerCase();
                return (name.includes(searchQuery.toLowerCase()) || type.includes(searchQuery.toLowerCase()));
            });
        }
    
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
    
        // Filter by date
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
    
        // Sort by nom
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
    
        setFilteredDepenses(filtered);
    };    

    const handleFilter = () => {
        setShowFilterModal(false);
        filterDepenses();
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