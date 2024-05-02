import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from "axios";
import Searchbar from "../../components/general/Searchbar/Searchbar";
import { useAuthContext } from '../../hooks/authContext/authContext';

const Groupes = () => {
    const { authData } = useAuthContext();
    const [searchQuery, setSearchQuery] = useState("");
    const [groupes, setGroupes] = useState([]);
    const [filteredGroupes, setFilteredGroupes] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [groupeIdToDelete, setGroupeIdToDelete] = useState(null);
    const [selectedNom, setSelectedNom] = useState("Pas de filtre");
    const [selectedSport, setSelectedSport] = useState("Tous");
    const [sportsGroupes, setSportsGroupes] = useState([]);
    const [currInd, setCurrInd] = useState(1);

    useEffect(() => {
        fetchGroupes();
        fetchSportsGroupes();
    }, []);

    const fetchSportsGroupes = () => {
        axios.get('http://localhost:4000/sport/getAllSportsGroupes')
            .then(response => {
                if(response.data.success){
                    setSportsGroupes(response.data.sportsGroupes);
                }
            })
            .catch(error => {
                console.error('Erreur de l\'obtention des groupes de sports:', error);
            });
    };

    const fetchGroupes = () => {
        axios
            .get("http://localhost:4000/group/getAllGroups")
            .then((response) => {
                if (response.data.success) {
                    const fetchGroupes = response.data.groupes || [];
                    setGroupes(fetchGroupes);
                    setFilteredGroupes(fetchGroupes);
                }
            })
            .catch((error) => {
                console.error("Erreur de l'obtention des groupes: ", error);
            });
    };

    const nbItems = 7;
    const nbPages = Math.ceil(filteredGroupes.length / nbItems);

    // Ensure indices are within valid bounds
    const debInd = Math.max((currInd - 1) * nbItems, 0); // Start index
    const finInd = Math.min(debInd + nbItems, filteredGroupes.length); // End index

    const groupesParPage = filteredGroupes.slice(debInd, finInd);

    const handleDeleteGroupe = (id) => {
        setGroupeIdToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDeleteGroupe = async () => {
        try {
            await axios.delete(`http://localhost:4000/expense/deleteExpense/${groupeIdToDelete}`);
            setShowDeleteModal(false);
            fetchGroupes();
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
        filterGroupes();
    };

    const handleFilterModal = () => {
        setShowFilterModal(true);
    };

    const HandleClearFilters = () => {
        setSelectedNom("Pas de filtre");
        setSelectedSport("Tous");
    };

    const filterGroupes = () => {
        let filtered = groupes;
    
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter((groupe) => {
                const name = groupe.nom_groupe.toLowerCase();
                const sport = groupe.nom_sport.toLowerCase();
                return (name.includes(searchQuery.toLowerCase()) || sport.includes(searchQuery.toLowerCase()));
            });
        }
    
        if (selectedSport !== "Tous") {
            filtered = filtered.filter((groupe) => groupe.nom_sport === selectedSport);
        }
    
        if (selectedNom !== "Pas de filtre") {
            filtered.sort((a, b) => {
                if (selectedNom === "Ascendant") {
                    return a.nom_groupe.localeCompare(b.nom_groupe);
                } else if (selectedNom === "Descendant") {
                    return b.nom_groupe.localeCompare(a.nom_groupe);
                }
                return 0;
            });
        }
    
        setFilteredGroupes(filtered);
    };    

    const handleFilter = () => {
        setShowFilterModal(false);
        filterGroupes();
    };
    return (
        <>
            <Navbar />
            <main>
                <Sidebar currPage="/groupes"/>
                <div className="top-container">
                    <div className="header">
                        <h1>Groupes</h1>
                        <button className="btn">
                            {authData.role === 'Administrateur' && (
                                <Link to="./ajouter" className="link">
                                    <span className="material-icons-outlined">add</span>
                                </Link>
                            )}
                        </button>
                    </div>
                    <Searchbar handleSearch={handleSearch} handleFilterModal={handleFilterModal}/>
                    <div>
                        {groupesParPage.length === 0 ? (
                                <h1 style={{ textAlign: 'center', marginTop: '3%' }}>Pas de dépenses!</h1>
                            ) : (
                            <table className="table-profiles">
                                <thead>
                                    <tr>
                                        <th>Groupe</th>
                                        <th>Sport</th>
                                        <th>Liste des membres</th>
                                        <th>Liste des coachs</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupesParPage.map((groupe) => (
                                        <tr key={groupe.id_groupe}>
                                            <th>{groupe.nom_groupe}</th>
                                            <th>{groupe.nom_sport}</th>
                                            <th><Link className="link"><span className="material-icons-outlined pointed">person</span></Link></th>
                                            <th><Link className="link"><span className="material-icons-outlined pointed">sports</span></Link></th>
                                            <th>
                                                <Link className="link"><span className="material-icons-outlined pointed">info</span></Link>
                                                {authData.role === 'Administrateur' && (
                                                    <>
                                                        <Link className="link"><span className="material-icons-outlined pointed">edit</span></Link>
                                                        <Link className="link"><span className="material-icons-outlined pointed">delete</span></Link>
                                                    </>
                                                )}
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
                            <h3>Etes-vous sûr de vouloir supprimer ce groupe?</h3>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={confirmDeleteGroupe} className="btn pointed"><span className="link">Confirmer</span></button>
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
                                    <label>Sport</label>
                                    <select name="sport" value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)}>
                                        <option value="Tous">Tous</option>
                                        {sportsGroupes.map(sport => (
                                            <option key={sport.id_sport} value={sport.nom}>{sport.nom}</option>
                                        ))}
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

export default Groupes;