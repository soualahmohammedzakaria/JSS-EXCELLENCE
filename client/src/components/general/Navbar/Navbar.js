import React from "react";
import './Navbar.css';
import PhotoStandard from '../../../assets/images/photoprofilestandard.png';
import Logo from '../../../assets/images/logo.png';
import { useAuthContext } from '../../../hooks/authContext/authContext';

const Navbar = () => {
    const { authData } = useAuthContext();
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
                        <div className="profile-photo">
                            <img src={authData.photo ? authData.photo : PhotoStandard} alt=""/>
                        </div>
                    </div>
                </div>
            </div>
      </nav>
    )
}

export default Navbar 