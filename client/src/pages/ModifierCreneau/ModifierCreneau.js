import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { useNavigate , useLocation } from 'react-router-dom';
import axios from "axios";

const ModifierCreneau = () => {
    const location = useLocation();

    // États pour les données des formulaires
    const [formData, setFormData] = useState({
        titre: location.state.title,
        description: location.state.description,
        salle: location.state.salle,
        groupe: location.state.groupe,
        dateDebut: location.state.start,
        dateFin: location.state.end,
        type: location.state.type
    });

    // États pour les messages d'erreur
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    // Gérer les changements dans le formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Soumettre les modifications des informations
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:4000/user/updateUser/${location.state.id}`, formData);
            if (response.data.success) {
                // Rediriger vers la page de planning
                navigate('/planning');
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setErrorMessage("Désolé, une erreur s'est produite!");
        }
    };

    return (
        <>
            <Navbar/>
            <main>
                <Sidebar currPage="/planning"/>
                <div className="top-container">
                    <div className="header">
                        <h1>Modifier un creneau horaire</h1>
                        <button className="btn">
                            <Link to="/planning" className="link">
                                <span className="material-icons-outlined">logout</span>
                            </Link>
                        </button>
                    </div>
                    <div className="add-form-group">
                        <h2>Modifications des informations du compte</h2>
                        <div className="add-container">
                        <form className="add-form" onSubmit={handleSubmit}>
                                <div className="add-input">
                                    <span className="material-icons-outlined">subtitles</span> 
                                    <label>Titre</label>
                                    <input type="text" name="titre" placeholder="Titre" value={formData.titre} onChange={handleChange} required/>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">timer</span>
                                    <label>Début</label>
                                    <input type="datetime-local" name="dateDebut" placeholder="Date de début" value={formData.dateDebut} onChange={handleChange} required/>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">timer_off</span>
                                    <label>Fin</label>
                                    <input type="datetime-local" name="dateFin" placeholder="Date de fin" value={formData.dateFin} onChange={handleChange} required/>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">drag_indicator</span>
                                    <label>Type</label>
                                    <select name="type" value={formData.type} onChange={handleChange}>
                                        <option value="Séance">Séance</option>
                                        <option value="Evénement">Evénement</option>                        
                                    </select>
                                </div> 
                                <div className="add-input">
                                    <span className="material-icons-outlined">meeting_room</span>
                                    <label>Salle</label>
                                    <select name="salle" value={formData.salle} onChange={handleChange}>
                                        <option value="Salle des sports de combat">Salle des sports de combat</option>
                                        <option value="Salle Judo">Salle Judo</option>                        
                                    </select>
                                </div> 
                                <div className="add-input">
                                    <span className="material-icons-outlined">group</span>
                                    <label>Groupe</label>
                                    <select name="groupe" value={formData.groupe} onChange={handleChange}>
                                        <option value="Judo U15">Judo U15</option>
                                        <option value="Judo U17">Judo U17</option>
                                        <option value="Judo U19">Judo U19</option>
                                        <option value="Kickboxing -80kg">Kickboxing -80kg</option>         
                                        <option value="Kickboxing -84kg">Kickboxing -84kg</option>   
                                        <option value="Kickboxing -88kg">Kickboxing -88kg</option>                  
                                    </select>
                                </div> 
                                <div className="add-input">
                                    <span className="material-icons-sharp">description</span>
                                    <label>Description</label>
                                    <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required/>
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

export default ModifierCreneau;