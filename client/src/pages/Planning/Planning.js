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
    const [selectedEvent, setSelectedEvent] = useState(null); // State to manage selected event

    useEffect(() => {
        fetchTimeslots();
    }, []);

    const fetchTimeslots = async () => {
        try {
            const response = await axios.get('http://localhost:4000/planning/getAllCreneaux');
            setTimeslots(response.data.creneaux);
        } catch (error) {
            console.error('Erreur lors de l\'obtention des membres:', error);
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
        // Close modal by resetting selected event to null
        setSelectedEvent(null);
    };

    return (
        <>
            <Navbar />
            <main>
                <Sidebar currPage="/planning" />
                <div>
                    <div className="header">
                        <h1>Planning</h1>
                        <button className="btn">
                            {authData.role === 'Administrateur' && (
                                <Link to="/planning/ajouter" className="link">
                                    <span className="material-icons-outlined">add</span>
                                </Link>
                            )}
                        </button>
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
                            events={timeslots}
                            eventClick={handleEventClick} // Handle event click
                        />
                    </div>
                </div>
            </main>
            {selectedEvent && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1>Information du creneau horaire</h1>
                            </div>
                            <span><h3>Titre:</h3> <p>{selectedEvent.title}</p></span>
                            <span><h3>Date de debut:</h3> <p>{new Date(selectedEvent.start).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</p></span>
                            <span><h3>Date de fin:</h3> <p>{new Date(selectedEvent.end).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</p></span>
                            <span><h3>Type:</h3> <p></p>{selectedEvent.type}</span>
                            <span><h3>Salle:</h3> <p>{selectedEvent.nom_salle}</p></span>
                            <span><h3>Groupe:</h3> <p>{selectedEvent.nom_groupe}</p></span>
                            <span><h3>Description:</h3> <p>{selectedEvent.description}</p></span>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={closeModal} className="btn pointed"><span className="link"><span className="material-icons-outlined">logout</span></span></button>
                            {authData.role === 'Administrateur' && (
                                <>
                                    <Link to="./modifier" state={{id: selectedEvent.id_creneau, title: selectedEvent.title, description: selectedEvent.description, salle: selectedEvent.salle, groupe: selectedEvent.groupe, start: selectedEvent.start, end: selectedEvent.end, type: selectedEvent.type}}><button className="btn pointed"><span className="link"><span className="material-icons-outlined">edit</span></span></button></Link>
                                    <button className="btn pointed"><span className="link"><span className="material-icons-outlined">delete</span></span></button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Planning;