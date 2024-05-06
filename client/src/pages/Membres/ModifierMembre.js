import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from "axios";

const ModifierMembre = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        nom: location.state.nom,
        prenom: location.state.prenom,
        dateNais: location.state.dateNais,
        email: location.state.email,
        sexe: location.state.sexe,
        telephone: location.state.telephone,
        age: location.state.age,
        taille: location.state.taille,
        poids: location.state.poids,
        sang: location.state.sang,
        maladies: location.state.maladies,
        dateAbn: location.state.dateAbn,
        montantPaye: location.state.montantPaye,
        montantRestant: location.state.montantRestant
    });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/Member/updateMembre", formData);
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
                                    <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} required/>
                                </div>
                                {/* Other input fields */}
                                <div className="add-input">
                                    <span className="material-icons-outlined">calendar_today</span>
                                    <label>Naissance</label>
                                    <input type="date" name="dateNais" placeholder="Date de naissance" value={formData.dateNais} onChange={handleChange} required/>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">email</span>
                                    <input type="email" name="email" placeholder="Adresse email" value={formData.email} onChange={handleChange} required/>
                                </div>
                                {/* Commented out for future functionality */}
                                {/* <div className="add-input">
                                    <span className="material-icons-outlined">image</span>
                                    <input type="file" value={formData.photo} onChange={handleChange}/>
                                </div> */}
                                <div className="add-input">
                                    <span className="material-icons-outlined">phone</span>
                                    <input type="text" name="telephone" placeholder="Numéro de télephone" value={formData.telephone} onChange={handleChange} required/>
                                </div>
                                <h2 style={{alignSelf: "start", marginLeft: "1.5rem", marginTop: "0.5rem"}}>Informations Sportives</h2>
                                {/* Corrected select input */}
                                <div className="add-input">
                                    <span className="material-icons-outlined">male</span>
                                    <label>Sexe</label>
                                    <select name="sexe" value={formData.sexe} onChange={handleChange}>
                                        <option value="Homme">Homme</option>
                                        <option value="Femme">Femme</option>                            
                                    </select>
                                </div>
                                {/* Other input fields */}
                                <h2 style={{alignSelf: "start", marginLeft: "1.5rem", marginTop: "0.5rem"}}>Dossier Medical</h2>
                                {/* Corrected name attribute */}
                                <div className="add-input">
                                    <span className="material-icons-outlined">bloodtype</span>
                                    <label>Groupe</label>
                                    <select name="sang" value={formData.sang} onChange={handleChange}>
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
                                {/* Corrected name attribute */}
                                <div className="add-input">
                                    <span className="material-icons-outlined">coronavirus</span>
                                    <label>Maladies</label>
                                    <input type="text" name="maladies" placeholder="Description des maladies" value={formData.maladies} onChange={handleChange} required/>
                                </div>
                                <h2 style={{alignSelf: "start", marginLeft: "1.5rem", marginTop: "0.5rem"}}>Informations de Paiement</h2> 
                                {/* Corrected name attribute */}
                                <div className="add-input">
                                    <span className="material-icons-outlined">card_membership</span>
                                    <label>Date de paiement</label>
                                    <input min={0} type="date" name="dateAbn" value={formData.dateAbn} onChange={handleChange} required/>
                                </div>
                                {/* Corrected name attribute */}
                                <div className="add-input">
                                    <span className="material-icons-outlined">attach_money</span>
                                    <label>Payé(DZD)</label>
                                    <input min={0} type="number" name="montantPaye" value={formData.montantPaye} onChange={handleChange} required/>
                                </div>
                                {/* Corrected name attribute */}
                                <div className="add-input">
                                    <span className="material-icons-outlined">money_off</span>
                                    <label>Restant(DZD)</label>
                                    <input min={0} type="number" name="montantRestant" value={formData.montantRestant} onChange={handleChange} required/>
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