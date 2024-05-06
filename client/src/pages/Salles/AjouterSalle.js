import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const AjouterSalle = () => {
    // États pour les données du formulaire
    const [formData, setFormData] = useState({
        nom_salle: '',
        capacite: 0
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
            const response = await axios.post("http://localhost:4000/salle/addSalle", formData);
            if(response.data.success){
                navigate('/salles');
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
                        <h1>Ajouter une salle</h1>
                        <button className="btn">
                            <Link to="/salles" className="link">
                                <span className="material-icons-outlined">undo</span>
                            </Link>
                        </button>
                    </div>
                    <div className="add-form-group">
                        <div className="add-container">
                            <form className="add-form" onSubmit={handleSubmit}>
                                <div className="add-input">
                                    <span className="material-icons-outlined">meeting_room</span> 
                                    <input type="text" name="nom_salle" placeholder="Nom" value={formData.nom_salle} onChange={handleChange} required/>
                                </div>                                            
                                <div className="add-input">
                                    <span className="material-icons-sharp">groups</span>
                                    <label>Capacité</label>
                                    <input type="number" name="capacite" value={formData.capacite} onChange={handleChange} required/>
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

export default AjouterSalle;