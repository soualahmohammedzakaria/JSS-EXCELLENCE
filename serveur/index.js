// Importation des modules nécessaires
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Chargement des variables d'environnement depuis un fichier .env
dotenv.config();

// Importation des routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const coachRoutes = require('./routes/coachRoutes');
const memberRoutes = require('./routes/memberRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const planningRoutes = require('./routes/planningRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const salleRoutes = require('./routes/salleRoutes');
const groupRoutes = require('./routes/groupRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const sportRoutes = require('./routes/sportRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const statisticRoutes = require('./routes/statisticRoutes');
const settingRoutes = require('./routes/settingRoutes');

// Initialisation de l'application Express
const app = express();

// Utilisation de CORS pour permettre les requêtes cross-origin
app.use(cors());

// Servir les fichiers statiques depuis le répertoire 'public'
app.use(express.static('public'));

// Analyse du corps des requêtes en JSON
app.use(bodyParser.json());

// Définition du port à utiliser, soit celui spécifié dans les variables d'environnement, soit 4000 par défaut
const PORT = process.env.PORT || 4000;

// Définition des routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/coach', coachRoutes);
app.use('/member', memberRoutes);
app.use('/expense', expenseRoutes);
app.use('/planning', planningRoutes);
app.use('/achievement', achievementRoutes);
app.use('/salle', salleRoutes);
app.use('/group', groupRoutes);
app.use('/equipment', equipmentRoutes);
app.use('/sport', sportRoutes);
app.use('/transaction', paymentRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/statistic', statisticRoutes);
app.use('/setting', settingRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
