import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";

const ModifierDepense = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        nom: location.state.nom,
        montant: location.state.montant,
        date: location.state.date,
        type: location.state.type
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
            const response = await axios.put(`http://localhost:4000/expense/updateExpense/${location.state.id}`, formData);
            if(response.data.success){
                navigate('/depenses');
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
                <Sidebar currPage="/depenses"/>
                <div className="top-container">
                    <div className="header">
                        <h1>Modifier une dépense</h1>
                        <button className="btn">
                            <Link to="/depenses" className="link">
                                <span className="material-icons-outlined">undo</span>
                            </Link>
                        </button>
                    </div>
                    <div className="add-form-group">
                        <div className="add-container">
                            <form className="add-form" onSubmit={handleSubmit}>
                                <div className="add-input">
                                    <span className="material-icons-outlined">local_activity</span> 
                                    <input type="text" name="nom" placeholder="Nom de la dépense" value={formData.nom} onChange={handleChange} required/>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">drag_indicator</span> 
                                    <input type="text" name="type" placeholder="Type" value={formData.type} onChange={handleChange} required/>
                                </div> 
                                <div className="add-input">
                                    <span className="material-icons-outlined">calendar_today</span> 
                                    <label>Date</label>
                                    <input type="date" name="date" value={formData.date} onChange={handleChange} required/>
                                </div>
                                <div className="add-input">
                                    <span className="material-icons-outlined">attach_money</span>
                                    <label>Montant(DZD)</label>
                                    <input min={0} type="number" name="montant" value={formData.montant} onChange={handleChange} required/>
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

export default ModifierDepense;