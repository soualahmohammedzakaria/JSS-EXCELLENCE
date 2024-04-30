import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const AjouterPresence = () => {
    // State for form data
    const [formData, setFormData] = useState({
        date: '',
        heure_entree: '',
        heure_sortie: '',
        sport: '',
        groupe: ''
    });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Handle changes in form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Submit form data
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/", formData);
            if(response.data.success){
                navigate('/membres/details/presences');
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
                <Sidebar currPage="/membres"/>
                <div className="top-container">
                    <div className="header">
                        <h1>Ajouter une présence</h1>
                        <button className="btn">
                            <Link to="/admins" className="link">
                                <span className="material-icons-outlined">undo</span>
                            </Link>
                        </button>
                    </div>
                    <div className="add-form-group">
                        <div className="add-container">
                            <form className="add-form" onSubmit={handleSubmit}>
                                <div className="add-input">
                                    <span className="material-icons-outlined">calendar_today</span>
                                    <label>Date</label>
                                    <input type="datetime" name="date" value={formData.date} onChange={handleChange} required/>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">timer</span> 
                                    <input type="time" name="nom" value={formData.heure_entree} onChange={handleChange} required/>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">timer_off</span> 
                                    <input type="time" name="prenom" value={formData.heure_sortie} onChange={handleChange} required/>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">group</span>
                                    <label>Groupe</label>
                                    <select name="id_groupe" value={formData.id_groupe}>
                                        <option value=""></option>
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

export default AjouterPresence;