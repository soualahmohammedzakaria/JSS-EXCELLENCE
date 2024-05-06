import React from "react";
import './Sidebar.css';
import { Link } from "react-router-dom";
import { useAuthContext } from '../../../hooks/authContext/authContext';

const Sidebar = ({ currPage }) => {
    const { authData } = useAuthContext();

    const pages = [
        {page: "Accueil", icon: "dashboard", to: "/dashboard"},
        {page: "Membres", icon: "person", to: "/membres"},
        {page: "Assiduité", icon: "star", to: "/assiduite"},
        {page: "Planning", icon: "calendar_month", to: "/planning"},
        {page: "Coachs", icon: "sports", to: "/coachs"},
        {page: "Sports", icon: "sports_gymnastics", to: "/sports"},
        {page: "Groupes", icon: "group", to: "/groupes"},
        {page: "Salles", icon: "meeting_room", to: "/salles"},
        {page: "Personnel", icon: "local_police", to: "/admins"},
        {page: "Dépenses", icon: "account_balance_wallet", to: "/depenses"},
        {page: "Paramètres", icon: "settings", to: "/params"}
    ];

    const filteredPages = pages.filter(page => {
        if (authData.role === 'Administrateur') {
            return true;
        } else {
            return !['Personnel', 'Dépenses', 'Coachs', 'Sports', 'Salles'].includes(page.page);
        }
    });

    const Lienspages = filteredPages.map((element) => (
        <Link key={element.to} to={element.to} className={`link ${element.to === currPage ? "active" : ""}`}>
            <span className="material-icons-sharp">{element.icon}</span>
            <h4>{element.page}</h4>
        </Link>
    ));

    return (
        <aside>
            <div className="sidebar">
                {Lienspages}
            </div>
            <div className="logout">
                <Link to="/" className="link">
                    <span className="material-icons-sharp">logout</span>
                    <h4>Deconnexion</h4>
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;