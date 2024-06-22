import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from "axios";

const ModifierCoach = () => {
    const location = useLocation(); // Pour récupérer les données passées en paramètres lors de la navigation
    const [file, setFile] = useState(null); // Pour stocker la photo
    const [photoErrorMessage, setPhotoErrorMessage] = useState(""); // Pour afficher un message d'erreur
    const [formData, setFormData] = useState({ // Les données du formulaire
        nom: location.state.nom,
        prenom: location.state.prenom,    
        email: location.state.email,
        date_naissance: location.state.dateNaissance,
        telephone: location.state.telephone,
        sexe: location.state.sexe,
    });
    const [errorMessage, setErrorMessage] = useState(""); // Pour afficher un message d'erreur
    const navigate = useNavigate(); // Hook pour la navigation

    const handleChange = (e) => { // Fonction pour gérer les changements des champs du formulaire
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => { // Fonction pour gérer la soumission du formulaire
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:4000/coach/updateCoach/${location.state.id}`, formData);
            if(response.data.success){
                navigate('/coachs');
            }else{
                setErrorMessage(response.data.message);
            }
        }catch (error) {
            setErrorMessage("Désolé, une erreur s'est produite!");
        }
    };

    const handleFile = (e) => { // Fonction pour gérer les changements dans le formulaire de photo
        setFile(e.target.files[0]);
    };

    // Modifier la photo du coach
    const modifierPhoto = async (id) => {
        const photoFormData = new FormData();
        photoFormData.append('image', file);
        if(file){ // Vérifier si une photo a été sélectionnée
            try {
                const photoresponse = await axios.post(`http://localhost:4000/coach/addPhoto/${id}`, photoFormData);
                if(photoresponse.data.success){
                    navigate('/coachs');
                }else{
                    setPhotoErrorMessage(photoresponse.data.message);
                }
            } catch (error) {
                console.log(error);
                setPhotoErrorMessage("Désolé, une erreur s'est produite lors de l'ajout de la photo!");
            }
        }else{
            setPhotoErrorMessage("Veuillez sélectionner une photo!");
        }
    };

    // Gérer les changements dans le formulaire de photo
    const handlePhotoSubmit = async (event) => {
        event.preventDefault();
        modifierPhoto(location.state.id);
    };

    // Supprimer la photo du coach
    const deletePhoto = async () => {
        if(location.state.photo !== null){
            try {
                const response = await axios.delete(`http://localhost:4000/coach/deletePhoto/${location.state.id}`);
                if(response.data.success){
                    navigate('/coachs');
                }else{
                    setPhotoErrorMessage(response.data.message);
                }
            } catch (error) {
                setErrorMessage("Désolé, une erreur s'est produite!");
            }
        }else{ 
            setPhotoErrorMessage("Désolé, aucune photo à supprimer!");
        }
    };

    return (
        <>
            <Navbar/>
            <main>
                <Sidebar currPage="/coachs"/>
                <div className="top-container">
                    <div className="header">
                        <h1>Modifier un coach</h1>
                        <button className="btn">
                            <Link to="/coachs" className="link">
                                <span className="material-icons-outlined">undo</span>
                            </Link>
                        </button>
                    </div>
                    <div className="add-form-group">
                        <div className="scroll-form">
                            <div className="add-form-group">
                                <h2>Modification des informations du coach</h2>
                                <form className="add-form" onSubmit={handleSubmit}>                      
                                    <div className="add-input">
                                        <span className="material-icons-outlined">person</span> 
                                        <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} required/>
                                    </div>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">badge</span> 
                                        <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} required/>
                                    </div>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">calendar_today</span>
                                        <label>Naissance</label>
                                        <input type="date" name="date_naissance" placeholder="Date de naissance" value={formData.date_naissance} onChange={handleChange} required/>
                                    </div>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">email</span>
                                        <input type="email" name="email" placeholder="Adresse email" value={formData.email} onChange={handleChange}/>
                                    </div>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">phone</span>
                                        <input type="text" name="telephone" placeholder="Numéro de télephone" value={formData.telephone} onChange={handleChange} required/>
                                    </div>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">male</span>
                                        <label>Sexe</label>
                                        <select name="sexe" value={formData.sexe} onChange={handleChange}>
                                            <option value="Homme">Homme</option>
                                            <option value="Femme">Femme</option>                            
                                        </select>
                                    </div>
                                    {errorMessage && <p className="danger">{errorMessage}</p>}
                                    <button type="submit" className="btn add-btn pointed"><span className="link">Confirmer</span></button>
                                </form>
                            </div>
                            <div className="add-form-group">
                                <h2>Modification de la photo du coach</h2>
                                <div className="add-container">
                                    <form className="add-form" onSubmit={handlePhotoSubmit}>
                                        <div className="add-input">
                                            <span className="material-icons-outlined">photo</span> 
                                            <input type="file" onChange={handleFile} required/>
                                        </div>    
                                        {photoErrorMessage && <p className="danger">{photoErrorMessage}</p>}
                                        <div style={{display: "flex", gap: "1rem"}}>
                                            <button type="submit" className="btn add-btn pointed"><span className="link">Modifier la photo</span></button>
                                        </div>
                                    </form>
                                    <button onClick={deletePhoto} className="btn add-btn pointed"><span className="link">Supprimer la photo</span></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default ModifierCoach