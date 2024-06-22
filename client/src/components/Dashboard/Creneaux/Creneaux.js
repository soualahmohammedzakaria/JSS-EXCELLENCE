import React from 'react';
import './Creneaux.css';
import { Link } from 'react-router-dom';

function Creneaux( { creneauxData }) {

  // Fonction pour formater la date en format "JJ MMM AAAA"
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Fonction pour formater l'heure en format "HH:MM"
  const formatTime = (timeString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(timeString).toLocaleTimeString('fr-FR', options);
  };

  return (
    <div className='creneaux'>
        <div className='c-header'>
            <h2>Prochains créneaux</h2>
            <Link to='/planning' className='plus-link'>Plus <span className='material-icons-sharp'>chevron_right</span></Link>
        </div>
        <table className='table-creneaux'>
          <tbody>
            {creneauxData.map((creneau) => (
              <tr className='creneau' key={creneau.id_creneau}>
                  <td><p>{creneau.type}</p> <h3>{creneau.titre}</h3></td>
                  <td>
                    <div className='date-temps'>
                      <p>{formatDate(creneau.date_debut)}</p>
                      <p>{formatTime(creneau.date_debut)}</p>
                    </div>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  )
}

export default Creneaux;
