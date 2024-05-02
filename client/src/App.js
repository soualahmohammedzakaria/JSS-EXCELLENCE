import './App.css';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './hooks/authContext/authContext';

import Dashboard from './pages/Dashboard/Dashboard';

import Authentification from './pages/Authentification/Authentification';

import Assiduite from './pages/Assiduite/Assiduite';

import Depenses from './pages/Depenses/Depenses';
import AjouterDepense from './pages/Depenses/AjouterDepense';
import ModifierDepense from './pages/Depenses/ModifierDepense';

import Paiements from './pages/Paiements/Paiements';
import AjouterPaiement from './pages/Paiements/AjouterPaiement';
import ModifierPaiement from './pages/Paiements/ModifierPaiement';

import Accomplissements from './pages/Accomplissements/Accomplissements';
import AjouterAccomplissement from './pages/Accomplissements/AjouterAccomplissement';
import ModifierAccomplissement from './pages/Accomplissements/ModifierAccomplissement';

import Coachs from './pages/Coachs/Coachs';
import AjouterCoach from './pages/Coachs/AjouterCoach';
import ModifierCoach from './pages/Coachs/ModifierCoach';

import Membres from './pages/Membres/Membres';
import AjouterMembre from './pages/Membres/AjouterMembre';
import ModifierMembre from './pages/Membres/ModifierMembre';
import DetailsMembre from './pages/DetailsMembre/DetailsMembre';


import PresencesMembre from './pages/PresencesMembre/PresencesMembre';
import AjouterPresence from './pages/PresencesMembre/AjouterPresence';

import Salles from './pages/Salles/Salles';
import AjouterSalle from './pages/Salles/AjouterSalle';
import ModifierSalle from './pages/Salles/ModifierSalle';

import Sports from './pages/Sports/Sports';
import AjouterSport from './pages/Sports/AjouterSport';

import Groupes from './pages/Groupes/Groupes';
import AjouterGroupe from './pages/Groupes/AjouterGroupe';

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

            <Route path='/assiduite' element={<Assiduite/>}></Route>

            <Route path='/depenses' element={<Depenses/>}></Route>
            <Route path='/depenses/ajouter' element={<AjouterDepense/>}></Route>
            <Route path='/depenses/modifier' element={<ModifierDepense/>}></Route>

            <Route path='/membres/details/paiements' element={<Paiements/>}></Route>
            <Route path='/membres/details/paiements/ajouter' element={<AjouterPaiement/>}></Route>
            <Route path='/membres/details/paiements/modifier' element={<ModifierPaiement/>}></Route>

            <Route path='/membres/details/accomplissements' element={<Accomplissements/>}></Route>
            <Route path='/membres/details/accomplissements/ajouter' element={<AjouterAccomplissement/>}></Route>
            <Route path='/membres/details/accomplissements/modifier' element={<ModifierAccomplissement/>}></Route>

            <Route path='/coachs' element={<Coachs/>}></Route>
            <Route path='/coachs/ajouter' element={<AjouterCoach/>}></Route>
            <Route path='/coachs/modifier' element={<ModifierCoach/>}></Route>

            <Route path='/membres' element={<Membres/>}></Route>
            <Route path='/membres/ajouter' element={<AjouterMembre/>}></Route>
            <Route path='/membres/modifier' element={<ModifierMembre/>}></Route>
            <Route path='/membres/details' element={<DetailsMembre/>}></Route>
            
            <Route path='/membres/details/presences' element={<PresencesMembre/>}></Route>
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