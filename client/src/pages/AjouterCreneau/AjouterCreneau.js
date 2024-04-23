import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const AjouterCreneaux = () => {
    const [salles, setSalles] = useState([]);
    const [groupes, setGroupes] = useState([]);

    useEffect(() => {
        // Fetch salles from the API
        axios.get("http://localhost:4000/salle/getNomIdSalles")
            .then(response => {
                setSalles(response.data.salles);
            })
            .catch(error => {
                console.error("Error fetching salles:", error);
            });

        // Fetch groupes from the API
        axios.get("http://localhost:4000/groupe/getNomIdGroupes")
            .then(response => {
                setGroupes(response.data.groupes);
            })
            .catch(error => {
                console.error("Error fetching groupes:", error);
            });
    }, []);

    const [formData, setFormData] = useState({
        id_groupe: 0,
        numero_salle: 0,
        titre: '',
        date_debut: '',
        date_fin: '',
        type: 'Séance',
        description: ''
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
            const response = await axios.post("http://localhost:4000/planning/addCreneau", formData);
            if(response.data.success){
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
                        <h1>Ajouter un créneau horaire</h1>
                        <button className="btn">
                            <Link to="/planning" className="link">
                                <span className="material-icons-outlined">logout</span>
                            </Link>
                        </button>
                    </div>
                    <div className="add-form-group">
                        <div className="add-container">
                            <form className="add-form" onSubmit={handleSubmit}>
                            <div className="add-input">
                                    <span className="material-icons-outlined">subtitles</span> 
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
                                        {salles && salles.map(salle => (
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
                                        {groupes && groupes.map(groupe => (
                                            <option key={groupe.id_groupe} value={groupe.id_groupe}>
                                                {groupe.nom_groupe}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-sharp">description</span>
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

export default AjouterCreneaux;