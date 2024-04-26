import React, { useState, useEffect } from "react";
import './DetailsMembre.css';
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from 'axios';
import Searchbar from "../../components/general/Searchbar/Searchbar";
import PhotoStandard from '../../assets/images/photoprofilestandard.png';

const DetailsMembre = () => {
    return (
        <>
            <Navbar/>
            <main>
                <Sidebar currPage="/membres" />
                <div className="top-container">
                    <div className="header">
                        <h1>Détails d'un membre</h1>
                        <button className="btn">
                            <Link to="/membres" className="link">
                                <span className="material-icons-outlined">undo</span>
                            </Link>
                        </button>
                    </div>
                    <div className="details-membre">
                        <div className="infos-personnelles">

                        </div>
                        <div className="infos-professionnelles">
                        </div>
                    </div>
                </div>
            </main>                   
        </>
    )
}

export default DetailsMembre;