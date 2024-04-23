import React, { useState, useEffect } from "react";
import './Membres.css';
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from 'axios';
import Searchbar from "../../components/general/Searchbar/Searchbar";
import PhotoStandard from '../../assets/images/photoprofilestandard.png';

const Membres = () => {
    const [searchQuery, setSearchQuery] = useState(""); // État pour la requête de recherche
    const [membres, setMembres] = useState([]); // État pour stocker les membres
    const [showModal, setShowModal] = useState(false); // État pour afficher ou masquer le modal
    const [membreIdToDelete, setMembreIdToDelete] = useState(null); // État pour stocker l'ID du membre à supprimer

    useEffect(() => {
        fetchMembres(); // Appel à la fonction pour récupérer les membres au chargement
    }, []);

    // Fonction pour récupérer les membres depuis l'API
    const fetchMembres = () => {
        setMembres([
            {
                id_membre: 3,
                nom: "ZEGHIMI",
                prenom: "Adriane",
                telephone: "0601020304",
                dateNais: "01/01/1990",
                dateInsc: "01/01/2024",
                email: "zaydmail@gmail.com",
                sexe: "Homme",
                age: "18",
                taille: "180",
                poids: "70",
                sang: "A+",
                maladies: "Pas de maladies connues",
                dateAbn: "01/01/2024",
                montantPaye: 2500,
                montantRestant: 0
            },
            {
                id_membre: 3,
                nom: "ZEGHIMI",
                prenom: "Adriane",
                telephone: "0601020304",
                dateNais: "01/01/1990",
                dateInsc: "01/01/2024",
                email: "zaydmail@gmail.com",
                sexe: "Homme",
                age: "18",
                taille: "180",
                poids: "70",
                sang: "A+",
                maladies: "Pas de maladies connues",
                dateAbn: "01/01/2024",
                montantPaye: 2500,
                montantRestant: 0
            },
            {
                id_membre: 3,
                nom: "ZEGHIMI",
                prenom: "Adriane",
                telephone: "0601020304",
                dateNais: "01/01/1990",
                dateInsc: "01/01/2024",
                email: "zaydmail@gmail.com",
                sexe: "Homme",
                age: "18",
                taille: "180",
                poids: "70",
                sang: "A+",
                maladies: "Pas de maladies connues",
                dateAbn: "01/01/2024",
                montantPaye: 2500,
                montantRestant: 0
            },
            {
                id_membre: 3,
                nom: "ZEGHIMI",
                prenom: "Adriane",
                telephone: "0601020304",
                dateNais: "01/01/1990",
                dateInsc: "01/01/2024",
                email: "zaydmail@gmail.com",
                sexe: "Homme",
                age: "18",
                taille: "180",
                poids: "70",
                sang: "A+",
                maladies: "Pas de maladies connues",
                dateAbn: "01/01/2024",
                montantPaye: 2500,
                montantRestant: 0
            },
            {
                id_membre: 3,
                nom: "ZEGHIMI",
                prenom: "Adriane",
                telephone: "0601020304",
                dateNais: "01/01/1990",
                dateInsc: "01/01/2024",
                email: "zaydmail@gmail.com",
                sexe: "Homme",
                age: "18",
                taille: "180",
                poids: "70",
                sang: "A+",
                maladies: "Pas de maladies connues",
                dateAbn: "01/01/2024",
                montantPaye: 2500,
                montantRestant: 0
            },
            
        ]); // Réinitialise la liste des membres
    };

    const nbItems = 5; // Nombre d'éléments par page
    const [currInd, setCurrInd] = useState(1); // État pour stocker l'index de la page actuelle

    // Filtrer les membres en fonction de la requête de recherche
    const filteredMembres = membres.filter(membre => {
        const fullName = `${membre.nom} ${membre.prenom}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
    });

    const nbPages = Math.ceil(filteredMembres.length / nbItems); // Calculer le nombre de pages

    const debInd = (currInd - 1) * nbItems; // Index de début pour l'affichage des éléments actuels
    const finInd = debInd + nbItems; // Index de fin pour l'affichage des éléments actuels

    const membresParPage = filteredMembres.slice(debInd, finInd); // Membres à afficher sur la page actuelle

    // Fonction pour supprimer un membre
    const handleDeleteMembre = async (id) => {
        // Stocker l'ID du membre à supprimer
        setMembreIdToDelete(id);
        // Afficher le modal
        setShowModal(true);
    };

    // Fonction pour confirmer la suppression du membre
    const confirmDeleteMembre = async () => {
        try {
            await axios.delete(`http://localhost:4000/members/deleteMember/${membreIdToDelete}`);
            // Fermer le modal
            setShowModal(false);
            fetchMembres(); // Met à jour la liste des membres après la suppression
            setCurrInd(1); // Réinitialise l'index de la page actuelle à 1
        } catch (error) {
            console.error('Erreur lors de la suppression du membre:', error);
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
                    <Searchbar handleSearch={handleSearch}/>
                    <div>
                        <table className="table-profiles">
                            <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Nom</th>
                                <th>Téléphone</th>
                                <th>Date de naissance</th>
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
                                        <th>{membre.dateNais}</th>
                                        <th>{membre.dateInsc}</th>
                                        <th><span>{membre.montantRestant}</span></th>
                                        <th>
                                            <Link className="link"><span className="material-icons-outlined pointed">info</span></Link>
                                            <Link className="link" to="./modifier" state={{id: membre.id_membre, nom: membre.nom, prenom: membre.prenom, email: membre.email, dateNais: membre.dateNais, sexe: membre.sexe, telephone: membre.telephone, age: membre.age, taille: membre.taille, poids: membre.poids, sang: membre.sang, maladies: membre.maladies, dateAbn: membre.dateAbn, montantPaye: membre.montantPaye, montantRestant: membre.montantRestant}}><span className="material-icons-outlined pointed">edit</span></Link>
                                            <button className="link" onClick={() => handleDeleteMembre(membre.id_membre)}><span className="material-icons-outlined pointed">delete</span></button>
                                        </th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
                            <h3>Etes-vous sûr de vouloir supprimer ce membre?</h3>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={confirmDeleteMembre} className="btn pointed"><span className="link">Confirmer</span></button>
                            <button onClick={() => setShowModal(false)} className="btn pointed"><span className="link">Retourner</span></button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Membres;