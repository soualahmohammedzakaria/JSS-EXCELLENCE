import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from 'axios';
import './Coachs.css';
import Searchbar from "../../components/general/Searchbar/Searchbar";
import PhotoStandard from '../../assets/images/photoprofilestandard.png';
import { formatDate } from "../../utils/datesUtils";
import { useParamsContext } from '../../hooks/paramsContext/ParamsContext';
import { useAuthContext } from '../../hooks/authContext/authContext';

const Coachs = () => {
    const { authData } = useAuthContext(); // Les données de l'utilisateur
    const location = useLocation(); // Hook pour obtenir les données de l'URL
    const { paramsData } = useParamsContext(); // Les paramètres
    const [searchQuery, setSearchQuery] = useState(""); // La recherche
    const [coachs, setCoachs] = useState([]); // Les coachs
    const [filteredCoachs, setFilteredCoachs] = useState([]); // Les coachs filtrés
    const [showDeleteCoach, setShowDeleteCoach] = useState(false); // Afficher la modal de suppression
    const [showDeleteCoachGroupe, setShowDeleteCoachGroupe] = useState(false); // Afficher la modal de suppression du groupe
    const [showAssignerModal, setShowAssignerModal] = useState(false); // Afficher la modal d'assignation
    const [selectedSport, setSelectedSport] = useState(null); // Le sport sélectionné
    const [selectedGroup, setSelectedGroup] = useState(null); // Le groupe sélectionné
    const [errorMessage, setErrorMessage] = useState(""); // Message d'erreur
    const [sportsGroupes, setSportsGroupes] = useState([]); // Les sports et groupes
    const [groupToDelete, setGroupToDelete] = useState(null); // Le groupe à supprimer
    const [showFilterModal, setShowFilterModal] = useState(false); // Afficher la modal de filtre
    const [showGroupesModal, setShowGroupesModal] = useState(false); // Afficher la modal des groupes
    const [coachIdToDelete, setCoachIdToDelete] = useState(null); // L'id du coach à supprimer
    const [selectedCoach, setSelectedCoach] = useState(null); // Le coach sélectionné
    const [selectedFilters, setSelectedFilters] = useState({ // Les filtres sélectionnés
        nom: "Pas de filtre",
        prenom: "Pas de filtre",
        email: "Pas de filtre",
        sexe: "Tous",
        sport: location.state?.sport || "Tous",
        groupe: location.state?.groupe || "Tous"
    });

    useEffect(() => { // Récupérer les coachs et les sports et groupes
        fetchCoachs();
        fetchSportsGroupes();
    }, []);

    useEffect(() => { // Filtrer les coachs
        if (sportsGroupes.length > 0 && coachs.length > 0 && selectedFilters.groupe !== "Tous" && selectedFilters.sport !== "Tous" && !showFilterModal) {
            filterCoachs();
        }
    }, [sportsGroupes, coachs, selectedFilters.groupe, selectedFilters.sport]);

    const fetchSportsGroupes = () => { // Fonction pour récupérer les sports et groupes
        axios.get("http://localhost:4000/sport/getAllSportsGroupes") // Récupérer les sports et groupes
            .then(response => { // Gérer la réponse
                if (response.data.success) {
                    const defaultSport = response.data.sportsGroupes[0];
                    const defaultGroup = defaultSport.groupes[0];
                    setSelectedSport(defaultSport);
                    setSelectedGroup(defaultGroup);
                    setSportsGroupes(response.data.sportsGroupes);
                }
            })
            .catch(error => { // Gérer les erreurs
                console.error('Erreur de l\'obtention des sports et groupes:', error);
            });
    };
  
    const fetchCoachs = () => { // Fonction pour récupérer les coachs
        axios.get('http://localhost:4000/coach/getAllCoachs') // Récupérer les coachs
            .then(response => {
                if(response.data.success){ // Si la récupération a réussi
                    setCoachs(response.data.coachs);
                    setFilteredCoachs(response.data.coachs);
                }
            })
            .catch(error => {
                console.error('Erreur de l\'obtention des coachs:', error); // Gérer les erreurs
            });
    };

    const nbItems = paramsData.grandes_tables || 5; // Nombre d'éléments par page
    const [currInd, setCurrInd] = useState(1); // L'indice courant

    const nbPages = Math.ceil(filteredCoachs.length / nbItems); // Nombre de pages

    const debInd = (currInd - 1) * nbItems; // Indice de début
    const finInd = debInd + nbItems; // Indice de fin

    const coachsParPage = filteredCoachs.slice(debInd, finInd); // Les coachs par page

    const handleSportChange = (e) => { // Fonction pour gérer le changement de sport
        const sportId = parseInt(e.target.value);
        const selectedSport = sportsGroupes.find(sport => sport.id_sport === sportId);
        setSelectedSport(selectedSport); // Mettre à jour le sport sélectionné
        setSelectedGroup(selectedSport.groupes[0]); // Mettre à jour le groupe sélectionné
    }; 

    const handleGroupChange = (e) => { // Fonction pour gérer le changement de groupe
        const groupId = parseInt(e.target.value); // L'id du groupe
        const selectedGroup = selectedSport.groupes.find(group => group.id_groupe === groupId); // Le groupe sélectionné
        setSelectedGroup(selectedGroup); // Mettre à jour le groupe sélectionné
    };
    

    const handleAssignerGroupe = async () => { // Fonction pour assigner un coach à un groupe
        try {
            // Assigner le coach au groupe
            const response = await axios.post(`http://localhost:4000/coach/assignCoachToGroup/${selectedCoach.id_coach}`, { groupId: selectedGroup.id_groupe });
            if(response.data.success){
                setShowAssignerModal(false);
                setShowGroupesModal(false);
                fetchCoachs();
                setErrorMessage("");
            }else {   
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setErrorMessage("Désolé, une erreur s'est produite!");
        }
    };

    const handleDeleteCoach = async (id) => { // Fonction pour gérer la suppression d'un coach
        setCoachIdToDelete(id);
        setShowDeleteCoach(true);
    };
    
    const confirmDeleteCoach = async () => { // Fonction pour confirmer la suppression d'un coach
        try {
            await axios.delete(`http://localhost:4000/Coach/deleteCoach/${coachIdToDelete}`); // Supprimer le coach
            setShowDeleteCoach(false); // Cacher la modal
            fetchCoachs(); // Récupérer les coachs
            setCurrInd(1); // Mettre à jour l'indice courant
        } catch (error) {
            console.error('Erreur lors de la suppression du coach:', error);
        }
    };
    

    const handlePageChange = (ind) => { // Fonction pour gérer le changement de page
        if (ind === 1) {
            if (currInd > 1) setCurrInd(ind);
        } else if (ind === nbPages) {
            if (currInd < nbPages) setCurrInd(ind);
        } else {
            setCurrInd(ind);
        }
    }

    const handleSearch = (event) => { // Fonction pour gérer la recherche
        const value = event.target.value;
        setSearchQuery(value);
    };
    
    useEffect(() => { // Filtrer les coachs
        setCurrInd(1);
        filterCoachs();
    }, [searchQuery]);

    const handleFilterModal = () => { // Fonction pour afficher la modal de filtre
        setShowFilterModal(true);
    };

    const HandleClearFilters = () => { // Fonction pour réinitialiser les filtres
        setSelectedFilters({
            nom: "Pas de filtre",
            prenom: "Pas de filtre",
            email: "Pas de filtre",
            sexe: "Tous",
            sport: "Tous",
            groupe: "Tous"
        });
    };

    const filterCoachs = () => { // Fonction pour filtrer les coachs
        let filtered = [...coachs];
    
        if (searchQuery.trim() !== ""){ // Filtrer par recherche
            filtered = filtered.filter(coach => {
                const fullName = `${coach.nom} ${coach.prenom}`.toLowerCase();
                const email = coach.email.toLowerCase();
                return fullName.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
            });
        }

        if (selectedFilters.sport !== "Tous") { // Filtrer par sport et groupe
            const sport = sportsGroupes.find(sport => sport.nom === selectedFilters.sport);
            if (sport) {
                filtered = filtered.filter(coach => {
                    if (selectedFilters.groupe !== "Tous") {
                        const group = sport.groupes.find(groupe => groupe.nom_groupe === selectedFilters.groupe);
                        return group && coach.groupes.some(m => m.id_groupe === group.id_groupe);
                    }
                    return sport.groupes.some(group => coach.groupes.some(m => m.id_groupe === group.id_groupe));
                });
            }
        }
    
        if (selectedFilters.sexe !== "Tous") { // Filtrer par sexe
            filtered = filtered.filter(coach => coach.sexe === selectedFilters.sexe);
        }
 
        if (selectedFilters.nom !== "Pas de filtre") { // Filtrer par nom, prénom et email
            filtered.sort((a, b) => {
                if (selectedFilters.nom === "Ascendant") {
                    return a.nom.localeCompare(b.nom);
                } else if (selectedFilters.nom === "Descendant") {
                    return b.nom.localeCompare(a.nom);
                }
                return 0;
            });
        } else if (selectedFilters.email !== "Pas de filtre") { // Filtrer par email
            filtered.sort((a, b) => {
                if (selectedFilters.email === "Ascendant") {
                    return a.email.localeCompare(b.email);
                } else if (selectedFilters.email === "Descendant") {
                    return b.email.localeCompare(a.email);
                }
                return 0;
            });
        } else if (selectedFilters.prenom !== "Pas de filtre") { // Filtrer par prénom
            filtered.sort((a, b) => {
                if (selectedFilters.prenom === "Ascendant") {
                    return a.prenom.localeCompare(b.prenom);
                } else if (selectedFilters.prenom === "Descendant") { 
                    return b.prenom.localeCompare(a.prenom);
                }
                return 0;
            });
        }
    
        setFilteredCoachs(filtered); // Mettre à jour les coachs filtrés
    };   
    
    const getNomSport = (groupId) => { // Fonction pour obtenir le nom du sport
        for (const sport of sportsGroupes) {
            const group = sport.groupes.find(g => g.id_groupe === groupId);
            if (group) {
                return sport.nom;
            }
        }
        return "Nom iconnu";
    };
    

    const handleFilter = () => { // Fonction pour gérer le filtre
        setShowFilterModal(false);
        filterCoachs();
        setCurrInd(1);
    };   
    
    const handleDeleteCoachGroup = async (id) => { // Fonction pour gérer la suppression d'un coach du groupe
        setGroupToDelete(id);
        setShowDeleteCoachGroupe(true);
    };

    const confirmDeleteCoachGroupe = async () => { // Fonction pour confirmer la suppression d'un coach du groupe
        try {
            // Supprimer le coach du groupe
            await axios.delete(`http://localhost:4000/coach/deleteGroupCoach/${selectedCoach.id_coach}`, { data: { groupId: groupToDelete } });
            fetchCoachs(); // Récupérer les coachs
            setShowGroupesModal(false);
            setShowDeleteCoachGroupe(false);
        } catch (error) {
            console.error('Erreur lors de la suppression du coach du groupe:', error);
        }
    };

    return (
        <>
            <Navbar />
            <main>
                <Sidebar currPage="/coachs" />
                <div className="top-container">
                    <div className="header">
                        <h1>Coachs</h1>
                        <button className="btn">
                            <Link to="/coachs/ajouter" className="link">
                                <span className="material-icons-outlined">add</span>
                            </Link>
                        </button>
                    </div>
                    <Searchbar handleSearch={handleSearch} handleFilterModal={handleFilterModal}/>
                    <div>
                        {coachsParPage.length === 0 ? (
                                <h1 style={{ textAlign: 'center', marginTop: '3%' }}>Pas de profils!</h1>
                            ) : (
                            <table className="table-profiles">
                                <thead>
                                <tr>
                                    <th>Photo</th>
                                    <th>Nom</th>
                                    <th>Téléphone</th>
                                    <th>Email</th>
                                    <th>Date de naissance</th>
                                    <th>Sexe</th>
                                    <th>Groupes</th>
                                    {authData.role === 'Administrateur' && <th>Actions</th> }
                                </tr>
                                </thead>
                                <tbody>
                                    {coachsParPage.map((coach) => (
                                        <tr key={coach.id_coach}>
                                            <th><img src={coach.photo !== null ? `http://localhost:4000/images/coachs/${coach.photo}.jpeg` : PhotoStandard} alt=""/></th>
                                            <th>{coach.nom} {coach.prenom}</th>
                                            <th>{coach.telephone}</th>
                                            <th>{coach.email === "" ? "Pas d'adresse" : coach.email}</th>
                                            <th>{formatDate(coach.date_naissance)}</th>
                                            <th>{coach.sexe}</th>
                                            <th><button className="link" onClick={() => { setShowGroupesModal(true); setSelectedCoach(coach) }}><span className="material-icons-outlined pointed">group</span></button></th>
                                            <th>
                                                {authData.role === 'Administrateur' &&
                                                    <>
                                                        <Link className="link" to="./modifier" state={{id: coach.id_coach, photo: coach.photo, nom: coach.nom, prenom: coach.prenom, email: coach.email, dateNaissance: coach.date_naissance, sexe: coach.sexe, telephone: coach.telephone, age: coach.age, taille: coach.taille, poids: coach.poids, sang: coach.sang, maladies: coach.maladies, date_inscription: coach.date_inscription, montantPaye: coach.montantPaye, montantRestant: coach.montantRestant}}><span className="material-icons-outlined pointed">edit</span></Link>
                                                        <button className="link" onClick={() => handleDeleteCoach(coach.id_coach)}><span className="material-icons-outlined pointed">delete</span></button>
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
            {showGroupesModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="coach-groupes-header">
                            <span className="material-icons-outlined">group</span>
                            <h1>Groupes</h1>
                            <button className="link pointed" onClick={() => setShowAssignerModal(true)}>
                                <span className="material-icons-outlined">control_point</span>
                            </button>
                        </div>
                        <div>
                            <div className="coach-groupes">
                                {selectedCoach && selectedCoach.groupes && selectedCoach.groupes.length > 0 ? (
                                    selectedCoach.groupes.map(groupe => (
                                        (groupe.id_groupe !== null && groupe.nom_groupe !== null) ? 
                                            <button onClick={() => handleDeleteCoachGroup(groupe.id_groupe)} key={groupe.id_groupe} className="coach-groupe pointed">
                                                {`${getNomSport(groupe.id_groupe)} | ${groupe.nom_groupe}`}
                                            </button>
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
            {showDeleteCoach && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-content">
                            <h3>Etes-vous sûr de vouloir supprimer ce coach?</h3>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={confirmDeleteCoach} className="btn pointed"><span className="link">Confirmer</span></button>
                            <button onClick={() => setShowDeleteCoach(false)} className="btn pointed"><span className="link">Retourner</span></button>
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
                                <div className="filter-options">
                                    <div className="filter-option">
                                        <label>Nom</label>
                                        <select name="nom" value={selectedFilters.nom} onChange={(e) => setSelectedFilters(prevFilters => ({...prevFilters, nom: e.target.value}))}>
                                            <option value="Pas de filtre">Pas de filtre</option>
                                            <option value="Ascendant">Ascendant</option>
                                            <option value="Descendant">Descendant</option>
                                        </select>
                                    </div>
                                    <div className="filter-option">
                                        <label>Prénom</label>
                                        <select name="prenom" disabled={selectedFilters.nom !== "Pas de filtre" || selectedFilters.email !== "Pas de filtre" ? true : false} value={selectedFilters.prenom} onChange={(e) => setSelectedFilters(prevFilters => ({...prevFilters, prenom: e.target.value}))}>
                                            <option value="Pas de filtre">Pas de filtre</option>
                                            <option value="Ascendant">Ascendant</option>
                                            <option value="Descendant">Descendant</option>
                                        </select>
                                    </div>
                                    <div className="filter-option">
                                        <label>Email</label>
                                        <select name="email" disabled={selectedFilters.nom !== "Pas de filtre" ? true : false} value={selectedFilters.email} onChange={(e) => setSelectedFilters(prevFilters => ({...prevFilters, email: e.target.value}))}>
                                            <option value="Pas de filtre">Pas de filtre</option>
                                            <option value="Ascendant">Ascendant</option>
                                            <option value="Descendant">Descendant</option>
                                        </select>
                                    </div>
                                    <div className="filter-option">
                                        <label>Sexe</label>
                                        <select name="sexe" value={selectedFilters.sexe} onChange={(e) => setSelectedFilters(prevFilters => ({...prevFilters, sexe: e.target.value}))}>
                                            <option value="Tous">Tous</option>
                                            <option value="Homme">Homme</option>
                                            <option value="Femme">Femme</option>
                                        </select>
                                    </div>
                                    <div className="filter-option">
                                        <label>Sport</label>
                                        <select name="sport" value={selectedFilters.sport} onChange={(e) => setSelectedFilters(prevFilters => ({...prevFilters, sport: e.target.value}))}>
                                            <option value="Tous">Tous</option>
                                            {sportsGroupes.map(sport => (
                                                <option key={sport.id_sport} value={sport.nom}>{sport.nom}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="filter-option">
                                        <label>Groupe</label>
                                        <select disabled={selectedFilters.sport === "Tous" ? true : false} name="groupe" value={selectedFilters.groupe} onChange={(e) => setSelectedFilters(prevFilters => ({...prevFilters, groupe: e.target.value}))}>
                                            <option value="Tous">Tous</option>
                                            {selectedFilters.sport === "Tous" &&
                                                sportsGroupes.map(sport => (
                                                    sport.groupes.map(groupe => (
                                                        <option key={groupe.id_groupe} value={groupe.nom_groupe}>{groupe.nom_groupe}</option>
                                                    ))
                                                ))
                                            }
                                            {selectedFilters.sport !== "Tous" &&
                                                sportsGroupes.find(sport => sport.nom === selectedFilters.sport).groupes.map(groupe => (
                                                    <option key={groupe.id_groupe} value={groupe.nom_groupe}>{groupe.nom_groupe}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <button onClick={HandleClearFilters} className="btn-reinit pointed">
                                        <span className="link">Réinitialiser</span>
                                    </button>
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
            {showDeleteCoachGroupe && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-content">
                            <h3>Etes-vous sûr de vouloir supprimer ce coach du groupe?</h3>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={confirmDeleteCoachGroupe} className="btn pointed"><span className="link">Confirmer</span></button>
                            <button onClick={() => {setShowDeleteCoachGroupe(false); setGroupToDelete(null)}} className="btn pointed"><span className="link">Retourner</span></button>
                        </div>
                    </div>
                </div>
            )}  
            {showAssignerModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1>Assigner le coach</h1>
                            </div>
                            <div className="filters-body">
                                <div className="filter-options">
                                    <div className="filter-option">
                                        <label>Sport</label>
                                        <select name="sport" value={selectedSport?.id_sport} onChange={handleSportChange}>
                                        {sportsGroupes.map(sport => (
                                            <option key={sport.id_sport} value={sport.id_sport}>
                                                {sport.nom}
                                            </option>
                                        ))}
                                        </select>
                                    </div>
                                    <div className="filter-option">
                                        <label>Groupe</label>
                                        <select name="id_groupe" value={selectedGroup?.id_groupe} onChange={handleGroupChange}>
                                        {selectedSport?.groupes.map(group => (
                                            <option key={group.id_groupe} value={group.id_groupe}>
                                                {group.nom_groupe}
                                            </option>
                                        ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={handleAssignerGroupe} className="btn pointed"><span className="link">Confirmer</span></button>
                            <button onClick={() => { setShowAssignerModal(false); setErrorMessage(""); }} className="btn pointed"><span className="link">Retourner</span></button>
                        </div>
                        {errorMessage && <p style={{ marginTop: "1rem", textAlign: "center" }} className="danger">{errorMessage}</p>}
                    </div>
                </div>
            )}   
        </>
    )
}

export default Coachs;