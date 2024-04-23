const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const coachRoutes = require('./routes/coachRoutes');

const app = express();
const dotenv = require('dotenv');
dotenv.config();
const PORT=process.env.PORT || 4000;
app.use(bodyParser.json());

app.use(cors());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/coach', coachRoutes);



app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
}); 
