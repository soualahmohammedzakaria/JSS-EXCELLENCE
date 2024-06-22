import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { useNavigate , useLocation } from 'react-router-dom';
import axios from "axios";

const ModifierSport = () => {
    const location = useLocation(); // Pour récupérer les données passées en paramètres lors de la navigation
    // États pour les données du formulaire
    const [formData, setFormData] = useState({
        nom: location.state.nom,
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
            const response = await axios.put(`http://localhost:4000/sport/updateSport/${location.state.id_sport}`, formData);
            if(response.data.success){
                navigate('/sports');
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
                <Sidebar currPage="/sports"/>
                <div className="top-container">
                    <div className="header">
                        <h1>Modifier un sport</h1>
                        <button className="btn">
                            <Link to="/sports" className="link">
                                <span className="material-icons-outlined">undo</span>
                            </Link>
                        </button>
                    </div>
                    <div className="add-form-group">
                        <div className="add-container">
                            <form className="add-form" onSubmit={handleSubmit}>
                                <div className="add-input">
                                    <span className="material-icons-outlined">meeting_room</span> 
                                    <label>Nom</label>
                                    <input type="text" name="nom" value={formData.nom} onChange={handleChange} required/>
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

export default ModifierSport;