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
//import axios from 'axios';
import { useAuthContext } from '../../hooks/authContext/authContext';

const Planning = () => {
    const { authData } = useAuthContext();
    const [timeslots, setTimeslots] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null); // State to manage selected event

    useEffect(() => {
        fetchTimeslots();
    }, []);

    const fetchTimeslots = async () => {
        /*try {
            const response = await axios.get('YOUR_BACKEND_API_ENDPOINT');
            setTimeslots(response.data); // Assuming the response contains timeslots data in the expected format
        } catch (error) {
            console.error('Error fetching timeslots:', error);
        }*/
        setTimeslots([
            {
                id_creneau: 1,
                title: 'Séance de Judo',
                description: 'Entraînement régulier de Judo',
                salle: 'Salle A',
                groupe: 'Débutants',
                start: '2024-04-20T09:00:00',
                end: '2024-04-20T10:00:00',
                type: 'Séance'
            },
            {
                id_creneau: 2,
                title: 'Séance de Fitness',
                description: 'Entraînement cardio et musculaire',
                salle: 'Salle C',
                groupe: 'Tous niveaux',
                start: '2024-04-21T12:00:00',
                end: '2024-04-21T13:00:00',
                type: 'Séance'
            },
            {
                id_creneau: 3,
                title: 'Séance de Crossfit',
                description: 'Entraînement intensif de Crossfit',
                salle: 'Salle D',
                groupe: 'Avancés',
                start: '2024-04-24T13:30:00',
                end: '2024-04-24T14:30:00',
                type: 'Séance'
            },
            {
                id_creneau: 4,
                title: 'Evénement Judo',
                description: 'Compétition de Judo',
                salle: 'Arène principale',
                groupe: 'Tous niveaux',
                start: '2024-04-21T15:00:00',
                end: '2024-04-21T16:00:00',
                type: 'Evénement'
            },
            {
                id_creneau: 5,
                title: 'Evénement Karaté',
                description: 'Démonstration de techniques de Karaté',
                salle: 'Arène principale',
                groupe: 'Tous niveaux',
                start: '2024-04-23T16:30:00',
                end: '2024-04-23T17:30:00',
                type: 'Evénement'
            },
            {
                id_creneau: 6,
                title: 'Evénement Fitness',
                description: 'Marathon de Fitness',
                salle: 'Salle de danse',
                groupe: 'Tous niveaux',
                start: '2024-04-23T18:00:00',
                end: '2024-04-23T19:00:00',
                type: 'Evénement'
            },
            {
                id_creneau: 7,
                title: 'Evénement Crossfit',
                description: 'Défi de Crossfit en équipe',
                salle: 'Terrain extérieur',
                groupe: 'Avancés',
                start: '2024-04-20T19:30:00',
                end: '2024-04-20T20:30:00',
                type: 'Evénement'
            },
            {
                id_creneau: 8,
                title: 'Séance de Judo',
                description: 'Entraînement compétitif de Judo',
                salle: 'Salle A',
                groupe: 'Compétiteurs',
                start: '2024-04-22T21:00:00',
                end: '2024-04-22T22:00:00',
                type: 'Séance'
            },
            {
                id_creneau: 9,
                title: 'Séance de Judo',
                description: 'Entraînement compétitif de Judo',
                salle: 'Salle B',
                groupe: 'Enfants',
                start: '2024-04-22T21:00:00',
                end: '2024-04-22T22:00:00',
                type: 'Séance'
            }
        ])
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
                            <span><h3>Salle:</h3> <p>{selectedEvent.salle}</p></span>
                            <span><h3>Groupe:</h3> <p>{selectedEvent.groupe}</p></span>
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