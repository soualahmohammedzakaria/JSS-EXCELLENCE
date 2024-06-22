import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const AjouterEquipement = () => {
    const location = useLocation(); // Pour récupérer les données passées en paramètres lors de la navigation
    
    // États pour les données du formulaire
    const [formData, setFormData] = useState({
        nom: '',
        quantite: 1,
        numero_salle: location.state.numero_salle
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
            const response = await axios.post("http://localhost:4000/equipment/addEquipment", formData); 
            if(response.data.success){
                navigate('/salles/equipements', { state: {numero_salle: location.state.numero_salle} });
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
                <Sidebar currPage="/salles"/>
                <div className="top-container">
                    <div className="header">
                        <h1>Ajouter un équipement</h1>
                        <button className="btn">
                            <Link to="/salles/equipements" className="link" state={{numero_salle: location.state.numero_salle}}>
                                <span className="material-icons-outlined">undo</span>
                            </Link>
                        </button>
                    </div>
                    <div className="add-form-group">
                        <div className="add-container">
                            <form className="add-form" onSubmit={handleSubmit}>
                                <div className="add-input">
                                    <span className="material-icons-outlined">fitness_center</span> 
                                    <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} required/>
                                </div>                                            
                                <div className="add-input">
                                    <span className="material-icons-sharp">confirmation_number</span>
                                    <label>Quantite</label>
                                    <input type="number" min={1} name="quantite" value={formData.quantite} onChange={handleChange} required/>
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

export default AjouterEquipement;