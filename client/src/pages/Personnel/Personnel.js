import React, { useState, useEffect } from "react";
import './Personnel.css';
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import Searchbar from "../../components/general/Searchbar/Searchbar";
import axios from 'axios';
import { useAuthContext } from '../../hooks/authContext/authContext';
import { useParamsContext } from '../../hooks/paramsContext/ParamsContext';

const Admins = () => {
    const { paramsData } = useParamsContext(); // Obtenir les paramètres globaux
    const { authData } = useAuthContext();  // Obtenir les données de l'utilisateur authentifié
    const [searchQuery, setSearchQuery] = useState(""); // Recherche
    const [admins, setAdmins] = useState([]); // État pour les administrateurs
    const [filteredAdmins, setFilteredAdmins] = useState([]); // État pour les administrateurs filtrés
    const [showDeleteModal, setShowDeleteModal] = useState(false); // État pour l'affichage de la modal de suppression
    const [showFilterModal, setShowFilterModal] = useState(false); // État pour l'affichage de la modal de filtre
    const [adminIdToDelete, setAdminIdToDelete] = useState(null); // État pour l'ID de l'administrateur à supprimer
    const [selectedRole, setSelectedRole] = useState("Tous"); // État pour le rôle sélectionné
    const [selectedNom, setSelectedNom] = useState("Pas de filtre"); // État pour le nom sélectionné
    const [selectedPrenom, setSelectedPrenom] = useState("Pas de filtre"); // État pour le prénom sélectionné
    const [selectedUsername, setSelectedUsername] = useState("Pas de filtre"); // État pour le nom d'utilisateur sélectionné

    useEffect(() => { // Pour obtenir les administrateurs lors du chargement du composant
        fetchAdmins();
    }, []);

    const fetchAdmins = () => { // Fonction pour obtenir les administrateurs
        axios.get('http://localhost:4000/user/getAllUsers')
            .then(response => {
                setAdmins(response.data.users);
                setFilteredAdmins(response.data.users);
            })
            .catch(error => {
                console.error('Erreur de l\'obtention des utilisateurs:', error);
            });
    };

    const nbItems = paramsData.petites_tables || 5; // Nombre d'éléments par page
    const [currInd, setCurrInd] = useState(1); // État pour l'indice de la page courante

    const nbPages = Math.ceil(filteredAdmins.length / nbItems); // Nombre de pages

    const debInd = (currInd - 1) * nbItems; // Indice de début
    const finInd = debInd + nbItems; // Indice de fin

    const adminsParPage = filteredAdmins.slice(debInd, finInd); // Les administrateurs à afficher

    const handleDeleteAdmin = async (id) => { // Fonction pour gérer la suppression d'un administrateur
        setAdminIdToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDeleteAdmin = async () => { // Fonction pour confirmer la suppression d'un administrateur
        try {
            await axios.delete(`http://localhost:4000/user/deleteUser/${adminIdToDelete}`);
            setShowDeleteModal(false);
            fetchAdmins();
            setCurrInd(1);
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur:', error);
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
     
    useEffect(() => { // Pour filtrer les administrateurs lors de la recherche
        setCurrInd(1);
        filterAdmins();
    }, [searchQuery]);

    const handleFilterModal = () => { // Fonction pour afficher la modal de filtre
        setShowFilterModal(true);
    };

    const HandleClearFilters = () => { // Fonction pour réinitialiser les filtres
        setSelectedNom("Pas de filtre");
        setSelectedPrenom("Pas de filtre");
        setSelectedUsername("Pas de filtre");
        setSelectedRole("Tous");
    };

    const filterAdmins = () => { // Fonction pour filtrer les administrateurs
        let filtered = [...admins];
        
        if (searchQuery.trim() !== ""){
            filtered = filtered.filter(admin => {
                const fullName = `${admin.nom} ${admin.prenom}`.toLowerCase();
                const username = admin.username.toLowerCase();
                return fullName.includes(searchQuery.toLowerCase()) || username.includes(searchQuery.toLowerCase());
            });
        }       

        if (selectedRole !== "Tous") {
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
        } else if (selectedUsername !== "Pas de filtre") {
            filtered.sort((a, b) => {
                if (selectedUsername === "Ascendant") {
                    return a.username.localeCompare(b.username);
                } else if (selectedUsername === "Descendant") {
                    return b.username.localeCompare(a.username);
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
        
        setFilteredAdmins(filtered);
    };

    const handleFilter = () => {
        setShowFilterModal(false);
        filterAdmins();
        setCurrInd(1);
    };    

    return (
        <>
            <Navbar />
            <main>
                <Sidebar currPage="/admins" />
                <div className="top-container">
                    <div className="header">
                        <h1>Personnel</h1>
                        <button className="btn">
                            <Link to="/admins/ajouter" className="link"><span className="material-icons-outlined">add</span></Link>
                        </button>
                    </div>
                    <Searchbar handleSearch={handleSearch} handleFilterModal={handleFilterModal}/>
                    <div>
                        {adminsParPage.length === 0 ? (
                            <h1 style={{ textAlign: 'center', marginTop: '3%' }}>Pas de profils!</h1>
                        ) : (
                            <table className="table-profiles">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Nom d'utilisateur</th>
                                        <th>Rôle</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminsParPage.map(admin => (
                                        <tr key={admin.id_admin}>
                                            <th>{admin.nom} {admin.prenom}</th>
                                            <th>{admin.username}</th>
                                            <th className={admin.role}>{admin.role}</th>
                                            <th>
                                                {admin.id_admin === authData.id ? (
                                                    <>
                                                        <Link className="link" to="./modifier" state={{ id: admin.id_admin, nom: admin.nom, prenom: admin.prenom, role: admin.role, username: admin.username }}><span className="material-icons-outlined pointed">edit</span></Link>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Link className="link" to="./modifier" state={{ id: admin.id_admin, nom: admin.nom, prenom: admin.prenom, role: admin.role, username: admin.username }}><span className="material-icons-outlined pointed">edit</span></Link>
                                                        <button className="link" onClick={() => handleDeleteAdmin(admin.id_admin)}><span className="material-icons-outlined pointed">delete</span></button>
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
                            <h3>Etes-vous sûr de vouloir supprimer cet utilisateur?</h3>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={confirmDeleteAdmin} className="btn pointed"><span className="link">Confirmer</span></button>
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
                                    <label>Prénom</label>
                                    <select disabled={selectedNom !== "Pas de filtre" || selectedUsername !== "Pas de filtre" ? true : false} name="prenom" id="prenom" value={selectedPrenom} onChange={(e) => setSelectedPrenom(e.target.value)}>
                                        <option value="Pas de filtre">Pas de filtre</option>
                                        <option value="Ascendant">Ascendant</option>
                                        <option value="Descendant">Descendant</option>
                                    </select>
                                </div>
                                <div className="filter-option">
                                    <label>Nom d'utilisateur</label>
                                    <select disabled={selectedNom !== "Pas de filtre" ? true : false} name="username" id="username" value={selectedUsername} onChange={(e) => setSelectedUsername(e.target.value)}>
                                        <option value="Pas de filtre">Pas de filtre</option>
                                        <option value="Ascendant">Ascendant</option>
                                        <option value="Descendant">Descendant</option>
                                    </select>
                                </div>
                                <div className="filter-option">
                                    <label>Rôle</label>
                                    <select name="role" id="role" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                                        <option value="Tous">Tous</option>
                                        <option value="Administrateur">Administrateur</option>
                                        <option value="Gestionnaire">Gestionnaire</option>
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

export default Admins;