import React from "react";
import './Searchbar.css';

const Searchbar = () => {
    return(
        <div className="search-bar">
            <span className="material-icons-sharp">search</span>
            <input type="search" placeholder="Rechercher"/>
            <span className="material-icons-sharp pointed">tune</span>
        </div>
    )
}

export default Searchbar