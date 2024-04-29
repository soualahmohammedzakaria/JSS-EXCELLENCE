import './App.css';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './hooks/authContext/authContext';

import Dashboard from './pages/Dashboard/Dashboard';

import Authentification from './pages/Authentification/Authentification';

import Membres from './pages/Membres/Membres';
import AjouterMembre from './pages/Membres/AjouterMembre';
import ModifierMembre from './pages/Membres/ModifierMembre';
import DetailsMembre from './pages/DetailsMembre/DetailsMembre';
import PresencesMembre from './pages/PresencesMembre/PresencesMembre';
import AbsencesMembre from './pages/DetailsMembre/AbsencesMembre';
import AjouterPresence from './pages/PresencesMembre/AjouterPresence';

import Salles from './pages/Salles/Salles';
import AjouterSalle from './pages/AjouterSalle/AjouterSalle';
import ModifierSalle from './pages/ModifierSalle/ModifierSalle';

import Sports from './pages/Sports/Sports';
import AjouterSport from './pages/AjouterSport/AjouterSport';

import Groupes from './pages/Groupes/Groupes';
import AjouterGroupe from './pages/AjouterGroupe/AjouterGroupe';

import Planning from './pages/Planning/Planning';
import AjouterCreneaux from './pages/Planning/AjouterCreneau';
import ModifierCreneau from './pages/Planning/ModifierCreneau';

import Personnel from './pages/Personnel/Personnel';
import AjouterUser from './pages/Personnel/AjouterAdmin';
import ModifierUser from './pages/Personnel/ModifierAdmin';

function App() {
  return (
    <AuthProvider>
      <div className="App noselect">
        <Router>
          <Routes>
            <Route path='/' element={<Authentification/>}></Route>

            <Route path='/dashboard' element={<Dashboard/>}></Route>

            <Route path='/membres' element={<Membres/>}></Route>
            <Route path='/membres/ajouter' element={<AjouterMembre/>}></Route>
            <Route path='/membres/modifier' element={<ModifierMembre/>}></Route>
            <Route path='/membres/details' element={<DetailsMembre/>}></Route>
            <Route path='/membres/details/presences' element={<PresencesMembre/>}></Route>
            <Route path='/membres/details/absences' element={<AbsencesMembre/>}></Route>
            <Route path='/membres/details/presences/ajouter' element={<AjouterPresence/>}></Route>

            <Route path='/planning' element={<Planning/>}></Route>
            <Route path='/planning/ajouter' element={<AjouterCreneaux/>}></Route>
            <Route path='/planning/modifier' element={<ModifierCreneau/>}></Route>

            <Route path='/admins' element={<Personnel/>}></Route>
            <Route path='/admins/ajouter' element={<AjouterUser/>}></Route>
            <Route path='/admins/modifier' element={<ModifierUser/>}></Route>

            <Route path='/salles' element={<Salles/>}></Route>
            <Route path='/salles/ajouter' element={<AjouterSalle/>}></Route>
            <Route path='/salles/modifier' element={<ModifierSalle/>}></Route>

            <Route path='/sports' element={<Sports/>}></Route>
            <Route path='/sports/ajouter' element={<AjouterSport/>}></Route>

            <Route path='/groupes' element={<Groupes/>}></Route>
            <Route path='/groupes/ajouter' element={<AjouterGroupe/>}></Route>
            
            
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;