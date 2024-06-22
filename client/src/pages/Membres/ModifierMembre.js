import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from "axios";

const ModifierMembre = () => {
    const location = useLocation(); // Pour obtenir les données de l'élément cliqué
    const [file, setFile] = useState(null); // État pour la photo du membre
    const [photoErrorMessage, setPhotoErrorMessage] = useState(""); // État pour les messages d'erreur de la photo
    // États pour les données du formulaire
    const [formData, setFormData] = useState({ // Les données du formulaire
        nom: location.state.nom,
        prenom: location.state.prenom,
        date_naissance: location.state.date_naissance,
        date_inscription: location.state.date_inscription,
        email: location.state.email,
        sexe: location.state.sexe,
        telephone: location.state.telephone,
        taille: location.state.taille,
        poids: location.state.poids,
        groupe_sanguin: location.state.groupe_sanguin,
        maladies: location.state.maladies
    });
    // État pour les messages d'erreur
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Gérer les changements dans le formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFile = (e) => { // Gérer les changements dans la photo
        setFile(e.target.files[0]);
    };

    // Modifier la photo du membre
    const modifierPhoto = async (id) => {
        const photoFormData = new FormData();
        photoFormData.append('image', file);
        if(file){
            try {
                const photoresponse = await axios.post(`http://localhost:4000/member/addPhoto/${id}`, photoFormData);
                if(photoresponse.data.success){
                    navigate('/membres');
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
    }

    // Soumettre le formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:4000/member/updateMember/${location.state.id}`, formData);
            if(response.data.success){
                navigate('/membres');
            }else{
                setErrorMessage(response.data.message);
            }
        }catch (error) {
            setErrorMessage("Désolé, une erreur s'est produite!");
        }
    };

    // Gérer les changements dans le formulaire de photo
    const handlePhotoSubmit = async (event) => {
        event.preventDefault();
        modifierPhoto(location.state.id);
    };

    // Supprimer la photo du membre
    const deletePhoto = async () => {
        if(location.state.photo !== null){
            try {
                const response = await axios.delete(`http://localhost:4000/member/deletePhoto/${location.state.id}`);
                if(response.data.success){
                    navigate('/membres');
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
                <Sidebar currPage="/membres"/>
                <div className="top-container">
                    <div className="header">
                        <h1>Modifier un membre</h1>
                        <button className="btn">
                            <Link to="/membres" className="link">
                                <span className="material-icons-outlined">undo</span>
                            </Link>
                        </button>
                    </div>
                    <div className="scroll-form">
                        <div className="add-form-group">
                            <h2>Modification des informations du compte</h2>
                            <div className="add-container">
                                <form className="add-form" onSubmit={handleSubmit}>
                                    <h2 style={{alignSelf: "start", marginLeft: "1.5rem"}}>Informations Personelles</h2>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">person</span> 
                                        <label>Nom</label>
                                        <input type="text" name="nom" value={formData.nom} onChange={handleChange} required/>
                                    </div>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">badge</span> 
                                        <label>Prénom</label>
                                        <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required/>
                                    </div>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">calendar_today</span>
                                        <label>Naissance</label>
                                        <input type="date" name="date_naissance" placeholder="Date de naissance" value={formData.date_naissance} onChange={handleChange} required/>
                                    </div>
                                    <h2 style={{alignSelf: "start", marginLeft: "1.5rem"}}>Informations de Contact</h2>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">email</span>
                                        <label>Email</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange}/>
                                    </div>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">phone</span>
                                        <label>Téléphone</label>
                                        <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} required/>
                                    </div>
                                    <h2 style={{alignSelf: "start", marginLeft: "1.5rem", marginTop: "0.5rem"}}>Dossier Medical</h2>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">male</span>
                                        <label>Sexe</label>
                                        <select name="sexe" value={formData.role} onChange={handleChange}>
                                            <option value="Homme">Homme</option>
                                            <option value="Femme">Femme</option>                            
                                        </select>
                                    </div>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">height</span>
                                        <label>Taille(Cm)</label>
                                        <input min={0} type="number" name="taille" value={formData.taille} onChange={handleChange} required/>
                                    </div>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">monitor_weight</span>
                                        <label>Poids(Kg)</label>
                                        <input min={0} type="number" name="poids" value={formData.poids} onChange={handleChange} required/>
                                    </div>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">bloodtype</span>
                                        <label>Groupe</label>
                                        <select name="groupe_sanguin" value={formData.groupe_sanguin} onChange={handleChange}>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>    
                                            <option value="AB+">AB+</option>   
                                            <option value="AB-">AB-</option>   
                                            <option value="Autre">Autre</option>                        
                                        </select>
                                    </div>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">coronavirus</span>
                                        <label>Maladies</label>
                                        <input type="text" name="maladies" placeholder="Description des maladies" value={formData.maladies} onChange={handleChange}/>
                                    </div>
                                    {errorMessage && <p className="danger">{errorMessage}</p>}
                                    <button type="submit" className="btn add-btn pointed"><span className="link">Confirmer</span></button>
                                </form>
                            </div>
                        </div>
                        <div className="add-form-group">
                            <h2>Modification de la photo du membre</h2>
                            <div className="add-container">
                                <form className="add-form" onSubmit={handlePhotoSubmit}>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">photo</span> 
                                        <input type="file" onChange={handleFile} required/>
                                    </div>    
                                    {photoErrorMessage && <p className="danger">{photoErrorMessage}</p>}
                                    <button type="submit" className="btn add-btn pointed"><span className="link">Modifier la photo</span></button>
                                </form>
                                <button onClick={deletePhoto} className="btn add-btn pointed"><span className="link">Supprimer la photo</span></button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default ModifierMembre;