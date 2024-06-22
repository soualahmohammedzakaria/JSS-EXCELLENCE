import React, { useEffect, useState } from "react";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import QRCode from '../../assets/images/CodeQR.jpg';
import './Assiduite.css';
import axios from 'axios';
import useScanDetection from "use-scan-detection";
import { extraireIdMembre } from "../../utils/membreUtils";
import { useNavigate } from "react-router-dom";

const Assiduite = () => {
    const navigate = useNavigate(); // Hook pour la navigation
    const [ScanCodeQR, setScanCodeQR] = useState(null); // Le code QR scanné
    const [errorMessage, setErrorMessage] = useState("Aucun code scanné"); // Message d'erreur

    useEffect(() => {
        if (ScanCodeQR !== null) { // Si un code QR a été scanné
            const idMembre = extraireIdMembre(ScanCodeQR); // Extraire l'id du membre
            if (idMembre === null) { // Si l'id n'a pas pu être extrait
                setErrorMessage("Code QR invalide!"); // Afficher un message d'erreur
            } else {
                axios.post(`http://localhost:4000/attendance/memberPresence/${idMembre}`) // Signaler la présence du membre
                    .then(response => {
                        if (!response.data.success && response.data.message === 'Membre non trouvé!') { // Si le membre n'a pas été trouvé
                            setErrorMessage("Code QR invalide!"); // Afficher un message d'erreur
                        } else {
                            navigate("/assiduite/resultat", { state: { reponse: response.data } }); // Naviguer vers la page de résultat
                        }
                    })
                    .catch(error => {
                        console.error('Erreur de signalement de la présence', error); // Gérer les erreurs
                    });
            }
        }
    }, [ScanCodeQR]);

useScanDetection({ // Hook pour détecter le scan du code QR
    onComplete: setScanCodeQR,
    minLength: 2 // Longueur minimale du code QR
})

return (
    <>
        <Navbar />
        <main>
            <Sidebar currPage="/assiduite" />
            <div className="top-container">
                <div className="header">
                    <h1>Assiduité</h1>
                </div>
                <div className="assiduite-container">
                    <div className="qr-page">
                        <h1 className="qr-title">Scannez votre code QR</h1>
                        <img src={QRCode} alt="" className="QRCode" />
                        {errorMessage && <p className="qr-scan danger">{errorMessage}</p>}
                    </div>
                </div>
            </div>
        </main>
    </>
)
}

export default Assiduite;