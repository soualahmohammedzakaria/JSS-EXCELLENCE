import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const AjouterCreneau = () => { 
    const [salles, setSalles] = useState([]); // État pour les salles
    const [sportsGroupes, setSportsGroupes] = useState([]); // État pour les sports avec les groupes
    const [formDataMultiple, setFormDataMultiple] = useState({ // Les données du formulaire pour l'ajout de plusieurs créneaux
        id_groupe: null,
        numero_salle: null,
        titre: '',
        jour: 0,
        date_debut: '',
        date_fin: '',
        heure_debut: '',
        heure_fin: '',
        type: 'Séance',
        description: null
    });
    const [formData, setFormData] = useState({ // Les données du formulaire pour l'ajout d'un seul créneau
        id_groupe: null,
        numero_salle: null,
        titre: '',
        date_debut: '',
        date_fin: '',
        type: 'Séance',
        description: null
    });
    const [selectedSport, setSelectedSport] = useState(null); // État pour le sport sélectionné
    const [selectedGroup, setSelectedGroup] = useState(null); // État pour le groupe sélectionné
    const [errorMessage, setErrorMessage] = useState(""); // Message d'erreur pour l'ajout d'un seul créneau
    const [errorMessageMultiple, setErrorMessageMultiple] = useState(""); // Message d'erreur pour l'ajout de plusieurs créneaux
    const navigate = useNavigate(); // Hook pour la navigation

    useEffect(() => { 
        fetchSalles(); // Pour obtenir les salles lors du chargement du composant
        fetchSportsGroupes(); // Pour obtenir les sports avec les groupes lors du chargement du composant
    }, []);

    const fetchSalles = async () => { // Fonction pour obtenir les salles
        try {
            const response = await axios.get("http://localhost:4000/salle/getNomIdSalles");
            setSalles(response.data.salles);
            if (response.data.salles.length > 0) {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    numero_salle: response.data.salles[0].numero_salle
                }));
                setFormDataMultiple(prevFormDataMultiple => ({
                    ...prevFormDataMultiple,
                    numero_salle: response.data.salles[0].numero_salle
                }));
            }
        } catch (error) {
            console.error("Error fetching salles:", error);
        }
    };

    const fetchSportsGroupes = async () => { // Fonction pour obtenir les sports avec les groupes
        try {
            const response = await axios.get("http://localhost:4000/sport/getAllSportsGroupes");
            setSportsGroupes(response.data.sportsGroupes);
            // Set default values for sport and group after fetching data
            if (response.data.sportsGroupes.length > 0) {
                const defaultSport = response.data.sportsGroupes[0];
                const defaultGroup = defaultSport.groupes[0];
                setSelectedSport(defaultSport);
                setSelectedGroup(defaultGroup);
                setFormData(prevFormData => ({
                    ...prevFormData,
                    id_groupe: defaultGroup.id_groupe
                }));
                setFormDataMultiple(prevFormDataMultiple => ({
                    ...prevFormDataMultiple,
                    id_groupe: defaultGroup.id_groupe
                }));
            }
        } catch (error) {
            console.error("Error fetching sports with groups:", error);
        }
    };

    const handleSportChange = (e) => { // Fonction pour gérer le changement de sport
        const sportId = parseInt(e.target.value);
        const selectedSport = sportsGroupes.find(sport => sport.id_sport === sportId);
        setSelectedSport(selectedSport);
        setSelectedGroup(selectedSport.groupes[0]);
        setFormData(prevFormData => ({
            ...prevFormData,
            id_groupe: selectedSport.groupes[0].id_groupe
        }));
        
        setFormDataMultiple(prevFormDataMultiple => ({
            ...prevFormDataMultiple,
            id_groupe: selectedSport.groupes[0].id_groupe
        }));
    };

    const handleGroupChange = (e) => { // Fonction pour gérer le changement de groupe
        const groupId = parseInt(e.target.value);
        const selectedGroup = selectedSport.groupes.find(group => group.id_groupe === groupId);
        setSelectedGroup(selectedGroup);
        setFormData(prevFormData => ({
            ...prevFormData,
            id_groupe: groupId
        }));

        setFormDataMultiple(prevFormDataMultiple => ({ // Mettre à jour l'état pour l'ajout de plusieurs créneaux
            ...prevFormDataMultiple,
            id_groupe: groupId
        }));
    };

    const handleChange = (e) => { // Fonction pour gérer les changements des champs du formulaire pour l'ajout d'un seul créneau
        const { name, value } = e.target;
        setFormData(prevFormData => ({ 
            ...prevFormData,
            [name]: value
        }));
    };
    
    const handleMultipleChange = (e) => { // Fonction pour gérer les changements des champs du formulaire pour l'ajout de plusieurs créneaux
        const { name, value } = e.target;
        setFormDataMultiple(prevFormDataMultiple => ({
            ...prevFormDataMultiple,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => { // Fonction pour gérer la soumission du formulaire pour l'ajout d'un seul créneau
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

    const handleSubmitMultiple = async (event) => { // Fonction pour gérer la soumission du formulaire pour l'ajout de plusieurs créneaux
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/planning/addCreneaux", formDataMultiple);
            if(response.data.success){
                navigate('/planning');
            } else {
                setErrorMessageMultiple(response.data.message);
            }
        } catch (error) {
            setErrorMessageMultiple("Désolé, une erreur s'est produite!");
        }
    };

    return (
        <>
            <Navbar/>
            <main>
                <Sidebar currPage="/planning"/>
                <div className="top-container">
                    <div className="header">
                        <h1>Ajouter des créneaux horaires</h1>
                        <button className="btn">
                            <Link to="/planning" className="link">
                                <span className="material-icons-outlined">undo</span>
                            </Link>
                        </button>
                    </div>
                    <div className="scroll-form">
                        <div className="add-form-group">
                            <h2>Ajout d'un seul créneau horaire</h2>
                            <div className="add-container">
                                <form className="add-form" onSubmit={handleSubmit}>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">subtitles</span> 
                                        <input type="text" name="titre" placeholder="Titre" value={formData.titre} onChange={handleChange} required/>
                                    </div>                                
                                    <div className="add-input">
                                        <span className="material-icons-outlined">timer</span>
                                        <label>Début</label>
                                        <input type="datetime-local" name="date_debut" value={formData.date_debut} onChange={handleChange} required/>
                                    </div>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">timer_off</span>
                                        <label>Fin</label>
                                        <input type="datetime-local" name="date_fin" value={formData.date_fin} onChange={handleChange} required/>
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
                                        <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange}/>
                                    </div>
                                    {errorMessage && <p className="danger">{errorMessage}</p>}
                                    <button type="submit" className="btn add-btn pointed"><span className="link">Confirmer</span></button>
                                </form>
                            </div>
                        </div>
                        <div className="add-form-group">
                            <h2>Ajout de plusieurs créneaux horaires</h2>
                            <div className="add-container">
                                <form className="add-form" onSubmit={handleSubmitMultiple}>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">subtitles</span> 
                                        <input type="text" name="titre" placeholder="Titre" value={formDataMultiple.titre} onChange={handleMultipleChange} required/>
                                    </div>       
                                    <div className="add-input">
                                        <span className="material-icons-outlined">date_range</span>
                                        <label>Jour</label>
                                        <select name="jour" value={formDataMultiple.jour} onChange={handleMultipleChange}>
                                            <option value={0}>Dimanche</option>
                                            <option value={1}>Lundi</option>
                                            <option value={2}>Mardi</option>
                                            <option value={3}>Mercredi</option>
                                            <option value={4}>Jeudi</option>
                                            <option value={5}>Vendredi</option>
                                            <option value={6}>Samedi</option>
                                        </select>
                                    </div>                         
                                    <div className="add-input">
                                        <span className="material-icons-outlined">hourglass_empty</span>
                                        <label>Début</label>
                                        <input type="date" name="date_debut" value={formDataMultiple.date_debut} onChange={handleMultipleChange} required/>
                                    </div>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">hourglass_disabled</span>
                                        <label>Fin</label>
                                        <input type="date" name="date_fin" value={formDataMultiple.date_fin} onChange={handleMultipleChange} required/>
                                    </div>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">timer</span>
                                        <label>Début</label>
                                        <input type="time" name="heure_debut" value={formDataMultiple.heure_debut} onChange={handleMultipleChange} required/>
                                    </div>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">timer</span>
                                        <label>Fin</label>
                                        <input type="time" name="heure_fin" value={formDataMultiple.heure_fin} onChange={handleMultipleChange} required/>
                                    </div>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">drag_indicator</span>
                                        <label>Type</label>
                                        <select name="type" value={formDataMultiple.type} onChange={handleMultipleChange}>
                                            <option value="Séance">Séance</option>
                                            <option value="Evénement">Evénement</option>                        
                                        </select>
                                    </div>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">meeting_room</span>
                                        <label>Salle</label>
                                        <select name="numero_salle" value={formDataMultiple.numero_salle} onChange={handleMultipleChange}>
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
                                        <input type="text" name="description" placeholder="Description" value={formDataMultiple.description} onChange={handleMultipleChange}/>
                                    </div>
                                    {errorMessageMultiple && <p className="danger">{errorMessageMultiple}</p>}
                                    <button type="submit" className="btn add-btn pointed"><span className="link">Confirmer</span></button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                
            </main>
        </>
    );
};

export default AjouterCreneau;