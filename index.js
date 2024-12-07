const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { specs, swaggerUi } = require('./config/swagger');
const cors = require('cors');
const authenticate = require('./middleware/authenticate');
const authorize = require('./middleware/authorize');
const authRoutes = require('./routes/auth');
const clinicRoutes = require('./routes/clinicRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(bodyParser.json());
app.use('/auth', authRoutes);

// wagger UI /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


app.use('/clinics', clinicRoutes);
app.use('/doctors', doctorRoutes);

// Middleware authenticate
app.use(authenticate);

// Route test Middleware authorize
app.use('/test1', authorize(['Patients']), (req, res) => res.json({ message: 'Test 1 for Patients', req: req.user }));
app.use('/test2', authorize(['Doctors']), (req, res) => res.json({ message: 'Test 2 for Doctors', req: req.user }));
app.use('/admin', authorize(['admin']), (req, res) => res.json({ message: 'Admin API' }));
app.get('/profile', (req, res) => {
    res.json({ username: req.user.username, role: req.user.role });
});





console.log(process.env.PORT);

port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
