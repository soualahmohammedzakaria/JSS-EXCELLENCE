import React, { useEffect, useState } from "react";
import './Planning.css';
import { Link } from "react-router-dom";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import frLocale from '@fullcalendar/core/locales/fr'
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import axios from 'axios';
import { useAuthContext } from '../../hooks/authContext/authContext';

const Planning = () => {
    const { authData } = useAuthContext();
    const [timeslots, setTimeslots] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [sportsGroupes, setSportsGroupes] = useState([]);
    const [salles, setSalles] = useState([]);
    const [filteredTimeSlots, setFilteredTimeSlots] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        salle: "Tous",
        sport: "Tous",
        groupe: "Tous"
    });

    useEffect(() => {
        fetchTimeslots();
        fetchSportsGroupes();
        fetchSalles();
    }, []);

    const HandleClearFilters = () => {
        setSelectedFilters({
            salle: "Tous",
            sport: "Tous",
            groupe: "Tous"
        });
    };

    const fetchSalles = async () => {
        axios.get('http://localhost:4000/salle/getAllSalles')
            .then(response => {
                if(response.data.success){
                    setSalles(response.data.salles);
                }
            })
            .catch(error => {
                console.error('Erreur de l\'obtention des salles:', error);
            });
    };

    const fetchSportsGroupes = () => {
        axios.get('http://localhost:4000/sport/getAllSportsGroupes')
            .then(response => {
                if(response.data.success){
                    setSportsGroupes(response.data.sportsGroupes);
                }
            })
            .catch(error => {
                console.error('Erreur de l\'obtention des groupes de sports:', error);
            });
    };

    const handleFilter = () => {
        setShowFilterModal(false);
        filterTimeSlots();
    };   

    const filterTimeSlots = () => {
        let filtered = [...timeslots];
    
        if (selectedFilters.salle !== "Tous") {
            filtered = filtered.filter(creneau => creneau.nom_salle === selectedFilters.salle);
        }
    
        if (selectedFilters.sport !== "Tous") {
            const sport = sportsGroupes.find(sport => sport.nom === selectedFilters.sport);
            if (sport) {
                filtered = filtered.filter(creneau => {
                    if (selectedFilters.groupe !== "Tous") {
                        const group = sport.groupes.find(groupe => groupe.nom_groupe === selectedFilters.groupe);
                        return group && (creneau.id_groupe === group.id_groupe);
                    }
                    return sport.groupes.some(group => creneau.groupes.some(m => m.id_groupe === group.id_groupe));
                });
            }
        }
    
        setFilteredTimeSlots(filtered);
    };        
    
    const handleSportChange = (e) => {
        const selectedSport = e.target.value;
        setSelectedFilters(prevFilters => ({
            ...prevFilters,
            sport: selectedSport,
            groupe: selectedSport === "Tous" ? "Tous" : sportsGroupes.find(sport => sport.nom === selectedSport).groupes[0].nom_groupe
        }));
    };

    const fetchTimeslots = async () => {
        try {
            const response = await axios.get('http://localhost:4000/planning/getAllCreneaux');
            if(response.data.success) {
                setTimeslots(response.data.creneaux);
                setFilteredTimeSlots(response.data.creneaux);
            }
        } catch (error) {
            console.error('Erreur lors de l\'obtention des creneaux:', error);
        }
    };

    const handleEventClick = (eventClickInfo) => {
        const clickedEvent = timeslots.find(event => 
            new Date(event.start).getTime() === new Date(eventClickInfo.event.start).getTime() &&
            new Date(event.end).getTime() === new Date(eventClickInfo.event.end).getTime() &&
            event.title === eventClickInfo.event.title
        );
        setSelectedEvent(clickedEvent);
    };

    const closeModal = () => {
        setSelectedEvent(null);
    };

    const handleDeleteConfirmation = async () => {
        const response = await axios.delete(`http://localhost:4000/planning/deleteCreneau/${selectedEvent.id_creneau}`);
        if(response.data.success) {
            setShowDeleteModal(false);
            setSelectedEvent(null);
            fetchTimeslots();
        }
    };

    return (
        <>
            <Navbar />
            <main>
                <Sidebar currPage="/planning" />
                <div>
                    <div className="header">
                        <h1>Planning</h1>
                        <div>
                            <button className="btn pointed" style={{ marginRight: "0.5rem" }} onClick={() => setShowFilterModal(true)}>
                                <span className="link">
                                    <span className="material-icons-outlined">tune</span>
                                </span>
                            </button>
                            <button className="btn">
                                {authData.role === 'Administrateur' && (
                                    <Link to="/planning/ajouter" className="link">
                                        <span className="material-icons-outlined">add</span>
                                    </Link>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="calendar">
                        <FullCalendar
                            locales={[frLocale]}
                            plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                            initialView="listWeek"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,listWeek'
                            }}
                            buttonText={{
                                today: 'Aujourd\'hui',
                                month: 'Calendrier',
                                list: 'Liste'
                            }}
                            events={filteredTimeSlots}
                            eventClick={handleEventClick}
                        />
                    </div>
                </div>
            </main>
            {selectedEvent && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1>Information du créneau horaire</h1>
                            </div>
                            <span><h2>Titre:</h2><p style={{fontSize: "1.3rem"}}>{selectedEvent.title}</p></span>
                            <span><h2>Date de début:</h2><p style={{fontSize: "1.3rem"}}>{new Date(selectedEvent.start).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</p></span>
                            <span><h2>Date de fin:</h2><p style={{fontSize: "1.3rem"}}>{new Date(selectedEvent.end).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</p></span>
                            <span><h2>Type:</h2><p style={{fontSize: "1.3rem"}}>{selectedEvent.type}</p></span>
                            <span><h2>Salle:</h2><p style={{fontSize: "1.3rem"}}>{selectedEvent.nom_salle}</p></span>
                            <span><h2>Groupe:</h2><p style={{fontSize: "1.3rem"}}>{selectedEvent.nom_groupe}</p></span>
                            <span><h2>Description:</h2><p className="modal-description" style={{fontSize: "1.3rem"}}>{selectedEvent.description === "" || selectedEvent.description === null ? "Pas de description" : selectedEvent.description}</p></span>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={closeModal} className="btn pointed"><span className="link"><span className="material-icons-outlined">logout</span></span></button>
                            {authData.role === 'Administrateur' && (
                                <>
                                    <Link to="./modifier" state={{id: selectedEvent.id_creneau, title: selectedEvent.title, description: selectedEvent.description, salle: selectedEvent.id_salle, groupe: selectedEvent.id_groupe, start: selectedEvent.start, end: selectedEvent.end, type: selectedEvent.type}}><button className="btn pointed"><span className="link"><span className="material-icons-outlined">edit</span></span></button></Link>
                                    <button onClick={() => setShowDeleteModal(true)} className="btn pointed"><span className="link"><span className="material-icons-outlined">delete</span></span></button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-content">
                            <h2>Etes-vous sûr de vouloir supprimer ce créneau horaire?</h2>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={() => setShowDeleteModal(false)} className="btn pointed"><span className="link">Annuler</span></button>
                            <button onClick={handleDeleteConfirmation} className="btn pointed"><span className="link">Confirmer</span></button>
                        </div>
                    </div>
                </div>
            )}
            {showFilterModal && (
                <div className="modal-overlay">
                <div className="modal-container">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1>Filtrer les résultats</h1>
                        </div>
                        <div className="filter-options">
                                <div className="filter-option">
                                    <label>Salle</label>
                                    <select name="salle" value={selectedFilters.salle} onChange={(e) => setSelectedFilters(prevFilters => ({...prevFilters, salle: e.target.value}))}>
                                        <option value="Tous">Tous</option>
                                        {salles.map(salle => (
                                            <option key={salle.numero_salle} value={salle.nom_salle}>{salle.nom_salle}</option>
                                        ))}
                                    </select>  
                                </div>  
                                <div className="filter-option">
                                    <label>Sport</label>
                                    <select name="sport" value={selectedFilters.sport} onChange={handleSportChange}>
                                        <option value="Tous">Tous</option>
                                        {sportsGroupes.map(sport => (
                                            <option key={sport.id_sport} value={sport.nom}>{sport.nom}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="filter-option">
                                    <label>Groupe</label>
                                    <select name="groupe" value={selectedFilters.groupe} onChange={(e) => setSelectedFilters(prevFilters => ({...prevFilters, groupe: e.target.value}))}>
                                        <option value="Tous">Tous</option>
                                        {selectedFilters.sport === "Tous" &&
                                            sportsGroupes.map(sport => (
                                                sport.groupes.map(groupe => (
                                                    <option key={groupe.id_groupe} value={groupe.nom_groupe}>{groupe.nom_groupe}</option>
                                                ))
                                            ))
                                        }
                                        {selectedFilters.sport !== "Tous" &&
                                            sportsGroupes.find(sport => sport.nom === selectedFilters.sport).groupes.map(groupe => (
                                                <option key={groupe.id_groupe} value={groupe.nom_groupe}>{groupe.nom_groupe}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            <button onClick={HandleClearFilters} className="btn-reinit pointed">
                                <span className="link">Réinitialiser les filtres</span>
                            </button>
                        </div>
                    </div>
                    <div className="modal-buttons">
                        <button onClick={handleFilter} className="btn pointed"><span className="link">Filtrer</span></button>
                        <button onClick={() => setShowFilterModal(false)} className="btn pointed"><span className="link">Retour</span></button>
                    </div>
                </div>
            </div>
            )}
        </>
    );
}

export default Planning;