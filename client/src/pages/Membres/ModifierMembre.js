import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from "axios";

const ModifierMembre = () => {
    const location = useLocation();
    // États pour les données du formulaire
    const [formData, setFormData] = useState({
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

    // Soumettre le formulaire
    const handleSubmit = async (event) => {
        console.log(formData);
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
                    <div className="add-form-group">
                        <div className="top-container">
                            <form className="add-form scroll-form" onSubmit={handleSubmit}>
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
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required/>
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
                </div>
            </main>
        </>
    );
};

export default ModifierMembre;