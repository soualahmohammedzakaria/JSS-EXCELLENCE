import React, { useState, useEffect } from "react";
import './Membres.css';
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from 'axios';
import Searchbar from "../../components/general/Searchbar/Searchbar";
import PhotoStandard from '../../assets/images/photoprofilestandard.png';
import { formatDate, calculerAge } from "../../utils/datesUtils";

const Membres = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [membres, setMembres] = useState([]);
    const [filteredMembres, setFilteredMembres] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [membreIdToDelete, setMembreIdToDelete] = useState(null);
    const [selectedNom, setSelectedNom] = useState("Pas de filtre");
    const [selectedPrenom, setSelectedPrenom] = useState("Pas de filtre");
    const [selectedEmail, setSelectedEmail] = useState("Pas de filtre");
    const [selectedCategorie, setSelectedCategorie] = useState("Tous");
    const [selectedEtat, setSelectedEtat] = useState("Tous");
    const [selectedSexe, setSelectedSexe] = useState("Tous");
    const [selectedGroupeSanguin, setSelectedGroupeSanguin] = useState("Tous");
    const [selectedSport, setSelectedSport] = useState("Tous");
    const [selectedGroupe, setSelectedGroupe] = useState("Tous");

    useEffect(() => {
        fetchMembres(); 
    }, []);

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

    const nbItems = 5;
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
        console.log(membreIdToDelete);
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
        setSelectedNom("Pas de filtre");
        setSelectedPrenom("Pas de filtre");
        setSelectedEmail("Pas de filtre");
        setSelectedCategorie("Tous");
        setSelectedEtat("Tous");
        setSelectedSexe("Tous");
        setSelectedGroupeSanguin("Tous");
        setSelectedSport("Tous");
        setSelectedGroupe("Tous");
    };

    const filterMembres = () => {
        let filtered = [...membres];
    
        filtered = filtered.filter(membre => {
            const fullName = `${membre.nom} ${membre.prenom}`.toLowerCase();
            const email = membre.email.toLowerCase();
            return fullName.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
        });
    
        if (selectedSexe !== "Tous") {
            filtered = filtered.filter(membre => membre.sexe === selectedSexe);
        }
    
        if (selectedGroupeSanguin !== "Tous") {
            filtered = filtered.filter(membre => membre.groupe_sanguin === selectedGroupeSanguin);
        }
    
        if (selectedEtat !== "Tous") {
            if (selectedEtat === "Payé") {
                filtered = filtered.filter(membre => new Date(membre.date_inscription) > new Date());
            } else if (selectedEtat === "Non payé") {
                filtered = filtered.filter(membre => new Date(membre.date_inscription) < new Date());
            }
        }
    
        if (selectedCategorie !== "Tous") {
            filtered = filtered.filter(membre => {
                const dateNaiss = new Date(membre.date_naissance);
                const age = calculerAge(dateNaiss);
                console.log(membre, age);
                if (selectedCategorie === "Enfants") {
                    return age < 13;
                } else if (selectedCategorie === "Adolescent") {
                    return (age >= 13 && age < 19);
                } else if (selectedCategorie === "Adultes") {
                    return age >= 19;
                }
                return true;
            });
        }
    
        if (selectedNom !== "Pas de filtre") {
            filtered.sort((a, b) => {
                if (selectedNom === "Ascendant") {
                    return a.nom.localeCompare(b.nom);
                } else if (selectedNom === "Descendant") {
                    return b.nom.localeCompare(a.nom);
                }
                return 0;
            });
        } else if (selectedEmail !== "Pas de filtre") {
            filtered.sort((a, b) => {
                if (selectedEmail === "Ascendant") {
                    return a.email.localeCompare(b.email);
                } else if (selectedEmail === "Descendant") {
                    return b.email.localeCompare(a.email);
                }
                return 0;
            });
        } else if (selectedPrenom !== "Pas de filtre") {
            filtered.sort((a, b) => {
                if (selectedPrenom === "Ascendant") {
                    return a.prenom.localeCompare(b.prenom);
                } else if (selectedPrenom === "Descendant") {
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

    return (
        <>
            <Navbar />
            <main>
                <Sidebar currPage="/membres" />
                <div className="top-container">
                    <div className="header">
                        <h1>Membres</h1>
                        <button className="btn">
                            <Link to="/membres/ajouter" className="link">
                                <span className="material-icons-outlined">add</span>
                            </Link>
                        </button>
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
                                            <th><span className={new Date(membre.date_inscription) > new Date() ? "success" : "danger"}>{new Date(membre.date_inscription) > new Date() ? "Payé" : "Non payé"}</span></th>
                                            <th>
                                                <Link className="link" to="./details"><span className="material-icons-outlined pointed">info</span></Link>
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
                                        <select name="nom" id="nom" value={selectedNom} onChange={(e) => setSelectedNom(e.target.value)}>
                                            <option value="Pas de filtre">Pas de filtre</option>
                                            <option value="Ascendant">Ascendant</option>
                                            <option value="Descendant">Descendant</option>
                                        </select>
                                    </div>
                                    <div className="filter-option">
                                        <label>Prénom</label>
                                        <select disabled={selectedNom !== "Pas de filtre" || selectedEmail !== "Pas de filtre" ? true : false} name="prenom" id="prenom" value={selectedPrenom} onChange={(e) => setSelectedPrenom(e.target.value)}>
                                            <option value="Pas de filtre">Pas de filtre</option>
                                            <option value="Ascendant">Ascendant</option>
                                            <option value="Descendant">Descendant</option>
                                        </select>
                                    </div>
                                    <div className="filter-option">
                                        <label>Email</label>
                                        <select disabled={selectedNom !== "Pas de filtre" ? true : false} name="email" id="email" value={selectedEmail} onChange={(e) => setSelectedEmail(e.target.value)}>
                                            <option value="Pas de filtre">Pas de filtre</option>
                                            <option value="Ascendant">Ascendant</option>
                                            <option value="Descendant">Descendant</option>
                                        </select>
                                    </div>
                                    <div className="filter-option">
                                        <label>Etat</label>
                                        <select name="etat" id="etat" value={selectedEtat} onChange={(e) => setSelectedEtat(e.target.value)}>
                                            <option value="Tous">Tous</option>
                                            <option value="Payé">Payé</option>
                                            <option value="Non payé">Non payé</option>
                                        </select>
                                    </div>
                                    <div className="filter-option">
                                        <label>Age</label>
                                        <select name="categorie" id="categorie" value={selectedCategorie} onChange={(e) => setSelectedCategorie(e.target.value)}>
                                            <option value="Tous">Tous</option>
                                            <option value="Enfants">Enfants</option>
                                            <option value="Adolescent">Adolescent</option>
                                            <option value="Adultes">Adultes</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="filter-options">
                                    <div className="filter-option">
                                        <label>Sexe</label>
                                        <select name="sexe" id="sexe" value={selectedSexe} onChange={(e) => setSelectedSexe(e.target.value)}>
                                            <option value="Tous">Tous</option>
                                            <option value="Homme">Homme</option>
                                            <option value="Femme">Femme</option>
                                        </select>
                                    </div>
                                    <div className="filter-option">
                                        <label>Groupe sanguin</label>
                                        <select name="groupesanguin" id="groupesanguin" value={selectedGroupeSanguin} onChange={(e) => setSelectedGroupeSanguin(e.target.value)}>
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
                                        <select name="sport" id="sport" value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)}>
                                            <option value="Tous">Tous</option>
                                            <option value="Football">Football</option>
                                            <option value="Basketball">Basketball</option>
                                            <option value="Handball">Handball</option>
                                        </select>
                                    </div>
                                    <div className="filter-option">
                                        <label>Groupe</label>
                                        <select name="groupe" id="groupe" value={selectedGroupe} onChange={(e) => setSelectedGroupe(e.target.value)}>
                                            <option value="Tous">Tous</option>
                                            <option value="Groupe 1">Groupe 1</option>
                                            <option value="Groupe 2">Groupe 2</option>
                                            <option value="Groupe 3">Groupe 3</option>
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