import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { useNavigate, useLocation } from 'react-router-dom';
import { formatDateHeure } from "../../utils/datesUtils";
import axios from "axios";

const AjouterPresence = () => {
    const navigate = useNavigate(); // Hook pour la navigation
    const location = useLocation(); // Pour récupérer les données passées en paramètres lors de la navigation
    const [creneaux, setCreneaux] = useState([]); // État pour les créneaux
    const [sportsGroupes, setSportsGroupes] = useState([]); // État pour les groupes de sports
    const [selectedGroupe, setSelectedGroupe] = useState(null); // État pour le groupe sélectionné
    const [selectedCreneau, setSelectedCreneau] = useState(null); // État pour le créneau sélectionné
    const [formData, setFormData] = useState({ // Les données du formulaire
        id_membre: location.state.id, 
        date_entree: '',
        date_sortie: null,
        id_groupe: null,
        id_creneau: null
    });
    const [errorMessage, setErrorMessage] = useState(""); // Message d'erreur
    
    useEffect(() => { // Pour obtenir les créneaux et les groupes de sports lors du chargement du composant
        fetchSportsGroupes();
        fetchCreneaux();
    }, []);

    const fetchCreneaux = async () => { // Fonction pour obtenir les créneaux
        try {
            const response = await axios.get('http://localhost:4000/planning/getAllCreneaux');
            if (response.data.success) setCreneaux(response.data.creneaux);
        } catch (error) {
            console.error('Erreur lors de l\'obtention des creneaux:', error);
        }
    };

    const fetchSportsGroupes = async () => { // Fonction pour obtenir les groupes de sports
        try {
            const response = await axios.get("http://localhost:4000/sport/getAllSportsGroupes");
            setSportsGroupes(response.data.sportsGroupes);
            if (response.data.sportsGroupes.length > 0) {
                const defaultGroup = response.data.sportsGroupes[0].groupes[0];
                setSelectedGroupe(defaultGroup);
                setFormData(prevFormData => ({
                    ...prevFormData,
                    id_groupe: defaultGroup.id_groupe
                }));
            }
        } catch (error) {
            console.error("Error fetching sports with groups:", error);
        }
    };

    const handleChange = (e) => { // Fonction pour gérer les changements des champs du formulaire
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => { // Fonction pour gérer la soumission du formulaire
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/attendance/addPresenceMember", formData);
            if (response.data.success) {
                navigate('/membres/details/presences', {state: {id: location.state.id, path: location.state.path}});
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setErrorMessage("Désolé, une erreur s'est produite!");
        }
    };

    const handleGroupChange = (e) => { // Fonction pour gérer le changement de groupe
        const groupId = parseInt(e.target.value);
        const selectedGroupe = sportsGroupes
            .flatMap(sport => sport.groupes)
            .find(group => group.id_groupe === groupId);

        setSelectedGroupe(selectedGroupe);
        setSelectedCreneau(null); // Reinintialize selectedCreneau
    
        // Trouver le premier creneau du groupe sélectionné
        const firstCreneau = creneaux.find(creneau => creneau.id_groupe === groupId);
    
        if (firstCreneau) {
            // Si le groupe sélectionné a des creneaux
            setSelectedCreneau(firstCreneau.id_creneau);
            setFormData(prevFormData => ({
                ...prevFormData,
                id_groupe: groupId,
                id_creneau: firstCreneau.id_creneau // Set id_creneau a l'id du premier creneau
            }));
        } else {
            // Si le groupe sélectionné n'a pas de creneaux
            setFormData(prevFormData => ({
                ...prevFormData,
                id_groupe: groupId,
                id_creneau: null // Set id_creneau a null
            }));
        }
    };    

    const handleCreneauChange = (e) => { // Fonction pour gérer le changement de créneau
        const creneauId = parseInt(e.target.value);
        setSelectedCreneau(creneauId);
        setFormData(prevFormData => ({
            ...prevFormData,
            id_creneau: creneauId
        }));
    };

    const filteredCreneaux = creneaux.filter(creneau => creneau.id_groupe === selectedGroupe?.id_groupe); // Filtrer les creneaux par groupe

    return (
        <>
            <Navbar />
            <main>
                <Sidebar currPage="/membres" />
                <div className="top-container">
                    <div className="header">
                        <h1>Ajouter une présence</h1>
                        <button className="btn">
                            <Link to="/membres/details/presences" state={{id: location.state.id, path: location.state.path}} className="link">
                                <span className="material-icons-outlined">undo</span>
                            </Link>
                        </button>
                    </div>
                    <div className="add-form-group">
                        <div className="add-container">
                            <form className="add-form" onSubmit={handleSubmit}>
                                <div className="add-input">
                                    <span className="material-icons-outlined">login</span>
                                    <label>Entrée</label>
                                    <input type="datetime-local" name="date_entree" value={formData.date_entree} onChange={handleChange} required />
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">logout</span>
                                    <label>Sortie</label>
                                    <input type="datetime-local" name="date_sortie" value={formData.date_sortie} onChange={handleChange}/>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">group</span>
                                    <label>Groupe</label>
                                    <select name="id_groupe" value={selectedGroupe?.id_groupe} onChange={handleGroupChange}>
                                        {sportsGroupes.map(sport => (
                                            sport.groupes.map(group => (
                                                <option key={group.id_groupe} value={group.id_groupe}>
                                                    {sport.nom} | {group.nom_groupe}
                                                </option>
                                            ))
                                        ))}
                                    </select>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">schedule</span>
                                    <label>Créneau</label>
                                    <select name="id_creneau" value={selectedCreneau} onChange={handleCreneauChange}>
                                        {filteredCreneaux.map(creneau => (
                                            <option key={creneau.id_creneau} value={creneau.id_creneau}>
                                                {creneau.title} - {formatDateHeure(creneau.start)} - {formatDateHeure(creneau.end)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errorMessage && <p className="danger">{errorMessage}</p>}
                                <button type="submit" className="btn add-btn pointed">
                                    <span className="link">Confirmer</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default AjouterPresence;