import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";

const ModifierCreneau = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // États pour les données des formulaires
    const [formData, setFormData] = useState({
        id_groupe: location.state.groupe,
        numero_salle: location.state.salle,
        titre: location.state.title,
        date_debut: location.state.start,
        date_fin: location.state.end,
        type: location.state.type,
        description: location.state.description
    });

    // États pour les messages d'erreur
    const [errorMessage, setErrorMessage] = useState("");

    // États pour les options des groupes et salles
    const [groupes, setGroupes] = useState([]);
    const [salles, setSalles] = useState([]);

    useEffect(() => {
        // Fetch groupes from the API
        axios.get("http://localhost:4000/groupe/getNomIdGroupes")
            .then(response => {
                setGroupes(response.data.groupes);
            })
            .catch(error => {
                console.error("Error fetching groupes:", error);
            });

        // Fetch salles from the API
        axios.get("http://localhost:4000/salle/getNomIdSalles")
            .then(response => {
                setSalles(response.data.salles);
            })
            .catch(error => {
                console.error("Error fetching salles:", error);
            });
    }, []);

    // Gérer les changements dans le formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Soumettre les modifications des informations
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:4000/planning/updateCreneau/${location.state.id}`, formData);
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
            <Navbar />
            <main>
                <Sidebar currPage="/planning" />
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
                                    <input type="datetime-local" name="date_debut" placeholder="Date de début" value={formData.date_debut} onChange={handleChange} required/>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">timer_off</span>
                                    <label>Fin</label>
                                    <input type="datetime-local" name="date_fin" placeholder="Date de fin" value={formData.date_fin} onChange={handleChange} required/>
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
                                    <select name="numero_salle" value={formData.numero_salle} onChange={handleChange}>
                                        {salles.map(salle => (
                                            <option key={salle.numero_salle} value={salle.numero_salle}>
                                                {salle.nom_salle}
                                            </option>
                                        ))}
                                    </select>
                                </div> 
                                <div className="add-input">
                                    <span className="material-icons-outlined">group</span>
                                    <label>Groupe</label>
                                    <select name="id_groupe" value={formData.id_groupe} onChange={handleChange}>
                                        {groupes.map(groupe => (
                                            <option key={groupe.id_groupe} value={groupe.id_groupe}>
                                                {groupe.nom_groupe}
                                            </option>
                                        ))}
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