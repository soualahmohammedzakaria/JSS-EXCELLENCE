import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { isImage } from "../../utils/imagesUtils";

const AjouterCoach = () => {
    const [file, setFile] = useState(null); // État pour la photo du coach
    // États pour les données du formulaire
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        dateNaissance: '',
        email: '',
        sexe: 'Homme',
        telephone: '',      
    });
    // État pour les messages d'erreur
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate(); // Hook pour la navigation

    // Gérer les changements dans le formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Gérer les changements dans la photo
    const handleFile = (e) => {
        setFile(e.target.files[0]);
    };

    // Ajouter la photo du coach
    const ajouterPhoto = async (id) => {
        const photoFormData = new FormData();
        photoFormData.append('image', file); // Ajouter la photo
        if(file){
            try {
                await axios.post(`http://localhost:4000/coach/addPhoto/${id}`, photoFormData); // Ajouter la photo
            } catch (error) {
                console.log(error); // Gérer les erreurs
                setErrorMessage("Désolé, une erreur s'est produite lors de l'ajout de la photo!"); // Afficher un message d'erreur
            }
        }
    }

    // Soumettre le formulaire
    const handleSubmit = async (event) => {
        event.preventDefault(); // Empêcher le rechargement de la page
        if(file && !isImage(file)){
            setErrorMessage("Veuillez insérer une photo. Les extensions valides sont: .jpeg, .jpg, .png");
            return;
        }
        try {
            const response = await axios.post("http://localhost:4000/coach/addCoach", formData); // Ajouter le coach
            if(response.data.success){
                ajouterPhoto(response.data.IdCoach); // Ajouter la photo
                navigate('/coachs'); // Naviguer vers la liste des coachs
            }else{
                setErrorMessage(response.data.message); // Afficher un message d'erreur
            }
        }catch (error) {
            setErrorMessage("Désolé, une erreur s'est produite!"); // Afficher un message d'erreur
        }
    };

    return (
        <>
            <Navbar/>
            <main>
                <Sidebar currPage="/coachs"/>
                <div className="top-container">
                    <div className="header">
                        <h1>Ajouter un coach</h1>
                        <button className="btn">
                            <Link to="/coachs" className="link">
                                <span className="material-icons-outlined">undo</span>
                            </Link>
                        </button>
                    </div>
                    <div className="add-form-group">
                        <div className="top-container">
                            <form className="add-form" onSubmit={handleSubmit} encType="multipart/form-data">                          
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
                                    <input type="date" name="dateNaissance" placeholder="Date de naissance" value={formData.dateNaissance} onChange={handleChange} required/>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">photo</span> 
                                    <input type="file" onChange={handleFile}/>
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
                                    <select name="sexe" value={formData.role} onChange={handleChange}>
                                        <option value="Homme">Homme</option>
                                        <option value="Femme">Femme</option>                            
                                    </select>
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

export default AjouterCoach;