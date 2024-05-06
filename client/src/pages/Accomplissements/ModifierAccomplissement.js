import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from "axios";

const ModifierAccomplissement = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nom_evenement: location.state.nom_evenement,
        discipline: location.state.discipline,
        date_evenement: location.state.date_evenement,
        palmares: location.state.palmares,
        id_membre: location.state.id
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [sports, setSports] = useState([]);

    useEffect(() => {
        fetchSports();
    }, []);

    const fetchSports = async () => {
        try {
            const response = await axios.get("http://localhost:4000/sport/getAllSports");
            if (response.data.success) {
                setSports(response.data.sports);
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.error('Erreur de récupération des sports:', error);
            setErrorMessage("Désolé, une erreur s'est produite lors de la récupération des sports.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:4000/achievement/updateAchievement/${location.state.id_accomplissement}`, formData);
            if(response.data.success){
                navigate('/membres/details/accomplissements', { state: { id: location.state.id, path: location.state.path }});
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire:', error);
            setErrorMessage("Désolé, une erreur s'est produite!");
        }
    };

    return (
        <>
            <Navbar/>
            <main>
                <Sidebar currPage="/membres"/>
                <div className="top-container">
                    <div className="header">
                        <h1>Modifier un accomplissement</h1>
                        <button className="btn">
                            <Link to="/membres/details/accomplissements" className="link" state={{ id: location.state.id, path: location.state.path }}>
                                <span className="material-icons-outlined">undo</span>
                            </Link>
                        </button>
                    </div>
                    <div className="add-form-group">
                        <div className="add-container">
                            <form className="add-form" onSubmit={handleSubmit}>
                                <div className="add-input">
                                    <span className="material-icons-outlined">local_activity</span> 
                                    <input type="text" name="nom_evenement" placeholder="Nom de l'événement" value={formData.nom_evenement} onChange={handleChange} required/>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">sports_gymnastics</span> 
                                    <label>Discipline</label>
                                    <select name="discipline" value={formData.discipline} onChange={handleChange} required>
                                        {sports.map(sport => (
                                            <option key={sport.id_sport} value={sport.nom}>{sport.nom}</option>
                                        ))}
                                    </select>
                                </div> 
                                <div className="add-input">
                                    <span className="material-icons-outlined">calendar_today</span> 
                                    <label>Date</label>
                                    <input type="date" name="date_evenement" value={formData.date_evenement} onChange={handleChange} required/>
                                </div> 
                                <div className="add-input">
                                    <span className="material-icons-outlined">military_tech</span> 
                                    <input type="text" name="palmares" placeholder="Palmares" value={formData.palmares} onChange={handleChange} required/>
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

export default ModifierAccomplissement;