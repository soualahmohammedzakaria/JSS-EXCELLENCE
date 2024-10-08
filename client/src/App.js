import './App.css';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './hooks/authContext/authContext';
import { ParamsProvider } from './hooks/paramsContext/ParamsContext';

// Imports de la page Dashboard
import Dashboard from './pages/Dashboard/Dashboard';

// Imports des pages d'authentification
import Authentification from './pages/Authentification/Authentification';

// Imports des pages de l'application
import Assiduite from './pages/Assiduite/Assiduite';
import ResultatSignalement from './pages/Assiduite/ResultatSignalement';

// Imports des pages de l'application
import Depenses from './pages/Depenses/Depenses';
import AjouterDepense from './pages/Depenses/AjouterDepense';
import ModifierDepense from './pages/Depenses/ModifierDepense';

// Imports des pages de l'application
import Paiements from './pages/Paiements/Paiements';
import AjouterPaiement from './pages/Paiements/AjouterPaiement';
import ModifierPaiement from './pages/Paiements/ModifierPaiement';

// Imports des pages de l'application
import Accomplissements from './pages/Accomplissements/Accomplissements';
import AjouterAccomplissement from './pages/Accomplissements/AjouterAccomplissement';
import ModifierAccomplissement from './pages/Accomplissements/ModifierAccomplissement';

// Imports des pages de l'application
import Coachs from './pages/Coachs/Coachs';
import AjouterCoach from './pages/Coachs/AjouterCoach';
import ModifierCoach from './pages/Coachs/ModifierCoach';

// Imports des pages de l'application
import Membres from './pages/Membres/Membres';
import AjouterMembre from './pages/Membres/AjouterMembre';
import ModifierMembre from './pages/Membres/ModifierMembre';
import DetailsMembre from './pages/DetailsMembre/DetailsMembre';
import MembresSupprimes from './pages/Membres/MembresSupprimes';

// Imports des pages de l'application
import PresencesMembre from './pages/PresencesMembre/PresencesMembre';
import AjouterPresence from './pages/PresencesMembre/AjouterPresence';
import ModifierPresence from './pages/PresencesMembre/ModifierPresence';

// Imports des pages de l'application
import AbsencesMembre from './pages/AbsencesMembre/AbsencesMembre';
import AjouterAbsence from './pages/AbsencesMembre/AjouterAbsence';
import ModifierAbsence from './pages/AbsencesMembre/ModifierAbsence';

// Imports des pages de l'application
import Salles from './pages/Salles/Salles';
import AjouterSalle from './pages/Salles/AjouterSalle';
import ModifierSalle from './pages/Salles/ModifierSalle';
import Equipements from './pages/Salles/Equipements';
import AjouterEquipement from './pages/Salles/AjouterEquipement';
import ModifierEquipement from './pages/Salles/ModifierEquipement';

// Imports des pages de l'application
import Sports from './pages/Sports/Sports';
import AjouterSport from './pages/Sports/AjouterSport';
import ModifierSport from './pages/Sports/ModifierSport';

// Imports des pages de l'application
import Groupes from './pages/Groupes/Groupes';
import AjouterGroupe from './pages/Groupes/AjouterGroupe';
import ModifierGroupe from './pages/Groupes/ModifierGroupe';

// Imports des pages de l'application
import Planning from './pages/Planning/Planning';
import AjouterCreneaux from './pages/Planning/AjouterCreneau';
import ModifierCreneau from './pages/Planning/ModifierCreneau';

// Imports des pages de l'application
import Personnel from './pages/Personnel/Personnel';
import AjouterUser from './pages/Personnel/AjouterAdmin';
import ModifierUser from './pages/Personnel/ModifierAdmin';

// Imports des pages de l'application
import Parametres from './pages/Parametres/Parametres';

function App() { // Composant principal de l'application
  return (
    <AuthProvider>
      <ParamsProvider>
        <div className="App noselect">
          <Router>
            <Routes>
              <Route path='/' element={<Authentification/>}></Route>

              <Route path='/dashboard' element={<Dashboard/>}></Route>

              <Route path='/assiduite' element={<Assiduite/>}></Route>
              <Route path='/assiduite/resultat' element={<ResultatSignalement/>}></Route>

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
              <Route path='/membres/supprimes' element={<MembresSupprimes/>}></Route>
              
              <Route path='/membres/details/presences' element={<PresencesMembre/>}></Route>
              <Route path='/membres/details/presences/ajouter' element={<AjouterPresence/>}></Route>
              <Route path='/membres/details/presences/modifier' element={<ModifierPresence/>}></Route>

              <Route path='/membres/details/absences' element={<AbsencesMembre/>}></Route>
              <Route path='/membres/details/absences/ajouter' element={<AjouterAbsence/>}></Route>
              <Route path='/membres/details/absences/modifier' element={<ModifierAbsence/>}></Route>

              <Route path='/planning' element={<Planning/>}></Route>
              <Route path='/planning/ajouter' element={<AjouterCreneaux/>}></Route>
              <Route path='/planning/modifier' element={<ModifierCreneau/>}></Route>

              <Route path='/admins' element={<Personnel/>}></Route>
              <Route path='/admins/ajouter' element={<AjouterUser/>}></Route>
              <Route path='/admins/modifier' element={<ModifierUser/>}></Route>

              <Route path='/salles' element={<Salles/>}></Route>
              <Route path='/salles/ajouter' element={<AjouterSalle/>}></Route>
              <Route path='/salles/modifier' element={<ModifierSalle/>}></Route>
              <Route path='/salles/equipements' element={<Equipements/>}></Route>
              <Route path='/salles/equipements/ajouter' element={<AjouterEquipement/>}></Route>
              <Route path='/salles/equipements/modifier' element={<ModifierEquipement/>}></Route>

              <Route path='/sports' element={<Sports/>}></Route>
              <Route path='/sports/ajouter' element={<AjouterSport/>}></Route>
              <Route path='/sports/modifier' element={<ModifierSport/>}></Route>

              <Route path='/groupes' element={<Groupes/>}></Route>
              <Route path='/groupes/ajouter' element={<AjouterGroupe/>}></Route>
              <Route path='/groupes/modifier' element={<ModifierGroupe/>}></Route>
              
              <Route path='/params' element={<Parametres/>}></Route>
              
            </Routes>
          </Router>
        </div>
      </ParamsProvider>
    </AuthProvider>
  );
}

export default App;