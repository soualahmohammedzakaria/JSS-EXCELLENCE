import React, { useState, useEffect } from "react";
import './Personnel.css';
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from 'axios';
import PhotoStandard from '../../assets/images/photoprofilestandard.png';
import { useAuthContext } from '../../hooks/authContext/authContext';

const Admins = () => {
    const { authData } = useAuthContext();
    const [searchQuery, setSearchQuery] = useState(""); // État pour la requête de recherche
    const [admins, setAdmins] = useState([]); // État pour stocker les utilisateurs
    const [showModal, setShowModal] = useState(false); // État pour afficher ou masquer le modal
    const [adminIdToDelete, setAdminIdToDelete] = useState(null); // État pour stocker l'ID de l'utilisateur à supprimer

    useEffect(() => {
        fetchAdmins(); // Appel à la fonction pour récupérer les utilisateurs au chargement
    }, []);

    // Fonction pour récupérer les utilisateurs depuis l'API
    const fetchAdmins = () => {
        axios.get('http://localhost:4000/user/getAllUsers')
            .then(response => {
                setAdmins(response.data.users); // Met à jour la liste des utilisateurs
            })
            .catch(error => {
                console.error('Erreur de l\'obtention des utilisateurs:', error);
            });
    };

    const nbItems = 5; // Nombre d'éléments par page
    const [currInd, setCurrInd] = useState(1); // État pour stocker l'index de la page actuelle

    // Filtrer les utilisateurs en fonction de la requête de recherche
    const filteredAdmins = admins.filter(admin => {
        const fullName = `${admin.nom} ${admin.prenom}`.toLowerCase();
        const username = admin.username.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase()) || username.includes(searchQuery.toLowerCase());
    });

    const nbPages = Math.ceil(filteredAdmins.length / nbItems); // Calculer le nombre de pages

    const debInd = (currInd - 1) * nbItems; // Index de début pour l'affichage des éléments actuels
    const finInd = debInd + nbItems; // Index de fin pour l'affichage des éléments actuels

    const adminsParPage = filteredAdmins.slice(debInd, finInd); // Utilisateurs à afficher sur la page actuelle

    // Fonction pour supprimer un utilisateur
    const handleDeleteAdmin = async (id) => {
        // Stocker l'ID de l'utilisateur à supprimer
        setAdminIdToDelete(id);
        // Afficher le modal
        setShowModal(true);
    };

    // Fonction pour confirmer la suppression de l'utilisateur
    const confirmDeleteAdmin = async () => {
        try {
            await axios.delete(`http://localhost:4000/user/deleteUser/${adminIdToDelete}`);
            // Fermer le modal
            setShowModal(false);
            fetchAdmins(); // Met à jour la liste des utilisateurs après la suppression
            setCurrInd(1); // Réinitialise l'index de la page actuelle à 1
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        }
    };

    // Fonction pour gérer le changement de page
    const handlePageChange= (ind) => {
        if(ind === 1){
            if(currInd > 1) setCurrInd(ind);
        } else {
            if(ind === nbPages){
                if(currInd < nbPages) setCurrInd(ind);
            } else {
                setCurrInd(ind);
            }
        }
    }

    // Fonction pour gérer la recherche
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrInd(1); // Réinitialise l'index de la page actuelle à 1 lors de la recherche
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
                            <Link to="/admins/ajouter" className="link">
                                <span class="material-icons-outlined">add</span>
                            </Link>
                        </button>
                    </div>
                    <div className="search-bar">
                        <span className="material-icons-sharp">search</span>
                        <input type="search" placeholder="Rechercher" value={searchQuery} onChange={handleSearch} />
                    </div>
                    <div>
                        {adminsParPage.length === 0 ? ( // Si aucun utilisateur à afficher
                            <h1 style={{ textAlign: 'center', marginTop: '3%' }}>Pas de profils!</h1>
                        ) : ( // Sinon, afficher la table des utilisateurs
                            <table className="table-profiles">
                                <thead>
                                    <tr>
                                        <th>Photo</th>
                                        <th>Nom</th>
                                        <th>Nom d'utilisateur</th>
                                        <th>Rôle</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminsParPage.map(admin =>(
                                        <tr key={admin.id_admin}>
                                            <th><img src={admin.photo ? admin.photo : PhotoStandard} alt=""/></th>
                                            <th>{admin.nom} {admin.prenom}</th>
                                            <th>{admin.username}</th>
                                            <th className={admin.role}>{admin.role}</th>
                                            <th>
                                                {admin.id_admin === authData.id ? ( // Si l'utilisateur est l'utilisateur actuel
                                                    <>
                                                        <Link className="link" to="./modifier" state={{id: admin.id_admin, nom: admin.nom, prenom: admin.prenom, role: admin.role, username: admin.username}}><span className="material-icons-outlined pointed">edit</span></Link>
                                                    </>
                                                ) : ( // Sinon, afficher l'option de suppression
                                                    <>
                                                        <Link className="link" to="./modifier" state={{id: admin.id_admin, nom: admin.nom, prenom: admin.prenom, role: admin.role, username: admin.username}}><span className="material-icons-outlined pointed">edit</span></Link>
                                                        <button className="link" onClick={() => handleDeleteAdmin(admin.id_admin)}><span className="material-icons-outlined pointed">delete</span></button>
                                                    </>
                                                )}
                                            </th>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {nbPages >= 2 && ( // Afficher la pagination si nécessaire
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
            {showModal && ( // Afficher le modal si showModal est true
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-content">
                            <h3>Etes-vous sûr de vouloir supprimer cet utilisateur?</h3>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={confirmDeleteAdmin} className="btn pointed"><span className="link">Confirmer</span></button>
                            <button onClick={() => setShowModal(false)} className="btn pointed"><span className="link">Retourner</span></button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Admins;