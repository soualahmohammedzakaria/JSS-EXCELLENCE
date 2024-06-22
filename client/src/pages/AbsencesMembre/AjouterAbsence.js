import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { useNavigate, useLocation } from 'react-router-dom';
import { formatDateHeure } from "../../utils/datesUtils";
import axios from "axios";

const AjouterAbsence = () => {
    const navigate = useNavigate(); // Hook pour la navigation
    const location = useLocation(); // Hook pour obtenir les données de l'URL
    const [creneaux, setCreneaux] = useState([]); // Les créneaux
    const [sportsGroupes, setSportsGroupes] = useState([]); // Les groupes de sport
    const [selectedGroupe, setSelectedGroupe] = useState(null); // Le groupe sélectionné
    const [selectedCreneau, setSelectedCreneau] = useState(null); // Le créneau sélectionné
    const [formData, setFormData] = useState({ // Les données du formulaire
        id_membre: location.state.id,
        date: '',
        justifiee: 0,
        justification: '',
        id_groupe: null,
        id_creneau: null
    });
    const [errorMessage, setErrorMessage] = useState(""); // Message d'erreur
    
    useEffect(() => {
        // Récupérer les groupes de sport et les créneaux
        fetchSportsGroupes();
        // Récupérer les créneaux
        fetchCreneaux();
    }, []);

    const fetchCreneaux = async () => {
        // Récupérer les créneaux
        try {
            const response = await axios.get('http://localhost:4000/planning/getAllCreneaux');
            if (response.data.success) setCreneaux(response.data.creneaux);
        } catch (error) {
            console.error('Erreur lors de l\'obtention des creneaux:', error);
        }
    };

    const fetchSportsGroupes = async () => { // Fonction pour récupérer les groupes de sport
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
        if (name === "justifiee" && value === "0") {
            setFormData(prevFormData => ({
                ...prevFormData,
                justification: ""
            }));
        }
    };
    

    const handleSubmit = async (event) => { // Fonction pour gérer la soumission du formulaire
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/attendance/addAbsenceMember", formData);
            if (response.data.success) {
                navigate('/membres/details/absences', {state: {id: location.state.id, path: location.state.path}});
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
        setSelectedCreneau(null); // Reinitialiser le créneau sélectionné
    
        // Find the first creneau of the newly selected group
        const firstCreneau = creneaux.find(creneau => creneau.id_groupe === groupId);
    
        if (firstCreneau) {
            // Si le groupe sélectionné a des créneaux
            setSelectedCreneau(firstCreneau.id_creneau);
            setFormData(prevFormData => ({
                ...prevFormData,
                id_groupe: groupId,
                id_creneau: firstCreneau.id_creneau // Set id_creneau a celui du premier creneau
            }));
        } else {
            // Si le groupe sélectionné n'a pas de créneaux
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

    const filteredCreneaux = creneaux.filter(creneau => creneau.id_groupe === selectedGroupe?.id_groupe); // Filtrer les créneaux par groupe

    return (
        <>
            <Navbar />
            <main>
                <Sidebar currPage="/membres" />
                <div className="top-container">
                    <div className="header">
                        <h1>Ajouter une absence</h1>
                        <button className="btn">
                            <Link to="/membres/details/absences" state={{id: location.state.id, path: location.state.path}} className="link">
                                <span className="material-icons-outlined">undo</span>
                            </Link>
                        </button>
                    </div>
                    <div className="add-form-group">
                        <div className="add-container">
                            <form className="add-form" onSubmit={handleSubmit}>
                                <div className="add-input">
                                    <span className="material-icons-outlined">login</span>
                                    <label>Date</label>
                                    <input type="date" name="date" value={formData.date} onChange={handleChange} required />
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
                                <div className="add-input">
                                    <span className="material-icons-outlined">info</span>
                                    <label>Justifiée</label>
                                    <select name="justifiee" value={formData.justifiee} onChange={handleChange}>
                                        <option value={0}>Non</option>
                                        <option value={1}>Oui</option>
                                    </select>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">receipt</span>
                                    <label>Justification</label>
                                    <input
                                        disabled={formData.justifiee === 0} type="text" name="justification" value={formData.justification} onChange={handleChange}/>
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

export default AjouterAbsence;