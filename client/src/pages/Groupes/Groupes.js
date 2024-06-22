import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from "axios";
import Searchbar from "../../components/general/Searchbar/Searchbar";
import { useAuthContext } from '../../hooks/authContext/authContext';
import { useParamsContext } from '../../hooks/paramsContext/ParamsContext';
import { formatDateHeure } from "../../utils/datesUtils";

const Groupes = () => {
    const { paramsData } = useParamsContext(); // Utiliser le contexte des paramètres
    const { authData } = useAuthContext(); // Utiliser le contexte d'authentification
    const [searchQuery, setSearchQuery] = useState(""); // Pour stocker la recherche
    const [groupes, setGroupes] = useState([]); // Pour stocker les groupes
    const [filteredGroupes, setFilteredGroupes] = useState([]); // Pour stocker les groupes filtrés
    const [creneaux, setCreneaux] = useState([]); // Pour stocker les créneaux
    const [reportedGroup, setReportedGroup] = useState(null); // Pour stocker le groupe signalé
    const [selectedCreneau, setSelectedCreneau] = useState(null); // Pour stocker le créneau sélectionné
    const [filteredCreneaux, setFilteredCreneaux] = useState([]); // Pour stocker les créneaux filtrés
    const [showSignalerAbsences, setShowSignalerAbsences] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Pour afficher le modal de suppression
    const [showFilterModal, setShowFilterModal] = useState(false);  // Pour afficher le modal de filtre
    const [groupeIdToDelete, setGroupeIdToDelete] = useState(null); // Pour stocker l'id du groupe à supprimer
    const [selectedNom, setSelectedNom] = useState("Pas de filtre"); // Pour stocker le filtre de nom
    const [selectedSport, setSelectedSport] = useState("Tous"); // Pour stocker le filtre de sport
    const [sportsGroupes, setSportsGroupes] = useState([]); // Pour stocker les groupes de sports
    const [currInd, setCurrInd] = useState(1); // Pour stocker l'indice de la page actuelle

    useEffect(() => { // Récupérer les groupes et les créneaux lors du chargement du composant
        fetchGroupes();
        fetchSportsGroupes();
        fetchCreneaux();
    }, []);

    const fetchCreneaux = async () => { // Fonction pour récupérer les créneaux
        try {
            const response = await axios.get('http://localhost:4000/planning/getAllCreneaux');
            if (response.data.success) setCreneaux(response.data.creneaux);
        } catch (error) {
            console.error('Erreur lors de l\'obtention des creneaux:', error);
        }
    };

    const fetchSportsGroupes = () => { // Fonction pour récupérer les groupes de sports
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

    const fetchGroupes = () => { // Fonction pour récupérer les groupes
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

    const nbItems = paramsData.petites_tables || 7; // Nombre d'éléments par page
    const nbPages = Math.ceil(filteredGroupes.length / nbItems); // Nombre de pages

    // Ensure indices are within valid bounds
    const debInd = Math.max((currInd - 1) * nbItems, 0); // Index de début
    const finInd = Math.min(debInd + nbItems, filteredGroupes.length); // Index de fin

    const groupesParPage = filteredGroupes.slice(debInd, finInd); // Groupes par page

    const handleDeleteGroupe = (id) => { // Fonction pour gérer la suppression d'un groupe
        setGroupeIdToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDeleteGroupe = async () => { // Fonction pour confirmer la suppression d'un groupe
        try {
            await axios.delete(`http://localhost:4000/group/deleteGroup/${groupeIdToDelete}`); // Supprimer le groupe
            setShowDeleteModal(false);
            fetchGroupes();
            setCurrInd(1);
        } catch (error) {
            console.error("Erreur lors de la suppression du dépense:", error);
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
    
    useEffect(() => { // Filtrer les groupes lors de la recherche
        setCurrInd(1);
        filterGroupes();
    }, [searchQuery]);

    const handleFilterModal = () => { // Fonction pour afficher le modal de filtre
        setShowFilterModal(true);
    };

    const HandleClearFilters = () => { // Fonction pour réinitialiser les filtres
        setSelectedNom("Pas de filtre");
        setSelectedSport("Tous");
    };

    const handleCreneauChange = (e) => { // Fonction pour gérer le changement de créneau
        const creneauId = parseInt(e.target.value);
        setSelectedCreneau(creneauId);
    };

    const handleSignalerAbsences = (id) => { // Fonction pour signaler les absences
        setReportedGroup(id);
        const filtered = creneaux.filter(creneau => creneau.id_groupe === id);
        setFilteredCreneaux(filtered);
        setSelectedCreneau(filtered[0]?.id_creneau || 0);
        setShowSignalerAbsences(true);
    };

    const confirmSignalerAbsences = () => async () => { // Fonction pour confirmer le signalement des absences
        setShowSignalerAbsences(false);
        try {
            await axios.post('http://localhost:4000/attendance/reportAbsentsGroupe', {
                id_creneau: selectedCreneau,
                id_groupe: reportedGroup
            });
        } catch (error) {
            console.error('Erreur lors du signalement des absences:', error);
        }
    };

    const filterGroupes = () => { // Fonction pour filtrer les groupes
        let filtered = groupes;
    
        if (searchQuery.trim() !== "") { // Filtrer par recherche
            filtered = filtered.filter((groupe) => {
                const name = groupe.nom_groupe.toLowerCase();
                const sport = groupe.nom_sport.toLowerCase();
                return (name.includes(searchQuery.toLowerCase()) || sport.includes(searchQuery.toLowerCase()));
            });
        }
    
        if (selectedSport !== "Tous") { // Filtrer par sport
            filtered = filtered.filter((groupe) => groupe.nom_sport === selectedSport);
        }
    
        if (selectedNom !== "Pas de filtre") { // Filtrer par nom
            filtered.sort((a, b) => {
                if (selectedNom === "Ascendant") {
                    return a.nom_groupe.localeCompare(b.nom_groupe);
                } else if (selectedNom === "Descendant") {
                    return b.nom_groupe.localeCompare(a.nom_groupe);
                }
                return 0;
            });
        }
     
        setFilteredGroupes(filtered); // Mettre à jour les groupes filtrés
    };    

    const handleFilter = () => { // Fonction pour gérer le filtre
        setShowFilterModal(false);
        filterGroupes();
        setCurrInd(1);
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
                                <h1 style={{ textAlign: 'center', marginTop: '3%' }}>Pas de groupes!</h1>
                            ) : (
                            <table className="table-profiles">
                                <thead>
                                    <tr>
                                        <th>Groupe</th>
                                        <th>Sport</th>
                                        <th>Liste des membres</th>
                                        <th>Liste des coachs</th>
                                        <th>Signalement des absences</th>
                                        {authData.role === 'Administrateur' && <th>Actions</th> }
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupesParPage.map((groupe) => (
                                        <tr key={groupe.id_groupe}>
                                            <th>{groupe.nom_groupe}</th>
                                            <th>{groupe.nom_sport}</th>
                                            <th><Link className="link" to="/membres" state={{sport: groupe.nom_sport, groupe: groupe.nom_groupe}}><span className="material-icons-outlined pointed">person</span></Link></th>
                                            <th><Link className="link" to="/coachs" state={{sport: groupe.nom_sport, groupe: groupe.nom_groupe}}><span className="material-icons-outlined pointed">sports</span></Link></th>
                                            <th><button className="link" onClick={() => { handleSignalerAbsences(groupe.id_groupe) }}><span className="material-icons-outlined pointed">person_off</span></button></th>
                                            <th>
                                                {authData.role === 'Administrateur' &&
                                                    <>
                                                        <Link className="link" to="./modifier" state={{id_groupe: groupe.id_groupe, id_sport: groupe.id_sport, nom_groupe: groupe.nom_groupe}}><span className="material-icons-outlined pointed">edit</span></Link>
                                                        <button className="link" onClick={() => handleDeleteGroupe(groupe.id_groupe)}><span className="material-icons-outlined pointed">delete</span></button>
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
            {showSignalerAbsences && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Choisissez le créneau horaire:</h3>
                        </div>
                        <div className="modal-content">
                            {filteredCreneaux.length > 0 ? (
                                <div className="filter-options">
                                    <div className="filter-option">
                                        <select name="id_creneau" value={selectedCreneau} onChange={handleCreneauChange}>
                                            {filteredCreneaux.map(creneau => (
                                                <option key={creneau.id_creneau} value={creneau.id_creneau}>
                                                    {creneau.title} - {formatDateHeure(creneau.start)} - {formatDateHeure(creneau.end)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <h3 style={{ textAlign: 'center', marginTop: '3%' }}>Pas de créneaux horaires!</h3>
                            )
                            }
                        </div>
                        <div className="modal-buttons">
                            <button onClick={confirmSignalerAbsences()} className="btn pointed"><span className="link">Signaler</span></button>
                            <button onClick={() => setShowSignalerAbsences(false)} className="btn pointed"><span className="link">Retourner</span></button>
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