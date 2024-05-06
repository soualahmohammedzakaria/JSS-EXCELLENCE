import { useState } from "react";
import './Parametres.css';
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import Animator from 'lottie-react';
import { Link } from 'react-router-dom';
import Check from '../../assets/animated/Check.json';
import axios from "axios";
import { useAuthContext } from '../../hooks/authContext/authContext';
import { useParamsContext } from '../../hooks/paramsContext/ParamsContext';

const Parametres = () => {
    const { authData } = useAuthContext();
    const { paramsData } = useParamsContext();
    const { updateParamsData } = useParamsContext();
    // États pour les données du formulaire
    const [formData, setFormData] = useState(paramsData);
    const [successModal, setSuccessModal] = useState(false);
    // État pour les messages d'erreur
    const [errorMessage, setErrorMessage] = useState("");

    // Gérer les changements dans le formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Soumettre le formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put("http://localhost:4000/setting/updateSettings", formData);
            if(response.data.success){
                setSuccessModal(true);
                updateParamsData(formData);
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
                <Sidebar currPage="/params"/>
                <div className="top-container">
                    <div className="header">
                        <h1>Paramètres</h1>
                    </div>
                    <div className="add-form-group">
                        <div className="top-container">
                            <form className="add-form" onSubmit={handleSubmit}>
                                {authData.role === 'Administrateur' &&
                                    <>
                                        <h2 style={{alignSelf: "start", marginLeft: "1.5rem"}}>Informations d'emailing</h2>
                                        <div class="add-input">
                                            <span class="material-icons-outlined">email</span>
                                            <label className="params-label">Adresse email</label>
                                            <input type="email" name="email" placeholder="Votre adresse" value={formData.email} onChange={handleChange} required/>
                                        </div>                      
                                        <div class="add-input">
                                            <span class="material-icons-outlined">password</span>
                                            <label className="params-label">Code confidentiel</label>
                                            <input type="password" name="password" placeholder="Votre mot secret" value={formData.password} onChange={handleChange} required/>
                                        </div>
                                    </>
                                }
                                <h2 style={{alignSelf: "start", marginLeft: "1.5rem", marginTop: "0.5rem"}}>Paramètres de l'application</h2>
                                <div class="add-input">
                                    <span className="material-icons-outlined">layers</span>
                                    <label className="params-label">Elements des grandes tables</label>
                                    <input min={3} type="number" name="grandes_tables" value={formData.grandes_tables} onChange={handleChange} required/>
                                </div>
                                <div class="add-input">
                                    <span className="material-icons-outlined">layers</span>
                                    <label className="params-label">Elements des petites tables</label>
                                    <input min={3} type="number" name="petites_tables" value={formData.petites_tables} onChange={handleChange} required/>
                                </div>
                                {errorMessage && <p className="danger">{errorMessage}</p>}
                                <button type="submit" className="btn add-btn pointed"><span className="link">Sauvegarder</span></button>
                            </form>
                        </div>
                    </div>
                </div>
                <Link to="/erreur" className="link">
                    <span className="material-icons-sharp">undo</span>
                    <span>Se déconnecter</span>
                </Link>
            </main>
            {successModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-content">
                            <Animator animationData={Check} loop/>
                            <h2>Paramètres modifiées avec success!</h2>
                            <div className="revenir-boutton">    
                                <button className="revenir-btn btn pointed">
                                    <Link to="/dashboard" className="link">
                                        <span className="material-icons-sharp">undo</span>
                                        <span>Retour</span>
                                    </Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Parametres;