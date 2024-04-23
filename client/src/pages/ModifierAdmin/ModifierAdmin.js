import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { useNavigate , useLocation } from 'react-router-dom';
import axios from "axios";
import { useAuthContext } from '../../hooks/authContext/authContext';

const ModifierAdmin = () => {
    const location = useLocation();
    const { authData } = useAuthContext();

    // États pour les données des formulaires
    const [infoFormData, setInfoFormData] = useState({
        nom: location.state.nom,
        prenom: location.state.prenom,
        username: location.state.username,
        role: location.state.role,
        photo: "",
    });
    const [passwordFormData, setPasswordFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    // États pour les messages d'erreur
    const [infoErrorMessage, setInfoErrorMessage] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

    const navigate = useNavigate();

    // Gérer les changements dans le formulaire d'informations
    const handleInfoChange = (e) => {
        const { name, value } = e.target;
        setInfoFormData({ ...infoFormData, [name]: value });
    };

    // Gérer les changements dans le formulaire de mot de passe
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordFormData({ ...passwordFormData, [name]: value });
    };

    // Soumettre les modifications des informations
    const handleInfoSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:4000/user/updateUser/${location.state.id}`, infoFormData);
            if (response.data.success) {
                // Mettre à jour les informations de l'utilisateur authentifié si nécessaire
                if(location.state.id === authData.id){
                    authData.nom = infoFormData.nom + " " + infoFormData.prenom;
                    authData.photo = infoFormData.photo;
                    authData.role = infoFormData.role;
                }
                // Rediriger en fonction du rôle de l'utilisateur
                if(authData.role === "Gestionnaire"){
                    navigate('/dashboard');
                }else{
                    navigate('/admins');
                }
            } else {
                setInfoErrorMessage(response.data.message);
            }
        } catch (error) {
            setInfoErrorMessage("Désolé, une erreur s'est produite!");
        }
    };

    // Soumettre les modifications du mot de passe
    const handlePasswordSubmit = async (event) => {
        event.preventDefault();
        if(passwordFormData.password !== passwordFormData.confirmPassword || !passwordFormData.password) {
            setPasswordErrorMessage("Le mot de passe et le mot de passe de confirmation ne sont pas les mêmes!");
        }else{
            try{
                const response = await axios.put(`http://localhost:4000/user/updateUserPassword/${location.state.id}`, {password: passwordFormData.password});
                if(response.data.success){
                    navigate('/admins');
                }else{
                    setPasswordErrorMessage(response.data.message);
                }          
            }catch(error){
                setPasswordErrorMessage("Désolé, une erreur s'est produite!");
            }
        }
    };

    return (
        <>
            <Navbar/>
            <main>
                <Sidebar currPage="/admins"/>
                <div className="top-container">
                    <div className="header">
                        <h1>Modifier un utilisateur</h1>
                        <button className="btn">
                            <Link to="/admins" className="link">
                                <span className="material-icons-outlined">logout</span>
                            </Link>
                        </button>
                    </div>
                    <div className="add-form-group">
                        <h2>Modifications des informations du compte</h2>
                        <div className="add-container">
                            <form className="add-form" onSubmit={handleInfoSubmit}>
                                <div className="add-input">
                                    <span className="material-icons-outlined">badge</span>
                                    <label>Nom</label>
                                    <input type="text" name="nom" placeholder="Nom" value={infoFormData.nom} onChange={handleInfoChange} required/>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">badge</span>
                                    <label>Prénom</label>
                                    <input type="text" name="prenom" placeholder="Prénom" value={infoFormData.prenom} onChange={handleInfoChange} required/>
                                </div>
                                {/* Commenté pour l'ajout ultérieur de la fonctionnalité */}
                                {/*<div className="add-input">
                                    <span className="material-icons-outlined">image</span>
                                    <input type="file" value={infoFormData.photo} onChange={handleInfoChange}/>
                                </div>*/}
                                <div className="add-input">
                                    <span className="material-icons-outlined">admin_panel_settings</span>
                                    <label>Rôle</label>
                                    <select name="role" value={infoFormData.role} onChange={handleInfoChange}>
                                        <option value="Administrateur">Administrateur</option>
                                        {/* Ne montrer l'option Gestionnaire que si l'utilisateur n'est pas administrateur */}
                                        {!(location.state.id === authData.id && authData.role === "Administrateur") && (<option value="Gestionnaire">Gestionnaire</option>)}                                    
                                    </select>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-sharp">person</span>
                                    <label>User</label>
                                    <input type="text" name="username" placeholder="Nom d'utilisateur" value={infoFormData.username} onChange={handleInfoChange} required/>
                                </div>
                                {infoErrorMessage && <p className="danger">{infoErrorMessage}</p>}
                                <button type="submit" className="btn add-btn pointed"><span className="link">Modifier informations</span></button>
                            </form>
                        </div>
                    </div>
                    <div className="add-form-group">
                        <h2>Modification du mot de passe du compte</h2>
                        <div className="add-container">
                            <form className="add-form" onSubmit={handlePasswordSubmit}>
                                <div className="add-input">
                                    <span className="material-icons-sharp">vpn_key</span>
                                    <input type="password" name="password" placeholder="Mot de passe" value={passwordFormData.password} onChange={handlePasswordChange} required/>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-sharp">password</span>
                                    <input type="password" name="confirmPassword" placeholder="Confirmation du mot de passe" value={passwordFormData.confirmPassword} onChange={handlePasswordChange} required/>
                                </div>
                                {passwordErrorMessage && <p className="danger">{passwordErrorMessage}</p>}
                                <button type="submit" className="btn add-btn pointed"><span className="link">Modifier mot de passe</span></button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default ModifierAdmin;