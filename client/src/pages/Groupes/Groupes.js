import React from "react";
import './Groupes.css';
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import Searchbar from "../../components/general/Searchbar/Searchbar";


const Groupes= () => {
    return (
        <>
            <Navbar></Navbar>
            <main>
                <Sidebar currPage="/groupes"></Sidebar>
                <div>
                    <div className="header">
                        <h1>Groupes</h1>
                        <button className="btn">
                            <Link to="/groupes/ajouter" className="link">
                            <span class="material-icons-outlined">add</span>
                            </Link>
                        </button>
                    </div>
                    <Searchbar/>
                    <div>
                        <table className="table-profiles">
                            <thead>
                            <tr>
                                <th>Nom du groupe</th>
                                <th>Membres</th>
                                <th>Coachs</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th>Groupe Judo +16</th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">person</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">sports</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">info</span></Link><Link className="link"><span className="material-icons-outlined pointed">edit</span></Link><Link className="link"><span className="material-icons-outlined pointed">delete</span></Link></th>
                            </tr>
                            <tr>
                                <th>Groupe Karate +16</th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">person</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">sports</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">info</span></Link><Link className="link"><span className="material-icons-outlined pointed">edit</span></Link><Link className="link"><span className="material-icons-outlined pointed">delete</span></Link></th>
                            </tr>
                            <tr>
                                <th>Groupe Judo 12</th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">person</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">sports</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">info</span></Link><Link className="link"><span className="material-icons-outlined pointed">edit</span></Link><Link className="link"><span className="material-icons-outlined pointed">delete</span></Link></th>
                            </tr>
                            <tr>
                                <th>Groupe Fitness Femme</th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">person</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">sports</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">info</span></Link><Link className="link"><span className="material-icons-outlined pointed">edit</span></Link><Link className="link"><span className="material-icons-outlined pointed">delete</span></Link></th>
                            </tr>
                            
                               
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Groupes