import './App.css';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './hooks/authContext/authContext';

import Dashboard from './pages/Dashboard/Dashboard';

import Authentification from './pages/Authentification/Authentification';

import Membres from './pages/Membres/Membres';
import AjouterMembre from './pages/AjouterMembre/AjouterMembre';
import ModifierMembre from './pages/ModifierMembre/ModifierMembre';
import DetailsMembre from './pages/DetailsMembre/DetailsMembre';

import Salles from './pages/Salles/Salles';
import AjouterSalle from './pages/AjouterSalle/AjouterSalle';
import ModifierSalle from './pages/ModifierSalle/ModifierSalle';

import Sports from './pages/Sports/Sports';
import AjouterSport from './pages/AjouterSport/AjouterSport';

import Groupes from './pages/Groupes/Groupes';
import AjouterGroupe from './pages/AjouterGroupe/AjouterGroupe';

import Planning from './pages/Planning/Planning';
import AjouterCreneaux from './pages/AjouterCreneau/AjouterCreneau';
import ModifierCreneau from './pages/ModifierCreneau/ModifierCreneau';

import Admins from './pages/Personnel/Personnel';
import AjouterAdmin from './pages/AjouterAdmin/AjouterAdmin';
import ModifierAdmin from './pages/ModifierAdmin/ModifierAdmin';

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

            <Route path='/planning' element={<Planning/>}></Route>
            <Route path='/planning/ajouter' element={<AjouterCreneaux/>}></Route>
            <Route path='/planning/modifier' element={<ModifierCreneau/>}></Route>

            <Route path='/admins' element={<Admins/>}></Route>
            <Route path='/admins/ajouter' element={<AjouterAdmin/>}></Route>
            <Route path='/admins/modifier' element={<ModifierAdmin/>}></Route>

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