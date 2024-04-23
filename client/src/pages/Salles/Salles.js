import React from "react";
import './Salles.css';
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import Searchbar from "../../components/general/Searchbar/Searchbar";


const Salles= () => {
    return (
        <>
            <Navbar></Navbar>
            <main>
                <Sidebar currPage="/salles"></Sidebar>
                <div>
                    <div className="header">
                        <h1>Salles</h1>
                        <button className="btn">
                            <Link to="/salles/ajouter" className="link">
                            <span class="material-icons-outlined">add</span>
                            </Link>
                        </button>
                    </div>
                    <Searchbar/>
                    <div>
                        <table className="table-profiles">
                            <thead>
                            <tr>
                                <th>Nom de la salle</th>
                                <th>Capacité</th>
                                <th>Equipement</th>
                                <th>Planning</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th>Salle Judo 1</th>
                                <th>50</th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">fitness_center</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">calendar_month</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">edit</span></Link><Link className="link"><span className="material-icons-outlined pointed">delete</span></Link></th>
                            </tr>
                            <tr>
                                <th>Salle Judo 2</th>
                                <th>50</th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">fitness_center</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">calendar_month</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">edit</span></Link><Link className="link"><span className="material-icons-outlined pointed">delete</span></Link></th>
                            </tr>
                            <tr>
                                <th>Salle Karate</th>
                                <th>40</th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">fitness_center</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">calendar_month</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">edit</span></Link><Link className="link"><span className="material-icons-outlined pointed">delete</span></Link></th>
                            </tr>
                            <tr>
                                <th>Salle Fitness</th>
                                <th>30</th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">fitness_center</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">calendar_month</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">edit</span></Link><Link className="link"><span className="material-icons-outlined pointed">delete</span></Link></th>
                            </tr>
                            <tr>
                                <th>Salle Kick Boxing 1</th>
                                <th>40</th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">fitness_center</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">calendar_month</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">edit</span></Link><Link className="link"><span className="material-icons-outlined pointed">delete</span></Link></th>
                            </tr>
                            <tr>
                                <th>Salle Hit Fitness</th>
                                <th>50</th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">fitness_center</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">calendar_month</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">edit</span></Link><Link className="link"><span className="material-icons-outlined pointed">delete</span></Link></th>
                            </tr>
                            <tr>
                                <th>Salle Kick Boxing 2</th>
                                <th>35</th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">fitness_center</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">calendar_month</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">edit</span></Link><Link className="link"><span className="material-icons-outlined pointed">delete</span></Link></th>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Salles;