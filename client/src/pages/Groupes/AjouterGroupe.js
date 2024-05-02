import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const AjouterGroupe = () => {
    const [sports, setSports] = useState([]);
    // États pour les données du formulaire
    const [formData, setFormData] = useState({
        nom: '',
        sport: '',
    });
    // État pour les messages d'erreur
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchSports();
    }, []);

    const fetchSports = () => {
        axios
            .get("http://localhost:4000/sport/getAllSports")
            .then((response) => {
                if (response.data.success) {
                    const fetchedSports = response.data.sports || [];
                    setSports(fetchedSports);
                    formData.sport = fetchedSports[0]?.id_sport;
                }
            })
            .catch((error) => {
                console.error("Erreur de l'obtention des groupes: ", error);
            });
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
            const response = await axios.post("http://localhost:4000/groupes/add", formData); // Corrected URL for adding time slots
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
                                    <input type="text" name="nom" placeholder="Nom du groupe" value={formData.nom} onChange={handleChange} required/>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">sports_gymnastics</span>
                                    <label>Sport</label>
                                    <select name="sport" value={formData.sport} onChange={handleChange}>
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