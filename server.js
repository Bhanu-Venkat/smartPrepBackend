const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const affiliationRoutes = require('./routes/affiliationRoutes');
const questionsRoutes = require('./routes/questionsRoutes');
const blueprintRoutes = require('./routes/blueprintRoutes');
const userRoutes = require('./routes/userRoutes');
const PORT = process.env.PORT || 3000;
const verifyJWT = require('./utils/authMiddleware');
const cors = require('cors');
const assessmentHistoryRoutes = require('./routes/assessmentHistoryRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');

require('dotenv').config();


const app = express();
connectDB();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allows all origins
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    
    // Handle preflight requests (for non-simple requests like PUT, DELETE, etc.)
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    
    next();
});


app.use(cors({
    origin: 'http://localhost:5173', // Avoid this in production if credentials are needed
    methods: 'GET,POST,PUT,DELETE',
    credentials: false // Cannot be true with '*'
}));

app.use(bodyParser.json());
app.use(verifyJWT)
app.use('/api/auth', authRoutes);
app.use('/api/affiliation', affiliationRoutes)
app.use('/api/question', questionsRoutes)
app.use('/api/user', userRoutes)
app.use('/api/blueprint', blueprintRoutes)
app.use('/api/assessmentHistory', assessmentHistoryRoutes);
app.use('/api/assessment', assessmentRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
module.exports = app;
