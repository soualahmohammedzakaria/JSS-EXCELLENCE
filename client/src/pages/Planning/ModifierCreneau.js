import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
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
    const [salles, setSalles] = useState([]);
    const [sportsGroupes, setSportsGroupes] = useState([]);
    const [selectedSport, setSelectedSport] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);

    useEffect(() => {
        fetchSalles();
        fetchSportsGroupes();
    }, []);

    const fetchSalles = async () => {
        try {
            const response = await axios.get("http://localhost:4000/salle/getNomIdSalles");
            setSalles(response.data.salles);
            if (response.data.salles.length > 0) {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    numero_salle: response.data.salles[0].numero_salle
                }));
            }
        } catch (error) {
            console.error("Error fetching salles:", error);
        }
    };

    const fetchSportsGroupes = async () => {
        try {
            const response = await axios.get("http://localhost:4000/sport/getAllSportsGroupes");
            setSportsGroupes(response.data.sportsGroupes);
            if (response.data.sportsGroupes.length > 0) {
                const defaultGroup = response.data.sportsGroupes.find(sport => sport.groupes.find(group => group.id_groupe === location.state.groupe)).groupes.find(group => group.id_groupe === location.state.groupe);
                const defaultSport = response.data.sportsGroupes.find(sport => sport.groupes.find(group => group.id_groupe === defaultGroup.id_groupe));
                setSelectedSport(defaultSport);
                setSelectedGroup(defaultGroup);
                setFormData(prevFormData => ({
                    ...prevFormData,
                    id_groupe: defaultGroup.id_groupe
                }));
            }
        } catch (error) {
            console.error("Error fetching sports with groups:", error);
        }
    };

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

    // Gérer le changement de sport
    const handleSportChange = (e) => {
        const sportId = parseInt(e.target.value);
        const selectedSport = sportsGroupes.find(sport => sport.id_sport === sportId);
        setSelectedSport(selectedSport);
        setSelectedGroup(selectedSport.groupes[0]);
        setFormData(prevFormData => ({
            ...prevFormData,
            id_groupe: selectedSport.groupes[0].id_groupe
        }));
    };

    // Gérer le changement de groupe
    const handleGroupChange = (e) => {
        const groupId = parseInt(e.target.value);
        const selectedGroup = selectedSport.groupes.find(group => group.id_groupe === groupId);
        setSelectedGroup(selectedGroup);
        setFormData(prevFormData => ({
            ...prevFormData,
            id_groupe: groupId
        }));
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
                                <span className="material-icons-outlined">undo</span>
                            </Link>
                        </button>
                    </div>
                    <div className="add-form-group">
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
                                    <span className="material-icons-outlined">sports_gymnastics</span>
                                    <label>Sport</label>
                                    <select name="sport" value={selectedSport?.id_sport} onChange={handleSportChange}>
                                        {sportsGroupes.map(sport => (
                                            <option key={sport.id_sport} value={sport.id_sport}>
                                                {sport.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div> 
                                <div className="add-input">
                                    <span className="material-icons-outlined">group</span>
                                    <label>Groupe</label>
                                    <select name="id_groupe" value={selectedGroup?.id_groupe} onChange={handleGroupChange}>
                                        {selectedSport?.groupes.map(group => (
                                            <option key={group.id_groupe} value={group.id_groupe}>
                                                {group.nom_groupe}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-sharp">description</span>
                                    <label>Description</label>
                                    <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange}/>
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