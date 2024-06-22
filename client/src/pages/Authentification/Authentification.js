// Authentification.js
import React, { useState } from "react";
import './Authentification.css';
import Logo from '../../assets/images/logo.png';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/authContext/authContext';
import { useParamsContext } from '../../hooks/paramsContext/ParamsContext';

const Authentification = () => {
    const [username, setUsername] = useState(""); // Nom d'utilisateur
    const [password, setPassword] = useState(""); // Mot de passe
    const [errorMessage, setErrorMessage] = useState(""); // Message d'erreur
    const navigate = useNavigate(); // Hook pour la navigation
    const { updateAuthData } = useAuthContext(); // Mettre à jour les données de l'utilisateur
    const { updateParamsData } = useParamsContext(); // Mettre à jour les paramètres

    const getParametres = async () => { // Fonction pour obtenir les paramètres
        try {
            const response = await axios.get("http://localhost:4000/setting/getSettings"); // Obtenir les paramètres
            if(response.data.success){ // Si la requête s'est bien passée
                updateParamsData({ // Mettre à jour les paramètres
                    email: response.data.parametres.email,
                    password: response.data.parametres.password,
                    grandes_tables: response.data.parametres.grandes_tables,
                    petites_tables: response.data.parametres.petites_tables
                });
            }
        } catch (error) {
            console.error('Erreur lors de l\'obtention des paramètres:', error); // Gérer les erreurs
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Empêcher le rechargement de la page
        try{
            const response = await axios.post("http://localhost:4000/auth/login", { username, password }); // Se connecter
            if(response.data.success){
                updateAuthData({ // Mettre à jour les données de l'utilisateur
                    id: response.data.id,
                    nom: `${response.data.nom} ${response.data.prenom}`,
                    role: response.data.role
                });
                getParametres(); // Obtenir les paramètres
                navigate('/dashboard'); // Naviguer vers le tableau de bord
            }else{
                setErrorMessage(response.data.message); // Afficher un message d'erreur
            }
        }catch(error){
            setErrorMessage("Désolé, une erreur s'est produite!"); // Afficher un message d'erreur
        }
        // Réinitialiser les champs
        setUsername("");
        setPassword("");
    }

    return (
        <div className="auth-container">
            <div className="auth-header">
                <img src={Logo} alt="logo" className="logo"/>
                <h1>JSS Excellence</h1>
            </div>
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-input">
                    <span className="material-icons-sharp">person</span>
                    <input type="text" required placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="auth-input">
                    <span className="material-icons-sharp">vpn_key</span>
                    <input type="password" required placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {errorMessage && <p className="danger">{errorMessage}</p>}
                <button type="submit" className="btn auth-btn pointed"><span className="link">Se connecter</span></button>
            </form>
        </div>
    )
}

export default Authentification;
