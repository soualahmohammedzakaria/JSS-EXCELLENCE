import React, { useState, useEffect } from "react";
import '../DetailsMembre/DetailsMembre.css';
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from 'axios';
import PhotoStandard from '../../assets/images/photoprofile.png';
import { formatDate, calculerAge } from "../../utils/datesUtils";

const DetailsMembre = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [membre, setMembre] = useState([]);
    const [selGroupe, setSelGroupe] = useState(null);

    useEffect(() => {
        fetchMembre();
    }, []);

    const fetchMembre = () => {
        axios.get(`http://localhost:4000/member/getMember/${location.state.id}`)
            .then(response => {
                if(response.data.success){
                    setMembre(response.data.member);
                }
            })
            .catch(error => {
                console.error('Erreur de l\'obtention du membre:', error);
            });
    };

    const handleGroupe = (id) => {
        if (selGroupe === id) {
            setSelGroupe(null);
            return;
        }
        setSelGroupe(id);
    };

    const handleEntree = () => {
        if (selGroupe === null) return;
        axios.post(`http://localhost:4000/attendance/memberEntry`, { id_membre: location.state.id, id_groupe: selGroupe})
            .then(response => {
                navigate("/assiduite/resultat", {state: {reponse: response.data, type: "Entrée"}});
            })
            .catch(error => {
                console.error('Erreur de signalisation de l\'entrée:', error);
            });
    };

    const handleSortie = () => {
        if (selGroupe === null) return;
        axios.post(`http://localhost:4000/attendance/memberExit`, { id_membre: location.state.id, id_groupe: selGroupe})
            .then(response => {
                navigate("/assiduite/resultat", {state: {reponse: response.data, type: "Sortie"}});
            })
            .catch(error => {
                console.error('Erreur de signalisation de la sortie:', error);
            });
    };

    return (
        <>
            <Navbar/>
            <main>
                <Sidebar currPage="/assiduite" />
                <div className="top-container">
                    <div className="header">
                        <h1>Profil du membre</h1>
                        <button className="btn">
                            <Link to="/assiduite" className="link">
                                <span className="material-icons-outlined">undo</span>
                            </Link>
                        </button>
                    </div>
                    <div className="details-membre scroll-form">
                        <div className="infos-membre">
                            <div className="infos-bouttons">
                                <img src={PhotoStandard} alt=""/>
                                <button className="membre-btn pointed">
                                    <Link to="./modifier" className="link"><span className="material-icons-outlined">edit</span><span>Modifier profil</span></Link>
                                </button>
                                <button className="membre-btn pointed">
                                    <Link to="./accomplissements" state={{id: membre.id_membre}} className="link"><span className="material-icons-outlined">military_tech</span><span>Accomplissements</span></Link>
                                </button>
                                <button className="membre-btn pointed">
                                    <Link to="./paiements" className="link" state={{id: membre.id_membre}}><span className="material-icons-outlined">history</span><span>Paiements</span></Link>
                                </button>
                                <button className="membre-btn pointed">
                                    <Link to="./presences" className="link" state={{id: membre.id_membre}}><span className="material-icons-outlined">check_circle</span><span>Voir présences</span></Link>
                                </button>
                                <button className="membre-btn pointed">
                                    <Link to="./absences" className="link" state={{id: membre.id_membre}}><span className="material-icons-outlined">cancel</span><span>Voir absences</span></Link>
                                </button>
                            </div>
                            <div>
                                <div className="infos-groupe">
                                    <h1>Informations personnelles</h1>
                                    <div className="info-membre">
                                        <h2>Nom</h2>
                                        <p className="info-membre-val">{membre.nom}</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Prénom</h2>
                                        <p className="info-membre-val">{membre.prenom}</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Date de naissance</h2>
                                        {membre.date_naissance && (
                                            <p className="info-membre-val">{formatDate(membre.date_naissance)}</p>
                                        )}
                                    </div>
                                    <div className="info-membre">
                                        <h2>Sexe</h2>
                                        <p className="info-membre-val">{membre.sexe}</p>
                                    </div>
                                </div>
                                <div className="infos-groupe">
                                    <h1>Informations de paiement</h1>
                                    <div className="info-membre">
                                        <h2>Date d'inscription</h2>
                                        {membre.date_naissance && (
                                            <p className="info-membre-val">{formatDate(membre.date_inscription)}</p>
                                        )}
                                    </div>
                                    <div className="info-membre">
                                        <h2>Etat de l'abonnement</h2>
                                        <p className={`info-membre-val ${new Date(membre.date_inscription) > new Date() ? "success" : "danger"}`}>{new Date(membre.date_inscription) > new Date() ? "Payé" : "Non payé"}</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Date d'abonnement</h2>
                                        {membre.date_naissance && (
                                            <p className="info-membre-val">{formatDate(membre.date_inscription)}</p>
                                        )}
                                    </div>
                                    <div className="info-membre">
                                        <h2>Montant Payé</h2>
                                        <p className="info-membre-val">2500 DZD</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Montant Restant</h2>
                                        <p className="info-membre-val danger">500 DZD</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="infos-groupe">
                                    <h1>Informations de contact</h1>
                                    <div className="info-membre">
                                        <h2>Télephone</h2>
                                        <p className="info-membre-val">0715234102</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Email</h2>
                                        <p className="info-membre-val">mz_soualahmohammed@esi.dz</p>
                                    </div>
                                </div>
                                <div className="infos-groupe">
                                    <h1>Dossier medical</h1>
                                    <div className="info-membre">
                                        <h2>Age</h2>
                                        <p className="info-membre-val">{calculerAge(membre.date_naissance)} ans</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Poids</h2>
                                        <p className="info-membre-val">{membre.poids} kg</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Groupe sanguin</h2>
                                        <p className="info-membre-val">{membre.groupe_sanguin}</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Taille</h2>
                                        <p className="info-membre-val">{membre.taille} cm</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Maladies</h2>
                                        <p className="info-membre-val">Pas de maladies!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="membre-groupes-header">
                                <span className="material-icons-outlined">group</span>
                                <h1>Groupes</h1>
                            </div>
                            <div className="membre-groupes">
                                {membre.groupes &&
                                    membre.groupes.map(groupe => (
                                        <button
                                            onClick={() => handleGroupe(groupe.id_groupe)}
                                            key={groupe.id_groupe}
                                            className={`${selGroupe === groupe.id_groupe ? " pointed selected-groupe" : "membre-groupe pointed"}`}
                                        >
                                            {groupe.nom_groupe}
                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="assiduite-bouttons">
                            <button className="assiduite-btn pointed" disabled={selGroupe === null} onClick={handleEntree}>
                                <span className="material-icons-outlined">login</span>
                                <span>Signaler entrée</span>
                            </button>
                            <button className="assiduite-btn pointed" disabled={selGroupe === null} onClick={handleSortie}>
                                <span className="material-icons-outlined">logout</span>
                                <span>Signaler sortie</span>
                            </button>
                        </div>

                    </div>
                </div>
            </main>       
        </>
    )
}

export default DetailsMembre;