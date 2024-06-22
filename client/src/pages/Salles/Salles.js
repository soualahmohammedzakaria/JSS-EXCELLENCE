import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from "axios";
import Searchbar from "../../components/general/Searchbar/Searchbar";
import { useParamsContext } from '../../hooks/paramsContext/ParamsContext';
import { useAuthContext } from '../../hooks/authContext/authContext';

const Salles= () => {
    const { authData } = useAuthContext(); // Obtenir les données d'authentification
    const { paramsData } = useParamsContext(); // Obtenir les paramètres globaux
    // Variables d'état
    const [searchQuery, setSearchQuery] = useState("");
    const [salles, setSalles] = useState([]);
    const [filteredSalles, setFilteredSalles] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [salleIdToDelete, setSalleIdToDelete] = useState(null);
    const [selectedNom, setSelectedNom] = useState("Pas de filtre");
    const [selectedCapacite, setSelectedCapacite] = useState("Tous");
    const [selectedEquipement, setSelectedEquipement] = useState("Tous");

    const [currInd, setCurrInd] = useState(1); // Index de la page actuelle

    useEffect(() => { // Pour obtenir les salles lors du chargement du composant
        fetchSalles();  
    }, []);

    const fetchSalles = () => { // Fonction pour obtenir les salles
        axios
            .get("http://localhost:4000/salle/getAllSalles")
            .then((response) => {
                if (response.data.success) {
                    const salles = response.data.salles || [];
                    setSalles(salles);
                    setFilteredSalles(salles);
                }
            })
            .catch((error) => {
                console.error("Erreur de l'obtention des salles:", error);
            });
    };
 
    const nbItems = paramsData.petites_tables || 7; // Nombre d'éléments par page
    const nbPages = Math.ceil(filteredSalles.length / nbItems); // Nombre de pages

    const debInd = Math.max((currInd - 1) * nbItems, 0); // Index de début
    const finInd = Math.min(debInd + nbItems, filteredSalles.length); // Index de fin

    const sallesParPage = filteredSalles.slice(debInd, finInd); // Salles par page

    const handleDeleteSalle = (id) => { // Fonction pour gérer la suppression d'une salle
        setSalleIdToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDeleteSalle = async () => { // Fonction pour confirmer la suppression d'une salle
        try {
            await axios.delete(`http://localhost:4000/salle/deleteSalle/${salleIdToDelete}`);
            setShowDeleteModal(false);
            fetchSalles();
            setCurrInd(1);
        } catch (error) {
            console.error("Erreur lors de la suppression de la salle:", error);
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
    
    useEffect(() => { // Pour filtrer les salles lors de la recherche
        setCurrInd(1);
        filterSalles();
    }, [searchQuery]);

    const handleFilterModal = () => { // Fonction pour afficher le modal de filtre
        setShowFilterModal(true);
    };

    const HandleClearFilters = () => { // Fonction pour réinitialiser les filtres
        setSelectedNom("Pas de filtre");
        setSelectedEquipement("Tous");
        setSelectedCapacite("Tous");
    };

    const filterSalles = () => { // Fonction pour filtrer les salles
        let filtered = salles;
    
        // Filtrer par recherche
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter((salle) => {
                const name = salle.nom_salle.toLowerCase();
                return name.includes(searchQuery.toLowerCase());
            });
        }
    
        // Filtrer par nom
        if (selectedNom !== "Pas de filtre") {
            filtered.sort((a, b) => {
                if (selectedNom === "Ascendant") {
                    return a.nom_salle.localeCompare(b.nom_salle);
                } else if (selectedNom === "Descendant") {
                    return b.nom_salle.localeCompare(a.nom_salle);
                }
                return 0;
            });
        }
    
        if (selectedCapacite !== "Tous") { // Filtrer par capacité
            filtered = filtered.filter((salle) => {
                if (selectedCapacite === "-15 adhérents") {
                    return salle.capacite <= 15;
                } else if (selectedCapacite === "+15 adhérents") {
                    return salle.capacite > 15 && salle.capacite <= 30;
                } else if (selectedCapacite === "+30 adhérents") {
                    return salle.capacite > 30;
                }
                return true;
            });
        }
    
        if (selectedEquipement !== "Tous") { // Filtrer par équipement
            filtered = filtered.filter((salle) => {
                if (selectedEquipement === "Oui") {
                    return salle.equipe === 1;
                } else if (selectedEquipement === "Non") {
                    return salle.equipe === 0;
                }
                return true;
            });
        }
    
        setFilteredSalles(filtered); // Mettre à jour les salles filtrées
    };    

    const handleFilter = () => { // Fonction pour gérer le filtre
        setShowFilterModal(false);
        filterSalles();
        setCurrInd(1);
    };

    return (
        <>
            <Navbar></Navbar>
            <main>
                <Sidebar currPage="/salles"></Sidebar>
                <div className="top-container">
                    <div className="header">
                        <h1>Salles</h1>
                        <button className="btn">
                            <Link to="/salles/ajouter" className="link">
                            <span className="material-icons-outlined">add</span>
                            </Link>
                        </button>
                    </div>
                    <Searchbar handleSearch={handleSearch} handleFilterModal={handleFilterModal}/>
                    <div>
                        {sallesParPage.length === 0 ? (
                                <h1 style={{ textAlign: 'center', marginTop: '3%' }}>Pas de salles!</h1>
                            ) : (
                            <table className="table-profiles">
                                <thead>
                                <tr>
                                    <th>Identifiant</th>
                                    <th>Nom</th>
                                    <th>Capacité</th>
                                    <th>Equipée</th>
                                    <th>Equipement</th>
                                    {authData.role === 'Administrateur' && <th>Actions</th>}
                                </tr>
                                </thead>
                                <tbody>
                                    {sallesParPage.map((salle) => (
                                        <tr key={salle.numero_salle}>
                                            <th>{salle.numero_salle}</th>
                                            <th>{salle.nom_salle}</th>
                                            <th>{salle.capacite}</th>
                                            <th>{salle.equipe === 1 ? "Oui" : "Non"}</th>
                                            <th><Link className="link" to="./equipements" state={{numero_salle: salle.numero_salle}}><span className="material-icons-outlined pointed">fitness_center</span></Link></th>
                                            <th>
                                            {authData.role === 'Administrateur' &&
                                                <>
                                                    <Link className="link" to="./modifier" state={{numero_salle: salle.numero_salle, nom_salle: salle.nom_salle, capacite: salle.capacite}}><span className="material-icons-outlined pointed">edit</span></Link>
                                                    <button className="link" onClick={() => handleDeleteSalle(salle.numero_salle)}><span className="material-icons-outlined pointed">delete</span></button>
                                                </>
                                            }
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
                                        <h3>Etes-vous sûr de vouloir supprimer cette salle?</h3>
                                    </div>
                                    <div className="modal-buttons">
                                        <button onClick={confirmDeleteSalle} className="btn pointed"><span className="link">Confirmer</span></button>
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
                                                <label>Capacité</label>
                                                <select name="capacite" id="capacite" value={selectedCapacite} onChange={(e) => setSelectedCapacite(e.target.value)}>
                                                    <option value="Tous">Tous</option>
                                                    <option value="-15 adhérents">-15 adhérents</option>
                                                    <option value="+15 adhérents">+15 adhérents</option>
                                                    <option value="+30 adhérents">+30 adhérents</option>
                                                </select>
                                            </div>
                                            <div className="filter-option">
                                                <label>Equipée</label>
                                                <select name="equipement" id="equipement" value={selectedEquipement} onChange={(e) => setSelectedEquipement(e.target.value)}>
                                                    <option value="Tous">Tous</option>
                                                    <option value="Oui">Oui</option>
                                                    <option value="Non">Non</option>
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
                    </div>
                </div>
            </main>
        </>
    )
}

export default Salles;