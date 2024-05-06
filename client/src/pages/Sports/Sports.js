import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from "axios";
import Searchbar from "../../components/general/Searchbar/Searchbar";
import { useParamsContext } from '../../hooks/paramsContext/ParamsContext';

const Sports = () => {
    const { paramsData } = useParamsContext();
    const [searchQuery, setSearchQuery] = useState("");
    const [sports, setSports] = useState([]);
    const [filteredSports, setFilteredSports] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [sportIdToDelete, setSportIdToDelete] = useState(null);
    const [showGroupesModal, setShowGroupesModal] = useState(false);
    const [selectedSport, setSelectedSport] = useState(null);
    const [selectedNom, setSelectedNom] = useState("Pas de filtre");
   
    const [currInd, setCurrInd] = useState(1);

    useEffect(() => {
        fetchSportsGroupes();
    }, []);

    const fetchSportsGroupes = () => {
        axios.get("http://localhost:4000/sport/getAllSportsGroupes")
            .then(response => {
                if (response.data.success) {
                    setSports(response.data.sportsGroupes);
                    setFilteredSports(response.data.sportsGroupes);
                }
            })
            .catch(error => {
                console.error('Erreur de l\'obtention des sports et groupes:', error);
            });
    };

    const nbItems = paramsData.grandes_tables || 7;
    const nbPages = Math.ceil(filteredSports.length / nbItems);

    // Ensure indices are within valid bounds
    const debInd = Math.max((currInd - 1) * nbItems, 0); // Start index
    const finInd = Math.min(debInd + nbItems, filteredSports.length); // End index

    const sportsParPage = filteredSports.slice(debInd, finInd);

    const handleDeleteSport = (id) => {
        setSportIdToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDeleteSport = async () => {
        try {
            await axios.delete(`http://localhost:4000/sport/deleteSport/${sportIdToDelete}`);
            setShowDeleteModal(false);
            fetchSportsGroupes();
            setCurrInd(1);
        } catch (error) {
            console.error("Erreur lors de la suppression de la sport:", error);
        }
    };

    const handlePageChange = (newInd) => {
        if (newInd >= 1 && newInd <= nbPages) {
            setCurrInd(newInd);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        filterSports();
    };

    const handleFilterModal = () => {
        setShowFilterModal(true);
    };

    const HandleClearFilters = () => {
        setSelectedNom("Pas de filtre");
    
    };

    const filterSports = () => {
        let filtered = sports;
    
        // Filter by search query
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter((sport) => {
                const name = sport.nom.toLowerCase();
                return name.includes(searchQuery.toLowerCase());
            });
        }
    
        // Filter by selected criteria
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
        setFilteredSports(filtered);
    };    

    const handleFilter = () => {
        setShowFilterModal(false);
        filterSports();
    };

    return (
        <>
            <Navbar></Navbar>
            <main>
                <Sidebar currPage="/sports"></Sidebar>
                <div className="top-container">
                    <div className="header">
                        <h1>Sports</h1>
                        <button className="btn">
                            <Link to="/sports/ajouter" className="link">
                            <span className="material-icons-outlined">add</span>
                            </Link>
                        </button>
                    </div>
                    <Searchbar handleSearch={handleSearch} handleFilterModal={handleFilterModal}/>
                    <div>
                        {sportsParPage.length === 0 ? (
                                <h1 style={{ textAlign: 'center', marginTop: '3%' }}>Pas de sports!</h1>
                            ) : (
                            <table className="table-profiles">
                                <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Liste des groupes</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {sportsParPage.map((sport) => (
                                        <tr key={sport.id_sport}>
                                            <th>{sport.nom}</th>                                      
                                            <th><button className="link" onClick={() => { setShowGroupesModal(true); setSelectedSport(sport) }}><span className="material-icons-outlined pointed">group</span></button></th>     
                                            <th>
                                                <Link className="link" to="./modifier" state={{id_sport: sport.id_sport, nom: sport.nom}}><span className="material-icons-outlined pointed">edit</span></Link>
                                                <button className="link" onClick={() => handleDeleteSport(sport.id_sport)}><span className="material-icons-outlined pointed">delete</span></button>
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
                        {showDeleteModal && (
                            <div className="modal-overlay">
                                <div className="modal-container">
                                    <div className="modal-content">
                                        <h3>Etes-vous sûr de vouloir supprimer ce sport?</h3>
                                    </div>
                                    <div className="modal-buttons">
                                        <button onClick={confirmDeleteSport} className="btn pointed"><span className="link">Confirmer</span></button>
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
                        {showGroupesModal && (
                            <div className="modal-overlay">
                                <div className="modal-container">
                                    <div className="coach-groupes-header">
                                        <span className="material-icons-outlined">group</span>
                                        <h1>Groupes</h1>
                                    </div>
                                    <div>
                                        <div className="coach-groupes">
                                            {selectedSport && selectedSport.groupes && selectedSport.groupes.length > 0 ? (
                                                selectedSport.groupes.map(groupe => (
                                                    (groupe.id_groupe !== null && groupe.nom_groupe !== null) ? 
                                                        <span key={groupe.id_groupe} className="coach-groupe pointed">
                                                            {groupe.nom_groupe}
                                                        </span>
                                                    : <h2 style={{textAlign: "center"}}>Pas de groupes!</h2>
                                                ))
                                            ) : (
                                                <h2 style={{textAlign: "center"}}>Pas de groupes!</h2>
                                            )}
                                        </div>
                                    </div>
                                    <div className="modal-buttons">
                                        <button onClick={() => setShowGroupesModal(false)} className="btn pointed">
                                            <span className="link">Retourner</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    )
}

export default Sports;