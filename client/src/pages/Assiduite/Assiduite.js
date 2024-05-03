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
    const navigate = useNavigate();
    const [ScanCodeQR, setScanCodeQR] = useState(null);
    const [errorMessage, setErrorMessage] = useState("Aucun code scanné");

    useEffect(() => {
        if (ScanCodeQR !== null) {
            const idMembre = extraireIdMembre(ScanCodeQR);
            if (idMembre === null) {
                setErrorMessage("Code QR invalide!");
            } else {
                axios.get(`http://localhost:4000/member/getMember/${idMembre}`)
                .then(response => {
                    if(response.data.success){
                        navigate("/assiduite/details", {state: {id: idMembre}});
                    }else{
                        setErrorMessage("Code QR invalide!");
                    }
                })
                .catch(error => {
                    console.error('Désole, une erreur s\'est produite!', error);
                });
            }
        }
    }, [ScanCodeQR]);

    useScanDetection({
        onComplete: setScanCodeQR,
        minLength: 2
    })

    return (
        <>
            <Navbar />
            <main>
                <Sidebar currPage="/assiduite"/>
                <div className="top-container">
                    <div className="header">
                        <h1>Assiduité</h1>
                    </div>
                    <div className="assiduite-container">
                        <div className="qr-page">
                            <h1 className="qr-title">Scannez votre code QR</h1>
                            <img src={QRCode} alt="" className="QRCode"/> 
                            {errorMessage && <p className="qr-scan danger">{errorMessage}</p>}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Assiduite;