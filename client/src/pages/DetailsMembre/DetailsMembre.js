import React, { useState, useEffect } from "react";
import './DetailsMembre.css';
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from 'axios';
import PhotoStandard from '../../assets/images/photoprofile.png';

const DetailsMembre = () => {
    return (
        <>
            <Navbar/>
            <main>
                <Sidebar currPage="/membres" />
                <div className="top-container">
                    <div className="header">
                        <h1>Profil d'un membre</h1>
                        <button className="btn">
                            <Link to="/membres" className="link">
                                <span className="material-icons-outlined">undo</span>
                            </Link>
                        </button>
                    </div>
                    <div className="details-membre">
                        <div className="infos-membre">
                            <div className="infos-bouttons">
                                <img src={PhotoStandard} alt=""/>
                                <button className="membre-btn pointed">
                                    <Link to="/membres/modifier" className="link"><span className="material-icons-outlined">edit</span><span>Modifier profil</span></Link>
                                </button>
                                <button className="membre-btn pointed">
                                    <Link to="/membres/details/absences" className="link"><span className="material-icons-outlined">cancel</span><span>Accomplissements</span></Link>
                                </button>
                                <button className="membre-btn pointed">
                                    <Link to="/membres/details/presences" className="link"><span className="material-icons-outlined">check_circle</span><span>Voir présences</span></Link>
                                </button>
                                <button className="membre-btn pointed">
                                    <Link to="/membres/details/absences" className="link"><span className="material-icons-outlined">cancel</span><span>Voir absences</span></Link>
                                </button>
                            </div>
                            <div>
                                <div className="infos-groupe">
                                    <h1>Informations personnelles</h1>
                                    <div className="info-membre">
                                        <h2>Nom</h2>
                                        <p className="info-membre-val">SOUALAH MOHAMMED</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Prénom</h2>
                                        <p className="info-membre-val">Zakaria</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Date de naissance</h2>
                                        <p className="info-membre-val">18/09/2005</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Sexe</h2>
                                        <p className="info-membre-val">Homme</p>
                                    </div>
                                </div>
                                <div className="infos-groupe">
                                    <h1>Informations de paiement</h1>
                                    <div className="info-membre">
                                        <h2>Etat de l'abonnement</h2>
                                        <p className="info-membre-val success">Payé</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Date d'abonnement</h2>
                                        <p className="info-membre-val">18/03/2024</p>
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
                                        <p className="info-membre-val">18 ans</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Poids</h2>
                                        <p className="info-membre-val">89 kg</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Groupe sanguin</h2>
                                        <p className="info-membre-val">O+</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Taille</h2>
                                        <p className="info-membre-val">183 cm</p>
                                    </div>
                                    <div className="info-membre">
                                        <h2>Maladies</h2>
                                        <button className="btn pointed"><span className="link">Voir maladies</span></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h1>Groupes</h1>
                            <div className="membre-groupes">
                                <div className="membre-groupe">Judo | Judo U17</div>
                                <div className="membre-groupe">Karate | Karate Junior</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>                   
        </>
    )
}

export default DetailsMembre;