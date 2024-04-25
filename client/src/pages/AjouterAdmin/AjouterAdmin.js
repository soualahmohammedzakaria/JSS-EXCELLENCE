import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const AjouterAdmin = () => {
    // State for form data
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        role: 'Gestionnaire',
        username: '',
        password: '',
        photo: null // State for storing selected image file
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Handle changes in form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle changes in image input field
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, photo: file });
    };

    // Submit form data
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formData.password !== confirmPassword || !formData.password) {
            setErrorMessage("Le mot de passe et le mot de passe de confirmation ne sont pas les mêmes!");
        } else {
            try {
                // Create FormData object to send file data
                const formDataToSend = new FormData();
                formDataToSend.append('nom', formData.nom);
                formDataToSend.append('prenom', formData.prenom);
                formDataToSend.append('role', formData.role);
                formDataToSend.append('username', formData.username);
                formDataToSend.append('password', formData.password);
                formDataToSend.append('photo', formData.photo); // Append image file

                const response = await axios.post("http://localhost:4000/user/addUser", formDataToSend);
                if(response.data.success){
                    navigate('/admins');
                }else{
                    setErrorMessage(response.data.message);
                }
            }catch (error) {
                setErrorMessage("Désolé, une erreur s'est produite!");
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
                                    <span className="material-icons-outlined">image</span>
                                    <input type="file" accept="image/*" onChange={handleImageChange}/> {/* Image input field */}
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