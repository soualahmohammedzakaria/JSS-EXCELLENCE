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
                // You can add additional error handling or state updates here
            });
    };

    const nbItems = 5; // Number of items per page
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

    const filterDepenses = () => {
        let filtered = depenses || [];
    
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter((depense) => {
                const name = `${depense.nom}`.toLowerCase();
                return name.includes(searchQuery.toLowerCase());
            });
        }
    
        if (selectedMontant !== "Tous") {
            filtered = filtered.filter((depense) => depense.montant === selectedMontant);
        }
    
        if (selectedDate !== "Tous") {
            filtered = filtered.filter((depense) => {
                const date = new Date(depense.date);
                const diffYears = new Date().getFullYear() - date.getFullYear();
                
                if (selectedDate === "-1 ans") {
                    return diffYears < 1;
                } else if (selectedDate === "+1 ans") {
                    return diffYears >= 1;
                }
                return true;
            });
        }
    
        // Apply sorting by name if needed
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
                        <h1>Depenses</h1>
                        <button className="btn">
                            <Link to="/depenses/ajouter" className="link">
                                <span className="material-icons-outlined">add</span>
                            </Link>
                        </button>
                    </div>
                    <Searchbar handleSearch={handleSearch} handleFilterModal={handleFilterModal}/>
                    <div>
                        {depensesParPage.length === 0 ? (
                                <h1 style={{ textAlign: 'center', marginTop: '3%' }}>Pas de profils!</h1>
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
                                                <Link className="link" to="./details" state={{}}><span className="material-icons-outlined pointed">info</span></Link>
                                                <Link className="link" to="./modifier" state={{id: depense.id_depense, nom: depense.nom, montant:depense.mintant, type: depense.type, date: depense.date}}><span className="material-icons-outlined pointed">edit</span></Link>
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
                            <h3>Etes-vous sûr de vouloir supprimer cette depense?</h3>
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
                            <div className="filters-body">
                                    <div className="filter-option">
                                        <label>Nom</label>
                                        <select name="nom" id="nom" value={selectedNom} onChange={(e) => setSelectedNom(e.target.value)}>
                                            <option value="Pas de filtre">Pas de filtre</option>
                                            <option value="Ascendant">Ascendant</option>
                                            <option value="Descendant">Descendant</option>
                                        </select>
                                    </div>
                                    <div className="filter-option">
                                        <label>Montant</label>
                                        <select name="montant" id="montant" value={selectedMontant} onChange={(e) => setSelectedMontant(e.target.value)}>
                                            <option value="tous">Tous</option>
                                            <option value="-5000 DZD">-5000 DZD</option>
                                            <option value="+5000 DZD">+5000DZD</option>
                                            <option value="+10000 DZD">+10000DZD</option> 
                                        </select>
                                    </div>
                                    <div className="filter-option">
                                        <label>Date</label>
                                        <select name="Date" id="Date" value={Date} onChange={(e) => setSelectedDate(e.target.value)}>
                                            <option value="Tous">Tous</option>
                                            <option value="-1 ans">-1 ans</option>
                                            <option value="+1 ans">+1 ans</option>
                                        </select>
                                     </div>
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