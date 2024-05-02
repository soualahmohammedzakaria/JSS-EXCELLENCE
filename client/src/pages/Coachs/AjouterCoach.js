import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const AjouterCoach = () => {
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
            const response = await axios.post("http://localhost:4000/coach/addCoach", formData);
            if(response.data.success){
                navigate('/coachs');
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
                            <form className="add-form" onSubmit={handleSubmit}>
                                
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
                                    <input type="date" name="dateNaissance" placeholder="Date de naissance" value={formData.dateNaissance} onChange={handleChange} required/>
                                </div>
                                <div class="add-input">
                                    <span class="material-icons-outlined">email</span>
                                    <input type="email" name="email" placeholder="Adresse email" value={formData.email} onChange={handleChange}/>
                                </div>
                                <div class="add-input">
                                    <span class="material-icons-outlined">phone</span>
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