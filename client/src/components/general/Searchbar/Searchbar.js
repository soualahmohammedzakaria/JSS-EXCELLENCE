import React from "react";
import './Searchbar.css';

const Searchbar = ({ searchQuery, handleSearch, handleFilterModal }) => {
    return(
        <div className="search-bar">
            <span className="material-icons-sharp">search</span>
            <input type="search" placeholder="Rechercher" value={searchQuery} onChange={handleSearch}/>
            <span className="material-icons-sharp pointed" onClick={handleFilterModal}>tune</span>
        </div>
    )
}

export default Searchbar;