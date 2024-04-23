import React from "react";
import './Sports.css';
import { Link } from "react-router-dom";
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import Searchbar from "../../components/general/Searchbar/Searchbar";


const Sports= () => {
    return (
        <>
            <Navbar></Navbar>
            <main>
                <Sidebar currPage="/sports"></Sidebar>
                <div>
                    <div className="header">
                        <h1>Sports</h1>
                        <button className="btn">
                            <Link to="/sports/ajouter" className="link">
                            <span class="material-icons-outlined">add</span>
                            </Link>
                        </button>
                    </div>
                    <Searchbar/>
                    <div>
                        <table className="table-profiles">
                            <thead>
                            <tr>
                                <th>Sport</th>
                                <th>Groupes</th>
                
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th>Judo 1</th>
                                
                                <th><Link className="link"><span className="material-icons-outlined pointed">group</span></Link></th>
                                
                                <th><Link className="link"><span className="material-icons-outlined pointed">info</span></Link><Link className="link"><span className="material-icons-outlined pointed">edit</span></Link><Link className="link"><span className="material-icons-outlined pointed">delete</span></Link></th>
                            </tr>
                            <tr>
                                <th>Judo 2</th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">group</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">info</span></Link><Link className="link"><span className="material-icons-outlined pointed">edit</span></Link><Link className="link"><span className="material-icons-outlined pointed">delete</span></Link></th>
                            </tr>
                            <tr>
                                <th>Karate</th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">group</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">info</span></Link><Link className="link"><span className="material-icons-outlined pointed">edit</span></Link><Link className="link"><span className="material-icons-outlined pointed">delete</span></Link></th>
                            </tr>
                            <tr>
                                <th>Fitness</th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">group</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">info</span></Link><Link className="link"><span className="material-icons-outlined pointed">edit</span></Link><Link className="link"><span className="material-icons-outlined pointed">delete</span></Link></th>
                            </tr>
                            <tr>
                                <th>Kick Boxing 1</th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">group</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">info</span></Link><Link className="link"><span className="material-icons-outlined pointed">edit</span></Link><Link className="link"><span className="material-icons-outlined pointed">delete</span></Link></th>
                            </tr>
                            <tr>
                                <th>Hit Fitness</th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">group</span></Link></th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">info</span></Link><Link className="link"><span className="material-icons-outlined pointed">edit</span></Link><Link className="link"><span className="material-icons-outlined pointed">delete</span></Link></th>
                            </tr>
                            <tr>
                                <th> Kick Boxing 2</th>
                                <th><Link className="link"><span className="material-icons-outlined pointed">group</span></Link></th>
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

export default Sports;