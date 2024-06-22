import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from "axios";
import Searchbar from "../../components/general/Searchbar/Searchbar";
import { useParamsContext } from '../../hooks/paramsContext/ParamsContext';

const Equipements = () => {
    const { paramsData } = useParamsContext(); // Obtenir les paramètres globaux
    const location = useLocation(); // Pour récupérer les données passées en paramètres lors de la navigation
    const [searchQuery, setSearchQuery] = useState(""); // Recherche
    const [equipements, setEquipements] = useState([]); // État pour les equipements
    const [filteredEquipements, setFilteredEquipements] = useState([]); // État pour les equipements filtrés
    const [showDeleteModal, setShowDeleteModal] = useState(false); // État pour la modal de suppression
    const [showFilterModal, setShowFilterModal] = useState(false); // État pour la modal de filtre
    const [equipementIdToDelete, setEquipementIdToDelete] = useState(null); // État pour l'id de l'equipement à supprimer
    const [selectedNom, setSelectedNom] = useState("Pas de filtre"); // État pour le nom sélectionné
    const [selectedQuantite, setSelectedQuantite] = useState("Tous"); // État pour la quantité sélectionnée
   
    const [currInd, setCurrInd] = useState(1); // Index de la page actuelle

    useEffect(() => { // Pour obtenir les equipements lors du chargement du composant
        fetchEquipements();
    }, []);

    const fetchEquipements = () => { // Fonction pour obtenir les equipements
        axios
            .get(`http://localhost:4000/equipment/getEquipmentsSalle/${location.state.numero_salle}`)
            .then((response) => {
                if (response.data.success) {
                    const equipements = response.data.equipements || [];
                    setEquipements(equipements);
                    setFilteredEquipements(equipements);
                }
            })
            .catch((error) => {
                console.error("Erreur de l'obtention des equipements:", error);
            });
    };

    const nbItems = paramsData.petites_tables || 7; // Nombre d'éléments par page
    const nbPages = Math.ceil(filteredEquipements.length / nbItems); // Nombre de pages

    const debInd = Math.max((currInd - 1) * nbItems, 0); // Index de début
    const finInd = Math.min(debInd + nbItems, filteredEquipements.length); // Index de fin

    const equipementsParPage = filteredEquipements.slice(debInd, finInd); // Equipements par page

    const handleDeleteEquipement = (id) => { // Fonction pour gérer la suppression d'un equipement
        setEquipementIdToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDeleteEquipement = async () => { // Fonction pour confirmer la suppression d'un equipement
        try {
            await axios.delete(`http://localhost:4000/equipment/deleteEquipment/${equipementIdToDelete}`);
            setShowDeleteModal(false);
            fetchEquipements();
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
        filterEquipements();
    }, [searchQuery]);

    const handleFilterModal = () => { // Fonction pour afficher la modal de filtre
        setShowFilterModal(true);
    };

    const HandleClearFilters = () => { // Fonction pour réinitialiser les filtres
        setSelectedNom("Pas de filtre");
        setSelectedQuantite("Tous");
    };

    const filterEquipements = () => { // Fonction pour filtrer les equipements
        let filtered = equipements;
    
        // Filtrer par recherche
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter((equipement) => {
                const name = equipement.nom.toLowerCase();
                return name.includes(searchQuery.toLowerCase());
            });
        }
    
        // Filter par nom
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
    
        if (selectedQuantite !== "Tous") { // Filtrer par quantité
            filtered = filtered.filter((equipement) => {
                if (selectedQuantite === "-5 unités") {
                    return equipement.quantite <= 5;
                } else if (selectedQuantite === "-10 unités") {
                    return equipement.quantite > 5 && equipement.quantite <= 10;
                } else if (selectedQuantite === "+10 unités") {
                    return equipement.quantite > 10;
                }
                return true;
            });
        }
    
        setFilteredEquipements(filtered); // Mettre à jour les equipements filtrés
    };    

    const handleFilter = () => { // Fonction pour gérer le filtre
        setShowFilterModal(false);
        filterEquipements();
        setCurrInd(1);
    };

    return (
        <>
            <Navbar></Navbar>
            <main>
                <Sidebar currPage="/salles"></Sidebar>
                <div className="top-container">
                    <div className="header">
                        <h1>Equipements</h1>
                        <div>
                            <button className="btn" style={{ marginRight: "0.5rem" }}>
                                <Link to="./ajouter" state={{numero_salle: location.state.numero_salle}} className="link">
                                    <span className="material-icons-outlined">add</span>
                                </Link>
                            </button>
                            <button className="btn">
                                <Link to="/salles" className="link" state={{numero_salle: location.state.numero_salle}}>
                                    <span className="material-icons-outlined">undo</span>
                                </Link>
                            </button>
                        </div>
                    </div>
                    <Searchbar handleSearch={handleSearch} handleFilterModal={handleFilterModal}/>
                    <div>
                        {equipementsParPage.length === 0 ? (
                                <h1 style={{ textAlign: 'center', marginTop: '3%' }}>Pas d'equipement!</h1>
                            ) : (
                            <table className="table-profiles">
                                <thead>
                                <tr>
                                    <th>Identifiant</th>
                                    <th>Nom</th>
                                    <th>Quantité</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {equipementsParPage.map((equipement) => (
                                        <tr key={equipement.id_equipement}>
                                            <th>{equipement.id_equipement}</th>
                                            <th>{equipement.nom}</th>
                                            <th>{equipement.quantite}</th>           
                                            <th>
                                                <Link className="link" to="./modifier" state={{id_equipement: equipement.id_equipement, nom: equipement.nom, quantite: equipement.quantite, numero_salle: location.state.numero_salle}}><span className="material-icons-outlined pointed">edit</span></Link>
                                                <button className="link" onClick={() => handleDeleteEquipement(equipement.id_equipement)}><span className="material-icons-outlined pointed">delete</span></button>
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
                                        <h3>Etes-vous sûr de vouloir supprimer cet equipement?</h3>
                                    </div>
                                    <div className="modal-buttons">
                                        <button onClick={confirmDeleteEquipement} className="btn pointed"><span className="link">Confirmer</span></button>
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
                                                <label>Quantité</label>
                                                <select name="quantite" id="quantite" value={selectedQuantite} onChange={(e) => setSelectedQuantite(e.target.value)}>
                                                    <option value="Tous">Tous</option>
                                                    <option value="-5 unités">-5 unités</option>
                                                    <option value="-10 unités">-10 unités</option>
                                                    <option value="+10 unités">+10 unités</option>
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

export default Equipements;