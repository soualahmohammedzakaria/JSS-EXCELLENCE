import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { isImage } from "../../utils/imagesUtils";

const AjouterMembre = () => {
    const [file, setFile] = useState(null); // État pour la photo du membre
    // États pour les données du formulaire
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        date_naissance: '',
        date_inscription: new Date().toISOString().split('T')[0],
        email: '',
        sexe: 'Homme',
        telephone: '',
        taille: 180,
        poids: 70,
        groupe_sanguin: 'O+',
        maladies: ''
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

    // Ajouter la photo du membre
    const ajouterPhoto = async (id) => {
        const photoFormData = new FormData();
        photoFormData.append('image', file);
        if(file){
            try {
                await axios.post(`http://localhost:4000/member/addPhoto/${id}`, photoFormData);
            } catch (error) {
                console.log(error);
                setErrorMessage("Désolé, une erreur s'est produite lors de l'ajout de la photo!");
            }
        }
    }

    // Soumettre le formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();
        if(file && !isImage(file)){
            setErrorMessage("Veuillez insérer une photo. Les extensions valides sont: .jpeg, .jpg, .png");
            return;
        }
        try {
            const response = await axios.post("http://localhost:4000/member/addMember", formData);
            if(response.data.success){
                ajouterPhoto(response.data.IdMember);
                navigate('/membres');
            }else{
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.log(error);
            setErrorMessage("Désolé, une erreur s'est produite!");
        }
    };   

    return (
        <>
            <Navbar/>
            <main>
                <Sidebar currPage="/membres"/>
                <div className="top-container">
                    <div className="header">
                        <h1>Ajouter un membre</h1>
                        <button className="btn">
                            <Link to="/membres" className="link">
                                <span className="material-icons-outlined">undo</span>
                            </Link>
                        </button>
                    </div>
                    <div className="add-form-group">
                        <div className="top-container">
                            <form className="add-form scroll-form" onSubmit={handleSubmit} encType="multipart/form-data">
                                <h2 style={{alignSelf: "start", marginLeft: "1.5rem"}}>Informations Personelles</h2>
                                <div className="add-input">
                                    <span className="material-icons-outlined">person</span> 
                                    <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} required/>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">badge</span> 
                                    <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} required/>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">photo</span> 
                                    <input type="file" onChange={handleFile}/>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">calendar_today</span>
                                    <label>Naissance</label>
                                    <input type="date" name="date_naissance" placeholder="Date de naissance" value={formData.date_naissance} onChange={handleChange} required/>
                                </div>
                                <h2 style={{alignSelf: "start", marginLeft: "1.5rem"}}>Informations de Contact</h2>
                                <div className="add-input">
                                    <span className="material-icons-outlined">email</span>
                                    <input type="email" name="email" placeholder="Adresse email" value={formData.email} onChange={handleChange}/>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">phone</span>
                                    <input type="text" name="telephone" placeholder="Numéro de télephone" value={formData.telephone} onChange={handleChange} required/>
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
                </div>
            </main>
        </>
    );
};

export default AjouterMembre;