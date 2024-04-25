import React, { useState, useEffect } from "react";
import './Membres.css';
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from 'axios';
import Searchbar from "../../components/general/Searchbar/Searchbar";
import PhotoStandard from '../../assets/images/photoprofilestandard.png';

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
        try {
            await axios.delete(`http://localhost:4000/members/deleteMember/${membreIdToDelete}`);
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
        } else {
            if (ind === nbPages) {
                if (currInd < nbPages) setCurrInd(ind);
            } else {
                setCurrInd(ind);
            }
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

    const filterMembres = () => {
        /*let filtered = [...membres];
        
        filtered = filtered.filter(admin => {
            const fullName = `${admin.nom} ${admin.prenom}`.toLowerCase();
            const username = admin.username.toLowerCase();
            return fullName.includes(searchQuery.toLowerCase()) || username.includes(searchQuery.toLowerCase());
        });

        if (selectedRole !== "Pas de filtre") {
            filtered = filtered.filter(admin => admin.role === selectedRole);
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
        } else if (selectedPrenom !== "Pas de filtre") {
            filtered.sort((a, b) => {
                if (selectedPrenom === "Ascendant") {
                    return a.prenom.localeCompare(b.prenom);
                } else if (selectedPrenom === "Descendant") {
                    return b.prenom.localeCompare(a.prenom);
                }
                return 0;
            });
        } else if (selectedUsername !== "Pas de filtre") {
            filtered.sort((a, b) => {
                if (selectedUsername === "Ascendant") {
                    return a.username.localeCompare(b.username);
                } else if (selectedUsername === "Descendant") {
                    return b.username.localeCompare(a.username);
                }
                return 0;
            });
        }
        
        setFilteredAdmins(filtered);*/
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
                                            <th>{membre.date_naissance}</th>
                                            <th>{membre.sexe}</th>
                                            <th>{membre.date_inscription}</th>
                                            <th><span className={new Date(membre.dateAbn) > new Date() ? "success" : "danger"}>{new Date(membre.dateAbn) > new Date() ? "Payé" : "Non payé"}</span></th>
                                            <th>
                                                <Link className="link"><span className="material-icons-outlined pointed">info</span></Link>
                                                <Link className="link" to="./modifier" state={{id: membre.id_membre, nom: membre.nom, prenom: membre.prenom, email: membre.email, dateNais: membre.dateNais, sexe: membre.sexe, telephone: membre.telephone, age: membre.age, taille: membre.taille, poids: membre.poids, sang: membre.sang, maladies: membre.maladies, dateAbn: membre.dateAbn, montantPaye: membre.montantPaye, montantRestant: membre.montantRestant}}><span className="material-icons-outlined pointed">edit</span></Link>
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
                            {/*<div className="filter-options">
                                <div className="filter-option">
                                    <label>Nom: </label>
                                    <select name="nom" id="nom" value={selectedNom} onChange={(e) => setSelectedNom(e.target.value)}>
                                        <option value="Pas de filtre">Pas de filtre</option>
                                        <option value="Ascendant">Ascendant</option>
                                        <option value="Descendant">Descendant</option>
                                    </select>
                                </div>
                                <div className="filter-option">
                                    <label>Prénom: </label>
                                    <select disabled={selectedNom !== "Pas de filtre" && selectedUsername === "Pas de filtre" ? true : false} name="prenom" id="prenom" value={selectedPrenom} onChange={(e) => setSelectedPrenom(e.target.value)}>
                                        <option value="Pas de filtre">Pas de filtre</option>
                                        <option value="Ascendant">Ascendant</option>
                                        <option value="Descendant">Descendant</option>
                                    </select>
                                </div>
                                <div className="filter-option">
                                    <label>Nom d'utilisateur: </label>
                                    <select disabled={selectedNom !== "Pas de filtre" ? true : false} name="username" id="username" value={selectedUsername} onChange={(e) => setSelectedUsername(e.target.value)}>
                                        <option value="Pas de filtre">Pas de filtre</option>
                                        <option value="Ascendant">Ascendant</option>
                                        <option value="Descendant">Descendant</option>
                                    </select>
                                </div>
                                <div className="filter-option">
                                    <label>Etat: </label>
                                    <select name="etat" id="role" value={selectedEtat} onChange={(e) => setSelectedRole(e.target.value)}>
                                        <option value="Tous">Tous</option>
                                        <option value="Administrateur">Payé</option>
                                        <option value="Gestionnaire">Non payé</option>
                                    </select>
                                </div>
                            </div>*/}
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