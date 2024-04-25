import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const AjouterMembre = () => {
    // États pour les données du formulaire
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        dateNais: '',
        email: '',
        sexe: 'Homme',
        telephone: '',
        age: 18,
        taille: 180,
        poids: 70,
        sang: 'O+',
        maladies: '',
        date_abn: '',
        montant_paye: 0,
        montant_restant: 0
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
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/user/addUser", formData);
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
                        <h1>Ajouter un membre</h1>
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
                                <div className="add-input">
                                    <span className="material-icons-outlined">badge</span> 
                                    <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} required/>
                                </div>
                                <div class="add-input">
                                    <span class="material-icons-outlined">calendar_today</span>
                                    <label>Naissance</label>
                                    <input type="date" name="dateNais" placeholder="Date de naissance" value={formData.dateNais} onChange={handleChange} required/>
                                </div>
                                <div class="add-input">
                                    <span class="material-icons-outlined">email</span>
                                    <input type="email" name="email" placeholder="Adresse email" value={formData.email} onChange={handleChange} required/>
                                </div>
                                {/* Commenté pour l'ajout ultérieur de la fonctionnalité */}
                                {/*<div className="add-input">
                                    <span className="material-icons-outlined">image</span>
                                    <input type="file" value={formData.photo} onChange={handleChange}/>
                                </div>*/}
                                <div class="add-input">
                                    <span class="material-icons-outlined">phone</span>
                                    <input type="text" name="telephone" placeholder="Numéro de télephone" value={formData.telephone} onChange={handleChange} required/>
                                </div>
                                <h2 style={{alignSelf: "start", marginLeft: "1.5rem", marginTop: "0.5rem"}}>Informations Sportives</h2>
                                <div className="add-input">
                                    <span className="material-icons-outlined">male</span>
                                    <label>Sexe</label>
                                    <select name="sexe" value={formData.role} onChange={handleChange}>
                                        <option value="Homme">Homme</option>
                                        <option value="Femme">Femme</option>                            
                                    </select>
                                </div>
                                <div class="add-input">
                                    <span class="material-icons-outlined">face</span>
                                    <label>Age</label>
                                    <input min={0} type="number" name="age" value={formData.age} onChange={handleChange} required/>
                                </div>
                                <div class="add-input">
                                    <span class="material-icons-outlined">height</span>
                                    <label>Taille(Cm)</label>
                                    <input min={0} type="number" name="taille" step={10} value={formData.taille} onChange={handleChange} required/>
                                </div>
                                <div class="add-input">
                                    <span class="material-icons-outlined">monitor_weight</span>
                                    <label>Poids(Kg)</label>
                                    <input min={0} type="number" name="poids" value={formData.poids} onChange={handleChange} required/>
                                </div>
                                <h2 style={{alignSelf: "start", marginLeft: "1.5rem", marginTop: "0.5rem"}}>Dossier Medical</h2>
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
                                <div class="add-input">
                                    <span className="material-icons-outlined">coronavirus</span>
                                    <label>Maladies</label>
                                    <input type="text" name="sang" placeholder="Description des maladies" value={formData.maladies} onChange={handleChange} required/>
                                </div>
                                <h2 style={{alignSelf: "start", marginLeft: "1.5rem", marginTop: "0.5rem"}}>Informations de Paiement</h2> 
                                <div class="add-input">
                                    <span className="material-icons-outlined">card_membership</span>
                                    <label>Date de paiement</label>
                                    <input min={0} type="date" name="date_abn" value={formData.date_abn} onChange={handleChange} required/>
                                </div>
                                <div class="add-input">
                                    <span className="material-icons-outlined">attach_money</span>
                                    <label>Payé(DZD)</label>
                                    <input min={0} type="number" name="montant_paye" step={500} value={formData.montant_paye} onChange={handleChange} required/>
                                </div>
                                <div class="add-input">
                                    <span className="material-icons-outlined">money_off</span>
                                    <label>Restant(DZD)</label>
                                    <input min={0} type="number" name="montant_restant" step={500} value={formData.montant_restant} onChange={handleChange} required/>
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