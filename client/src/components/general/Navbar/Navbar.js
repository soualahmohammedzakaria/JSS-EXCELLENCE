import React from "react";
import './Navbar.css';
import Logo from '../../../assets/images/logo.png';
import { useAuthContext } from '../../../hooks/authContext/authContext';

const Navbar = () => {
    const { authData } = useAuthContext(); // Récupérer les données de l'utilisateur connecté
    return (
        <nav>
            <div className="container">
                <div className="ident">
                    <img src={Logo} alt="logo" className="logo"/>
                    <h3>JSS Excellence</h3>
                </div>
                <div className="profile-area">
                    <div className="profile">
                        <div className="infos">
                            <h4>{authData.nom}</h4>
                            <h5>{authData.role}</h5>
                        </div>
                    </div>
                </div>
            </div>
      </nav>
    )
}

export default Navbar 