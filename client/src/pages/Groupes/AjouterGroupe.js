import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const AjouterGroupe = () => {
    const [sports, setSports] = useState([]); // Pour stocker les sports
    const [selectedSport, setSelectedSport] = useState(null); // Pour stocker le sport sélectionné
    // États pour les données du formulaire
    const [formData, setFormData] = useState({
        nom_groupe:'',
        id_sport: null
        
    });
    // État pour les messages d'erreur
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => { // Récupérer les sports lors du chargement du composant
        fetchSports();
    }, []);

    const fetchSports = () => { // Fonction pour récupérer les sports
        axios
            .get("http://localhost:4000/sport/getAllSports") // Récupérer les sports
            .then((response) => {
                if (response.data.success) {
                    const fetchedSports = response.data.sports || [];
                    setSports(fetchedSports);
                    setSelectedSport(fetchedSports[0]?.id_sport);
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        id_sport: fetchedSports[0]?.id_sport
                    }));
                }
            })
            .catch((error) => {
                console.error("Erreur de l'obtention des groupes: ", error);
            });
    };

    const handleSportChange = (e) => { // Fonction pour gérer le changement de sport
        const sportId = parseInt(e.target.value);
        const selectedSport = sports.find(sport => sport.id_sport === sportId);
        setSelectedSport(selectedSport);
        setFormData(prevFormData => ({
            ...prevFormData,
            id_sport: selectedSport.id_sport
        }));
    };

    // Gérer les changements dans le formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Soumettre le formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/group/addGroup", formData); // Corrected URL for adding time slots
            if(response.data.success){
                navigate('/groupes');
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
                <Sidebar currPage="/groupes"/>
                <div className="top-container">
                    <div className="header">
                        <h1>Ajouter un groupe</h1>
                        <button className="btn">
                            <Link to="/groupes" className="link">
                                <span className="material-icons-outlined">undo</span>
                            </Link>
                        </button>
                    </div>
                    <div className="add-form-group">
                        <div className="add-container">
                            <form className="add-form" onSubmit={handleSubmit}>
                                <div className="add-input">
                                    <span className="material-icons-outlined">group</span> 
                                    <input type="text" name="nom_groupe" placeholder="Nom du groupe" value={formData.nom_groupe} onChange={handleChange} required/>
                                </div>
                                    <div className="add-input">
                                        <span className="material-icons-outlined">sports_gymnastics</span>
                                        <label>Sport</label>
                                        <select name="sport" value={selectedSport?.id_sport} onChange={handleSportChange}>
                                            {sports.map(sport => (
                                                <option key={sport.id_sport} value={sport.id_sport}>
                                                    {sport.nom}
                                                </option>
                                            ))}
                                        </select>
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

export default AjouterGroupe;