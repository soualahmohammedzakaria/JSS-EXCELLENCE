import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const AjouterAdmin = () => {
    const [formData, setFormData] = useState({ // Les données du formulaire
        nom: '',
        prenom: '',
        role: 'Gestionnaire',
        username: '',
        password: ''
    });
    const [confirmPassword, setConfirmPassword] = useState(""); // État pour la confirmation du mot de passe
    const [errorMessage, setErrorMessage] = useState(""); // Message d'erreur
    const navigate = useNavigate(); // Hook pour la navigation

    const handleChange = (e) => { // Fonction pour gérer les changements des champs du formulaire
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => { // Fonction pour gérer la soumission du formulaire
        event.preventDefault();
        if (formData.password !== confirmPassword || !formData.password) {
            setErrorMessage("Le mot de passe et le mot de passe de confirmation ne sont pas les mêmes!");
            return;
        }
        try {
            const response = await axios.post("http://localhost:4000/user/addUser", formData); // Ajouter un utilisateur
            if (response.data.success) {
                setFormData({
                    password: ''
                });
                setConfirmPassword("");
                navigate('/admins');
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setErrorMessage("Désolé, une erreur s'est produite!");
        }
    };

    return (
        <>
            <Navbar/>
            <main>
                <Sidebar currPage="/admins"/>
                <div className="top-container">
                    <div className="header">
                        <h1>Ajouter un utilisateur</h1>
                        <button className="btn">
                            <Link to="/admins" className="link">
                                <span className="material-icons-outlined">undo</span>
                            </Link>
                        </button>
                    </div>
                    <div className="add-form-group">
                        <div className="add-container">
                            <form className="add-form" onSubmit={handleSubmit}>
                                <div className="add-input">
                                    <span className="material-icons-outlined">badge</span>
                                    <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} required/>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">badge</span>
                                    <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} required/>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">admin_panel_settings</span>
                                    <label>Rôle</label>
                                    <select name="role" value={formData.role} onChange={handleChange}>
                                        <option value="Administrateur">Administrateur</option>
                                        <option value="Gestionnaire">Gestionnaire</option>
                                    </select>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-sharp">person</span>
                                    <input type="text" name="username" placeholder="Nom d'utilisateur" value={formData.username} onChange={handleChange} required/>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-sharp">vpn_key</span>
                                    <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required/>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-sharp">password</span>
                                    <input type="password" name="confirmPassword" placeholder="Confirmation du mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                                </div>
                                {errorMessage && <p className="danger">{errorMessage}</p>}
                                <button type="submit" className="btn add-btn pointed"><span className="link">Confirmer</span></button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default AjouterAdmin;