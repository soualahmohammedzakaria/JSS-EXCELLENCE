import React from 'react';
import './Creneaux.css';
import { Link } from 'react-router-dom';

function Creneaux() {
  // Array of creneaux data
  const creneauxData = [
    {
      id_creneau: 1,
      title: 'Judo pour débutants',
      description: 'Entraînement régulier de Judo',
      salle: 'Salle A',
      groupe: 'Débutants',
      start: '2024-04-20T09:00:00',
      end: '2024-04-20T10:00:00',
      type: 'Séance'
    },
    {
      id_creneau: 5,
      title: 'Evénement Judo U18',
      description: 'Entraînement cardio et musculaire',
      salle: 'Salle C',
      groupe: 'Tous niveaux',
      start: '2024-04-21T12:00:00',
      end: '2024-04-21T13:00:00',
      type: 'Evénement'
    },
    {
      id_creneau: 2,
      title: 'Fintess pour tous',
      description: 'Entraînement cardio et musculaire',
      salle: 'Salle C',
      groupe: 'Tous niveaux',
      start: '2024-04-21T12:00:00',
      end: '2024-04-21T13:00:00',
      type: 'Séance'
    },
    {
      id_creneau: 4,
      title: 'Crossfit enfants',
      description: 'Entraînement cardio et musculaire',
      salle: 'Salle C',
      groupe: 'Tous niveaux',
      start: '2024-04-21T12:00:00',
      end: '2024-04-21T13:00:00',
      type: 'Evénement'
    },
    {
      id_creneau: 3,
      title: 'Kickboxing -80kg',
      description: 'Entraînement cardio et musculaire',
      salle: 'Salle C',
      groupe: 'Tous niveaux',
      start: '2024-04-21T12:00:00',
      end: '2024-04-21T13:00:00',
      type: 'Séance'
    }
  ];

  // Function to format the date in "DD MMM YYYY" format
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Function to format the time in "HH:MM" format
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
                  <td><p>{creneau.type}</p> <h3>{creneau.title}</h3></td>
                  <td>
                    <div className='date-temps'>
                      <p>{formatDate(creneau.start)}</p>
                      <p>{formatTime(creneau.start)}</p>
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
