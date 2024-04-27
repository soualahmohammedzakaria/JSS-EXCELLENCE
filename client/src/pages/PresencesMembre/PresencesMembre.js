import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from 'axios';

function PresencesMembre() {
  return (
    <>  <Navbar/>
        <main>
            <Sidebar currPage="/membres" />
            <div className="top-container">
                <div className="header">
                    <h1>Présences d'un membre</h1>
                    <div>
                        <button className="btn" style={{ marginRight: "0.5rem" }}>
                            <Link to="./ajouter" className="link">
                                <span className="material-icons-outlined">add</span>
                            </Link>
                        </button>
                        <button className="btn">
                            <Link to="/membres" className="link">
                                <span className="material-icons-outlined">undo</span>
                            </Link>
                        </button>
                    </div>
                </div>
                <div>
                    <table  className="table-profiles">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Heure d'entrée</th>
                                <th>Heure de sortie</th>
                                <th>Groupe</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>10/02/2024</th>
                                <th>10:00</th>
                                <th>11:00</th>
                                <th>Groupe1</th>
                                <th>
                                    <Link className="link" to="./modifier"><span className="material-icons-outlined pointed">edit</span></Link>
                                    <button className="link"><span className="material-icons-outlined pointed">delete</span></button>
                                </th>
                            </tr>
                            <tr>
                                <th>10/02/2024</th>
                                <th>10:00</th>
                                <th>11:00</th>
                                <th>Groupe1</th>
                                <th>
                                    <Link className="link" to="./modifier"><span className="material-icons-outlined pointed">edit</span></Link>
                                    <button className="link"><span className="material-icons-outlined pointed">delete</span></button>
                                </th>
                            </tr>
                            <tr>
                                <th>10/02/2024</th>
                                <th>10:00</th>
                                <th>11:00</th>
                                <th>Groupe2</th>
                                <th>
                                    <Link className="link" to="./modifier"><span className="material-icons-outlined pointed">edit</span></Link>
                                    <button className="link"><span className="material-icons-outlined pointed">delete</span></button>
                                </th>
                            </tr>
                            <tr>
                                <th>10/02/2024</th>
                                <th>10:00</th>
                                <th>-</th>
                                <th>Groupe3</th>
                                <th>
                                    <Link className="link" to="./modifier"><span className="material-icons-outlined pointed">edit</span></Link>
                                    <button className="link"><span className="material-icons-outlined pointed">delete</span></button>
                                </th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </>

  )
}

export default PresencesMembre
