// Authentification.js
import React, { useState } from "react";
import './Authentification.css';
import Logo from '../../assets/images/logo.png';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/authContext/authContext';

const Authentification = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const { updateAuthData } = useAuthContext();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            console.log("Checkpoint 1");
            const response = await axios.post("http://localhost:4000/auth/login", { username, password });
            console.log("Checkpoint 2");
            console.log(response.data.success);
            if(response.data.success){
                updateAuthData({
                    id: response.data.id,
                    nom: `${response.data.nom} ${response.data.prenom}`,
                    role: response.data.role,
                    photo: response.data.photo
                });
                navigate('/dashboard');
            }else{
                setErrorMessage(response.data.message);
            }
        }catch(error){
            setErrorMessage("Désolé, une erreur s'est produite!");
        }
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
