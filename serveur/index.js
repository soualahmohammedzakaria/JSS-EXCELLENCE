const express=require('express');
const cors=require('cors');
const bodyParser = require('body-parser');
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
 
const app=express();
app.use(cors());
app.use(express.static('public'));
const dotenv = require('dotenv');
dotenv.config();
const PORT=process.env.PORT || 4000;
app.use(bodyParser.json());



app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/coach', coachRoutes);
app.use('/member', memberRoutes);
app.use('/expense', expenseRoutes);
app.use('/planning', planningRoutes);// a re faire
app.use('/achievement', achievementRoutes);
app.use('/salle', salleRoutes);
app.use('/group', groupRoutes);
app.use('/equipment', equipmentRoutes);
app.use('/sport', sportRoutes);



app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
}); 
