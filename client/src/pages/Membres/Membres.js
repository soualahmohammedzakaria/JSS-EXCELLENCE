import React, { useState, useEffect } from "react";
import './Membres.css';
import { Link, useLocation } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from 'axios';
import Searchbar from "../../components/general/Searchbar/Searchbar";
import PhotoStandard from '../../assets/images/photoprofilestandard.png';
import { formatDate, calculerAge } from "../../utils/datesUtils";
import { useParamsContext } from '../../hooks/paramsContext/ParamsContext';

const Membres = () => {
    const location = useLocation();
    const { paramsData } = useParamsContext();
    const [searchQuery, setSearchQuery] = useState("");
    const [membres, setMembres] = useState([]);
    const [filteredMembres, setFilteredMembres] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [membreIdToDelete, setMembreIdToDelete] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState({
        nom: "Pas de filtre",
        prenom: "Pas de filtre",
        email: "Pas de filtre",
        categorie: "Tous",
        etat: "Tous",
        sexe: "Tous",
        groupeSanguin: "Tous",
        sport: location.state?.sport || "Tous",
        groupe: location.state?.groupe || "Tous"
    });
    
    const [sportsGroupes, setSportsGroupes] = useState([]);

    useEffect(() => {
        fetchMembres(); 
        fetchSportsGroupes();
    }, []);

    useEffect(() => {
        if (sportsGroupes.length > 0 && membres.length > 0 && selectedFilters.groupe !== "Tous" && selectedFilters.sport !== "Tous" && !showFilterModal) {
            filterMembres();
        }
    }, [sportsGroupes, membres, selectedFilters.groupe, selectedFilters.sport]);

    const fetchMembres = () => {
        axios.get('http://localhost:4000/member/getAllMembers')
            .then(response => {
                if(response.data.success){
                    setMembres(response.data.members);
                    setFilteredMembres(response.data.members);
                }
            })
            .catch(error => {
                console.error('Erreur de l\'obtention des membres:', error);
            });
    };

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

    const nbItems = paramsData.grandes_tables || 5;
    const [currInd, setCurrInd] = useState(1);

    const nbPages = Math.ceil(filteredMembres.length / nbItems);

    const debInd = (currInd - 1) * nbItems;
    const finInd = debInd + nbItems;

    const membresParPage = filteredMembres.slice(debInd, finInd);

    const handleDeleteMembre = async (id) => {
        setMembreIdToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDeleteMembre = async () => {
        try {
            await axios.delete(`http://localhost:4000/member/deleteMember/${membreIdToDelete}`);
            setShowDeleteModal(false);
            fetchMembres();
            setCurrInd(1);
        } catch (error) {
            console.error('Erreur lors de la suppression du membre:', error);
        }
    };

    const handlePageChange = (ind) => {
        if (ind === 1) {
            if (currInd > 1) setCurrInd(ind);
        } else if (ind === nbPages) {
            if (currInd < nbPages) setCurrInd(ind);
        } else {
            setCurrInd(ind);
        }
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrInd(1);
        filterMembres();
    };

    const handleFilterModal = () => {
        setShowFilterModal(true);
    };

    const HandleClearFilters = () => {
        setSelectedFilters({
            nom: "Pas de filtre",
            prenom: "Pas de filtre",
            email: "Pas de filtre",
            categorie: "Tous",
            etat: "Tous",
            sexe: "Tous",
            groupeSanguin: "Tous",
            sport: "Tous",
            groupe: "Tous"
        });
    };

    const filterMembres = () => {
        let filtered = [...membres];
        
        if (searchQuery.trim() !== ""){
            filtered = filtered.filter(membre => {
                const fullName = `${membre.nom} ${membre.prenom}`.toLowerCase();
                const email = membre.email.toLowerCase();
                return fullName.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
            });
        }
    
        if (selectedFilters.sexe !== "Tous") {
            filtered = filtered.filter(membre => membre.sexe === selectedFilters.sexe);
        }
    
        if (selectedFilters.groupeSanguin !== "Tous") {
            filtered = filtered.filter(membre => membre.groupe_sanguin === selectedFilters.groupeSanguin);
        }
    
        if (selectedFilters.etat !== "Tous") {
            if (selectedFilters.etat === "Payé") {
                filtered = filtered.filter(membre => membre.etat_abonnement === "Payé");
            } else if (selectedFilters.etat === "Non payé") {
                filtered = filtered.filter(membre => membre.etat_abonnement === "Non payé");
            }
        }
    
        if (selectedFilters.categorie !== "Tous") {
            filtered = filtered.filter(membre => {
                const age = calculerAge(membre.date_naissance);
                if (selectedFilters.categorie === "Enfants") {
                    return age < 13;
                } else if (selectedFilters.categorie === "Adolescents") {
                    return (age >= 13 && age < 19);
                } else if (selectedFilters.categorie === "Adultes") {
                    return age >= 19;
                }
                return true;
            });
        }
    
        if (selectedFilters.sport !== "Tous") {
            const sport = sportsGroupes.find(sport => sport.nom === selectedFilters.sport);
            if (sport) {
                filtered = filtered.filter(membre => {
                    if (selectedFilters.groupe !== "Tous") {
                        const group = sport.groupes.find(groupe => groupe.nom_groupe === selectedFilters.groupe);
                        return group && membre.groupes.some(m => m.id_groupe === group.id_groupe);
                    }
                    return sport.groupes.some(group => membre.groupes.some(m => m.id_groupe === group.id_groupe));
                });
            }
        }
    
        if (selectedFilters.nom !== "Pas de filtre") {
            filtered.sort((a, b) => {
                if (selectedFilters.nom === "Ascendant") {
                    return a.nom.localeCompare(b.nom);
                } else if (selectedFilters.nom === "Descendant") {
                    return b.nom.localeCompare(a.nom);
                }
                return 0;
            });
        } else if (selectedFilters.email !== "Pas de filtre") {
            filtered.sort((a, b) => {
                if (selectedFilters.email === "Ascendant") {
                    return a.email.localeCompare(b.email);
                } else if (selectedFilters.email === "Descendant") {
                    return b.email.localeCompare(a.email);
                }
                return 0;
            });
        } else if (selectedFilters.prenom !== "Pas de filtre") {
            filtered.sort((a, b) => {
                if (selectedFilters.prenom === "Ascendant") {
                    return a.prenom.localeCompare(b.prenom);
                } else if (selectedFilters.prenom === "Descendant") {
                    return b.prenom.localeCompare(a.prenom);
                }
                return 0;
            });
        }
    
        setFilteredMembres(filtered);
    };      

    const handleFilter = () => {
        setShowFilterModal(false);
        filterMembres();
    };   
    
    const handleSportChange = (e) => {
        const selectedSport = e.target.value;
        setSelectedFilters(prevFilters => ({
            ...prevFilters,
            sport: selectedSport,
            groupe: selectedSport === "Tous" ? "Tous" : sportsGroupes.find(sport => sport.nom === selectedSport).groupes[0].nom_groupe
        }));
    };

    return (
        <>
            <Navbar />
            <main>
                <Sidebar currPage="/membres" />
                <div className="top-container">
                    <div className="header">
                        <h1>Membres</h1>
                        <div>
                            <button className="btn" style={{ marginRight: "0.5rem" }}>
                                <Link to="/membres/supprimes" className="link">
                                    <span className="material-icons-outlined">folder_delete</span>
                                </Link>
                            </button>
                            <button className="btn">
                                <Link to="/membres/ajouter" className="link">
                                    <span className="material-icons-outlined">add</span>
                                </Link>
                            </button>
                        </div>
                    </div>
                    <Searchbar handleSearch={handleSearch} handleFilterModal={handleFilterModal}/>
                    <div>
                        {membresParPage.length === 0 ? (
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
                                    <th>Date d'inscription</th>
                                    <th>Etat</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {membresParPage.map((membre) => (
                                        <tr key={membre.id_membre}>
                                            <th><img src={PhotoStandard} alt=""/></th>
                                            <th>{membre.nom} {membre.prenom}</th>
                                            <th>{membre.telephone}</th>
                                            <th>{membre.email}</th>
                                            <th>{formatDate(membre.date_naissance)}</th>
                                            <th>{membre.sexe}</th>
                                            <th>{formatDate(membre.date_inscription)}</th>
                                            <th><span className={membre.etat_abonnement === "Payé" ? "success" : "danger"}>{membre.etat_abonnement}</span></th>
                                            <th>
                                                <Link className="link" to="./details" state={{id: membre.id_membre}}><span className="material-icons-outlined pointed">info</span></Link>
                                                <Link className="link" to="./modifier" state={{id: membre.id_membre, nom: membre.nom, prenom: membre.prenom, email: membre.email, dateNais: membre.dateNais, sexe: membre.sexe, telephone: membre.telephone, age: membre.age, taille: membre.taille, poids: membre.poids, sang: membre.sang, maladies: membre.maladies, date_inscription: membre.date_inscription, montantPaye: membre.montantPaye, montantRestant: membre.montantRestant}}><span className="material-icons-outlined pointed">edit</span></Link>
                                                <button className="link" onClick={() => handleDeleteMembre(membre.id_membre)}><span className="material-icons-outlined pointed">delete</span></button>
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
                            <h3>Etes-vous sûr de vouloir supprimer ce membre?</h3>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={confirmDeleteMembre} className="btn pointed"><span className="link">Confirmer</span></button>
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
                                        <label>Etat</label>
                                        <select name="etat" value={selectedFilters.etat} onChange={(e) => setSelectedFilters(prevFilters => ({...prevFilters, etat: e.target.value}))}>
                                            <option value="Tous">Tous</option>
                                            <option value="Payé">Payé</option>
                                            <option value="Non payé">Non payé</option>
                                        </select>
                                    </div>
                                    <div className="filter-option">
                                        <label>Age</label>
                                        <select name="categorie" value={selectedFilters.categorie} onChange={(e) => setSelectedFilters(prevFilters => ({...prevFilters, categorie: e.target.value}))}>
                                            <option value="Tous">Tous</option>
                                            <option value="Enfants">Enfants</option>
                                            <option value="Adolescents">Adolescents</option>
                                            <option value="Adultes">Adultes</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="filter-options">
                                    <div className="filter-option">
                                        <label>Sexe</label>
                                        <select name="sexe" value={selectedFilters.sexe} onChange={(e) => setSelectedFilters(prevFilters => ({...prevFilters, sexe: e.target.value}))}>
                                            <option value="Tous">Tous</option>
                                            <option value="Homme">Homme</option>
                                            <option value="Femme">Femme</option>
                                        </select>
                                    </div>
                                    <div className="filter-option">
                                        <label>Groupe sanguin</label>
                                        <select name="groupesanguin" value={selectedFilters.groupeSanguin} onChange={(e) => setSelectedFilters(prevFilters => ({...prevFilters, groupeSanguin: e.target.value}))}>
                                            <option value="Tous">Tous</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="Autre">Autre</option>
                                        </select>
                                    </div>
                                    <div className="filter-option">
                                        <label>Sport</label>
                                        <select name="sport" value={selectedFilters.sport} onChange={handleSportChange}>
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
        </>
    )
}

export default Membres;